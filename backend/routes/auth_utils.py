import jwt
from functools import wraps
from flask import request, jsonify, g
from config import JWT_SECRET

def require_auth(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return jsonify({"error": "Missing Bearer token"}), 401

        token = auth.split(" ", 1)[1].strip()
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        except Exception:
            return jsonify({"error": "Invalid/expired token"}), 401

        g.user_id = payload.get("user_id")
        g.role = payload.get("role")
        if not g.user_id:
            return jsonify({"error": "Token missing user_id"}), 401
        return fn(*args, **kwargs)
    return wrapper

def require_teacher(fn):
    @wraps(fn)
    @require_auth
    def wrapper(*args, **kwargs):
        if g.role != "teacher":
            return jsonify({"error": "Teacher access only"}), 403
        return fn(*args, **kwargs)
    return wrapper