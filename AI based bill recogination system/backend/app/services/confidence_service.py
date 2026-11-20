from typing import Dict, Any

class ConfidenceService:
    """Calculates composite multi-engine confidence scoring for extracted invoice entities."""

    def compute_composite_score(
        self,
        ocr_confidence: float,
        format_valid: bool,
        context_matched: bool,
        is_handwritten: bool = False,
    ) -> float:
        # Base weights: OCR (40%), Regex/Format (30%), Context/Layout (30%)
        score = ocr_confidence * 0.4

        if format_valid:
            score += 30.0
        else:
            score += 10.0

        if context_matched:
            score += 30.0
        else:
            score += 15.0

        # Handwriting penalty factor
        if is_handwritten:
            score *= 0.9

        return round(min(100.0, max(0.0, score)), 1)

confidence_service = ConfidenceService()
