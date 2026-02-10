def adaptive_decision(score):
    if score >= 70:
        return {
            "next_action": "NEXT_LESSON",
            "message": "Excellent! You can move to the next lesson."
        }
    elif score >= 40:
        return {
            "next_action": "SIMPLER_CONTENT",
            "message": "Let’s revise nouns with simpler examples."
        }
    elif score >= 40:
        return {
        "next_action": "REASSESSMENT",
        "message": "Reattempt quiz focused on weak areas."
    }

    else:
        return {
            "next_action": "VIDEO_SUPPORT",
            "message": "Watch a video explanation and try again."
        }
