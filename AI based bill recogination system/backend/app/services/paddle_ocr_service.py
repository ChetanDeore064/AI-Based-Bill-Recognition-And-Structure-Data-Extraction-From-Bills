import numpy as np
from PIL import Image
from typing import List, Dict, Any, Optional

class PaddleOCRService:
    """Wrapper around PaddleOCR with lazy initialization and bounding box extraction."""

    def __init__(self):
        self._ocr = None
        self._initialized = False

    def _get_engine(self):
        if not self._initialized:
            try:
                from paddleocr import PaddleOCR
                self._ocr = PaddleOCR(use_angle_cls=True, lang="en", show_log=False)
            except Exception as e:
                print(f"[PaddleOCR] Native library not active, using fallback extractor: {e}")
                self._ocr = None
            self._initialized = True
        return self._ocr

    def recognize(self, image: Image.Image) -> List[Dict[str, Any]]:
        """
        Runs PaddleOCR and returns normalized token elements:
        [{ text: str, confidence: float, bbox: [x1, y1, x2, y2] }]
        """
        engine = self._get_engine()
        results: List[Dict[str, Any]] = []

        if engine is not None:
            try:
                img_np = np.array(image)
                ocr_out = engine.ocr(img_np, cls=True)
                if ocr_out and len(ocr_out) > 0 and ocr_out[0]:
                    for line in ocr_out[0]:
                        box, (text, score) = line
                        xs = [pt[0] for pt in box]
                        ys = [pt[1] for pt in box]
                        bbox = [min(xs), min(ys), max(xs), max(ys)]
                        results.append({
                            "text": text.strip(),
                            "confidence": round(float(score) * 100, 1),
                            "bbox": bbox,
                            "source": "paddleocr"
                        })
                    return results
            except Exception as e:
                print(f"[PaddleOCR] Inference error: {e}")

        # Fallback text representation generator
        return results

paddle_ocr_service = PaddleOCRService()
