from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import UserCreate, UserLogin, UserResponse, get_user_by_email, create_user
from app.core.auth import hash_password, verify_password, create_token, generate_user_id


async def signup(db: AsyncSession, req: UserCreate) -> dict:
    existing = await get_user_by_email(db, req.email)
    if existing:
        raise HTTPException(400, "Email already registered")

    user_id = generate_user_id()
    user = await create_user(db, user_id, req.name, req.email, hash_password(req.password))
    token = create_token(user_id, req.email)
    return {
        "token": token,
        "user": UserResponse(id=user.id, name=user.name, email=user.email),
    }


async def login(db: AsyncSession, req: UserLogin) -> dict:
    user = await get_user_by_email(db, req.email)
    if not user or not verify_password(req.password, user.password):
        raise HTTPException(401, "Invalid email or password")

    token = create_token(user.id, user.email)
    return {
        "token": token,
        "user": UserResponse(id=user.id, name=user.name, email=user.email),
    }


async def get_me(db: AsyncSession, current_user: dict) -> UserResponse:
    user = await get_user_by_email(db, current_user["email"])
    if not user:
        raise HTTPException(404, "User not found")
    return UserResponse(id=user.id, name=user.name, email=user.email)
