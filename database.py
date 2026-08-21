import os
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the database URL from the environment
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the SQLAlchemy engine
if DATABASE_URL:
    # Supabase provides postgresql:// which is compatible with newer SQLAlchemy versions
    engine = create_engine(DATABASE_URL)
else:
    engine = None
