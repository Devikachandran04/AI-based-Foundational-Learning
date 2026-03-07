from datetime import datetime, timedelta
from db import users_col, attempts_col, profiles_col, lessons_col


def dashboard_summary():
    total_students = users_col.count_documents({"role": "student"})

    since = datetime.utcnow() - timedelta(days=7)
    recent_attempts = list(attempts_col.find({"created_at": {"$gte": since}}))

    if recent_attempts:
        avg_score_7d = round(sum(a.get("score", 0) for a in recent_attempts) / len(recent_attempts))
    else:
        avg_score_7d = 0

    latest_attempts_pipeline = [
        {"$sort": {"created_at": -1}},
        {
            "$group": {
                "_id": "$user_id",
                "last_score": {"$first": "$score"}
            }
        },
        {"$match": {"last_score": {"$lt": 70}}}
    ]

    low_students = list(attempts_col.aggregate(latest_attempts_pipeline))
    low_score_students = len(low_students)

    return {
        "total_students": total_students,
        "avg_score_7d": avg_score_7d,
        "low_score_students": low_score_students
    }


def weak_topics():
    all_profiles = profiles_col.find({})
    counter = {}

    for profile in all_profiles:
        wt = profile.get("weak_topics", {})
        for topic, count in wt.items():
            counter[topic] = counter.get(topic, 0) + int(count)

    sorted_topics = sorted(counter.items(), key=lambda x: x[1], reverse=True)

    return [{"topic": topic, "count": count} for topic, count in sorted_topics[:20]]


def student_progress():
    students = list(users_col.find({"role": "student"}))
    result = []

    for student in students:
        user_id = str(student["_id"])

        attempts = list(
            attempts_col.find({"user_id": user_id}).sort("created_at", -1).limit(10)
        )

        recent_attempts = []
        for a in attempts:
            recent_attempts.append({
                "lesson_id": a.get("lesson_id"),
                "score": a.get("score"),
                "decision": a.get("decision"),
                "quiz_type": a.get("quiz_type"),
                "difficulty_breakdown": a.get("difficulty_breakdown", {}),
                "created_at": a.get("created_at")
            })

        profile = profiles_col.find_one({"user_id": user_id})
        weak = []
        if profile:
            for topic, count in profile.get("weak_topics", {}).items():
                weak.append({
                    "topic": topic,
                    "count": count
                })

        result.append({
            "user_id": user_id,
            "name": student.get("name"),
            "email": student.get("email"),
            "recent_attempts": recent_attempts,
            "weak_topics": weak
        })

    return result