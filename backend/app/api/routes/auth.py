from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import UserCreate, UserLogin
from app.core.auth import get_current_user
from app.core.database import get_db
from app.api.controllers import auth_controller

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup")
async def signup(req: UserCreate, db: AsyncSession = Depends(get_db)):
    return await auth_controller.signup(db, req)


@router.post("/login")
async def login(req: UserLogin, db: AsyncSession = Depends(get_db)):
    return await auth_controller.login(db, req)


@router.get("/me")
async def get_me(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await auth_controller.get_me(db, current_user)
