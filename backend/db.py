import os
import certifi
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("MONGO_URI missing in .env")

client = MongoClient(
    MONGO_URI,
    tls=True,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=10000,
    connectTimeoutMS=10000,
)

db = client["ai_learning_db"]

# COLLECTIONS
users_col = db["users"]
lessons_col = db["lessons"]
quizzes_col = db["quizzes"]
attempts_col = db["attempts"]
profiles_col = db["learner_profile"]
help_col = db["help_requests"]
