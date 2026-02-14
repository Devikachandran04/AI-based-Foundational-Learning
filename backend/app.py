from flask import Flask, jsonify
from flask_cors import CORS
from db import db
from routes.lessons import lessons_bp

app = Flask(__name__)
CORS(app)

@app.get("/api/health")
def health():
    try:
        db.list_collection_names()
        return jsonify({"ok": True, "db": "connected"})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

app.register_blueprint(lessons_bp, url_prefix="/api/lessons")

if __name__ == "__main__":
    app.run(debug=True)
