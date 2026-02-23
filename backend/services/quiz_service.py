import json
import os
from datetime import datetime
from bson import ObjectId

from db import quizzes_col, attempts_col, profiles_col, lessons_col

# Import Person 2 modules
from ai.question_generator import quiz_generator, quiz_evaluator, adaptive_logic


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # backend/
QB_DIR = os.path.join(BASE_DIR, "ai", "question_generator", "question_bank")


def _load_question_bank_from_file(topic: str):
    """
    File-based question bank loader.
    Ex: topic="nouns" -> loads backend/ai/question_generator/question_bank/nouns.json
    """
    path = os.path.join(QB_DIR, f"{topic}.json")
    if not os.path.exists(path):
        raise FileNotFoundError(f"Question bank file not found: {path}")

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # data can be list or dict depending on person2 format
    return data


def _get_topic_from_lesson(lesson_id: str):
    lesson = lessons_col.find_one({"_id": ObjectId(lesson_id)})
    if not lesson:
        raise ValueError("Lesson not found")

    # topics field is best, else fallback
    topics = lesson.get("topics") or []
    if topics:
        return topics[0]
    # fallback to title keyword
    return "nouns"


def _call_person2_generate_quiz(question_bank, num_questions=10, difficulty="basic"):
    """
    Adapter: call person2 quiz_generator with best-effort function detection.
    Modify here ONCE if their function name differs.
    """
    # Common function names students use:
    candidates = ["generate_quiz", "create_quiz", "select_questions", "build_quiz"]
    for fn_name in candidates:
        fn = getattr(quiz_generator, fn_name, None)
        if callable(fn):
            # Try common signatures (best effort)
            try:
                return fn(question_bank, num_questions=num_questions, difficulty=difficulty)
            except TypeError:
                try:
                    return fn(question_bank, num_questions)
                except TypeError:
                    return fn(question_bank)

    raise ImportError(
        "Could not find quiz generator function in quiz_generator.py. "
        "Expected one of: generate_quiz/create_quiz/select_questions/build_quiz"
    )


def _call_person2_evaluate(quiz, submitted_answers):
    """
    Adapter: call person2 quiz_evaluator.
    Should return score + topic-wise stats ideally.
    """
    candidates = ["evaluate_quiz", "score_quiz", "evaluate", "check_answers"]
    for fn_name in candidates:
        fn = getattr(quiz_evaluator, fn_name, None)
        if callable(fn):
            try:
                return fn(quiz, submitted_answers)
            except TypeError:
                return fn(submitted_answers)

    raise ImportError(
        "Could not find evaluator function in quiz_evaluator.py. "
        "Expected one of: evaluate_quiz/score_quiz/evaluate/check_answers"
    )


def _call_person2_adaptive(result):
    """
    Adapter: call person2 adaptive_logic.
    Input can be score% or full evaluation result.
    Output should be a decision string like: NEXT / SIMPLIFIED / VIDEO
    """
    candidates = ["decide_next_step", "adaptive_decision", "decide", "get_decision"]
    for fn_name in candidates:
        fn = getattr(adaptive_logic, fn_name, None)
        if callable(fn):
            try:
                return fn(result)
            except TypeError:
                # maybe expects score only
                score = result.get("score_percent") if isinstance(result, dict) else result
                return fn(score)

    # fallback: your rule-based decision if person2 doesn't have it
    score = result.get("score_percent", 0) if isinstance(result, dict) else int(result)
    if score >= 70:
        return "NEXT"
    if score >= 40:
        return "SIMPLIFIED"
    return "VIDEO"


def start_quiz(user_id: str, lesson_id: str, num_questions: int = 10, difficulty: str = "basic"):
    """
    Creates a quiz instance in DB and returns quiz payload.
    """
    topic = _get_topic_from_lesson(lesson_id)

    # Case A: file-based
    question_bank = _load_question_bank_from_file(topic)

    # Person2 generates quiz JSON
    quiz_payload = _call_person2_generate_quiz(question_bank, num_questions=num_questions, difficulty=difficulty)

    # Store quiz instance
    quiz_doc = {
        "user_id": user_id,
        "lesson_id": lesson_id,
        "topic": topic,
        "difficulty": difficulty,
        "quiz": quiz_payload,          # store full quiz served
        "created_at": datetime.utcnow()
    }
    inserted = quizzes_col.insert_one(quiz_doc)

    return {
        "quiz_id": str(inserted.inserted_id),
        "lesson_id": lesson_id,
        "topic": topic,
        "quiz": quiz_payload
    }


def submit_quiz(user_id: str, quiz_id: str, submitted_answers):
    """
    Evaluates quiz, stores attempt, updates profile, returns result + decision.
    """
    quiz_doc = quizzes_col.find_one({"_id": ObjectId(quiz_id)})
    if not quiz_doc:
        raise ValueError("Quiz not found")

    if quiz_doc.get("user_id") != user_id:
        # simple protection
        raise PermissionError("This quiz does not belong to this user")

    quiz_payload = quiz_doc.get("quiz")
    lesson_id = quiz_doc.get("lesson_id")
    topic = quiz_doc.get("topic")

    evaluation = _call_person2_evaluate(quiz_payload, submitted_answers)

    # Normalize evaluation into a consistent format
    # If person2 returns just score, convert to dict
    if isinstance(evaluation, (int, float)):
        evaluation = {"score_percent": float(evaluation)}
    if "score_percent" not in evaluation:
        # common alternative keys
        if "score" in evaluation:
            evaluation["score_percent"] = float(evaluation["score"])
        elif "percentage" in evaluation:
            evaluation["score_percent"] = float(evaluation["percentage"])
        else:
            evaluation["score_percent"] = 0.0

    decision = _call_person2_adaptive(evaluation)

    # Store attempt
    attempt_doc = {
        "user_id": user_id,
        "quiz_id": quiz_id,
        "lesson_id": lesson_id,
        "topic": topic,
        "submitted_answers": submitted_answers,
        "result": evaluation,
        "decision": decision,
        "created_at": datetime.utcnow()
    }
    attempts_col.insert_one(attempt_doc)

    # Update learner profile (very simple version)
    profiles_col.update_one(
        {"user_id": user_id},
        {"$set": {"last_lesson_id": lesson_id},
         "$push": {"attempts": {"quiz_id": quiz_id, "topic": topic, "score": evaluation["score_percent"], "decision": decision}}},
        upsert=True
    )

    return {
        "quiz_id": quiz_id,
        "lesson_id": lesson_id,
        "topic": topic,
        "score_percent": evaluation["score_percent"],
        "evaluation": evaluation,
        "decision": decision
    }