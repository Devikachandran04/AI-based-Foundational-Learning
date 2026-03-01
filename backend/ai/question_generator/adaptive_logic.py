LESSON_SEQUENCE = [
    "nouns",
    "pronouns",
    "verbs",
    "articles",
    "adjectives",
    "basic_sentence_structure"
]
def get_next_lesson(current_lesson):
    try:
        index = LESSON_SEQUENCE.index(current_lesson)
        return LESSON_SEQUENCE[index + 1]
    except (ValueError, IndexError):
        return None  # No more lessons
MAX_ATTEMPTS = 3
PASS_THRESHOLD = 70


def adaptive_decision(score, attempt_count, quiz_type, lesson_id):

    # Passed normal quiz
    if score >= PASS_THRESHOLD and quiz_type == "normal":
        return {
            "next_action": "NEXT_LESSON",
            "mastery_level": "PROFICIENT_MASTERY",
            "next_lesson": get_next_lesson(lesson_id),
            "attempts_used": attempt_count
        }

    # Passed simplified quiz
    if score >= PASS_THRESHOLD and quiz_type == "easy":
        return {
            "next_action": "NEXT_LESSON",
            "mastery_level": "FOUNDATIONAL_MASTERY",
            "next_lesson": get_next_lesson(lesson_id),
            "attempts_used": attempt_count
        }

    # Attempt limit reached
    if attempt_count >= MAX_ATTEMPTS:
        return {
            "next_action": "USER_DECISION",
            "options": ["WATCH_VIDEO", "RETAKE_QUIZ"],
            "attempts_used": attempt_count
        }

    # Failed normal → simplified
    if score < PASS_THRESHOLD and quiz_type == "normal":
        return {
            "next_action": "SIMPLIFIED_QUIZ",
            "next_quiz_type": "easy",
            "attempts_used": attempt_count + 1
        }

    # Failed simplified → retry normal
    if score < PASS_THRESHOLD and quiz_type == "easy":
        return {
            "next_action": "NORMAL_RETRY",
            "next_quiz_type": "normal",
            "attempts_used": attempt_count + 1
        }