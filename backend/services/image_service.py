import base64
import io
import cv2
import numpy as np
from PIL import Image

class ImageService:
    @staticmethod
    def bytes_to_cv2(image_bytes):
        """Converts raw image bytes (JPEG/PNG/WEBP) to OpenCV BGR image array."""
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Could not decode image bytes into valid image.")
        return img

    @staticmethod
    def cv2_to_base64(cv2_img, format=".jpg"):
        """Converts OpenCV BGR image array to base64 string."""
        success, buffer = cv2.imencode(format, cv2_img)
        if not success:
            raise ValueError("Failed to encode image to JPEG buffer.")
        b64_encoded = base64.b64encode(buffer).decode("utf-8")
        return f"data:image/jpeg;base64,{b64_encoded}"

    @staticmethod
    def base64_to_cv2(b64_str):
        """Converts base64 data URI or raw base64 string to OpenCV BGR image array."""
        if "," in b64_str:
            b64_str = b64_str.split(",", 1)[1]
        image_bytes = base64.b64decode(b64_str)
        return ImageService.bytes_to_cv2(image_bytes)
