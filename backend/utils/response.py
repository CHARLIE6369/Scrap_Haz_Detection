from flask import jsonify

def success_response(data=None, message=None, status_code=200):
    response = {
        "success": True
    }
    if message:
        response["message"] = message
    if data:
        response.update(data)
    return jsonify(response), status_code

def error_response(message, status_code=400, details=None):
    response = {
        "success": False,
        "error": message
    }
    if details:
        response["details"] = details
    return jsonify(response), status_code
