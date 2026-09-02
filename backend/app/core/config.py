from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "InterviewForge"
    openai_api_key: str
    redis_url: str
    chroma_host: str
    chroma_port: int
    database_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expiry_hours: int = 24
    upload_dir: str = "uploads"

    model_config = {"env_file": ["../.env", ".env"], "extra": "ignore"}


settings = Settings()
