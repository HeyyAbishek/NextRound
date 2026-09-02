import traceback
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from loguru import logger

from app.api.routes import auth, settings, interview, sessions
from app.core.database import init_db

logger.add("logs/error.log", rotation="10 MB", level="ERROR")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="InterviewForge", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    auth_header = request.headers.get("authorization", "None")
    token_preview = auth_header[:30] + "..." if len(auth_header) > 30 else auth_header
    query_params = str(request.query_params) if request.query_params else "None"

    try:
        body = await request.body()
        body_str = body.decode("utf-8")[:500] if body else "Empty"
    except Exception:
        body_str = "Could not read body"

    tb_lines = traceback.format_exc().strip().splitlines()
    short_tb = "\n".join(tb_lines[-3:])
    logger.error(
        f"[500] {request.method} {request.url} | Token: {token_preview} | "
        f"Query: {query_params} | Body: {body_str} | "
        f"Error: {type(exc).__name__}: {exc} | {short_tb}"
    )

    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


app.include_router(auth.router)
app.include_router(settings.router)
app.include_router(interview.router)
app.include_router(sessions.router)


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
