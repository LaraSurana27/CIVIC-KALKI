from fastapi import FastAPI, HTTPException
from sqlalchemy.sql import text
from database import engine

app = FastAPI()

@app.get("/health")
def health_check():
    """
    Health check endpoint to verify database connection.
    """
    if not engine:
        raise HTTPException(status_code=500, detail="Database engine not configured. Please check your .env file.")
    
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            row = result.fetchone()
            if row and row[0] == 1:
                return {"status": "ok", "database": "connected"}
            else:
                raise HTTPException(status_code=500, detail="Database connection test failed (unexpected result).")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")
