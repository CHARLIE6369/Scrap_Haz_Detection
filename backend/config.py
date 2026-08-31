import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")

class Config:
    raw_model_path = os.getenv("MODEL_PATH", "./models/best.pt")
    model_path_obj = Path(raw_model_path)
    
    # Ensure relative paths are always resolved relative to backend directory (BASE_DIR)
    if not model_path_obj.is_absolute():
        MODEL_PATH = str((BASE_DIR / model_path_obj).resolve())
    else:
        MODEL_PATH = str(model_path_obj.resolve())

    FLASK_HOST = os.getenv("FLASK_HOST", "0.0.0.0")
    FLASK_PORT = int(os.getenv("FLASK_PORT", 5000))
    
    ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB
    
    CORS_ORIGINS_ENV = os.getenv("CORS_ORIGINS", "*")
    CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS_ENV.split(",") if origin.strip()]
