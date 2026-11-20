from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float
    page: Optional[int] = 1

class ExtractedField(BaseModel):
    value: Any
    confidence: float
    source: str = "paddleocr"  # paddleocr, trocr, layoutlm, inferred
    needsReview: bool = False
    boundingBox: Optional[BoundingBox] = None
    rawText: Optional[str] = None
    reviewReason: Optional[str] = None

class ExtractedItem(BaseModel):
    id: int
    description: ExtractedField
    hsn: ExtractedField
    quantity: ExtractedField
    rate: ExtractedField
    taxableAmount: ExtractedField
    gstRate: Optional[ExtractedField] = None
    cgst: Optional[ExtractedField] = None
    sgst: Optional[ExtractedField] = None
    igst: Optional[ExtractedField] = None
    total: Optional[ExtractedField] = None

class InvoiceValidation(BaseModel):
    gstinValid: bool = True
    gstinChecksumValid: bool = True
    taxCalculationValid: bool = True
    taxDifference: float = 0.0
    taxMismatchMessage: Optional[str] = None
    isDuplicate: bool = False
    duplicateBillId: Optional[str] = None
    dateValid: bool = True
    customerGstinValid: bool = True
    fieldLevelWarnings: Dict[str, str] = Field(default_factory=dict)

class ExtractedInvoice(BaseModel):
    invoiceNumber: ExtractedField
    invoiceDate: ExtractedField
    dueDate: Optional[ExtractedField] = None
    vendorName: ExtractedField
    vendorGSTIN: ExtractedField
    vendorAddress: ExtractedField
    customerName: ExtractedField
    customerGSTIN: ExtractedField
    customerAddress: Optional[ExtractedField] = None
    items: List[ExtractedItem] = Field(default_factory=list)
    subtotal: Optional[ExtractedField] = None
    taxableAmount: ExtractedField
    cgst: ExtractedField
    sgst: ExtractedField
    igst: ExtractedField
    cess: Optional[ExtractedField] = None
    roundOff: Optional[ExtractedField] = None
    totalAmount: ExtractedField
    overallConfidence: float
    processingMode: str = "ai_backend"
    processingTimeMs: int = 0
    enginesUsed: List[str] = Field(default_factory=list)
    validation: InvoiceValidation
    rawText: Optional[str] = None

class OCRApiResponse(BaseModel):
    success: bool
    data: Optional[ExtractedInvoice] = None
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
