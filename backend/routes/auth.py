from flask import Blueprint

auth_bp = Blueprint("auth", __name__)

@auth_bp.get("/test")
def test():
    return {"message": "auth works"}
