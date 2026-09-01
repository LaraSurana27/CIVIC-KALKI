s# CIVIC-KALKI Setup Instructions

## Prerequisites
- Python 3.10+

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository_url>
   cd CIVIC-KALKI
   ```

2. **Create and activate a virtual environment**
   - **Windows:**
     ```bash
     python -m venv venv
     .\venv\Scripts\Activate
     ```
   - **Mac / Linux:**
     ```bash
     python -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables**
   - Create a `.env` file in the root directory (make sure it stays out of version control).
   - Add your Supabase database connection string to the `.env` file:
     ```env
     DATABASE_URL=postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres
     ```
   *(Note: You can retrieve this connection string from the Supabase dashboard under the 'Connect' button -> 'Transaction pooler'.)*

5. **Run the development server**
   ```bash
   uvicorn main:app --reload
   ```

6. **Test the connection**
   Open your browser and navigate to the health check endpoint:
   http://127.0.0.1:8000/health

   If everything is set up correctly, you should see a response like:
   `{"status": "ok", "database": "connected"}`
