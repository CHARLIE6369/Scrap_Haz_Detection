from flask import Blueprint, request
from services.yolo_service import YOLOService
from services.image_service import ImageService
from utils.validators import validate_image_file
from utils.response import success_response, error_response

detection_bp = Blueprint("detection", __name__)
yolo_service = YOLOService()

@detection_bp.route("/api/detect", methods=["POST"])
def detect_objects():
    json_payload = request.get_json(silent=True) or {}
    
    # Parse confidence threshold (support 0.0 - 1.0 or 0 - 100)
    conf_val = request.form.get("confidence") or json_payload.get("confidence")
    try:
        if conf_val is not None:
            conf = float(conf_val)
            if conf > 1.0:
                conf = conf / 100.0
            conf = max(0.0, min(1.0, conf))
        else:
            conf = 0.5
    except ValueError:
        conf = 0.5

    cv2_img = None

    # Handle multipart file upload
    if "image" in request.files:
        file = request.files["image"]
        is_valid, err_msg = validate_image_file(file)
        if not is_valid:
            return error_response(err_msg, status_code=400)

        try:
            image_bytes = file.read()
            cv2_img = ImageService.bytes_to_cv2(image_bytes)
        except Exception as e:
            return error_response(f"Failed to process uploaded image: {str(e)}", status_code=400)

    # Handle base64 JSON payload (for webcam stream capture)
    elif "image" in json_payload:
        b64_str = json_payload["image"]
        if not b64_str:
            return error_response("Base64 image string is empty.", status_code=400)
        try:
            cv2_img = ImageService.base64_to_cv2(b64_str)
        except Exception as e:
            return error_response(f"Failed to decode base64 image: {str(e)}", status_code=400)
    else:
        return error_response("No image provided. Please send a file upload or base64 JSON field named 'image'.", status_code=400)

    # Execute inference
    try:
        result = yolo_service.predict(cv2_img, confidence_threshold=conf)
        return success_response(data=result, status_code=200)
    except FileNotFoundError as fnf_err:
        return error_response(str(fnf_err), status_code=500)
    except Exception as e:
        return error_response(f"Detection error: {str(e)}", status_code=500)
