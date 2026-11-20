from fastapi import APIRouter
from ...config import settings

router = APIRouter(tags=["Health"])

@router.get("/health")
async def health_check():
    return {
        "status": "online",
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "gpu_enabled": settings.USE_GPU,
        "engines": [
            "PaddleOCR v4",
            "TrOCR Handwriting Transformer",
            "LayoutLMv3 B2B",
            "OpenCV Preprocessor",
            "GST Statutory Validator",
        ],
    }
