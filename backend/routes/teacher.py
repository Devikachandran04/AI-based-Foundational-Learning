from flask import Blueprint, jsonify
from routes.auth_utils import require_teacher
from services.analytics_service import (
    dashboard_summary,
    low_score_students_table,
    weak_topics_dashboard,
    student_progress
)

teacher_bp = Blueprint("teacher", __name__)

# 1️⃣ Dashboard Summary
@teacher_bp.get("/dashboard/summary")
@require_teacher
def summary():
    return jsonify(dashboard_summary())

# 2️⃣ Low Score Students
@teacher_bp.get("/dashboard/low-score-students")
@require_teacher
def low_score_students_route():
    return jsonify({"students": low_score_students_table()})

# 3️⃣ Weak Topics
@teacher_bp.get("/dashboard/weak-topics")
@require_teacher
def weak_topics():
    return jsonify({"weak_topics": weak_topics_dashboard()})

# 4️⃣ Student Progress
@teacher_bp.get("/dashboard/student-progress")
@require_teacher
def progress():
    return jsonify({"students": student_progress()})