from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.db_models import SessionModel


async def create_session(db: AsyncSession, user_id: str, role: str) -> str:
    session = SessionModel(user_id=user_id, role=role)
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session.id


async def get_session(db: AsyncSession, session_id: str) -> SessionModel | None:
    result = await db.execute(select(SessionModel).where(SessionModel.id == session_id))
    return result.scalar_one_or_none()


async def update_session(db: AsyncSession, session_id: str, updates: dict) -> None:
    session = await get_session(db, session_id)
    if not session:
        return

    for key, value in updates.items():
        if key == "questions_asked":
            current = session.questions or []
            session.questions = current + value
        elif key == "question_count":
            session.question_count = value
        elif key == "current_question":
            session.current_question = value
        elif key == "resume_context":
            session.resume_context = value
        elif key == "report":
            session.report = value
        elif key == "is_complete":
            session.is_complete = value

    await db.commit()


async def list_sessions(db: AsyncSession, user_id: str | None = None) -> list[dict]:
    query = select(SessionModel)
    if user_id:
        query = query.where(SessionModel.user_id == user_id)
    query = query.order_by(SessionModel.created_at.desc())

    result = await db.execute(query)
    sessions = result.scalars().all()

    return [
        {
            "session_id": s.id,
            "role": s.role,
            "question_count": s.question_count,
            "max_questions": s.max_questions,
            "is_complete": s.is_complete,
            "total_score": (s.report or {}).get("total_score") if s.report else None,
            "created_at": s.created_at.isoformat() if s.created_at else None,
        }
        for s in sessions
    ]
