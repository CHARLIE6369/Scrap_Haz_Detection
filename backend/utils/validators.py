import os
from werkzeug.utils import secure_filename
from config import Config

def allowed_file(filename):
    if not filename or '.' not in filename:
        return False
    ext = filename.rsplit('.', 1)[1].lower()
    return ext in Config.ALLOWED_EXTENSIONS

def validate_image_file(file):
    if not file or file.filename == '':
        return False, "No file selected."
        
    filename = secure_filename(file.filename)
    if not allowed_file(filename):
        allowed_str = ", ".join(sorted(list(Config.ALLOWED_EXTENSIONS))).upper()
        return False, f"Invalid file type '{file.filename}'. Allowed formats: {allowed_str}"
        
    # Check size if available
    file.seek(0, os.SEEK_END)
    file_length = file.tell()
    file.seek(0)
    
    if file_length > Config.MAX_CONTENT_LENGTH:
        max_mb = Config.MAX_CONTENT_LENGTH / (1024 * 1024)
        return False, f"File size exceeds maximum limit of {max_mb:.0f} MB."
        
    return True, None
