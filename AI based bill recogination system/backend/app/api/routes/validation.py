from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict
from ...services.validation_service import validation_service
from ...utils.text_utils import validate_gstin_format, correct_ocr_gstin, parse_indian_money

router = APIRouter(prefix="/validate", tags=["Validation"])

class GSTINValidationRequest(BaseModel):
    gstin: str

class GSTINValidationResponse(BaseModel):
    valid: bool
    normalized: str
    repaired: str
    stateCode: Optional[str] = None
    pan: Optional[str] = None
    checksumValid: bool = True
    error: Optional[str] = None

class TaxParityRequest(BaseModel):
    taxableAmount: float
    cgst: float = 0.0
    sgst: float = 0.0
    igst: float = 0.0
    cess: float = 0.0
    totalAmount: float

class TaxParityResponse(BaseModel):
    valid: bool
    calculatedTotal: float
    providedTotal: float
    difference: float
    message: str

@router.post("/gstin", response_model=GSTINValidationResponse)
async def validate_gstin(req: GSTINValidationRequest):
    raw = req.gstin.strip().upper()
    repaired = correct_ocr_gstin(raw)
    is_valid = validate_gstin_format(repaired)

    state_code = repaired[:2] if len(repaired) >= 2 and repaired[:2].isdigit() else None
    pan = repaired[2:12] if len(repaired) >= 12 else None

    return GSTINValidationResponse(
        valid=is_valid,
        normalized=raw,
        repaired=repaired,
        stateCode=state_code,
        pan=pan,
        checksumValid=is_valid,
        error=None if is_valid else "Invalid 15-character GSTIN format or state code."
    )

@router.post("/tax", response_model=TaxParityResponse)
async def validate_tax_parity(req: TaxParityRequest):
    calc_total = round(req.taxableAmount + req.cgst + req.sgst + req.igst + req.cess, 2)
    diff = round(abs(calc_total - req.totalAmount), 2)
    is_valid = diff <= 2.0

    msg = "Tax parity validated." if is_valid else f"Mismatch of ₹{diff:.2f}: Calculated ₹{calc_total:.2f} vs Provided ₹{req.totalAmount:.2f}."

    return TaxParityResponse(
        valid=is_valid,
        calculatedTotal=calc_total,
        providedTotal=req.totalAmount,
        difference=diff,
        message=msg
    )
