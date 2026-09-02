from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.core.database import get_db
from app.api.controllers import sessions_controller

router = APIRouter(prefix="/api/sessions", tags=["sessions"])


@router.get("")
async def get_all_sessions(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await sessions_controller.get_all_sessions(db, current_user)


@router.get("/{session_id}")
async def get_session_details(
    session_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await sessions_controller.get_session_details(db, session_id, current_user)
