# CrewAI Visual Builder

A visual multi-agent workflow builder with deep CrewAI integration and a modern, Lindy.AI-inspired UI.

## Features

- **Visual Workflow Builder**: Drag-and-drop interface for creating CrewAI workflows
- **Real-time Collaboration**: Multi-user editing with live updates
- **Template System**: Save and share workflow templates
- **CrewAI Integration**: Direct execution of workflows with real-time monitoring
- **Modern UI**: Clean, intuitive interface inspired by Lindy.AI

## Project Structure

```
crewai-visual-builder/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/v1/         # API endpoints
│   │   ├── core/           # Core configuration
│   │   ├── models/         # Database models
│   │   └── services/       # Business logic
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── stores/         # State management
│   │   └── utils/          # Utilities
│   └── package.json        # Node.js dependencies
└── docker-compose.yml      # Development environment
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 13+
- Redis (optional, for caching)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd crewai-visual-builder
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Database Setup

1. **Install PostgreSQL** (if not already installed):
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql
   
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql
   
   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database and User**:
   ```sql
   CREATE DATABASE crewai_visual_builder;
   CREATE USER crewai_user WITH PASSWORD 'crewai_password';
   GRANT ALL PRIVILEGES ON DATABASE crewai_visual_builder TO crewai_user;
   ```

#### Environment Configuration

1. **Copy environment template**:
   ```bash
   cp env.example .env
   ```

2. **Update `.env` file** with your configuration:
   ```env
   # Required settings
   SECRET_KEY=your-super-secret-key-change-this-in-production
   DATABASE_URL=postgresql://crewai_user:crewai_password@localhost:5432/crewai_visual_builder
   
   # Optional: LLM API keys
   OPENAI_API_KEY=your-openai-api-key
   ANTHROPIC_API_KEY=your-anthropic-api-key
   ```

#### Start Backend Server

```bash
# Development mode
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Or using the main.py
python app/main.py
```

The API will be available at `http://localhost:8000`

### 3. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Start Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Using Docker (Alternative)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

## API Documentation

Once the backend is running, you can access:

- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## Authentication

The application uses JWT-based authentication with the following endpoints:

- `POST /api/v1/auth/signup` - Create a new user account
- `POST /api/v1/auth/login` - Authenticate and get access token
- `POST /api/v1/auth/logout` - Logout (client-side token removal)
- `GET /api/v1/auth/me` - Get current user information
- `POST /api/v1/auth/refresh` - Refresh access token

### Example Usage

```bash
# Sign up
curl -X POST "http://localhost:8000/api/v1/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "SecurePass123",
    "full_name": "Test User"
  }'

# Login
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=SecurePass123"
```

## Development

### Backend Development

The backend is built with:
- **FastAPI**: Modern, fast web framework
- **SQLAlchemy**: Database ORM
- **Pydantic**: Data validation
- **CrewAI**: Multi-agent framework integration

#### Key Files:
- `app/main.py`: Application entry point
- `app/api/v1/auth.py`: Authentication endpoints
- `app/api/v1/crews.py`: Workflow management
- `app/core/security.py`: JWT and password utilities
- `app/models/database.py`: Database models

### Frontend Development

The frontend is built with:
- **React**: UI framework
- **React Flow**: Visual workflow builder
- **Zustand**: State management
- **TypeScript**: Type safety

## Testing

### Backend Tests

```bash
cd backend
source venv/bin/activate
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Deployment

### Production Environment Variables

For production deployment, ensure these environment variables are set:

```env
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=<strong-secret-key>
DATABASE_URL=<production-database-url>
ALLOWED_HOSTS=<your-domain>
OPENAI_API_KEY=<your-openai-key>
```

### Docker Production Build

```bash
# Build production image
docker build -f Dockerfile.prod -t crewai-visual-builder .

# Run production container
docker run -p 8000:8000 --env-file .env crewai-visual-builder
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the code examples in the `/examples` directory

## Roadmap

- [ ] Real-time collaboration features
- [ ] Advanced workflow templates
- [ ] Integration with external services
- [ ] Mobile responsive design
- [ ] Advanced analytics and monitoring
- [ ] Plugin system for custom tools 