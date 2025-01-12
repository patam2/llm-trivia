from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    PORT: int = 8000
    DEBUG: bool = False
    REDIS_URL: str = "redis://localhost:6379/0"
    CORS_ORIGINS: list = ["http://localhost:5173"]

    ANTHROPIC_API_KEY: str = None

    class Config:
        env_file = ".env"
    
@lru_cache
def get_settings() -> Settings:
    return Settings()