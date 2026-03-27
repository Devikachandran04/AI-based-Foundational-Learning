# routes/student.py
from flask import Blueprint, request, jsonify, g
from bson import ObjectId
from db import users_col, attempts_col, profiles_col
from routes.auth_utils import require_auth

student_bp = Blueprint("student", __name__)

@student_bp.get("/profile")
@require_auth
def get_student_profile():
    """
    Returns learner profile for a single student.

    Works in 2 ways:
    1. Logged-in student → uses g.user_id
    2. Admin → pass ?id=<student_id>
    """

    # ✅ Get student id
    student_id = request.args.get("id") or g.user_id

    # ✅ Convert to ObjectId safely
    try:
        student_obj_id = ObjectId(student_id)
    except:
        return jsonify({"error": "Invalid student id"}), 400

    # ✅ Fetch student
    student = users_col.find_one({"_id": student_obj_id})
    if not student:
        return jsonify({"error": "Student not found"}), 404

    # ✅ Fetch attempts
    attempts = list(attempts_col.find({"user_id": student_id}))

    basic = 0
    intermediate = 0
    advanced = 0

    for a in attempts:
        breakdown = a.get("difficulty_breakdown", {})

        basic += breakdown.get("basic", 0)
        intermediate += breakdown.get("moderate", 0)
        advanced += breakdown.get("advanced", 0)   # ✅ FIXED (not "hard")

    # ✅ Fetch learner profile
    profile = profiles_col.find_one({"user_id": student_id}) or {}

    lessons_completed = len(profile.get("completed_lessons", []))
    weak_topics = profile.get("weak_topics", {})

    # ✅ Final response
    return jsonify({
        "name": student.get("name", "Unknown"),
        "class": student.get("class", "-"),
        "email": student.get("email", ""),
        "basic_questions_attempted": basic,
        "intermediate_questions_attempted": intermediate,
        "advanced_questions_attempted": advanced,
        "lessons_completed": lessons_completed,
        "weak_topics": weak_topics
    })