import os
import sys

# Ensure backend root is in Python path for clean imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from flask_cors import CORS
from config import Config
from services.yolo_service import YOLOService
from routes.health import health_bp
from routes.detection import detection_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Configure CORS for frontend access
    CORS(
        app,
        resources={r"/api/*": {"origins": Config.ALLOWED_ORIGINS}},
        supports_credentials=True
    )

    # Register API blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(detection_bp)

    # Initialize YOLO Model once on startup
    yolo_service = YOLOService()
    yolo_service.initialize(Config.MODEL_PATH)

    @app.route('/', methods=['GET'])
    def root():
        return {
            "success": True,
            "status": "ok",
            "message": "Scrap Hazard Detection API is running",
            "model_loaded": yolo_service.is_loaded()
        }

    @app.errorhandler(413)
    def request_entity_too_large(error):
        return {
            "success": False,
            "error": "Uploaded image file size exceeds the 10 MB limit."
        }, 413

    @app.errorhandler(404)
    def not_found_error(error):
        return {
            "success": False,
            "error": "API endpoint not found."
        }, 404

    @app.errorhandler(500)
    def internal_server_error(error):
        return {
            "success": False,
            "error": "Internal server error occurred."
        }, 500

    return app

app = create_app()

if __name__ == '__main__':
    print(f"Starting YOLO Object Detection Flask Server on http://{Config.FLASK_HOST}:{Config.FLASK_PORT}")
    app.run(host=Config.FLASK_HOST, port=Config.FLASK_PORT, debug=True)
