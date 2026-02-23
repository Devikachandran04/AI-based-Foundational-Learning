from flask import Flask, jsonify
from flask_cors import CORS
from db import db

# Import blueprints
from routes.lessons import lessons_bp
from routes.quiz import quiz_bp

app = Flask(__name__)
CORS(app)

# ------------------------
# Health Check Route
# ------------------------
@app.get("/api/health")
def health():
    try:
        db.list_collection_names()
        return jsonify({"ok": True, "db": "connected"})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500


# ------------------------
# Register Blueprints
# ------------------------
app.register_blueprint(lessons_bp, url_prefix="/api/lessons")
app.register_blueprint(quiz_bp, url_prefix="/api/quiz")


# ------------------------
# Run App
# ------------------------
if __name__ == "__main__":
    app.run(debug=True)