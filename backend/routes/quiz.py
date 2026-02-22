from flask import Blueprint, request, jsonify
from services.quiz_service import start_quiz, submit_quiz

quiz_bp = Blueprint("quiz", __name__)

@quiz_bp.post("/start")
def start():
    data = request.get_json(force=True)

    user_id = data.get("user_id")   # later from JWT
    lesson_id = data.get("lesson_id")
    num_questions = int(data.get("num_questions", 10))
    difficulty = data.get("difficulty", "basic")

    if not user_id or not lesson_id:
        return jsonify({"error": "user_id and lesson_id are required"}), 400

    try:
        result = start_quiz(user_id=user_id, lesson_id=lesson_id, num_questions=num_questions, difficulty=difficulty)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@quiz_bp.post("/submit")
def submit():
    data = request.get_json(force=True)

    user_id = data.get("user_id")  # later from JWT
    quiz_id = data.get("quiz_id")
    submitted_answers = data.get("submitted_answers")  # can be list/dict depending on person2 format

    if not user_id or not quiz_id or submitted_answers is None:
        return jsonify({"error": "user_id, quiz_id, submitted_answers are required"}), 400

    try:
        result = submit_quiz(user_id=user_id, quiz_id=quiz_id, submitted_answers=submitted_answers)
        return jsonify(result)
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500