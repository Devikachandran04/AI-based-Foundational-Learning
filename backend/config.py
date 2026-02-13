import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "ai_learning_db")
JWT_SECRET = os.getenv("JWT_SECRET", "change_this_secret")
