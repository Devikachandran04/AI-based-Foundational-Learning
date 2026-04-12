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


def get_recommended_action(score, decision, quiz_type):
    if score == 0:
        return "Start lesson and take main quiz"
    if decision == "NEXT_LESSON":
        return "Proceed to next lesson"
    if quiz_type == "simplified":
        return "Revise lesson and retry simplified quiz"
    return "Attempt simplified quiz"


@student_bp.get("/profile")
@require_auth
def get_student_profile():
    student_id = request.args.get("id") or g.user_id

    try:
        student_obj_id = ObjectId(student_id)
    except Exception:
        return jsonify({"error": "Invalid student id"}), 400

    student = users_col.find_one({"_id": student_obj_id})
    if not student:
        return jsonify({"error": "Student not found"}), 404

    attempts = list(
        attempts_col.find({"user_id": student_id}).sort("created_at", 1)
    )
    profile = profiles_col.find_one({"user_id": student_id}) or {}

    completed_lessons = profile.get("completed_lessons", [])
    weak_topics = profile.get("weak_topics", {})

    scores = [a.get("score", 0) for a in attempts]
    adaptive_score = round(sum(scores) / len(scores)) if scores else 0

    if not scores:
        performance_level = "Not Started"
        overall_status = "Not Started"
    else:
        performance_level = get_performance_level(adaptive_score)

        if len(scores) >= 2:
            if scores[-1] > scores[0]:
                overall_status = "Improving"
            elif scores[-1] < scores[0]:
                overall_status = "Needs Attention"
            else:
                overall_status = "Stable"
        else:
            overall_status = "Started"

    total_lessons = lessons_col.count_documents({})
    course_completion = (
        round((len(completed_lessons) / total_lessons) * 100)
        if total_lessons > 0 else 0
    )

    all_lessons = list(lessons_col.find().sort("title", 1))

    learning_path = []
    completed_set = set(completed_lessons)

    attempted_lessons = set()
    for a in attempts:
        lesson_id = a.get("lesson_id")
        if lesson_id:
            attempted_lessons.add(str(lesson_id))

    for lesson in all_lessons:
        lesson_id = str(lesson["_id"])
        lesson_title = lesson.get("title", "Unknown Lesson")

        if lesson_id in completed_set:
            state = "Completed"
        elif lesson_id in attempted_lessons:
            state = "Attempted"
        else:
            state = "Not Started"

        learning_path.append({
            "lesson_id": lesson_id,
            "lesson_title": lesson_title,
            "state": state
        })

    # Organize attempts by lesson
    attempts_by_lesson = {}
    for a in attempts:
        lesson_id = a.get("lesson_id")
        attempts_by_lesson.setdefault(lesson_id, []).append(a)

    lesson_performance = []
    graph_data = {}

    for lesson in all_lessons:
        lesson_id = str(lesson["_id"])
        lesson_title = lesson.get("title", "Unknown Lesson")
        lesson_attempts = attempts_by_lesson.get(lesson_id, [])

        latest_attempt = lesson_attempts[-1] if lesson_attempts else None

        if latest_attempt:
            quiz_type = latest_attempt.get("quiz_type", "mixed")
            quiz_label = (
                "Main Quiz" if quiz_type == "mixed"
                else "Simplified Quiz"
            )
            latest_score = latest_attempt.get("score", 0)
            decision = latest_attempt.get("decision", "")
        else:
            quiz_type = "not_started"
            quiz_label = "Not Started"
            latest_score = 0
            decision = ""

        # Corrected Indentation
        basic_correct = sum(
            a.get("difficulty_correct", {}).get(
                "basic",
                a.get("difficulty_breakdown", {}).get("basic", 0)
            )
            for a in lesson_attempts
        )

        moderate_correct = sum(
            a.get("difficulty_correct", {}).get(
                "moderate",
                a.get("difficulty_breakdown", {}).get("moderate", 0)
            )
            for a in lesson_attempts
        )

        hard_correct = sum(
            a.get("difficulty_correct", {}).get(
                "hard",
                a.get("difficulty_breakdown", {}).get("hard", 0)
            )
            for a in lesson_attempts
        )

        lesson_performance.append({
            "lesson_id": lesson_id,
            "lesson_title": lesson_title,
            "current_quiz": quiz_label,
            "latest_score": latest_score,
            "basic_correct": basic_correct,
            "moderate_correct": moderate_correct,
            "hard_correct": hard_correct,
            "recommended_action": get_recommended_action(
                latest_score, decision, quiz_type
            )
        })

        graph_data[lesson_title] = {
            "mixed_scores": [
                a.get("score", 0)
                for a in lesson_attempts
                if a.get("quiz_type") == "mixed"
            ],
            "simplified_scores": [
                a.get("score", 0)
                for a in lesson_attempts
                if a.get("quiz_type") == "simplified"
            ]
        }

    weak_lessons = [
        {"lesson_title": topic, "count": count}
        for topic, count in weak_topics.items()
    ]

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