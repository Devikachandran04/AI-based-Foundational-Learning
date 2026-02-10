from quiz_evaluator import evaluate_quiz
from adaptive_logic import adaptive_decision
import json

def generate_quiz(lesson_id):
    with open("question_bank/nouns.json", "r") as file:
        return json.load(file)

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











