import os
import json
from .quiz_evaluator import evaluate_quiz
from .adaptive_logic import adaptive_decision


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
QUESTION_FOLDER = os.path.join(BASE_DIR, "question_bank")


def generate_quiz(lesson_id, level="normal"):

    if level not in ["normal", "easy"]:
        raise ValueError("Invalid level")

    filename = f"{lesson_id}_{level}.json"
    file_path = os.path.join(QUESTION_FOLDER, filename)

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Question file not found: {filename}")

    print("Loading:", filename)

    with open(file_path, "r") as file:
        questions = json.load(file)

    return questions


def process_quiz_request(lesson_id, quiz_type, attempt_count, student_answers):
    
    questions = generate_quiz(lesson_id, level=quiz_type)

    score, topic_accuracy, weak_topics = evaluate_quiz(
        questions, student_answers
    )

    decision = adaptive_decision(
        score=score,
        attempt_count=attempt_count,
        quiz_type=quiz_type,
        lesson_id=lesson_id
    )

    return {
        "lesson_id": lesson_id,
        "quiz_type": quiz_type,
        "score": score,
        "weak_topics": weak_topics,
        "decision": decision
    }