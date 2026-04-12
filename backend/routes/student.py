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
    except:
        return jsonify({"error": "Invalid student id"}), 400

    student = users_col.find_one({"_id": student_obj_id})
    if not student:
        return jsonify({"error": "Student not found"}), 404

    attempts = list(attempts_col.find({"user_id": student_id}).sort("created_at", 1))
    profile = profiles_col.find_one({"user_id": student_id}) or {}

    completed_lessons = profile.get("completed_lessons", [])
    weak_topics = profile.get("weak_topics", {})

    # Adaptive score
    scores = [a.get("score", 0) for a in attempts]
    adaptive_score = round(sum(scores) / len(scores)) if scores else 0
    performance_level = get_performance_level(adaptive_score)

    course_completion = round(
        (len(completed_lessons) / lessons_col.count_documents({})) * 100
    ) if lessons_col.count_documents({}) > 0 else 0

    # Learning path
    all_lessons = list(lessons_col.find().sort("title", 1))
    learning_path = []
    first_incomplete_found = False

    for lesson in all_lessons:
        lesson_id = str(lesson["_id"])
        title = lesson.get("title", "Unknown Lesson")

        if lesson_id in completed_lessons:
            state = "Completed"
        elif not first_incomplete_found:
            state = "In Progress"
            first_incomplete_found = True
        else:
            state = "Pending"

        learning_path.append({
            "lesson_id": lesson_id,
            "lesson_title": title,
            "state": state
        })

    # Lesson performance and graph data
    lesson_performance = []
    graph_data = {}

    attempts_by_lesson = {}
    for a in attempts:
        attempts_by_lesson.setdefault(a["lesson_id"], []).append(a)

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
            quiz_label = "Not Started"
            latest_score = 0
            decision = ""
            quiz_type = "mixed"

        basic_correct = sum(
            a.get("difficulty_correct", {}).get("basic", 0)
            for a in lesson_attempts
        )
        moderate_correct = sum(
            a.get("difficulty_correct", {}).get("moderate", 0)
            for a in lesson_attempts
        )
        hard_correct = sum(
            a.get("difficulty_correct", {}).get("hard", 0)
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
        "overall_status": "Improving",
        "course_completion": course_completion,
        "lessons_completed": len(completed_lessons),
        "learning_path": learning_path,
        "lesson_performance": lesson_performance,
        "graph_data": graph_data,
        "weak_lessons": weak_lessons
    })