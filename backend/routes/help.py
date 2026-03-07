from flask import Blueprint, request, jsonify, g
from datetime import datetime
from bson import ObjectId
from db import help_requests_col, users_col, lessons_col
from routes.auth_utils import require_auth, require_teacher

help_bp = Blueprint("help", __name__)


@help_bp.post("/request")
@require_auth
def create_help_request():
    data = request.get_json(force=True)

    lesson_id = data.get("lesson_id")
    message = data.get("message")

    if not lesson_id or not message:
        return jsonify({"error": "lesson_id and message required"}), 400

    doc = {
        "user_id": g.user_id,
        "lesson_id": lesson_id,
        "message": message,
        "status": "open",
        "reply": None,
        "teacher_id": None,
        "created_at": datetime.utcnow(),
        "replied_at": None
    }

    res = help_requests_col.insert_one(doc)

    return jsonify({
        "help_id": str(res.inserted_id),
        "status": "open"
    })


@help_bp.get("/my-requests")
@require_auth
def my_requests():
    reqs = []

    for r in help_requests_col.find({"user_id": g.user_id}).sort("created_at", -1):
        reqs.append({
            "id": str(r["_id"]),
            "lesson_id": r.get("lesson_id"),
            "message": r.get("message"),
            "status": r.get("status"),
            "reply": r.get("reply"),
            "created_at": r.get("created_at"),
            "replied_at": r.get("replied_at")
        })

    return jsonify({"requests": reqs})


@help_bp.get("/requests")
@require_teacher
def teacher_requests():
    status = request.args.get("status", "open")
    reqs = []

    for r in help_requests_col.find({"status": status}).sort("created_at", -1):
        student_name = r.get("user_id")
        lesson_title = r.get("lesson_id")

        if ObjectId.is_valid(r.get("user_id", "")):
            student = users_col.find_one({"_id": ObjectId(r["user_id"])})
            if student:
                student_name = student.get("name")

        if ObjectId.is_valid(r.get("lesson_id", "")):
            lesson = lessons_col.find_one({"_id": ObjectId(r["lesson_id"])})
            if lesson:
                lesson_title = lesson.get("title")

        reqs.append({
            "help_id": str(r["_id"]),
            "student_name": student_name,
            "lesson_title": lesson_title,
            "message": r.get("message"),
            "status": r.get("status"),
            "reply": r.get("reply"),
            "created_at": r.get("created_at"),
            "replied_at": r.get("replied_at")
        })

    return jsonify({"requests": reqs})


@help_bp.post("/reply")
@require_teacher
def teacher_reply():
    data = request.get_json(force=True)

    help_id = data.get("help_id")
    reply = data.get("reply")

    if not help_id or not reply:
        return jsonify({"error": "help_id and reply required"}), 400

    help_requests_col.update_one(
        {"_id": ObjectId(help_id)},
        {
            "$set": {
                "reply": reply,
                "status": "answered",
                "teacher_id": g.user_id,
                "replied_at": datetime.utcnow()
            }
        }
    )

    return jsonify({"status": "answered"})