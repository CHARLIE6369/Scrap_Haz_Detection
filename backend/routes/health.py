from flask import Blueprint
from services.yolo_service import YOLOService
from utils.response import success_response

health_bp = Blueprint('health', __name__)

@health_bp.route('/api/health', methods=['GET'])
def health_check():
    """
    GET /api/health
    Check API backend health and model loaded status.
    """
    service = YOLOService()
    return success_response({
        "status": "ok",
        "model_loaded": service.is_loaded()
    })

@health_bp.route('/api/model-info', methods=['GET'])
def model_info():
    """
    GET /api/model-info
    Returns detailed metadata about the loaded YOLO model.
    """
    service = YOLOService()
    info = service.get_model_info()
    return success_response(info)
