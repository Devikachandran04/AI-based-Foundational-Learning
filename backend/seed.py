from datetime import datetime
from werkzeug.security import generate_password_hash
from db import users_col, lessons_col


def seed_all():
    # clear only users and lessons
    users_col.delete_many({})
    lessons_col.delete_many({})

    # -------------------------
    # Seed users
    # -------------------------
    users_col.insert_one({
        "name": "Teacher",
        "email": "teacher@test.com",
        "password_hash": generate_password_hash("teacher123"),
        "role": "teacher",
        "created_at": datetime.utcnow()
    })

    users_col.insert_one({
        "name": "Student",
        "email": "student@test.com",
        "password_hash": generate_password_hash("student123"),
        "role": "student",
        "created_at": datetime.utcnow()
    })

    # -------------------------
    # Seed lessons
    # -------------------------
    lessons = [
        {
            "subject": "English",
            "title": "Nouns Basics",
            "content": "A noun is the name of a person, place, animal, or thing.",
            "simplified_content": "Noun means the name of a person, place, animal or thing.",
            "images": [],
            "video_links": [],
            "topics": ["nouns"],
            "difficulty": "basic",
            "created_at": datetime.utcnow()
        },
        {
            "subject": "English",
            "title": "Tenses Basics",
            "content": "Tenses tell us the time of an action",
            "simplified_content": "Tenses show past, present, or future.",
            "images": [],
            "video_links": [],
            "topics": ["tenses"],
            "difficulty": "basic",
            "created_at": datetime.utcnow()
        },
        {
            "subject": "English",
            "title": "Verbs Basics",
            "content": "A verb is an action word or a state of being.",
            "simplified_content": "Verb means action word.",
            "images": [],
            "video_links": [],
            "topics": ["verbs"],
            "difficulty": "basic",
            "created_at": datetime.utcnow()
        },
        {
            "subject": "English",
            "title": "Adjectives Basics",
            "content": "An adjective describes a noun or pronoun.",
            "simplified_content": "Adjective means describing word.",
            "images": [],
            "video_links": [],
            "topics": ["adjectives"],
            "difficulty": "basic",
            "created_at": datetime.utcnow()
        },
        {
            "subject": "English",
            "title": "Articles Basics",
            "content": "Articles are words like a, an, and the used before nouns.",
            "simplified_content": "Articles are a, an, and the.",
            "images": [],
            "video_links": [],
            "topics": ["articles"],
            "difficulty": "basic",
            "created_at": datetime.utcnow()
        },
        {
            
    "subject": "English",
    "title": "Prepositions",
    "content": "Prepositions are words that show the relationship between a noun or pronoun and another word in the sentence. Examples include in, on, at, under, over, and between.",
    "simplified_content": "Prepositions are small words like in, on, at that show place, time, or direction.",
    "images": [],
    "video_links": [],
    "topics": ["prepositions"],
    "difficulty": "basic",
    "created_at": datetime.utcnow()

        }
    ]

    lessons_col.insert_many(lessons)

    print("✅ Seeded users and all lesson records")


if __name__ == "__main__":
    seed_all()