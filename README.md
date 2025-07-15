# CrewAI Visual Builder - Minimal Working Setup

This is a minimal working version of the CrewAI Visual Builder with a React Flow frontend and FastAPI backend.

## What's Working

### Frontend (React + React Flow)
- ✅ React application with Vite
- ✅ React Flow canvas with draggable nodes
- ✅ Basic "Hello World Crew" node displayed
- ✅ Running on http://localhost:3001

### Backend (FastAPI)
- ✅ FastAPI server with CORS configured
- ✅ Health check endpoint: `GET /health`
- ✅ Crews endpoint: `GET /api/v1/crews`
- ✅ Running on http://localhost:8001

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Visit: http://localhost:3001

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn pydantic python-multipart python-dotenv
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001
```

## Current Features

1. **Visual Canvas**: Drag-and-drop interface with React Flow
2. **Basic Node**: "Hello World Crew" node that can be moved around
3. **Backend API**: Simple REST endpoints for crew management
4. **CORS**: Frontend can communicate with backend

## Next Steps

This is a minimal foundation. You can now:
1. Add more node types (agents, tasks, tools)
2. Implement node connections and edges
3. Add property panels for node configuration
4. Integrate with actual CrewAI execution
5. Add workflow saving/loading
6. Implement real-time collaboration

## Project Structure

```
crewai-visual-builder/
├── frontend/                 # React + React Flow application
│   ├── src/
│   │   ├── App.tsx          # Main React Flow canvas
│   │   ├── main.tsx         # React entry point
│   │   └── index.css        # Styling
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # FastAPI application
│   ├── app/
│   │   └── main.py          # FastAPI application
│   ├── requirements.txt
│   └── venv/                # Python virtual environment
└── README.md
```
