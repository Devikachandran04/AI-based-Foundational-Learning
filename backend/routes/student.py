from flask import Blueprint, request, jsonify, g
from bson import ObjectId
from db import users_col, attempts_col, profiles_col, lessons_col
from routes.auth_utils import require_auth

student_bp = Blueprint("student", __name__)

PASS_THRESHOLD = 75


def get_performance_level(score):
    if score >= 75:
        return "Strong"
    elif score >= 50:
        return "Moderate"
    return "Needs Improvement"


def get_status(score, quiz_type):
    if score == 0:
        return "Pending"

    if quiz_type == "mixed":
        if score >= 75:
            return "Strong"
        elif score >= 50:
            return "Moderate Mastery"
        return "Needs Improvement"

    if quiz_type == "simplified":
        if score >= 75:
            return "Moderate Mastery"
        return "Needs Improvement"

    return "Pending"


def get_recommended_action(score, decision, quiz_type):
    if score == 0:
        return "Start lesson and take main quiz"

    if decision == "NEXT_LESSON":
        return "Proceed to next lesson"

    if quiz_type == "simplified":
        if score >= 75:
            return "Retry main quiz or move forward"
        return "Revise lesson and retry simplified quiz"

    return "Attempt simplified quiz"


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

    attempts = list(attempts_col.find({"user_id": student_id}).sort("created_at", 1))
    profile = profiles_col.find_one({"user_id": student_id}) or {}

    completed_lessons = profile.get("completed_lessons", [])
    weak_topics = profile.get("weak_topics", {})
    history = profile.get("history", [])

    # -----------------------------
    # Overall adaptive score
    # -----------------------------
    all_scores = [a.get("score", 0) for a in attempts]
    adaptive_score = round(sum(all_scores) / len(all_scores)) if all_scores else 0
    performance_level = get_performance_level(adaptive_score)

    if len(all_scores) >= 2:
        if all_scores[-1] > all_scores[0]:
            overall_status = "Improving"
        elif all_scores[-1] < all_scores[0]:
            overall_status = "Needs Attention"
        else:
            overall_status = "Stable"
    else:
        overall_status = "Stable"

    total_lessons = lessons_col.count_documents({})
    course_completion = round((len(completed_lessons) / total_lessons) * 100) if total_lessons > 0 else 0

    # -----------------------------
    # Learning path
    # -----------------------------
    all_lessons = list(lessons_col.find().sort("title", 1))
    learning_path = []

    completed_set = set(completed_lessons)
    first_incomplete_found = False

    for lesson in all_lessons:
        lesson_id = str(lesson["_id"])
        lesson_title = lesson.get("title", "Unknown Lesson")

        if lesson_id in completed_set:
            state = "Completed"
        elif not first_incomplete_found:
            state = "In Progress"
            first_incomplete_found = True
        else:
            state = "Pending"

        learning_path.append({
            "lesson_id": lesson_id,
            "lesson_title": lesson_title,
            "state": state
        })

    # -----------------------------
    # Lesson performance table
    # -----------------------------
    lesson_map = {str(l["_id"]): l.get("title", "Unknown Lesson") for l in all_lessons}
    lesson_performance = []
    graph_data = {}

    # Group attempts lesson-wise
    attempts_by_lesson = {}
    for a in attempts:
        lid = a.get("lesson_id")
        attempts_by_lesson.setdefault(lid, []).append(a)

    for lesson in all_lessons:
        lesson_id = str(lesson["_id"])
        lesson_title = lesson.get("title", "Unknown Lesson")
        lesson_attempts = attempts_by_lesson.get(lesson_id, [])

        latest_attempt = lesson_attempts[-1] if lesson_attempts else None

        if latest_attempt:
            quiz_type = latest_attempt.get("quiz_type", "mixed")
            quiz_label = "Main Quiz" if quiz_type == "mixed" else "Simplified Quiz"
            latest_score = latest_attempt.get("score", 0)
            decision = latest_attempt.get("decision", "")
        else:
            quiz_type = "not_started"
            quiz_label = "Not Started"
            latest_score = 0
            decision = ""

        # successful attempts only
        successful_attempts = [
            a for a in lesson_attempts
            if a.get("score", 0) >= PASS_THRESHOLD
        ]

        basic_completed = 0
        moderate_completed = 0
        advanced_completed = 0

        for a in successful_attempts:
            breakdown = a.get("difficulty_breakdown", {})
            if breakdown.get("basic", 0) > 0:
                basic_completed += 1
            if breakdown.get("moderate", 0) > 0:
                moderate_completed += 1
            if breakdown.get("advanced", 0) > 0:
                advanced_completed += 1

        status = get_status(latest_score, quiz_type)
        action = get_recommended_action(latest_score, decision, quiz_type)

        lesson_performance.append({
            "lesson_id": lesson_id,
            "lesson_title": lesson_title,
            "current_quiz": quiz_label,
            "basic_completed": basic_completed,
            "moderate_completed": moderate_completed,
            "advanced_completed": advanced_completed,
            "status": status,
            "recommended_action": action
        })

        mixed_scores = [a.get("score", 0) for a in lesson_attempts if a.get("quiz_type") == "mixed"]
        simplified_scores = [a.get("score", 0) for a in lesson_attempts if a.get("quiz_type") == "simplified"]

        graph_data[lesson_title] = {
            "mixed_scores": mixed_scores,
            "simplified_scores": simplified_scores
        }

    # -----------------------------
    # Weak lessons list
    # -----------------------------
    weak_lessons = []
    for topic, count in sorted(weak_topics.items(), key=lambda x: x[1], reverse=True):
        weak_lessons.append({
            "lesson_title": topic,
            "count": count
        })

    return jsonify({
        "name": student.get("name", "Unknown"),
        "class": student.get("class", "-"),
        "email": student.get("email", ""),

        "adaptive_score": adaptive_score,
        "performance_level": performance_level,
        "overall_status": overall_status,
        "course_completion": course_completion,

        "lessons_completed": len(completed_lessons),

        "learning_path": learning_path,
        "lesson_performance": lesson_performance,
        "graph_data": graph_data,
        "weak_lessons": weak_lessons
    })