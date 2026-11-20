import io
from PIL import Image
import numpy as np

def bytes_to_pil(image_bytes: bytes) -> Image.Image:
    """Convert raw byte stream to RGB PIL Image."""
    image = Image.open(io.BytesIO(image_bytes))
    if image.mode != "RGB":
        image = image.convert("RGB")
    return image

def pil_to_cv2(pil_image: Image.Image) -> np.ndarray:
    """Convert PIL Image to OpenCV BGR numpy array."""
    rgb_array = np.array(pil_image)
    return rgb_array[:, :, ::-1].copy()

def cv2_to_pil(cv2_image: np.ndarray) -> Image.Image:
    """Convert OpenCV BGR array to PIL Image."""
    rgb_array = cv2_image[:, :, ::-1]
    return Image.fromarray(rgb_array)
