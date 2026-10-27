import os
from dotenv import load_dotenv

# Load environment variables from .env file if available
load_dotenv()

class Config:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    
    # Model path defaults to relative path in backend/models/best.pt
    env_model_path = os.getenv("MODEL_PATH", "./models/best.pt")
    if not os.path.isabs(env_model_path):
        MODEL_PATH = os.path.abspath(os.path.join(BASE_DIR, env_model_path))
    else:
        MODEL_PATH = env_model_path
    
    # Server settings
    FLASK_HOST = os.getenv("FLASK_HOST", "0.0.0.0")
    FLASK_PORT = int(os.getenv("FLASK_PORT", "5000"))
    
    # Allowed CORS origins
    ALLOWED_ORIGINS = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000"
    ).split(",")
    
    # Max file upload size (10 MB)
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024
    
    # Allowed image file extensions
    ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp'}
