def evaluate_quiz(questions, student_answers):
    correct = 0
    topic_accuracy = {}

    for q in questions:
        qid = q["question_id"]
        topic = q["topic"]

        if topic not in topic_accuracy:
            topic_accuracy[topic] = {"correct": 0, "total": 0}

        topic_accuracy[topic]["total"] += 1

        if student_answers.get(qid) == q["correct_answer"]:
            correct += 1
            topic_accuracy[topic]["correct"] += 1

    score_percentage = (correct / len(questions)) * 100
    return score_percentage, topic_accuracy
