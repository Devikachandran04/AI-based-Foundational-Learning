# routes/student.py
from flask import Blueprint, request, g, Response
from bson import ObjectId
from db import users_col, attempts_col, profiles_col
from collections import OrderedDict
import json

student_bp = Blueprint("student", __name__)

@student_bp.get("/profile")
def get_student_profile():
    """
    Returns learner profile for a single student.
    Student can be identified by:
    - query param `id` (ObjectId as string)
    - optionally, use g.user_id if using auth
    """
    student_id = request.args.get("id") or getattr(g, "user_id", None)
    if not student_id:
        return Response(json.dumps({"error": "student id required"}), mimetype="application/json"), 400

    # Convert string id to ObjectId
    try:
        student_obj_id = ObjectId(student_id)
    except:
        return Response(json.dumps({"error": "Invalid student id"}), mimetype="application/json"), 400

    # Fetch student info
    student = users_col.find_one({"_id": student_obj_id})
    if not student:
        return Response(json.dumps({"error": "Student not found"}), mimetype="application/json"), 404

    # Fetch attempts for this student
    attempts = list(attempts_col.find({"user_id": student_id}))

    basic = sum(a.get("difficulty_breakdown", {}).get("basic", 0) for a in attempts)
    intermediate = sum(a.get("difficulty_breakdown", {}).get("moderate", 0) for a in attempts)
    advanced = sum(a.get("difficulty_breakdown", {}).get("hard", 0) for a in attempts)

    # Fetch learner profile
    profile = profiles_col.find_one({"user_id": student_id})
    lessons_completed = len(profile.get("completed_lessons", [])) if profile else 0
    weak_topics = profile.get("weak_topics", {}) if profile else {}

    # Build final profile response with fixed order
    result = OrderedDict([
        ("name", student.get("name")),
        ("class", student.get("class", "Unknown")),
        ("email", student.get("email")),
        ("basic_questions_attempted", basic),
        ("intermediate_questions_attempted", intermediate),
        ("advanced_questions_attempted", advanced),
        ("lessons_completed", lessons_completed),
        ("weak_topics", weak_topics)
    ])

    return Response(json.dumps(result), mimetype="application/json")