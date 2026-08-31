
import sys
from pathlib import Path

# ============================================================
# Add backend directory to Python path
# ============================================================

backend_dir = Path(__file__).resolve().parent

if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))


# ============================================================
# Imports
# ============================================================

from flask import Flask
from flask_cors import CORS

from config import Config
from routes.detection import detection_bp
from services.yolo_service import YOLOService
from utils.response import error_response


# ============================================================
# Create Flask Application
# ============================================================

def create_app():

    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)

    # ========================================================
    # CORS
    # ========================================================
    CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
        }
    }
)
    # ========================================================
    # Register Detection Blueprint
    # ========================================================

    app.register_blueprint(detection_bp)

    # ========================================================
    # Initialize YOLO Service
    # ========================================================

    yolo_service = YOLOService()

    # ========================================================
    # Pre-load YOLO Model
    # ========================================================

    try:

        print("[Flask App] Pre-loading YOLO model...")

        yolo_service.load_model()

        print("[Flask App] YOLO model loaded successfully.")

    except Exception as e:

        print(
            f"[Flask App WARNING] "
            f"Could not pre-load model: {e}"
        )

    # ========================================================
    # ROOT ENDPOINT
    # ========================================================

    @app.route("/", methods=["GET"])
    def home():

        return {
            "success": True,
            "status": "ok",
            "message": "Scrap Hazard Detection API is running"
        }

    # ========================================================
    # HEALTH ENDPOINT
    # ========================================================

    @app.route("/api/health", methods=["GET"])
    def health_check():

        try:

            model_loaded = yolo_service.is_loaded()

            return {
                "success": True,
                "data": {
                    "status": "ok",
                    "model_loaded": model_loaded
                }
            }

        except Exception as e:

            return {
                "success": False,
                "error": str(e)
            }, 500

    # ========================================================
    # MODEL INFO ENDPOINT
    # ========================================================

    @app.route("/api/model-info", methods=["GET"])
    def model_info():

        try:

            info = yolo_service.get_model_info()

            return {
                "success": True,
                "data": info
            }

        except Exception as e:

            return {
                "success": False,
                "error": (
                    f"Failed to fetch model info: {str(e)}"
                )
            }, 500

    # ========================================================
    # 404 ERROR HANDLER
    # ========================================================

    @app.errorhandler(404)
    def not_found_error(error):

        return error_response(
            "Endpoint not found.",
            status_code=404
        )

    # ========================================================
    # 413 ERROR HANDLER
    # ========================================================

    @app.errorhandler(413)
    def request_entity_too_large(error):

        max_mb = (
            Config.MAX_CONTENT_LENGTH /
            (1024 * 1024)
        )

        return error_response(
            (
                f"File size exceeds maximum allowed "
                f"limit of {max_mb:.0f} MB."
            ),
            status_code=413
        )

    # ========================================================
    # 500 ERROR HANDLER
    # ========================================================

    @app.errorhandler(500)
    def internal_server_error(error):

        return error_response(
            "Internal server error. Please check server logs.",
            status_code=500
        )

    # ========================================================
    # Print Registered Routes
    # ========================================================

    print("\n========== REGISTERED FLASK ROUTES ==========")

    for rule in app.url_map.iter_rules():

        print(
            f"{rule.methods}  {rule}"
        )

    print("==============================================\n")

    # ========================================================
    # Return Flask Application
    # ========================================================

    return app


# ============================================================
# Create Application
# ============================================================

app = create_app()


# ============================================================
# Run Application Locally
# ============================================================

if __name__ == "__main__":

    print(
        f"🚀 Starting YOLO API Server on "
        f"http://{Config.FLASK_HOST}:{Config.FLASK_PORT}"
    )

    app.run(
        host=Config.FLASK_HOST,
        port=Config.FLASK_PORT,
        debug=False,
        use_reloader=False
    )
