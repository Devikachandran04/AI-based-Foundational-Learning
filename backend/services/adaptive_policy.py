def decide_next_step(score_percent: int, quiz_type: str) -> str:
    if score_percent >= 70:
        return "NEXT_LESSON"

    if quiz_type == "mixed":
        return "GO_SIMPLIFIED_QUIZ"

    return "SHOW_SUPPORT_OPTIONS"