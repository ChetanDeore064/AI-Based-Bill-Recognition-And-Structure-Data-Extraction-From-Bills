from pydantic import BaseModel
import os

class Settings(BaseModel):
    APP_NAME: str = "CA BillMate AI OCR Engine"
    VERSION: str = "1.0.0"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]
    MAX_UPLOAD_SIZE_MB: int = 25
    CONFIDENCE_THRESHOLD: float = 80.0
    USE_GPU: bool = os.getenv("USE_CUDA", "false").lower() in ("true", "1", "yes")

settings = Settings()
