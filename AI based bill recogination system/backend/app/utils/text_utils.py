import re
from typing import Optional, Tuple

GSTIN_PATTERN = re.compile(r'\b([0-3][0-9]|97)[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]\b', re.IGNORECASE)
LOOSE_GSTIN_PATTERN = re.compile(r'\b[0-9]{2}[A-Z0-9]{13}\b', re.IGNORECASE)
INVOICE_PATTERN = re.compile(r'(?:INV|BILL|TAX|GST|REC|SI|PI|MEMO|CHALLAN|CN)[-/\s#:]*([A-Z0-9\-_/]{3,20})', re.IGNORECASE)
DATE_PATTERN = re.compile(r'\b(\d{1,2})[-/. ](\d{1,2}|[A-Za-z]{3,9})[-/. ](\d{2,4})\b')
INDIAN_AMOUNT_PATTERN = re.compile(r'(?:₹|Rs\.?|INR)?\s*([0-9]{1,3}(?:,[0-9]{2,3})*(?:\.[0-9]{1,2})?|-|\/-)\b', re.IGNORECASE)
HSN_PATTERN = re.compile(r'\b(?:HSN|SAC)?\s*([0-9]{4,8})\b', re.IGNORECASE)

def parse_indian_money(amount_str: str) -> float:
    """Extract and parse Indian currency representation to float."""
    if not amount_str:
        return 0.0
    cleaned = re.sub(r'[₹\s]|Rs\.?|INR|\/-|—', '', amount_str, flags=re.IGNORECASE)
    cleaned = cleaned.replace(',', '').strip()
    try:
        val = float(cleaned)
        return round(val, 2)
    except ValueError:
        return 0.0

def correct_ocr_gstin(raw_gstin: str) -> str:
    """Repair optical misrecognitions in GSTIN (O vs 0, I vs 1, etc.)."""
    cleaned = re.sub(r'[^A-Za-z0-9]', '', raw_gstin.upper())
    if len(cleaned) != 15:
        return cleaned

    chars = list(cleaned)

    # Pos 0-1: State Digits
    for i in (0, 1):
        if chars[i] in ('O', 'D', 'Q'): chars[i] = '0'
        elif chars[i] in ('I', 'L'): chars[i] = '1'
        elif chars[i] == 'Z': chars[i] = '2'
        elif chars[i] == 'S': chars[i] = '5'
        elif chars[i] == 'B': chars[i] = '8'

    # Pos 2-6: PAN entity alphabets
    for i in range(2, 7):
        if chars[i] == '0': chars[i] = 'O'
        elif chars[i] == '1': chars[i] = 'I'
        elif chars[i] == '5': chars[i] = 'S'
        elif chars[i] == '8': chars[i] = 'B'
        elif chars[i] == '2': chars[i] = 'Z'

    # Pos 7-10: PAN sequential digits
    for i in range(7, 11):
        if chars[i] in ('O', 'D'): chars[i] = '0'
        elif chars[i] in ('I', 'L'): chars[i] = '1'
        elif chars[i] == 'Z': chars[i] = '2'
        elif chars[i] == 'S': chars[i] = '5'
        elif chars[i] == 'B': chars[i] = '8'

    # Pos 11: PAN check letter
    if chars[11] == '0': chars[11] = 'O'
    elif chars[11] == '1': chars[11] = 'I'

    # Pos 13: Default Z
    if chars[13] == '2': chars[13] = 'Z'

    return "".join(chars)

def validate_gstin_format(gstin: str) -> bool:
    """Strict format check for Indian GSTIN."""
    if not gstin or len(gstin) != 15:
        return False
    return bool(GSTIN_PATTERN.match(gstin.upper()))

def normalize_date(date_str: str) -> str:
    """Convert mixed date representations to DD-MM-YYYY."""
    if not date_str:
        return ""
    cleaned = date_str.strip().replace('/', '-').replace('.', '-')
    parts = cleaned.split('-')
    if len(parts) == 3:
        day, month, year = parts[0].zfill(2), parts[1], parts[2]
        months_map = {
            'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06',
            'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
        }
        if month.lower() in months_map:
            month = months_map[month.lower()]
        else:
            month = month.zfill(2)

        if len(year) == 2:
            year = '20' + year

        if int(month) > 12 and int(day) <= 12:
            day, month = month, day

        return f"{day}-{month}-{year}"
    return date_str
