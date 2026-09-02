import os

from fastapi import HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.user import get_user_by_email
from app.services.rag import process_resume

ALLOWED_EXTENSIONS = {".pdf"}
MAX_FILE_SIZE = 5 * 1024 * 1024


async def get_profile(db: AsyncSession, current_user: dict) -> dict:
    user = await get_user_by_email(db, current_user["email"])
    if not user:
        raise HTTPException(404, "User not found")

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "resume_name": user.resume_name,
        "has_resume": user.resume_path is not None,
    }


async def upload_resume(db: AsyncSession, current_user: dict, resume: UploadFile) -> dict:
    ext = os.path.splitext(resume.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, "Only PDF files are allowed")
    if resume.size and resume.size > MAX_FILE_SIZE:
        raise HTTPException(400, "File size exceeds 5MB limit")

    user = await get_user_by_email(db, current_user["email"])
    if not user:
        raise HTTPException(404, "User not found")

    upload_dir = os.path.join(settings.upload_dir, user.id)
    os.makedirs(upload_dir, exist_ok=True)

    resume_path = os.path.join(upload_dir, "resume.pdf")
    content = await resume.read()
    with open(resume_path, "wb") as f:
        f.write(content)

    await process_resume(user.id, resume_path)

    user.resume_path = resume_path
    user.resume_name = resume.filename
    await db.commit()

    return {
        "message": "Resume uploaded and processed",
        "resume_name": resume.filename,
    }
