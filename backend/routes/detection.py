from flask import Blueprint, request
from services.yolo_service import YOLOService
from utils.validators import validate_image_file
from utils.response import success_response, error_response

detection_bp = Blueprint('detection', __name__)

@detection_bp.route('/api/detect', methods=['POST'])
def detect_objects():
    """
    POST /api/detect
    Accepts multipart/form-data with 'image' file and optional 'confidence' parameter (0.0 to 1.0).
    Runs YOLO object detection and returns annotated image + metadata JSON.
    """
    if 'image' not in request.files:
        return error_response("Missing image file in request ('image' form-data field required).", 400)

    image_file = request.files['image']
    
    # Validate uploaded file
    is_valid, err_msg = validate_image_file(image_file)
    if not is_valid:
        return error_response(err_msg, 400)

    # Parse confidence threshold if provided (default 0.25)
    conf_param = request.form.get('confidence', '0.25')
    try:
        confidence_threshold = float(conf_param)
        if not (0.0 <= confidence_threshold <= 1.0):
            confidence_threshold = 0.25
    except ValueError:
        confidence_threshold = 0.25

    try:
        image_bytes = image_file.read()
        service = YOLOService()
        
        if not service.is_loaded():
            return error_response(
                "YOLO model is not loaded. Please ensure best.pt is placed in backend/models/.",
                503
            )

        result = service.detect(image_bytes, confidence_threshold=confidence_threshold)
        return success_response(result)

    except Exception as e:
        print(f"[API DETECT ERROR] {str(e)}")
        return error_response("An error occurred during object detection inference.", 500, details=str(e))
