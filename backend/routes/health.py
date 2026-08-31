from flask import Blueprint
from services.yolo_service import YOLOService
from utils.response import success_response, error_response

health_bp = Blueprint("health", __name__)
yolo_service = YOLOService()

@health_bp.route("/api/health", methods=["GET"])
def health_check():
    is_loaded = yolo_service.is_loaded()
    return success_response(data={
        "status": "ok",
        "model_loaded": is_loaded
    })

@health_bp.route("/api/model-info", methods=["GET"])
def model_info():
    try:
        info = yolo_service.get_model_info()
        return success_response(data=info)
    except Exception as e:
        return error_response(f"Failed to fetch model info: {str(e)}", status_code=500)
