from flask import Blueprint, request, jsonify, g
from routes.auth_utils import require_auth
from services.quiz_service import start_quiz, submit_quiz

quiz_bp = Blueprint("quiz", __name__)

@quiz_bp.post("/start")
@require_auth
def start():
    data = request.get_json(force=True)
    lesson_id = data.get("lesson_id")

    if not lesson_id:
        return jsonify({"error": "lesson_id is required"}), 400

    try:
        result = start_quiz(user_id=g.user_id, lesson_id=lesson_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@quiz_bp.post("/submit")
@require_auth
def submit():
    data = request.get_json(force=True)
    quiz_id = data.get("quiz_id")
    submitted_answers = data.get("submitted_answers")
    time_taken_sec = int(data.get("time_taken_sec", 0))

    if not quiz_id or submitted_answers is None:
        return jsonify({"error": "quiz_id and submitted_answers required"}), 400

    try:
        result = submit_quiz(
            user_id=g.user_id,
            quiz_id=quiz_id,
            submitted_answers=submitted_answers,
            time_taken_sec=time_taken_sec
        )
        return jsonify(result)
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500