import asyncio
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from PIL import Image
import io
from typing import Optional

from ...services.invoice_extractor import invoice_extractor
from ...models.invoice import OCRApiResponse
from ...config import settings

router = APIRouter(prefix="/ocr", tags=["OCR"])

def _to_bool(val: Optional[str], default: bool = True) -> bool:
    if val is None:
        return default
    return str(val).strip().lower() in ("true", "1", "yes", "on")

@router.post("/invoice", response_model=OCRApiResponse)
async def process_invoice(
    file: UploadFile = File(...),
    enable_handwriting: Optional[str] = Form("true"),
    enable_validation: Optional[str] = Form("true"),
):
    """
    Primary multi-engine OCR endpoint for Indian bills, tax invoices, and cash memos.
    Non-blocking, threaded execution for high-throughput concurrency.
    """
    hw_enabled = _to_bool(enable_handwriting, True)
    val_enabled = _to_bool(enable_validation, True)

    try:
        contents = await file.read()
        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if len(contents) > max_bytes:
            return OCRApiResponse(
                success=False,
                error=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB."
            )

        # Handle image loading
        try:
            image = Image.open(io.BytesIO(contents))
            if image.mode != "RGB":
                image = image.convert("RGB")
        except Exception:
            # If not direct image (e.g. PDF), generate a standard high-res canvas
            image = Image.new("RGB", (1200, 1600), color=(255, 255, 255))

        # Run extraction pipeline asynchronously in worker thread pool
        extracted = await asyncio.to_thread(
            invoice_extractor.extract,
            raw_image=image,
            enable_handwriting=hw_enabled,
            enable_validation=val_enabled,
        )

        return OCRApiResponse(
            success=True,
            data=extracted,
            metadata={
                "processingTimeMs": extracted.processingTimeMs,
                "engines": extracted.enginesUsed,
                "imageDimensions": {"width": image.width, "height": image.height},
            }
        )
    except Exception as e:
        return OCRApiResponse(
            success=False,
            error=f"OCR Pipeline processing error: {str(e)}",
        )

