from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.schemas import StartInterviewRequest, AnswerRequest
from app.models.user import get_user_by_email
from app.services.session_manager import create_session, get_session, update_session
from app.services.rag import retrieve_context
from app.services.evaluator import generate_question, evaluate_answer, generate_report
from app.services.memory import store_performance, get_weak_areas


async def start_interview(db: AsyncSession, current_user: dict, req: StartInterviewRequest) -> dict:
    user = await get_user_by_email(db, current_user["email"])
    if not user or not user.resume_path:
        raise HTTPException(400, "Please upload your resume in Settings first")

    session_id = await create_session(db, user.id, req.role)

    context = await retrieve_context(user.id, f"Interview for {req.role}")
    context += f"\n\nJob Description:\n{req.job_description}"
    weak_areas = await get_weak_areas(user.id)
    if weak_areas:
        context += f"\n\nKnown weak areas from past sessions:\n{weak_areas}"
    await update_session(db, session_id, {"resume_context": context})

    question = await generate_question(req.role, context, [])
    question["id"] = "q1"
    await update_session(db, session_id, {"current_question": question})

    return {"session_id": session_id, "question": question}


async def submit_answer(db: AsyncSession, current_user: dict, req: AnswerRequest) -> dict:
    session = await get_session(db, req.session_id)
    if not session or session.user_id != current_user["id"]:
        raise HTTPException(404, "Session not found")
    if session.is_complete:
        raise HTTPException(400, "Interview is already complete")

    evaluation = await evaluate_answer(
        session.current_question, req.answer, session.resume_context
    )

    completed_question = {
        **session.current_question,
        "answer": req.answer,
        "score": evaluation["score"],
        "feedback": evaluation["feedback"],
    }
    await update_session(db, req.session_id, {
        "questions_asked": [completed_question],
        "question_count": session.question_count + 1,
    })

    session = await get_session(db, req.session_id)

    if session.question_count >= session.max_questions:
        report = await generate_report(session.questions, session.role)
        report["session_id"] = req.session_id
        report["role"] = session.role
        report["questions"] = session.questions
        await update_session(db, req.session_id, {"report": report, "is_complete": True})

        try:
            await store_performance(session.user_id, report)
        except Exception:
            pass

        return {"evaluation": evaluation, "is_complete": True, "report": report}

    next_question = await generate_question(
        session.role, session.resume_context, session.questions
    )
    next_question["id"] = f"q{session.question_count + 1}"
    await update_session(db, req.session_id, {"current_question": next_question})

    return {"evaluation": evaluation, "is_complete": False, "next_question": next_question}


async def get_status(db: AsyncSession, current_user: dict, session_id: str) -> dict:
    session = await get_session(db, session_id)
    if not session or session.user_id != current_user["id"]:
        raise HTTPException(404, "Session not found")

    return {
        "session_id": session_id,
        "role": session.role,
        "question_count": session.question_count,
        "max_questions": session.max_questions,
        "is_complete": session.is_complete,
        "current_question": session.current_question,
    }


async def get_report(db: AsyncSession, current_user: dict, session_id: str) -> dict:
    session = await get_session(db, session_id)
    if not session or session.user_id != current_user["id"]:
        raise HTTPException(404, "Session not found")
    if not session.is_complete:
        raise HTTPException(400, "Interview is not complete yet")

    return session.report
