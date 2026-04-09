# routes/help.py
from flask import Blueprint, request, jsonify, g, current_app
from bson import ObjectId
from db import help_requests_col, users_col
from routes.auth_utils import require_auth, require_teacher
from datetime import datetime
from werkzeug.utils import secure_filename
import os
import uuid

help_bp = Blueprint("help", __name__)


def allowed_file(filename):
    allowed = current_app.config.get(
        "ALLOWED_IMAGE_EXTENSIONS",
        {"png", "jpg", "jpeg", "gif", "webp"}
    )
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed


def save_uploaded_image(file):
    if not file or file.filename == "":
        return None

    if not allowed_file(file.filename):
        return None

    ext = file.filename.rsplit(".", 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)

    filepath = os.path.join(upload_folder, secure_filename(filename))
    file.save(filepath)

    return f"/uploads/help_chat/{filename}"


def get_user_role(user_id):
    try:
        user = users_col.find_one({"_id": ObjectId(user_id)})
    except Exception:
        user = None
    return user.get("role") if user else None


def build_message(sender, text="", image=None):
    return {
        "sender": sender,
        "text": text or "",
        "image": image,
        "timestamp": datetime.utcnow()
    }


def normalize_messages(doc):
    messages = doc.get("messages", [])

    if messages and isinstance(messages, list):
        return messages

    fallback_messages = []

    if doc.get("message"):
        fallback_messages.append({
            "sender": "student",
            "text": doc.get("message", ""),
            "image": None,
            "timestamp": doc.get("created_at")
        })

    if doc.get("reply"):
        fallback_messages.append({
            "sender": "teacher",
            "text": doc.get("reply", ""),
            "image": None,
            "timestamp": doc.get("updated_at")
        })

    return fallback_messages


def format_message(msg):
    return {
        "sender": msg.get("sender", ""),
        "text": msg.get("text", ""),
        "image": msg.get("image"),
        "timestamp": msg.get("timestamp")
    }


def first_non_empty_text(messages):
    for msg in messages:
        text = (msg.get("text") or "").strip()
        if text:
            return text
    return ""


def has_teacher_reply(messages):
    return any(msg.get("sender") == "teacher" for msg in messages)


def summarize_thread(doc, student=None, include_messages=True):
    messages = normalize_messages(doc)
    last_message = messages[-1] if messages else {}
    teacher_replied = has_teacher_reply(messages)

    # keep explicit status if present, otherwise infer it
    status = doc.get("status")
    if status not in {"answered", "pending"}:
        status = "answered" if teacher_replied else "pending"

    title = doc.get("title")
    if not title:
        title = first_non_empty_text(messages) or "New Chat"

    base = {
        "id": str(doc["_id"]),
        "student_id": doc.get("user_id"),
        "student_name": (
            student.get("name")
            if student
            else doc.get("student_name", "Student")
        ),
        "student_email": student.get("email") if student else "",
        "title": title,
        "status": status,
        "teacher_replied": teacher_replied,
        "message_count": len(messages),
        "created_at": doc.get("created_at"),
        "updated_at": doc.get("updated_at"),
        "message": doc.get("message", ""),
        "reply": doc.get("reply"),
        "last_message": {
            "text": last_message.get("text", ""),
            "image": last_message.get("image"),
            "sender": last_message.get("sender", ""),
            "timestamp": last_message.get("timestamp")
        }
    }

    if include_messages:
        base["messages"] = [format_message(m) for m in messages]

    return base


def parse_request_message():
    message = ""
    image_path = None

    if request.content_type and "multipart/form-data" in request.content_type:
        message = (request.form.get("message") or "").strip()
        image = request.files.get("image")
        image_path = save_uploaded_image(image) if image else None
    else:
        data = request.get_json(force=True, silent=True) or {}
        message = (data.get("message") or "").strip()

    return message, image_path


