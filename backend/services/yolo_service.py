import os
import time
from pathlib import Path
from ultralytics import YOLO
from config import Config
from services.image_service import ImageService

class YOLOService:
    _instance = None
    _model = None
    _model_path = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(YOLOService, cls).__new__(cls)
        return cls._instance

    def load_model(self, model_path=None):
        target_path = model_path or Config.MODEL_PATH
        resolved_path = Path(target_path).resolve()
        
        if not resolved_path.exists():
            raise FileNotFoundError(
                f"YOLO model file not found at path: '{target_path}'. "
                "Please make sure best.pt exists in backend/models/ directory."
            )
            
        try:
            self._model = YOLO(str(resolved_path))
            self._model_path = str(resolved_path)
            print(f"[YOLOService] Model successfully loaded from: {self._model_path}")
        except Exception as e:
            raise RuntimeError(f"Failed to load YOLO model: {str(e)}")

    def is_loaded(self):
        return self._model is not None

    def get_model_info(self):
        if not self.is_loaded():
            return {
                "model_loaded": False,
                "model_name": None,
                "num_classes": 0,
                "class_names": {}
            }
            
        class_names = getattr(self._model, "names", {})
        # Format class_names cleanly (e.g. {0: 'Cylinder', 1: 'Shock Absorber'})
        if isinstance(class_names, list):
            names_dict = {i: name for i, name in enumerate(class_names)}
        elif isinstance(class_names, dict):
            names_dict = {int(k): v for k, v in class_names.items()}
        else:
            names_dict = {}

        return {
            "model_loaded": True,
            "model_name": Path(self._model_path).name if self._model_path else "yolo_model",
            "num_classes": len(names_dict),
            "class_names": names_dict
        }

    def predict(self, cv2_img, confidence_threshold=0.5):
        if not self.is_loaded():
            self.load_model()

        start_time = time.time()
        
        # Run inference
        results = self._model(cv2_img, conf=confidence_threshold)
        
        inference_time_ms = round((time.time() - start_time) * 1000, 2)
        
        detections = []
        annotated_bgr = None
        
        if len(results) > 0:
            result = results[0]
            # Use Ultralytics result.plot() for bounding box visualization
            annotated_bgr = result.plot()
            
            boxes = result.boxes
            if boxes is not None and len(boxes) > 0:
                for box in boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                    conf = float(box.conf[0])
                    class_id = int(box.cls[0])
                    class_name = self._model.names.get(class_id, f"Class {class_id}")
                    
                    detections.append({
                        "class_id": class_id,
                        "class_name": class_name,
                        "confidence": round(conf, 4),
                        "confidence_percent": round(conf * 100, 1),
                        "bbox": {
                            "x1": x1,
                            "y1": y1,
                            "x2": x2,
                            "y2": y2
                        }
                    })

        if annotated_bgr is None:
            annotated_bgr = cv2_img.copy()

        # Convert images to base64
        annotated_b64 = ImageService.cv2_to_base64(annotated_bgr)
        original_b64 = ImageService.cv2_to_base64(cv2_img)

        # Statistics summary
        highest_conf = max([d["confidence_percent"] for d in detections]) if detections else 0.0
        unique_classes = len(set([d["class_id"] for d in detections])) if detections else 0

        return {
            "success": True,
            "count": len(detections),
            "detections": detections,
            "inference_time_ms": inference_time_ms,
            "statistics": {
                "total_objects": len(detections),
                "highest_confidence": highest_conf,
                "classes_detected": unique_classes,
                "inference_time_ms": inference_time_ms
            },
            "annotated_image": annotated_b64,
            "original_image": original_b64
        }
