from datetime import datetime
from db import profiles_col

def update_profile_after_attempt(user_id: str, lesson_id: str, score: int, topic_accuracy: dict, decision: str):
    prof = profiles_col.find_one({"user_id": user_id})
    if not prof:
        prof = {"user_id": user_id, "weak_topics": {}, "completed_lessons": [], "updated_at": datetime.utcnow()}
        profiles_col.insert_one(prof)

    weak_topics = prof.get("weak_topics", {})
    for topic, acc in topic_accuracy.items():
        if acc < 0.7:
            weak_topics[topic] = weak_topics.get(topic, 0) + 1

    completed_lessons = prof.get("completed_lessons", [])
    if decision == "NEXT_LESSON" and lesson_id not in completed_lessons:
        completed_lessons.append(lesson_id)

    profiles_col.update_one(
        {"user_id": user_id},
        {"$set": {
            "weak_topics": weak_topics,
            "completed_lessons": completed_lessons,
            "updated_at": datetime.utcnow()
        }}
    )