from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
from datetime import datetime, timedelta
from db import users_col
from config import JWT_SECRET
import random
from services.email_service import send_email

auth_bp = Blueprint("auth", __name__)


# 🔹 Generate JWT token
def make_token(user_id: str, role: str):
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


# 🔹 Generate OTP
def generate_otp():
    return str(random.randint(100000, 999999))


# =========================
# 🔐 REGISTER
# =========================
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
        if existing_user.get("is_verified", False):
            return jsonify({"error": "Email already registered. Please login."}), 409
        else:
            return jsonify({
                "error": "Email already registered but not verified. Please verify your account."
            }), 409

    otp = generate_otp()
    expiry = datetime.utcnow() + timedelta(minutes=10)

    doc = {
        "name": name,
        "email": email,
        "password_hash": generate_password_hash(password),
        "role": role,
        "class": class_name or "",
        "is_verified": False,
        "verification_otp": otp,
        "verification_otp_expiry": expiry,
        "reset_otp": None,
        "reset_otp_expiry": None,
        "created_at": datetime.utcnow()
    }

    users_col.insert_one(doc)

    send_email(
        email,
        "Verify your GrammarPal account",
        f"Your OTP for email verification is: {otp}. It expires in 10 minutes."
    )

    return jsonify({
        "ok": True,
        "message": "Registration successful. Please verify your email with the OTP sent."
    })


# =========================
# ✅ VERIFY EMAIL
# =========================
@auth_bp.post("/verify-email")
def verify_email():
    data = request.get_json(force=True)

    email = data.get("email")
    otp = data.get("otp")

    if not email or not otp:
        return jsonify({"error": "email and otp required"}), 400

    user = users_col.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.get("is_verified"):
        return jsonify({"message": "Email already verified"}), 200

    if user.get("verification_otp") != otp:
        return jsonify({"error": "Invalid OTP"}), 400

    expiry = user.get("verification_otp_expiry")
    if not expiry or expiry < datetime.utcnow():
        return jsonify({"error": "OTP expired"}), 400

    users_col.update_one(
        {"email": email},
        {
            "$set": {"is_verified": True},
            "$unset": {
                "verification_otp": "",
                "verification_otp_expiry": ""
            }
        }
    )

    user = users_col.find_one({"email": email})
    user_id = str(user["_id"])
    token = make_token(user_id, user["role"])

    return jsonify({
        "ok": True,
        "message": "Email verified successfully",
        "token": token,
        "user": {
            "id": user_id,
            "name": user["name"],
            "email": user["email"],
            "class": user.get("class", ""),
            "role": user["role"]
        }
    })


# =========================
# 🔁 RESEND OTP
# =========================
@auth_bp.post("/resend-verification-otp")
def resend_verification_otp():
    data = request.get_json(force=True)
    email = data.get("email")

    if not email:
        return jsonify({"error": "email required"}), 400

    user = users_col.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.get("is_verified"):
        return jsonify({"message": "Email already verified"}), 200

    otp = generate_otp()
    expiry = datetime.utcnow() + timedelta(minutes=10)

    users_col.update_one(
        {"email": email},
        {
            "$set": {
                "verification_otp": otp,
                "verification_otp_expiry": expiry
            }
        }
    )

    send_email(
        email,
        "Your new GrammarPal verification OTP",
        f"Your new OTP is: {otp}. It expires in 10 minutes."
    )

    return jsonify({"ok": True, "message": "Verification OTP resent"})


# =========================
# 🔐 LOGIN
# =========================
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

    if not user.get("is_verified", False):
        return jsonify({"error": "Please verify your email before logging in."}), 403

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


# =========================
# 🔁 FORGOT PASSWORD
# =========================
@auth_bp.post("/forgot-password")
def forgot_password():
    data = request.get_json(force=True)
    email = data.get("email")

    if not email:
        return jsonify({"error": "email required"}), 400

    user = users_col.find_one({"email": email})
    if not user:
        return jsonify({"error": "No account found with this email"}), 404

    if not user.get("is_verified", False):
        return jsonify({"error": "Please verify your email first"}), 403

    otp = generate_otp()
    expiry = datetime.utcnow() + timedelta(minutes=10)

    users_col.update_one(
        {"email": email},
        {
            "$set": {
                "reset_otp": otp,
                "reset_otp_expiry": expiry
            }
        }
    )

    send_email(
        email,
        "GrammarPal password reset OTP",
        f"Your password reset OTP is: {otp}. It expires in 10 minutes."
    )

    return jsonify({"ok": True, "message": "Reset OTP sent to email"})


# =========================
# 🔐 RESET PASSWORD
# =========================
@auth_bp.post("/reset-password")
def reset_password():
    data = request.get_json(force=True)

    email = data.get("email")
    otp = data.get("otp")
    new_password = data.get("new_password")

    if not email or not otp or not new_password:
        return jsonify({"error": "email, otp, new_password required"}), 400

    user = users_col.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.get("reset_otp") != otp:
        return jsonify({"error": "Invalid reset OTP"}), 400

    expiry = user.get("reset_otp_expiry")
    if not expiry or expiry < datetime.utcnow():
        return jsonify({"error": "Reset OTP expired"}), 400

    users_col.update_one(
        {"email": email},
        {
            "$set": {
                "password_hash": generate_password_hash(new_password)
            },
            "$unset": {
                "reset_otp": "",
                "reset_otp_expiry": ""
            }
        }
    )

    return jsonify({"ok": True, "message": "Password reset successful"})