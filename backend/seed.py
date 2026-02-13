from db import lessons_col

def seed_lessons():
    lessons_col.delete_many({})

    lessons_col.insert_many([
        {
            "subject": "English",
            "title": "Nouns Basics",
            "content": "Full lesson: noun definition, examples, exercises...",
            "simplified_content": "Simple: Noun = name of person/place/thing.",
            "images": [],
            "video_links": [],
            "topics": ["nouns"],
            "difficulty": "basic"
        }
    ])

    print("✅ Seeded lessons")

if __name__ == "__main__":
    seed_lessons()
