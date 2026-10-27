import os
import time
import json
import cv2
import numpy as np
from ultralytics import YOLO
from services.image_service import read_image_from_bytes, encode_image_to_base64

class YOLOService:
    _instance = None

    def __new__(cls, model_path=None):
        if cls._instance is None:
            cls._instance = super(YOLOService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def initialize(self, model_path: str = None):
        """
        Load YOLO model once upon Flask application startup.
        """
        if getattr(self, "_initialized", False):
            return

        self.model = None
        self.load_error = None
        self.class_names = {}

        # Resolve model path across candidate locations (root or backend dir)
        resolved_path = None
        candidates = [
            model_path,
            os.path.join(os.path.dirname(__file__), "..", "models", "best.pt"),
            os.path.join(os.getcwd(), "backend", "models", "best.pt"),
            os.path.join(os.getcwd(), "models", "best.pt"),
            "./models/best.pt",
            "backend/models/best.pt"
        ]
        for c in candidates:
            if c and os.path.exists(c):
                resolved_path = os.path.abspath(c)
                break

        self.model_path = resolved_path or model_path

        if not self.model_path or not os.path.exists(self.model_path):
            self.load_error = f"YOLO model file not found at '{model_path}'. Please verify best.pt exists."
            print(f"[YOLOService ERROR] {self.load_error}")
            return

        try:
            print(f"[YOLOService] Loading YOLO model from {self.model_path}...")
            self.model = YOLO(self.model_path)
            
            # Obtain model class names dynamically
            raw_names = {}
            if hasattr(self.model, 'names') and isinstance(self.model.names, dict):
                raw_names = {int(k): str(v) for k, v in self.model.names.items()}
            elif hasattr(self.model, 'names') and isinstance(self.model.names, list):
                raw_names = {i: name for i, name in enumerate(self.model.names)}
            else:
                raw_names = {0: "cylinder", 1: "shock absorber"}

            # Check if custom CLASS_MAPPING is provided in .env
            custom_mapping = os.getenv("CLASS_MAPPING")
            if custom_mapping:
                try:
                    parsed = json.loads(custom_mapping)
                    self.class_names = {int(k): str(v) for k, v in parsed.items()}
                    print(f"[YOLOService] Applied custom CLASS_MAPPING from env: {self.class_names}")
                except Exception as e:
                    print(f"[YOLOService WARNING] Could not parse CLASS_MAPPING: {e}")
                    self.class_names = raw_names
            # Check if SWAP_CLASSES=true is set in .env
            elif os.getenv("SWAP_CLASSES", "false").lower() in ("true", "1", "yes"):
                if 0 in raw_names and 1 in raw_names:
                    self.class_names = {0: raw_names[1], 1: raw_names[0]}
                else:
                    self.class_names = {0: "shock absorber", 1: "cylinder"}
                print(f"[YOLOService] SWAP_CLASSES active. Inverted class names: {self.class_names}")
            else:
                self.class_names = raw_names
            
            self._initialized = True
            print(f"[YOLOService] Model loaded successfully! Classes: {self.class_names}")
        except Exception as e:
            self.load_error = f"Failed to initialize YOLO model: {str(e)}"
            print(f"[YOLOService ERROR] {self.load_error}")

    def load_model(self, model_path: str = None):
        """
        Alias for initialize() to support diverse entrypoints.
        """
        return self.initialize(model_path)

    def is_loaded(self) -> bool:
        return getattr(self, "_initialized", False) and getattr(self, "model", None) is not None

    def get_model_info(self) -> dict:
        """
        Return metadata about the loaded model.
        """
        model_path = getattr(self, "model_path", None)
        class_names = getattr(self, "class_names", {})
        return {
            "model_path": os.path.basename(model_path) if model_path else None,
            "model_loaded": self.is_loaded(),
            "class_names": class_names,
            "class_count": len(class_names),
            "swap_classes": os.getenv("SWAP_CLASSES", "false").lower() in ("true", "1", "yes"),
            "error": getattr(self, "load_error", None)
        }

    def detect(self, image_bytes: bytes, confidence_threshold: float = 0.25) -> dict:
        """
        Perform YOLO inference on raw image bytes.
        """
        if not self.is_loaded():
            raise RuntimeError(self.load_error or "YOLO model is not loaded.")

        # Read image to BGR numpy array (standard OpenCV format expected by Ultralytics YOLO)
        bgr_image = read_image_from_bytes(image_bytes)
        annotated_bgr = bgr_image.copy()

        # Measure inference time with explicit resolution and IoU threshold
        start_time = time.time()
        results = self.model(bgr_image, conf=confidence_threshold, iou=0.45, imgsz=640)
        inference_time_ms = round((time.time() - start_time) * 1000, 2)

        detections = []
        highest_confidence = 0.0
        
        # Color palette for classes (BGR format for OpenCV)
        # Class 0 (Cylinder): Vibrant Blue (255, 140, 0)
        # Class 1 (Shock Absorber): Bright Orange (0, 120, 255)
        palette_bgr = [
            (255, 140, 0),   # Blue in BGR
            (0, 120, 255),   # Orange in BGR
            (50, 205, 50),   # Lime Green
            (138, 43, 226),  # Violet
            (0, 215, 255),   # Gold
            (255, 0, 255)    # Magenta
        ]

        for result in results:
            boxes = result.boxes
            if boxes is None:
                continue

            for box in boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                confidence = float(box.conf[0])
                class_id = int(box.cls[0])
                class_name = self.class_names.get(class_id, f"Class {class_id}")

                if confidence > highest_confidence:
                    highest_confidence = confidence

                detections.append({
                    "class_id": class_id,
                    "class_name": class_name,
                    "confidence": round(confidence, 4),
                    "confidence_pct": round(confidence * 100, 1),
                    "bbox": {
                        "x1": x1,
                        "y1": y1,
                        "x2": x2,
                        "y2": y2
                    }
                })

                # Draw bounding box and label directly on annotated_bgr image
                color = palette_bgr[class_id % len(palette_bgr)]
                
                # Thick bounding rectangle
                cv2.rectangle(annotated_bgr, (x1, y1), (x2, y2), color, 3)

                # Label text and background rectangle
                label = f"{class_name} {confidence * 100:.1f}%"
                font = cv2.FONT_HERSHEY_SIMPLEX
                font_scale = 0.6
                thickness = 2
                (text_w, text_h), baseline = cv2.getTextSize(label, font, font_scale, thickness)
                
                # Make sure label stays within frame
                label_y1 = max(y1, text_h + 10)
                cv2.rectangle(
                    annotated_bgr,
                    (x1, label_y1 - text_h - 6),
                    (x1 + text_w + 10, label_y1 + baseline - 2),
                    color,
                    -1
                )
                cv2.putText(
                    annotated_bgr,
                    label,
                    (x1 + 5, label_y1 - 4),
                    font,
                    font_scale,
                    (255, 255, 255),
                    thickness,
                    cv2.LINE_AA
                )

        # Base64 encode annotated result (already BGR)
        annotated_b64 = encode_image_to_base64(annotated_bgr)

        # Calculate class distribution summary
        unique_classes_detected = len(set(d["class_id"] for d in detections))

        return {
            "detections": detections,
            "count": len(detections),
            "highest_confidence": round(highest_confidence, 4),
            "highest_confidence_pct": round(highest_confidence * 100, 1),
            "unique_classes_detected": unique_classes_detected,
            "inference_time_ms": inference_time_ms,
            "confidence_threshold": confidence_threshold,
            "annotated_image": annotated_b64
        }