# ------------------------
# 1️⃣ Student starts a NEW chat thread
# ------------------------
@help_bp.post("/submit")
@require_auth
def submit_help():
    message, image_path = parse_request_message()

    if not message and not image_path:
        return jsonify({"error": "Message or image required"}), 400

    student = users_col.find_one({"_id": ObjectId(g.user_id)})

    first_message = build_message(
        sender="student",
        text=message,
        image=image_path
    )

    title = message.strip() if message.strip() else "New Chat"

    help_doc = {
        "user_id": g.user_id,
        "student_name": student.get("name") if student else "Student",
        "title": title[:120],
        "messages": [first_message],
        "message": message,   # legacy compatibility
        "reply": None,        # legacy compatibility
        "status": "pending",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    res = help_requests_col.insert_one(help_doc)

    return jsonify({
        "ok": True,
        "help_id": str(res.inserted_id),
        "status": "pending"
    })


# ------------------------
# 2️⃣ Student views own chat threads list
# ------------------------
@help_bp.get("/my")
@require_auth
def my_help_requests():
    doubts = list(
        help_requests_col.find({"user_id": g.user_id}).sort("updated_at", -1)
    )

    formatted = [summarize_thread(d, include_messages=True) for d in doubts]
    return jsonify({"my_doubts": formatted})


# ------------------------
# 3️⃣ Teacher views only pending threads
# ------------------------
@help_bp.get("/pending")
@require_teacher
def pending_help():
    doubts = list(
        help_requests_col.find({"status": "pending"}).sort("updated_at", -1)
    )

    formatted = []
    for d in doubts:
        student = users_col.find_one({"_id": ObjectId(d["user_id"])})
        formatted.append(summarize_thread(d, student=student, include_messages=True))

    return jsonify({"pending_doubts": formatted})


# ------------------------
# 4️⃣ Teacher legacy reply endpoint
#    (still works, now appends to message history)
# ------------------------
@help_bp.post("/reply/<help_id>")
@require_teacher
def reply_help(help_id):
    try:
        obj_id = ObjectId(help_id)
    except Exception:
        return jsonify({"error": "Invalid help request id"}), 400

    data = request.get_json(force=True, silent=True) or {}
    reply_msg = (data.get("reply") or "").strip()

    if not reply_msg:
        return jsonify({"error": "Reply required"}), 400

    thread = help_requests_col.find_one({"_id": obj_id})
    if not thread:
        return jsonify({"error": "Help request not found"}), 404

    teacher_message = build_message(
        sender="teacher",
        text=reply_msg,
        image=None
    )

    help_requests_col.update_one(
        {"_id": obj_id},
        {
            "$push": {"messages": teacher_message},
            "$set": {
                "reply": reply_msg,
                "status": "answered",
                "updated_at": datetime.utcnow()
            }
        }
    )

    return jsonify({"ok": True, "help_id": help_id, "status": "answered"})


# ------------------------
# 5️⃣ Teacher views all chat threads
# ------------------------
@help_bp.get("/all")
@require_teacher
def all_help_requests():
    doubts = list(help_requests_col.find({}).sort("updated_at", -1))

    formatted = []
    for d in doubts:
        student = users_col.find_one({"_id": ObjectId(d["user_id"])})
        formatted.append(summarize_thread(d, student=student, include_messages=True))

    return jsonify({"all_doubts": formatted})


# ------------------------
# 6️⃣ Get one chat thread
# ------------------------
@help_bp.get("/thread/<help_id>")
@require_auth
def get_help_thread(help_id):
    try:
        obj_id = ObjectId(help_id)
    except Exception:
        return jsonify({"error": "Invalid help request id"}), 400

    thread = help_requests_col.find_one({"_id": obj_id})
    if not thread:
        return jsonify({"error": "Help request not found"}), 404

    current_role = get_user_role(g.user_id)

    if current_role != "teacher" and thread.get("user_id") != g.user_id:
        return jsonify({"error": "Unauthorized"}), 403

    student = users_col.find_one({"_id": ObjectId(thread["user_id"])})

    return jsonify({
        "thread": summarize_thread(thread, student=student, include_messages=True)
    })


# ------------------------
# 7️⃣ Send message in existing thread
#    student and teacher both use this
# ------------------------
@help_bp.post("/message/<help_id>")
@require_auth
def send_thread_message(help_id):
    try:
        obj_id = ObjectId(help_id)
    except Exception:
        return jsonify({"error": "Invalid help request id"}), 400

    thread = help_requests_col.find_one({"_id": obj_id})
    if not thread:
        return jsonify({"error": "Help request not found"}), 404

    current_role = get_user_role(g.user_id)

    if current_role != "teacher" and thread.get("user_id") != g.user_id:
        return jsonify({"error": "Unauthorized"}), 403

    message, image_path = parse_request_message()

    if not message and not image_path:
        return jsonify({"error": "Message or image required"}), 400

    sender = "teacher" if current_role == "teacher" else "student"

    new_message = build_message(
        sender=sender,
        text=message,
        image=image_path
    )

    new_status = "answered" if sender == "teacher" else "pending"

    # keep original first student message in legacy "message"
    first_message_value = thread.get("message") or message

    # keep latest teacher reply in legacy "reply"
    latest_reply_value = message if sender == "teacher" else thread.get("reply")

    help_requests_col.update_one(
        {"_id": obj_id},
        {
            "$push": {"messages": new_message},
            "$set": {
                "updated_at": datetime.utcnow(),
                "status": new_status,
                "message": first_message_value,
                "reply": latest_reply_value
            }
        }
    )

    updated_thread = help_requests_col.find_one({"_id": obj_id})
    student = users_col.find_one({"_id": ObjectId(updated_thread["user_id"])})

    return jsonify({
        "ok": True,
        "help_id": help_id,
        "status": new_status,
        "thread": summarize_thread(updated_thread, student=student, include_messages=True)
    })