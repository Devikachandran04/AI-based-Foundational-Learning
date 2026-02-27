from flask import Flask, jsonify
from flask_cors import CORS
from db import db

from routes.auth import auth_bp
from routes.lessons import lessons_bp
from routes.quiz import quiz_bp
from routes.help import help_bp
from routes.teacher import teacher_bp

app = Flask(__name__)
CORS(app)

@app.get("/api/health")
def health():
    try:
        db.list_collection_names()
        return jsonify({"ok": True, "db": "connected"})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(lessons_bp, url_prefix="/api/lessons")
app.register_blueprint(quiz_bp, url_prefix="/api/quiz")
app.register_blueprint(help_bp, url_prefix="/api/help")
app.register_blueprint(teacher_bp, url_prefix="/api/teacher")

if __name__ == "__main__":
    app.run(debug=True)