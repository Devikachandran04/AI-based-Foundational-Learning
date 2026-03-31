from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
from datetime import datetime, timedelta
from db import users_col
from config import JWT_SECRET
import secrets
from services.email_service import send_email

auth_bp = Blueprint("auth", __name__)

FRONTEND_URL = "https://ai-based-foundational-learning-user.vercel.app"


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
    class_name = data.get("class")
    role = "student"

    if not name or not email or not password:
        return jsonify({"error": "name, email, password required"}), 400

    existing_user = users_col.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "Email already exists. Please login."}), 409

    doc = {
        "name": name,
        "email": email,
        "password_hash": generate_password_hash(password),
        "role": role,
        "class": class_name or "",
        "reset_token": None,
        "reset_token_expiry": None,
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
            "email": email,
            "class": class_name or "",
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
            "email": user.get("email", ""),
            "class": user.get("class", ""),
            "role": role
        }
    })


@auth_bp.post("/forgot-password")
def forgot_password():
    data = request.get_json(force=True)
    email = data.get("email")

    if not email:
        return jsonify({"error": "email required"}), 400

    user = users_col.find_one({"email": email})
    if not user:
        return jsonify({"error": "No account found with this email"}), 404

    reset_token = secrets.token_urlsafe(32)
    expiry = datetime.utcnow() + timedelta(minutes=30)

    users_col.update_one(
        {"email": email},
        {
            "$set": {
                "reset_token": reset_token,
                "reset_token_expiry": expiry
            }
        }
    )

    reset_link = f"{FRONTEND_URL}/?resetToken={reset_token}&email={email}"

    send_email(
        email,
        "GrammarPal Password Reset",
        f"Click this link to reset your password:\n\n{reset_link}\n\nThis link expires in 30 minutes."
    )

    return jsonify({
        "ok": True,
        "message": "Password reset link sent to your email."
    })


@auth_bp.post("/reset-password")
def reset_password():
    data = request.get_json(force=True)

    email = data.get("email")
    reset_token = data.get("reset_token")
    new_password = data.get("new_password")

    if not email or not reset_token or not new_password:
        return jsonify({"error": "email, reset_token, new_password required"}), 400

    user = users_col.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.get("reset_token") != reset_token:
        return jsonify({"error": "Invalid or expired reset link"}), 400

    expiry = user.get("reset_token_expiry")
    if not expiry or expiry < datetime.utcnow():
        return jsonify({"error": "Reset link expired"}), 400

    users_col.update_one(
        {"email": email},
        {
            "$set": {
                "password_hash": generate_password_hash(new_password)
            },
            "$unset": {
                "reset_token": "",
                "reset_token_expiry": ""
            }
        }
    )

    return jsonify({
        "ok": True,
        "message": "Password reset successful. Please login."
    })