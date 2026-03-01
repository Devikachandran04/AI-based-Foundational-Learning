from datetime import datetime, timedelta
from db import users_col, attempts_col, profiles_col

def dashboard_summary():
    total_students = users_col.count_documents({"role": "student"})

    since = datetime.utcnow() - timedelta(days=7)
    recent_attempts = list(attempts_col.find({"created_at": {"$gte": since}}))

    if recent_attempts:
        avg_score_7d = round(sum(a["score"] for a in recent_attempts) / len(recent_attempts))
    else:
        avg_score_7d = 0

    # low performers = students with last attempt score < 70
    pipeline = [
        {"$sort": {"created_at": -1}},
        {"$group": {"_id": "$user_id", "last_score": {"$first": "$score"}}},
        {"$match": {"last_score": {"$lt": 70}}}
    ]
    low_students = list(attempts_col.aggregate(pipeline))
    low_score_students = len(low_students)

    return {
        "total_students": total_students,
        "avg_score_7d": avg_score_7d,
        "low_score_students": low_score_students
    }

def weak_topics():
    # aggregate learner_profile weak_topics counts
    all_profiles = profiles_col.find({})
    counter = {}
    for p in all_profiles:
        wt = p.get("weak_topics", {})
        for topic, c in wt.items():
            counter[topic] = counter.get(topic, 0) + int(c)

    sorted_topics = sorted(counter.items(), key=lambda x: x[1], reverse=True)
    return [{"topic": t, "count": c} for t, c in sorted_topics[:20]]