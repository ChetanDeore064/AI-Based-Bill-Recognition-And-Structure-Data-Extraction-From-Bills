from .health import router as health_router
from .ocr import router as ocr_router
from .validation import router as validation_router
from .bills import router as bills_router
from .clients import router as clients_router

__all__ = [
    "health_router",
    "ocr_router",
    "validation_router",
    "bills_router",
    "clients_router",
]
