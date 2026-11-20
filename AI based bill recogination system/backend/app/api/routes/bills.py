from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

router = APIRouter(prefix="/bills", tags=["Bills Ledger"])

class InvoiceItemModel(BaseModel):
    id: int
    description: str
    hsn: str
    quantity: float
    rate: float
    taxableAmount: float

class BillModel(BaseModel):
    id: str
    invoiceNumber: str
    invoiceDate: str
    dueDate: Optional[str] = ""
    vendorName: str
    vendorGSTIN: str
    vendorAddress: Optional[str] = ""
    customerName: str
    customerGSTIN: str
    items: List[InvoiceItemModel] = Field(default_factory=list)
    taxableAmount: float
    cgst: float
    sgst: float
    igst: float = 0.0
    cess: Optional[float] = 0.0
    roundOff: Optional[float] = 0.0
    totalAmount: float
    status: str = "Review"  # Verified, Review, Processing, Error
    confidence: float = 85.0
    clientId: str = "client-001"
    type: str = "GST Invoice"
    fieldConfidence: Dict[str, float] = Field(default_factory=dict)
    ocrSource: Optional[str] = "paddleocr"
    processingMode: Optional[str] = "ai_backend"
    processingTimeMs: Optional[int] = 1200
    enginesUsed: Optional[List[str]] = Field(default_factory=list)

# In-memory mock database store for standalone backend operation
_BILLS_DB: Dict[str, BillModel] = {
    "bill-001": BillModel(
        id="bill-001",
        invoiceNumber="INV-1024",
        invoiceDate="12-09-2026",
        dueDate="27-09-2026",
        vendorName="ABC Traders",
        vendorGSTIN="27ABCDE1234F1Z5",
        vendorAddress="Shop 12, Main Road, Dhule, Maharashtra 424001",
        customerName="Patil Enterprises",
        customerGSTIN="27FGHIJ5678K1Z2",
        items=[
            InvoiceItemModel(id=1, description="LED Monitor 24 inch", hsn="8528", quantity=2, rate=5000, taxableAmount=10000),
            InvoiceItemModel(id=2, description="Wireless Keyboard", hsn="8471", quantity=5, rate=1000, taxableAmount=5000),
        ],
        taxableAmount=15000,
        cgst=1350,
        sgst=1350,
        igst=0,
        totalAmount=17700,
        status="Verified",
        confidence=97,
        clientId="client-001",
        type="Purchase Invoice",
        fieldConfidence={"invoiceNumber": 98, "invoiceDate": 99, "vendorName": 96, "vendorGSTIN": 99, "totalAmount": 97},
        ocrSource="paddleocr",
        processingMode="ai_backend",
        processingTimeMs=1120,
        enginesUsed=["PaddleOCR v4", "LayoutLMv3", "GST Validator"],
    )
}

@router.get("", response_model=List[BillModel])
async def list_bills(client_id: Optional[str] = None, status: Optional[str] = None):
    bills = list(_BILLS_DB.values())
    if client_id and client_id != "all":
        bills = [b for b in bills if b.clientId == client_id]
    if status and status != "all":
        bills = [b for b in bills if b.status == status]
    return bills

@router.get("/{bill_id}", response_model=BillModel)
async def get_bill(bill_id: str):
    if bill_id not in _BILLS_DB:
        raise HTTPException(status_code=404, detail="Bill record not found")
    return _BILLS_DB[bill_id]

@router.post("", response_model=BillModel)
async def create_bill(bill: BillModel):
    _BILLS_DB[bill.id] = bill
    return bill

@router.patch("/{bill_id}/verify", response_model=BillModel)
async def verify_bill(bill_id: str):
    if bill_id not in _BILLS_DB:
        raise HTTPException(status_code=404, detail="Bill record not found")
    _BILLS_DB[bill_id].status = "Verified"
    return _BILLS_DB[bill_id]

@router.delete("/{bill_id}")
async def delete_bill(bill_id: str):
    if bill_id in _BILLS_DB:
        del _BILLS_DB[bill_id]
    return {"success": True, "message": f"Bill {bill_id} deleted"}
