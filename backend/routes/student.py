from flask import Blueprint, request, jsonify, g
from bson import ObjectId
from db import users_col, attempts_col, profiles_col, lessons_col
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

    student_id = request.args.get("id") or g.user_id

    try:
        student_obj_id = ObjectId(student_id)
    except:
        return jsonify({"error": "Invalid student id"}), 400

    student = users_col.find_one({"_id": student_obj_id})
    if not student:
        return jsonify({"error": "Student not found"}), 404

    # all attempts
    attempts = list(attempts_col.find({"user_id": student_id}).sort("created_at", -1))

    # ✅ only successful attempts
    successful_attempts = [a for a in attempts if a.get("decision") == "NEXT_LESSON"]

    basic = 0
    intermediate = 0
    advanced = 0

    for a in successful_attempts:
        breakdown = a.get("difficulty_breakdown", {})
        basic += breakdown.get("basic", 0)
        intermediate += breakdown.get("moderate", 0)
        advanced += breakdown.get("advanced", 0)

    profile = profiles_col.find_one({"user_id": student_id}) or {}

    completed_lessons = profile.get("completed_lessons", [])
    weak_topics = profile.get("weak_topics", {})

    # ✅ detailed completed lessons with quiz type
    completed_lessons_details = []

    for lesson_id in completed_lessons:
        lesson = None
        try:
            lesson = lessons_col.find_one({"_id": ObjectId(lesson_id)})
        except:
            lesson = None

        lesson_title = lesson.get("title", "Unknown Lesson") if lesson else "Unknown Lesson"

        # find the successful attempt for this lesson
        success_attempt = next(
            (a for a in successful_attempts if a.get("lesson_id") == lesson_id),
            None
        )

        quiz_type = success_attempt.get("quiz_type", "mixed") if success_attempt else "mixed"

        # label for frontend
        quiz_label = "Main Quiz" if quiz_type == "mixed" else "Simplified Quiz"

        completed_lessons_details.append({
            "lesson_id": lesson_id,
            "lesson_title": lesson_title,
            "quiz_type": quiz_type,
            "quiz_label": quiz_label
        })

    return jsonify({
        "name": student.get("name", "Unknown"),
        "class": student.get("class", "-"),
        "email": student.get("email", ""),

        # ✅ only successful attempts
        "basic_questions_attempted": basic,
        "intermediate_questions_attempted": intermediate,
        "advanced_questions_attempted": advanced,

        "lessons_completed": len(completed_lessons),
        "completed_lessons_details": completed_lessons_details,

        "weak_topics": weak_topics
    })