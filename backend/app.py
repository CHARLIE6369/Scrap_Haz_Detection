import sys
from pathlib import Path

# Add backend directory to sys.path for clean imports
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from flask import Flask
from flask_cors import CORS
from config import Config
from routes.health import health_bp
from routes.detection import detection_bp
from services.yolo_service import YOLOService
from utils.response import error_response

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for all routes and origins during local development
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Register Blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(detection_bp)

    # Pre-load YOLO model once on server start
    with app.app_context():
        try:
            yolo_service = YOLOService()
            print("[Flask App] Pre-loading YOLO model...")
            yolo_service.load_model()
        except Exception as e:
            print(f"[Flask App WARNING] Could not pre-load model: {e}")

    # Error Handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return error_response("Endpoint not found.", status_code=404)

    @app.errorhandler(413)
    def request_entity_too_large(error):
        max_mb = Config.MAX_CONTENT_LENGTH / (1024 * 1024)
        return error_response(f"File size exceeds maximum allowed limit of {max_mb:.0f} MB.", status_code=413)

    @app.errorhandler(500)
    def internal_server_error(error):
        return error_response("Internal server error. Please check server logs.", status_code=500)

    return app

app = create_app()

if __name__ == "__main__":
    print(f"🚀 Starting YOLO API Server on http://{Config.FLASK_HOST}:{Config.FLASK_PORT}")
    # Disable reloader to prevent double-loading PyTorch model on Windows
    app.run(host=Config.FLASK_HOST, port=Config.FLASK_PORT, debug=False, use_reloader=False)
