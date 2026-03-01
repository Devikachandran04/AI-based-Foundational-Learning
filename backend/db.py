import os
import certifi
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "ai_learning_db")

if not MONGO_URI:
    raise ValueError("MONGO_URI missing in .env")

client = MongoClient(
    MONGO_URI,
    tls=True,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=10000,
    connectTimeoutMS=10000,
)

db = client[DB_NAME]

users_col = db["users"]
lessons_col = db["lessons"]
quizzes_col = db["quizzes"]
attempts_col = db["attempts"]
profiles_col = db["learner_profile"]
help_requests_col = db["help_requests"]
question_bank_col = db["question_bank"]