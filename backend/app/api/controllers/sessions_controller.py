from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.session_manager import get_session, list_sessions


async def get_all_sessions(db: AsyncSession, current_user: dict) -> dict:
    sessions = await list_sessions(db, user_id=current_user["id"])
    return {"sessions": sessions}


async def get_session_details(db: AsyncSession, session_id: str, current_user: dict) -> dict:
    session = await get_session(db, session_id)
    if not session or session.user_id != current_user["id"]:
        raise HTTPException(404, "Session not found")

    return {
        "session_id": session.id,
        "role": session.role,
        "question_count": session.question_count,
        "max_questions": session.max_questions,
        "is_complete": session.is_complete,
        "questions": session.questions or [],
        "report": session.report,
    }
