import os
import json
from datetime import datetime
from db import lessons_col, question_bank_col

QUESTION_BANK_FOLDER = os.path.join(
    os.path.dirname(__file__),
    "ai",
    "question_generator",
    "question_bank"
)

# Map file topic names to lesson titles
LESSON_TITLE_MAP = {
    "nouns": "Nouns Basics",
    "verbs": "Verbs Basics",
    "tenses": "Tenses Basics",
    "adjectives": "Adjectives Basics",
    "articles": "Articles Basics",
    "prepositions": "Prepositions"
}

# File difficulty -> backend difficulty
DIFFICULTY_MAP = {
    "basic": "basic",
    "moderate": "moderate",
    "hard": "advanced"
}


def get_lessons_map():
    """
    Returns:
    {
        "nouns": "<lesson_id_as_string>",
        ...
    }
    """
    lessons_map = {}

    for topic_key, lesson_title in LESSON_TITLE_MAP.items():
        lesson = lessons_col.find_one({"title": lesson_title})
        if lesson:
            lessons_map[topic_key] = str(lesson["_id"])

    return lessons_map


def normalize_question(raw_q, lesson_id, topic, difficulty):
    """
    Convert JSON question format into backend DB format.

    Supported formats:
    1) {
         "question": "...",
         "options": ["a","b","c","d"],
         "correct_index": 1
       }

    2) {
         "question": "...",
         "options": {"A":"..","B":"..","C":"..","D":".."},
         "answer": "B"
       }

    3) {
         "question": "...",
         "choices": ["a","b","c","d"],
         "answer": 1
       }

    4) {
         "question": "...",
         "options": ["a","b","c","d"],
         "answer": "correct option text"
       }
    """

    question_text = raw_q.get("question") or raw_q.get("q") or raw_q.get("text")
    if not question_text:
        return None

    options = raw_q.get("options") or raw_q.get("choices")

    # Case 1: options as dict {"A": "...", "B": "..."}
    if isinstance(options, dict):
        ordered_keys = list(options.keys())
        option_values = [options[k] for k in ordered_keys]

        answer = raw_q.get("answer")
        correct_index = raw_q.get("correct_index")

        if correct_index is None and answer is not None:
            if isinstance(answer, str) and answer in ordered_keys:
                correct_index = ordered_keys.index(answer)

        if correct_index is None:
            return None

        return {
            "lesson_id": lesson_id,
            "topic": topic,
            "difficulty": difficulty,
            "question": question_text,
            "options": option_values,
            "correct_index": int(correct_index),
            "created_at": datetime.utcnow()
        }

    # Case 2: options as list
    if isinstance(options, list):
        answer = raw_q.get("answer")
        correct_index = raw_q.get("correct_index")

        if correct_index is None and answer is not None:
            if isinstance(answer, str) and answer in options:
                correct_index = options.index(answer)
            elif isinstance(answer, int):
                correct_index = answer

        if correct_index is None:
            return None

        return {
            "lesson_id": lesson_id,
            "topic": topic,
            "difficulty": difficulty,
            "question": question_text,
            "options": options,
            "correct_index": int(correct_index),
            "created_at": datetime.utcnow()
        }

    return None


def import_question_bank():
    lessons_map = get_lessons_map()

    if not lessons_map:
        print("❌ No lessons found in MongoDB. Run seed.py first.")
        return

    # clear old imported questions
    question_bank_col.delete_many({})

    inserted_count = 0

    for filename in os.listdir(QUESTION_BANK_FOLDER):
        if not filename.endswith(".json"):
            continue

        # Example: nouns_basic.json
        name_without_ext = filename[:-5]

        if "_" not in name_without_ext:
            print(f"⚠ Skipping invalid filename: {filename}")
            continue

        difficulty_suffix = None
        topic_name = None

        if name_without_ext.endswith("_basic"):
            difficulty_suffix = "basic"
            topic_name = name_without_ext[:-6]   # remove "_basic"
        elif name_without_ext.endswith("_moderate"):
            difficulty_suffix = "moderate"
            topic_name = name_without_ext[:-9]   # remove "_moderate"
        elif name_without_ext.endswith("_hard"):
            difficulty_suffix = "hard"
            topic_name = name_without_ext[:-5]   # remove "_hard"
        else:
            print(f"⚠ Skipping unsupported filename: {filename}")
            continue

        if topic_name not in lessons_map:
            print(f"⚠ No lesson found for topic '{topic_name}' (file: {filename})")
            continue

        lesson_id = lessons_map[topic_name]
        difficulty = DIFFICULTY_MAP[difficulty_suffix]

        file_path = os.path.join(QUESTION_BANK_FOLDER, filename)

        with open(file_path, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except Exception as e:
                print(f"❌ Failed to load {filename}: {e}")
                continue

        if not isinstance(data, list):
            print(f"⚠ Expected list in {filename}, got {type(data).__name__}")
            continue

        docs_to_insert = []

        for raw_q in data:
            doc = normalize_question(
                raw_q=raw_q,
                lesson_id=lesson_id,
                topic=topic_name,
                difficulty=difficulty
            )

            if doc:
                docs_to_insert.append(doc)
            else:
                print(f"⚠ Skipped malformed question in {filename}: {raw_q}")

        if docs_to_insert:
            question_bank_col.insert_many(docs_to_insert)
            inserted_count += len(docs_to_insert)
            print(f"✅ Imported {len(docs_to_insert)} questions from {filename}")
        else:
            print(f"⚠ No valid questions found in {filename}")

    print(f"\n🎉 Total imported questions: {inserted_count}")


if __name__ == "__main__":
    import_question_bank()