from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(
    title="CrewAI Visual Builder API",
    description="Backend API for CrewAI Visual Builder",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "CrewAI Visual Builder API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "crewai-visual-builder"}

@app.get("/api/v1/crews")
async def get_crews():
    """Get all crews - placeholder for now"""
    return {
        "crews": [
            {
                "id": "1",
                "name": "Hello World Crew",
                "description": "A simple example crew",
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z"
            }
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True) 