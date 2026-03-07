def decide_next_step(score_percent: int, attempt_no: int) -> str:
    if score_percent >= 70:
        return "NEXT_LESSON"

    if attempt_no == 1:
        return "GO_SIMPLIFIED_QUIZ"

    return "SHOW_SUPPORT_OPTIONS"