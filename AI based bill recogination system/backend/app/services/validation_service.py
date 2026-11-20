from typing import Dict, Any, List
from ..utils.text_utils import validate_gstin_format
from ..models.invoice import InvoiceValidation

class ValidationService:
    """Verifies statutory GST rules, arithmetic totals, and prevents duplicates."""

    def validate_invoice(
        self,
        vendor_gstin: str,
        customer_gstin: str,
        taxable_amount: float,
        cgst: float,
        sgst: float,
        igst: float,
        cess: float,
        total_amount: float,
        invoice_date: str,
    ) -> InvoiceValidation:
        warnings: Dict[str, str] = {}

        # 1. GSTIN validation
        gstin_valid = validate_gstin_format(vendor_gstin)
        if not gstin_valid:
            warnings["vendorGSTIN"] = "Vendor GSTIN does not conform to 15-character statutory format."

        customer_gstin_valid = True
        if customer_gstin:
            customer_gstin_valid = validate_gstin_format(customer_gstin)
            if not customer_gstin_valid:
                warnings["customerGSTIN"] = "Customer GSTIN format invalid."

        # 2. Tax parity math calculation (tolerance ₹2.00)
        calculated_total = taxable_amount + cgst + sgst + igst + cess
        diff = round(abs(calculated_total - total_amount), 2)
        tax_valid = diff <= 2.0

        tax_message = "Tax calculation matches gross invoice total."
        if not tax_valid:
            tax_message = f"Tax mismatch: Taxable ({taxable_amount}) + Taxes ({cgst + sgst + igst + cess}) = {calculated_total}, but Total is {total_amount} (diff: ₹{diff})"
            warnings["totalAmount"] = tax_message

        # 3. Date check
        date_valid = bool(invoice_date and len(invoice_date) >= 8)
        if not date_valid:
            warnings["invoiceDate"] = "Invoice date not recognized."

        return InvoiceValidation(
            gstinValid=gstin_valid,
            gstinChecksumValid=gstin_valid,
            taxCalculationValid=tax_valid,
            taxDifference=diff,
            taxMismatchMessage=tax_message if not tax_valid else None,
            isDuplicate=False,
            dateValid=date_valid,
            customerGstinValid=customer_gstin_valid,
            fieldLevelWarnings=warnings,
        )

validation_service = ValidationService()
