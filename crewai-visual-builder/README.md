# CrewAI Visual Builder

A comprehensive visual interface for CrewAI that makes it accessible to non-technical users through an intuitive drag-and-drop workflow builder.

## 🚀 Features

- **Visual Workflow Builder**: Drag-and-drop interface for creating CrewAI workflows
- **Node-Based Editor**: Intuitive visual representation of agents, tasks, and tools
- **Real-Time Collaboration**: Multi-user editing with live updates
- **Template Library**: Pre-built templates for common use cases
- **Execution Monitoring**: Real-time workflow execution tracking
- **Code Export**: Generate Python code from visual workflows
- **YAML Compatibility**: Full compatibility with existing CrewAI configurations

## 🏗️ Architecture

```
crewai-visual-builder/
├── frontend/          # React/TypeScript SPA
├── backend/           # FastAPI Python application
├── shared/            # Shared types and utilities
├── docker/            # Docker configurations
├── docs/              # Documentation
└── scripts/           # Development and deployment scripts
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Flow** for visual workflow editor
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Query** for API interactions
- **Socket.io** for real-time features
- **Monaco Editor** for code editing

### Backend
- **FastAPI** for REST API
- **PostgreSQL** for primary database
- **Redis** for caching and sessions
- **SQLAlchemy** for ORM
- **Pydantic** for data validation
- **CrewAI** for workflow execution
- **WebSocket** for real-time communication

### Infrastructure
- **Docker** for containerization
- **Kubernetes** for orchestration
- **AWS/GCP** for cloud deployment
- **GitHub Actions** for CI/CD

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- Docker and Docker Compose
- PostgreSQL 14+
- Redis 6+

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/crewai-visual-builder.git
   cd crewai-visual-builder
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

3. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

5. **Run the development servers**
   ```bash
   # Backend (from backend directory)
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   
   # Frontend (from frontend directory)
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📚 Documentation

- [User Guide](./docs/user-guide.md) - Step-by-step tutorials
- [API Documentation](./docs/api-reference.md) - Complete API reference
- [Developer Guide](./docs/developer-guide.md) - Technical documentation
- [Deployment Guide](./docs/deployment.md) - Production deployment
- [Architecture Guide](./docs/architecture.md) - System architecture

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
pytest

# End-to-end tests
npm run test:e2e
```

## 🚀 Deployment

### Production Deployment

1. **Build the application**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Deploy to production**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Kubernetes Deployment

```bash
kubectl apply -f k8s/
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.crewai-visual-builder.com](https://docs.crewai-visual-builder.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/crewai-visual-builder/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/crewai-visual-builder/discussions)
- **Email**: support@crewai-visual-builder.com

## 🙏 Acknowledgments

- Built on top of [CrewAI](https://github.com/crewAIInc/crewAI)
- Inspired by modern no-code platforms like Zapier and Bubble
- Uses React Flow for the visual editor
- Powered by FastAPI and React

---

**Made with ❤️ by the CrewAI Visual Builder Team** 