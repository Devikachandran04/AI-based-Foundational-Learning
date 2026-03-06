from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
from datetime import datetime, timedelta
from db import users_col
from config import JWT_SECRET

auth_bp = Blueprint("auth", __name__)


def make_token(user_id: str, role: str):
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


@auth_bp.post("/register")
def register():
    data = request.get_json(force=True)

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "student")

    if not name or not email or not password:
        return jsonify({"error": "name, email, password required"}), 400

    if role not in ["student", "teacher"]:
        return jsonify({"error": "role must be student or teacher"}), 400

    existing_user = users_col.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "Email already exists"}), 409

    doc = {
        "name": name,
        "email": email,
        "password_hash": generate_password_hash(password),
        "role": role,
        "created_at": datetime.utcnow()
    }

    res = users_col.insert_one(doc)
    user_id = str(res.inserted_id)

    token = make_token(user_id, role)

    return jsonify({
        "token": token,
        "user": {
            "id": user_id,
            "name": name,
            "role": role
        }
    })


@auth_bp.post("/login")
def login():
    data = request.get_json(force=True)

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "email and password required"}), 400

    user = users_col.find_one({"email": email})

    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    user_id = str(user["_id"])
    role = user["role"]
    token = make_token(user_id, role)

    return jsonify({
        "token": token,
        "user": {
            "id": user_id,
            "name": user["name"],
            "role": role
        }
    })