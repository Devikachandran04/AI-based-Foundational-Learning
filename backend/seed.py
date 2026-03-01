from datetime import datetime
from werkzeug.security import generate_password_hash
from db import users_col, lessons_col, question_bank_col

def seed_all():
    users_col.delete_many({})
    lessons_col.delete_many({})
    question_bank_col.delete_many({})

    teacher_id = users_col.insert_one({
        "name": "Teacher",
        "email": "teacher@test.com",
        "password_hash": generate_password_hash("teacher123"),
        "role": "teacher",
        "created_at": datetime.utcnow()
    }).inserted_id

    student_id = users_col.insert_one({
        "name": "Student",
        "email": "student@test.com",
        "password_hash": generate_password_hash("student123"),
        "role": "student",
        "created_at": datetime.utcnow()
    }).inserted_id

    lesson_id = lessons_col.insert_one({
        "subject": "English",
        "title": "Nouns Basics",
        "content": "Full lesson: noun definition, examples, exercises...",
        "simplified_content": "Simple: Noun = name of person/place/thing.",
        "images": [],
        "video_links": ["https://www.youtube.com/watch?v=example"],
        "topics": ["nouns"],
        "difficulty": "basic"
    }).inserted_id

    qs = []

    for i in range(6):
        qs.append({
            "lesson_id": str(lesson_id),
            "topic": "nouns",
            "difficulty": "basic",
            "question": f"Basic Q{i+1}: Which is a noun?",
            "options": ["run", "cat", "quickly", "blue"],
            "correct_index": 1
        })

    for i in range(6):
        qs.append({
            "lesson_id": str(lesson_id),
            "topic": "nouns",
            "difficulty": "moderate",
            "question": f"Moderate Q{i+1}: Identify the noun in 'The boy runs fast'.",
            "options": ["The", "boy", "runs", "fast"],
            "correct_index": 1
        })

    for i in range(6):
        qs.append({
            "lesson_id": str(lesson_id),
            "topic": "nouns",
            "difficulty": "hard",
            "question": f"Hard Q{i+1}: Choose the abstract noun.",
            "options": ["table", "happiness", "dog", "car"],
            "correct_index": 1
        })

    question_bank_col.insert_many(qs)

    print("✅ Seeded teacher, student, lesson, question_bank")

if __name__ == "__main__":
    seed_all()