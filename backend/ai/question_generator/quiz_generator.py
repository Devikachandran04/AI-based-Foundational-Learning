
import os
import json
from quiz_evaluator import evaluate_quiz
from adaptive_logic import adaptive_decision

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_PATH = os.path.join(BASE_DIR, "question_bank", "nouns.json")


def generate_quiz(lesson_id):
    with open(FILE_PATH, "r") as file:
        questions = json.load(file)
    return questions


if __name__ == "__main__":
    questions = generate_quiz("grammar_nouns")

    student_answers = {
        "n1": "Apple",
        "n2": "is"
    }

    score, topic_accuracy = evaluate_quiz(questions, student_answers)
    decision = adaptive_decision(score)

    print("Score:", score)
    print("Topic Accuracy:", topic_accuracy)
    print("Decision:", decision)
