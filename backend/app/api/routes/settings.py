from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.core.database import get_db
from app.api.controllers import settings_controller

router = APIRouter(prefix="/api/settings", tags=["settings"])


@router.get("/profile")
async def get_profile(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await settings_controller.get_profile(db, current_user)


@router.post("/resume")
async def upload_resume(
    resume: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await settings_controller.upload_resume(db, current_user, resume)
