# routes/teacher.py
from flask import Blueprint, jsonify
from routes.auth_utils import require_teacher
from services.analytics_service import (
    dashboard_summary,
    low_score_students_table,
    weak_topics_dashboard,
    student_progress
)

teacher_bp = Blueprint("teacher", __name__)

# -----------------------------
# 1️⃣ Dashboard Summary
# -----------------------------
@teacher_bp.get("/dashboard/summary")
@require_teacher
def summary():
    """
    Returns general dashboard counts:
    - total students
    - avg score last 7 days
    - low score student count
    """
    return jsonify(dashboard_summary())

# -----------------------------
# 2️⃣ Low Score Students
# -----------------------------
@teacher_bp.get("/dashboard/low-score-students")
@require_teacher
def low_score_students():
    """
    Returns table of low score students with:
    - last score
    - consecutive low attempts
    - risk level
    """
    return jsonify({"low_score_students": low_score_students_table()})

# -----------------------------
# 3️⃣ Weak Topics Dashboard
# -----------------------------
@teacher_bp.get("/dashboard/weak-topics")
@require_teacher
def weak_topics():
    """
    Returns weak topics dashboard with:
    - total weak topic counts
    - average score per topic
    - risk level
    """
    return jsonify({"weak_topics": weak_topics_dashboard()})

# -----------------------------
# 4️⃣ Student Progress Dashboard
# -----------------------------
@teacher_bp.get("/dashboard/student-progress")
@require_teacher
def progress():
    """
    Returns detailed student progress:
    - avg/highest/lowest score
    - lessons completed
    - weak topics
    - recent attempts
    """
    return jsonify({"students": student_progress()})