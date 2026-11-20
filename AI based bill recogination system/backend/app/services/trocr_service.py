from PIL import Image
from typing import Dict, Any, Optional

class TrOCRService:
    """Microsoft TrOCR transformer service for handwritten cash memos and cursive slips."""

    def __init__(self):
        self._processor = None
        self._model = None
        self._initialized = False

    def _get_model(self):
        if not self._initialized:
            try:
                from transformers import TrOCRProcessor, VisionEncoderDecoderModel
                import torch
                # Attempt to load only if pre-cached locally to avoid blocking web requests
                self._processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten", local_files_only=True)
                self._model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten", local_files_only=True)
                self._model.eval()
            except Exception as e:
                # Graceful fallback: local weights not present or torch cpu fallback
                self._processor = None
                self._model = None
            self._initialized = True
        return self._processor, self._model

    def recognize_crop(self, crop_image: Image.Image) -> Dict[str, Any]:
        """Recognize handwritten line from cropped image region."""
        processor, model = self._get_model()

        if processor is not None and model is not None:
            try:
                import torch
                pixel_values = processor(images=crop_image, return_tensors="pt").pixel_values
                with torch.no_grad():
                    generated_ids = model.generate(pixel_values)
                text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
                return {
                    "text": text.strip(),
                    "confidence": 78.0,
                    "source": "trocr",
                }
            except Exception as e:
                print(f"[TrOCR] Crop inference error: {e}")

        return {"text": "", "confidence": 0.0, "source": "trocr"}

trocr_service = TrOCRService()

