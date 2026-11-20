from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .config import settings
from .api.routes import (
    health_router,
    ocr_router,
    validation_router,
    bills_router,
    clients_router,
)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Multi-Engine AI OCR & Statutory GST Audit Microservice for CA BillMate",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": str(exc), "path": request.url.path},
    )

# Route Mounts
app.include_router(health_router, prefix="/api")
app.include_router(ocr_router, prefix="/api")
app.include_router(validation_router, prefix="/api")
app.include_router(bills_router, prefix="/api")
app.include_router(clients_router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.APP_NAME} v{settings.VERSION}",
        "docs": "/docs",
        "health": "/api/health",
        "endpoints": [
            "/api/health",
            "/api/ocr/invoice",
            "/api/validate/gstin",
            "/api/validate/tax",
            "/api/bills",
            "/api/clients",
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
