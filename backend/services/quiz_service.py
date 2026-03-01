from datetime import datetime
from bson import ObjectId
from db import quizzes_col, attempts_col, profiles_col, question_bank_col
from services.profile_service import update_profile_after_attempt
from services.adaptive_policy import decide_next_step

# ---------- weights for scoring ----------
WEIGHTS = {"basic": 1, "moderate": 2, "hard": 3}

def _get_attempt_no(user_id: str, lesson_id: str) -> int:
    # number of previous attempts for this lesson + 1
    count = attempts_col.count_documents({"user_id": user_id, "lesson_id": lesson_id})
    return count + 1

def _pick_questions(lesson_id: str, attempt_no: int):
    # Attempt 1: 2 basic, 2 moderate, 2 hard
    # Attempt 2+: simplified: more basic+moderate, no hard
    if attempt_no == 1:
        plan = [("basic", 2), ("moderate", 2), ("hard", 2)]
        quiz_type = "mixed"
    else:
        plan = [("basic", 4), ("moderate", 2)]
        quiz_type = "simplified"

    picked = []
    for diff, n in plan:
        cursor = list(question_bank_col.aggregate([
            {"$match": {"lesson_id": lesson_id, "difficulty": diff}},
            {"$sample": {"size": n}}
        ]))
        picked.extend(cursor)

    # fallback if not enough questions
    # (don’t crash; just return what we have)
    return picked, quiz_type

def start_quiz(user_id: str, lesson_id: str):
    attempt_no = _get_attempt_no(user_id, lesson_id)

    questions, quiz_type = _pick_questions(lesson_id, attempt_no)
    if len(questions) == 0:
        raise ValueError("No questions found in question_bank for this lesson.")

    q_payload = []
    q_ids = []
    for q in questions:
        qid = str(q["_id"])
        q_ids.append(qid)
        q_payload.append({
            "question_id": qid,
            "question": q["question"],
            "options": q["options"],
            "difficulty": q["difficulty"],
            "topic": q.get("topic")
        })

    quiz_doc = {
        "user_id": user_id,
        "lesson_id": lesson_id,
        "attempt_no": attempt_no,
        "quiz_type": quiz_type,
        "question_ids": q_ids,
        "status": "active",
        "created_at": datetime.utcnow()
    }
    res = quizzes_col.insert_one(quiz_doc)

    return {
        "quiz_id": str(res.inserted_id),
        "lesson_id": lesson_id,
        "attempt_no": attempt_no,
        "quiz_type": quiz_type,
        "questions": q_payload
    }

def submit_quiz(user_id: str, quiz_id: str, submitted_answers, time_taken_sec: int = 0):
    quiz = quizzes_col.find_one({"_id": ObjectId(quiz_id)})
    if not quiz:
        raise ValueError("Quiz not found.")
    if quiz["user_id"] != user_id:
        raise PermissionError("This quiz does not belong to you.")
    if quiz.get("status") == "submitted":
        raise PermissionError("Quiz already submitted.")

    lesson_id = quiz["lesson_id"]
    attempt_no = int(quiz.get("attempt_no", 1))
    question_ids = [ObjectId(x) for x in quiz["question_ids"]]

    # Map submitted answers to dict: {question_id: selected_index}
    # Accept list like [{"question_id":"..","selected_index":1}, ...] or dict {"qid":1}
    answers_map = {}
    if isinstance(submitted_answers, list):
        for a in submitted_answers:
            answers_map[a["question_id"]] = a["selected_index"]
    elif isinstance(submitted_answers, dict):
        answers_map = submitted_answers
    else:
        raise ValueError("submitted_answers must be list or dict")

    questions = list(question_bank_col.find({"_id": {"$in": question_ids}}))

    total_weight = 0
    score_weight = 0
    topic_stats = {}  # topic -> {"correct":x,"total":y}

    for q in questions:
        qid = str(q["_id"])
        diff = q["difficulty"]
        w = WEIGHTS.get(diff, 1)

        total_weight += w
        correct_index = q["correct_index"]
        selected_index = answers_map.get(qid, None)

        topic = q.get("topic", "unknown")
        topic_stats.setdefault(topic, {"correct": 0, "total": 0})
        topic_stats[topic]["total"] += 1

        if selected_index is not None and int(selected_index) == int(correct_index):
            score_weight += w
            topic_stats[topic]["correct"] += 1

    score_percent = 0 if total_weight == 0 else round((score_weight / total_weight) * 100)

    topic_accuracy = {}
    for t, s in topic_stats.items():
        topic_accuracy[t] = 0 if s["total"] == 0 else round(s["correct"] / s["total"], 2)

    # decide next step based on your new policy
    decision = decide_next_step(score_percent=score_percent, attempt_no=attempt_no)

    attempt_doc = {
        "user_id": user_id,
        "lesson_id": lesson_id,
        "quiz_id": quiz_id,
        "attempt_no": attempt_no,
        "quiz_type": quiz.get("quiz_type"),
        "score": score_percent,
        "time_taken_sec": time_taken_sec,
        "topic_accuracy": topic_accuracy,
        "decision": decision,
        "created_at": datetime.utcnow()
    }
    attempts_col.insert_one(attempt_doc)

    quizzes_col.update_one({"_id": ObjectId(quiz_id)}, {"$set": {"status": "submitted"}})

    update_profile_after_attempt(
        user_id=user_id,
        lesson_id=lesson_id,
        score=score_percent,
        topic_accuracy=topic_accuracy,
        decision=decision
    )

    return {
        "score": score_percent,
        "topic_accuracy": topic_accuracy,
        "decision": decision
    }