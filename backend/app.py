from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from db import db
import os

from config import (
    UPLOAD_FOLDER,
    MAX_CONTENT_LENGTH,
    ALLOWED_IMAGE_EXTENSIONS,
)

# Import routes
from routes.auth import auth_bp
from routes.lessons import lessons_bp
from routes.quiz import quiz_bp
from routes.help import help_bp
from routes.teacher import teacher_bp
from routes.student import student_bp

# 1️⃣ Create Flask app
app = Flask(__name__)

# 2️⃣ App config for uploads
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH
app.config["ALLOWED_IMAGE_EXTENSIONS"] = ALLOWED_IMAGE_EXTENSIONS

os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# 3️⃣ Enable CORS
CORS(app)

# 4️⃣ Handle preflight & headers manually
@app.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    return response

# 5️⃣ Health check route
@app.get("/api/health")
def health():
    try:
        db.list_collection_names()
        return jsonify({"ok": True, "db": "connected"})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

# 6️⃣ Serve uploaded help-chat images
@app.get("/uploads/help_chat/<path:filename>")
def uploaded_help_chat_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# 7️⃣ Register blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(lessons_bp, url_prefix="/api/lessons")
app.register_blueprint(quiz_bp, url_prefix="/api/quiz")
app.register_blueprint(help_bp, url_prefix="/api/help")
app.register_blueprint(teacher_bp, url_prefix="/api/teacher")
app.register_blueprint(student_bp, url_prefix="/api/student")

# 8️⃣ Run server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))