def adaptive_decision(score):
    if score >= 70:
        return {
            "next_action": "NEXT_LESSON",
            "message": "Concept mastered. Proceed to next topic."
        }
    elif score >= 40:
        return {
            "next_action": "REASSESSMENT",
            "message": "Reattempt quiz focused on weak areas."
        }
    else:
        return {
            "next_action": "REMEDIAL_SUPPORT",
            "message": "Provide simplified content and practice exercises."
        }
#emax4444445