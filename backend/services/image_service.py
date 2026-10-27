import io
import base64
import cv2
import numpy as np
from PIL import Image, ImageOps

def read_image_from_bytes(file_bytes: bytes) -> np.ndarray:
    """
    Safely load raw byte array into BGR numpy array format (standard OpenCV format).
    Handles EXIF orientation tags automatically via PIL.
    Note: Ultralytics YOLO expects numpy arrays in BGR uint8 format (OpenCV standard)
    and flips them internally (BGR to RGB) during its preprocess step.
    """
    pil_image = Image.open(io.BytesIO(file_bytes))
    
    # Auto-rotate image according to EXIF Orientation tag if present
    try:
        pil_image = ImageOps.exif_transpose(pil_image)
    except Exception:
        pass

    # Convert to RGB mode if RGBA or P palette
    if pil_image.mode != 'RGB':
        pil_image = pil_image.convert('RGB')
        
    rgb_array = np.array(pil_image)
    # Convert RGB to BGR so Ultralytics YOLO preprocess (which flips BGR->RGB) gets correct colors
    return cv2.cvtColor(rgb_array, cv2.COLOR_RGB2BGR)

def encode_image_to_base64(bgr_image: np.ndarray, format: str = ".jpg") -> str:
    """
    Convert OpenCV BGR image to base64 data URL string.
    """
    success, buffer = cv2.imencode(format, bgr_image)
    if not success:
        raise ValueError("Failed to encode image to buffer")
    b64_encoded = base64.b64encode(buffer).decode('utf-8')
    mime_type = "image/jpeg" if format.lower() in [".jpg", ".jpeg"] else "image/png"
    return f"data:{mime_type};base64,{b64_encoded}"
