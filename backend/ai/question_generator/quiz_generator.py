import os
import json
from .quiz_evaluator import evaluate_quiz #for backend i changed
from .adaptive_logic import adaptive_decision


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
QUESTION_FOLDER = os.path.join(BASE_DIR, "question_bank")


def generate_quiz(lesson_id, level="normal"):

    if level == "normal":
        filename = "nouns_normal.json"
    elif level == "easy":
        filename = "nouns_easy.json"
    else:
        raise ValueError("Invalid level")

    file_path = os.path.join(QUESTION_FOLDER, filename)

    print("Loading:", filename)

    with open(file_path, "r") as file:
        questions = json.load(file)

    return questions


# 🚨 Always keep this at bottom
if __name__ == "__main__":

    questions = generate_quiz("grammar_nouns", level="normal")

    student_answers = {
        "n1": "Apple",
        "n2": "is"
    }

    score, topic_accuracy = evaluate_quiz(questions, student_answers)
    decision = adaptive_decision(score)

    print("Score:", score)
    print("Decision:", decision)

    if decision["next_action"] in ["SIMPLER_CONTENT", "REASSESSMENT"]:
        print("\nSwitching to simplified questions...\n")

        easy_questions = generate_quiz("grammar_nouns", level="easy")

        print(json.dumps(easy_questions, indent=4))