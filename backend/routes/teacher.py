from flask import Blueprint, jsonify
from routes.auth_utils import require_teacher
from services.analytics_service import dashboard_summary, weak_topics, student_progress

teacher_bp = Blueprint("teacher", __name__)


@teacher_bp.get("/dashboard/summary")
@require_teacher
def summary():
    return jsonify(dashboard_summary())


@teacher_bp.get("/dashboard/weak-topics")
@require_teacher
def topics():
    return jsonify({"weak_topics": weak_topics()})


@teacher_bp.get("/dashboard/student-progress")
@require_teacher
def progress():
    return jsonify({"students": student_progress()})