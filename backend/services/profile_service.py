from datetime import datetime
from db import profiles_col

PASS_THRESHOLD = 75


def update_profile_after_attempt(
    user_id: str,
    lesson_id: str,
    lesson_name: str,
    score: int,
    topic_accuracy: dict,
    decision: str,
    quiz_type: str,
    difficulty_breakdown: dict,
    attempt_no: int
):
    profile = profiles_col.find_one({"user_id": user_id})

    if not profile:
        profile = {
            "user_id": user_id,
            "weak_topics": {},
            "completed_lessons": [],
            "history": [],
            "updated_at": datetime.utcnow()
        }
        profiles_col.insert_one(profile)

    weak_topics = profile.get("weak_topics", {})
    completed_lessons = profile.get("completed_lessons", [])
    history = profile.get("history", [])

    for topic, acc in topic_accuracy.items():
        if acc < 0.75:
            weak_topics[topic] = weak_topics.get(topic, 0) + 1

    if decision == "NEXT_LESSON" and score >= PASS_THRESHOLD and lesson_id not in completed_lessons:
        completed_lessons.append(lesson_id)

    history.append({
        "lesson_id": lesson_id,
        "lesson_name": lesson_name,
        "score": score,
        "quiz_type": quiz_type,   # mixed / simplified
        "difficulty_breakdown": difficulty_breakdown,
        "attempt_no": attempt_no,
        "decision": decision,
        "passed": score >= PASS_THRESHOLD,
        "created_at": datetime.utcnow()
    })

    profiles_col.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "weak_topics": weak_topics,
                "completed_lessons": completed_lessons,
                "history": history,
                "updated_at": datetime.utcnow()
            }
        }
    )