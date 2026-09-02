from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.db_models import UserModel


class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str


async def get_user_by_email(db: AsyncSession, email: str) -> UserModel | None:
    result = await db.execute(select(UserModel).where(UserModel.email == email))
    return result.scalar_one_or_none()


async def create_user(db: AsyncSession, user_id: str, name: str, email: str, hashed_password: str) -> UserModel:
    user = UserModel(id=user_id, name=name, email=email, password=hashed_password)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
