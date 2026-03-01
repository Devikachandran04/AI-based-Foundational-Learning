def decide_next_step(score_percent: int, attempt_no: int) -> str:
    """
    Return one of:
    - NEXT_LESSON
    - GO_SIMPLIFIED_QUIZ
    - SHOW_SUPPORT_OPTIONS (help/video/retake)
    """
    if score_percent >= 70:
        return "NEXT_LESSON"

    # attempt 1 fail => simplified quiz
    if attempt_no == 1:
        return "GO_SIMPLIFIED_QUIZ"

    # attempt 2+ fail => show help/video/retake
    return "SHOW_SUPPORT_OPTIONS"