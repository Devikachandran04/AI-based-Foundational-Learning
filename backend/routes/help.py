# routes/help.py
from flask import Blueprint, request, jsonify, g
from bson import ObjectId
from db import help_requests_col, users_col
from routes.auth_utils import require_auth, require_teacher
from datetime import datetime

help_bp = Blueprint("help", __name__)

# ------------------------
# 1️⃣ Student submits a doubt
# ------------------------
@help_bp.post("/submit")
@require_auth
def submit_help():
    data = request.get_json(force=True)
    message = data.get("message")
    if not message:
        return jsonify({"error": "Message required"}), 400

    help_doc = {
        "user_id": g.user_id,
        "message": message,
        "reply": None,
        "status": "pending",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    res = help_requests_col.insert_one(help_doc)
    return jsonify({"ok": True, "help_id": str(res.inserted_id)})

# ------------------------
# 2️⃣ Teacher views all pending doubts (dashboard-friendly)
# ------------------------
@help_bp.get("/pending")
@require_teacher
def pending_help():
    # Get pending doubts, newest first
    doubts = list(help_requests_col.find({"status": "pending"}).sort("created_at", -1))
    formatted = []

    for d in doubts:
        student = users_col.find_one({"_id": ObjectId(d["user_id"])})
        formatted.append({
            "id": str(d["_id"]),
            "student_id": d["user_id"],
            "student_name": student.get("name") if student else "Unknown",
            "student_email": student.get("email") if student else "",
            "message": d["message"],
            "reply": d.get("reply"),
            "status": d.get("status"),
            "created_at": d.get("created_at"),
            "updated_at": d.get("updated_at")
        })

    return jsonify({"pending_doubts": formatted})

# ------------------------
# 3️⃣ Teacher replies to a doubt
# ------------------------
@help_bp.post("/reply/<help_id>")
@require_teacher
def reply_help(help_id):
    data = request.get_json(force=True)
    reply_msg = data.get("reply")
    if not reply_msg:
        return jsonify({"error": "Reply required"}), 400

    res = help_requests_col.update_one(
        {"_id": ObjectId(help_id)},
        {"$set": {"reply": reply_msg, "status": "answered", "updated_at": datetime.utcnow()}}
    )

    if res.matched_count == 0:
        return jsonify({"error": "Help request not found"}), 404

    return jsonify({"ok": True, "help_id": help_id})

# ------------------------
# 4️⃣ Teacher views all doubts (dashboard-friendly)
# ------------------------
@help_bp.get("/all")
@require_teacher
def all_help_requests():
    # Get all doubts, newest first
    doubts = list(help_requests_col.find({}).sort("created_at", -1))
    formatted = []

    for d in doubts:
        student = users_col.find_one({"_id": ObjectId(d["user_id"])})
        formatted.append({
            "id": str(d["_id"]),
            "student_id": d["user_id"],
            "student_name": student.get("name") if student else "Unknown",
            "student_email": student.get("email") if student else "",
            "message": d["message"],
            "reply": d.get("reply"),
            "status": d.get("status"),
            "created_at": d.get("created_at"),
            "updated_at": d.get("updated_at")
        })

    return jsonify({"all_doubts": formatted})