import numpy as np
from PIL import Image
from typing import Tuple, Optional

try:
    import cv2
    HAS_CV2 = True
except ImportError:
    HAS_CV2 = False

class ImagePreprocessor:
    """OpenCV-powered document deskewing, noise reduction, and illumination correction."""

    def __init__(self, max_dimension: int = 2000):
        self.max_dimension = max_dimension

    def preprocess(self, pil_image: Image.Image) -> Tuple[Image.Image, dict]:
        """Runs image enhancement pipeline and returns normalized PIL Image + metadata."""
        meta = {
            "original_size": pil_image.size,
            "rotated_deg": 0.0,
            "enhanced": False,
        }

        # Resize if oversized while maintaining aspect ratio
        width, height = pil_image.size
        if max(width, height) > self.max_dimension:
            scale = self.max_dimension / float(max(width, height))
            new_w, new_h = int(width * scale), int(height * scale)
            pil_image = pil_image.resize((new_w, new_h), Image.Resampling.LANCZOS)
            meta["resized_to"] = (new_w, new_h)

        if not HAS_CV2:
            return pil_image, meta

        try:
            # Convert to OpenCV BGR
            img_bgr = np.array(pil_image)[:, :, ::-1].copy()
            gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

            # 1. Deskew estimation via minimum area rectangle on text contour
            coords = np.column_stack(np.where(gray < 240))
            if len(coords) > 100:
                angle = cv2.minAreaRect(coords)[-1]
                if angle < -45:
                    angle = -(90 + angle)
                else:
                    angle = -angle

                if abs(angle) > 0.5 and abs(angle) < 45:
                    (h, w) = img_bgr.shape[:2]
                    center = (w // 2, h // 2)
                    M = cv2.getRotationMatrix2D(center, angle, 1.0)
                    img_bgr = cv2.warpAffine(
                        img_bgr, M, (w, h),
                        flags=cv2.INTER_CUBIC,
                        borderMode=cv2.BORDER_REPLICATE
                    )
                    meta["rotated_deg"] = round(float(angle), 2)

            # 2. Contrast enhancement via CLAHE on L channel
            lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
            l, a, b = cv2.split(lab)
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            cl = clahe.apply(l)
            enhanced_lab = cv2.merge((cl, a, b))
            enhanced_bgr = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)
            meta["enhanced"] = True

            # Convert back to PIL RGB
            result_pil = Image.fromarray(enhanced_bgr[:, :, ::-1])
            return result_pil, meta
        except Exception as e:
            meta["error"] = str(e)
            return pil_image, meta

preprocessor = ImagePreprocessor()
