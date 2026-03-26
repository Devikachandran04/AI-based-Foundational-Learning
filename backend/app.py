from flask import Flask, jsonify
from flask_cors import CORS
from db import db

# Import routes
from routes.auth import auth_bp
from routes.lessons import lessons_bp
from routes.quiz import quiz_bp
from routes.help import help_bp
from routes.teacher import teacher_bp
from routes.student import student_bp  # new

# 1️⃣ Create Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# 2️⃣ Health check route
@app.get("/api/health")
def health():
    try:
        db.list_collection_names()
        return jsonify({"ok": True, "db": "connected"})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

# 3️⃣ Register blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(lessons_bp, url_prefix="/api/lessons")
app.register_blueprint(quiz_bp, url_prefix="/api/quiz")
app.register_blueprint(help_bp, url_prefix="/api/help")
app.register_blueprint(teacher_bp, url_prefix="/api/teacher")
app.register_blueprint(student_bp, url_prefix="/api/student")  # student blueprint last

# 4️⃣ Run server
import os

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))