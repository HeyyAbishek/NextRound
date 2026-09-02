from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.schemas import StartInterviewRequest, AnswerRequest
from app.core.auth import get_current_user
from app.core.database import get_db
from app.api.controllers import interview_controller

router = APIRouter(prefix="/api/interview", tags=["interview"])


@router.post("/start")
async def start_interview(
    req: StartInterviewRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await interview_controller.start_interview(db, current_user, req)


@router.post("/answer")
async def submit_answer(
    req: AnswerRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await interview_controller.submit_answer(db, current_user, req)


@router.get("/status/{session_id}")
async def get_status(
    session_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await interview_controller.get_status(db, current_user, session_id)


@router.get("/report/{session_id}")
async def get_report(
    session_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await interview_controller.get_report(db, current_user, session_id)
