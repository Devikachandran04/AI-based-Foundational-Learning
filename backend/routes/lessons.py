from flask import Blueprint, request, jsonify
from bson import ObjectId
from db import lessons_col

lessons_bp = Blueprint("lessons", __name__)

@lessons_bp.get("/subjects")
def subjects():
    subjects = lessons_col.distinct("subject")
    return jsonify({"subjects": subjects})

@lessons_bp.get("")
def list_lessons():
    subject = request.args.get("subject")
    query = {}
    if subject:
        query["subject"] = subject

    lessons = []
    for l in lessons_col.find(query, {"content": 0, "simplified_content": 0}):
        l["id"] = str(l["_id"])
        del l["_id"]
        lessons.append(l)

    return jsonify({"lessons": lessons})

@lessons_bp.get("/<lesson_id>")
def lesson_detail(lesson_id):
    lesson = lessons_col.find_one({"_id": ObjectId(lesson_id)})
    if not lesson:
        return jsonify({"error": "Lesson not found"}), 404

    lesson["id"] = str(lesson["_id"])
    del lesson["_id"]
    return jsonify(lesson)
