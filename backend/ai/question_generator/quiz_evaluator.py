def evaluate_quiz(questions, student_answers):

    correct_count = 0
    topic_accuracy = {}

    for q in questions:
        qid = q["id"]
        topic = q["topic"]

        if topic not in topic_accuracy:
            topic_accuracy[topic] = {"correct": 0, "total": 0}

        topic_accuracy[topic]["total"] += 1

        if student_answers.get(qid) == q["answer"]:
            correct_count += 1
            topic_accuracy[topic]["correct"] += 1

    total_questions = len(questions)
    score = (correct_count / total_questions) * 100 if total_questions > 0 else 0

    return score, topic_accuracy