# services/analytics_service.py
from datetime import datetime, timedelta
from db import users_col, attempts_col, profiles_col, lessons_col

LEVELS = {0: "Low", 1: "Medium", 2: "High"}  # example mapping for risk

# -----------------------------
# 1️⃣ Dashboard Summary
# -----------------------------
def dashboard_summary():
    total_students = users_col.count_documents({"role": "student"})

    since = datetime.utcnow() - timedelta(days=7)
    recent_attempts = list(attempts_col.find({"created_at": {"$gte": since}}))

    avg_score_7d = (
        round(sum(a.get("score", 0) for a in recent_attempts) / len(recent_attempts))
        if recent_attempts else 0
    )

    # Count low-score students (last attempt < 70)
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


# -----------------------------
# 2️⃣ Low Score Students Detailed Table
# -----------------------------
def low_score_students_table():
    students = list(users_col.find({"role": "student"}))
    result = []

    for student in students:
        user_id = str(student["_id"])
        attempts = list(
            attempts_col.find({"user_id": user_id}).sort("created_at", -1).limit(5)
        )

        if not attempts:
            continue

        last_score = attempts[0]["score"]
        # count consecutive low attempts (score < 70)
        consecutive_low = 0
        for a in attempts:
            if a["score"] < 70:
                consecutive_low += 1
            else:
                break

        # Risk level based on consecutive low attempts
        if consecutive_low >= 3:
            level = "High"
        elif consecutive_low == 2:
            level = "Medium"
        else:
            level = "Low"

        if last_score < 70:
            result.append({
                "user_id": user_id,
                "name": student.get("name"),
                "email": student.get("email"),
                "last_score": last_score,
                "consecutive_low": consecutive_low,
                "level": level
            })

    # Sort by consecutive low desc
    result.sort(key=lambda x: x["consecutive_low"], reverse=True)
    return result


# -----------------------------
# 3️⃣ Weak Topics Dashboard
# -----------------------------
def weak_topics_dashboard():
    all_profiles = profiles_col.find({})
    counter = {}
    topic_scores = {}

    for profile in all_profiles:
        user_id = profile["user_id"]
        attempts = list(attempts_col.find({"user_id": user_id}))
        for topic, count in profile.get("weak_topics", {}).items():
            counter[topic] = counter.get(topic, 0) + count

            # avg score for this topic
            topic_scores.setdefault(topic, []).extend(
                [a.get("score", 0) for a in attempts if topic in a.get("topic_accuracy", {})]
            )

    weak_topics_list = []
    for topic, count in counter.items():
        scores = topic_scores.get(topic, [])
        avg_score = round(sum(scores) / len(scores), 2) if scores else 0

        # determine risk level based on count
        if count >= 5:
            level = "High"
        elif count >= 3:
            level = "Medium"
        else:
            level = "Low"

        weak_topics_list.append({
            "topic": topic,
            "count": count,
            "avg_score": avg_score,
            "level": level
        })

    # Sort by count desc
    weak_topics_list.sort(key=lambda x: x["count"], reverse=True)
    return weak_topics_list


# -----------------------------
# 4️⃣ Student Progress Dashboard
# -----------------------------
def student_progress():
    students = list(users_col.find({"role": "student"}))
    result = []

    for student in students:
        user_id = str(student["_id"])
        attempts = list(attempts_col.find({"user_id": user_id}))
        scores = [a.get("score", 0) for a in attempts]

        if not scores:
            avg_score = highest_score = lowest_score = 0
        else:
            avg_score = round(sum(scores) / len(scores), 2)
            highest_score = max(scores)
            lowest_score = min(scores)

        # Get learner profile weak topics
        profile = profiles_col.find_one({"user_id": user_id})
        weak = [{"topic": t, "count": c} for t, c in profile.get("weak_topics", {}).items()] if profile else []

        result.append({
            "user_id": user_id,
            "name": student.get("name"),
            "email": student.get("email"),
            "avg_score": avg_score,
            "highest_score": highest_score,
            "lowest_score": lowest_score,
            "lessons_completed": len(profile.get("completed_lessons", [])) if profile else 0,
            "weak_topics": weak,
            "recent_attempts": [
                {
                    "lesson_id": a.get("lesson_id"),
                    "score": a.get("score"),
                    "decision": a.get("decision"),
                    "quiz_type": a.get("quiz_type"),
                    "difficulty_breakdown": a.get("difficulty_breakdown", {}),
                    "created_at": a.get("created_at")
                } for a in sorted(attempts, key=lambda x: x["created_at"], reverse=True)[:10]
            ]
        })

    return result