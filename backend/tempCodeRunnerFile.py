@app.route("/api/health")
def health():
    try:
        cols = db.list_collection_names()
        return jsonify({"status": "connected to MongoDB Atlas", "collections": cols})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500