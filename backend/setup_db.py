from db import (
    users_col, lessons_col, quizzes_col, attempts_col,
    profiles_col, help_requests_col, question_bank_col
)

def setup_indexes():
    users_col.create_index("email", unique=True)

    lessons_col.create_index([("subject", 1)])
    lessons_col.create_index([("topics", 1)])

    quizzes_col.create_index([("user_id", 1), ("created_at", -1)])
    quizzes_col.create_index([("lesson_id", 1)])
    quizzes_col.create_index([("status", 1)])

    attempts_col.create_index([("user_id", 1), ("created_at", -1)])
    attempts_col.create_index([("lesson_id", 1), ("created_at", -1)])
    attempts_col.create_index([("quiz_id", 1)])

    profiles_col.create_index("user_id", unique=True)

    help_requests_col.create_index([("status", 1), ("created_at", -1)])
    help_requests_col.create_index([("user_id", 1), ("created_at", -1)])

    question_bank_col.create_index([("lesson_id", 1), ("difficulty", 1)])
    question_bank_col.create_index([("topic", 1), ("difficulty", 1)])

    print("✅ Indexes created/verified")

if __name__ == "__main__":
    setup_indexes()