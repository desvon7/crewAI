# CrewAI Visual Builder - Project Structure

## Overview

This document provides a complete overview of the CrewAI Visual Builder project structure, including all directories, files, and their purposes.

## Root Directory Structure

```
crewai-visual-builder/
├── README.md                           # Main project documentation
├── PROJECT_STRUCTURE.md                # This file - project structure overview
├── LICENSE                             # Project license
├── .gitignore                          # Git ignore rules
├── docker-compose.dev.yml              # Development Docker Compose
├── docker-compose.prod.yml             # Production Docker Compose
├── docker-compose.test.yml             # Testing Docker Compose
├── .github/                            # GitHub Actions CI/CD
│   └── workflows/
│       └── ci.yml                      # CI/CD pipeline configuration
├── frontend/                           # React/TypeScript frontend
├── backend/                            # FastAPI Python backend
├── shared/                             # Shared types and utilities
├── docker/                             # Docker configurations
├── docs/                               # Documentation
├── scripts/                            # Development and deployment scripts
├── k8s/                                # Kubernetes manifests
└── tests/                              # End-to-end tests
```

## Frontend Structure

```
frontend/
├── package.json                        # Node.js dependencies and scripts
├── package-lock.json                   # Locked dependency versions
├── tsconfig.json                       # TypeScript configuration
├── vite.config.ts                      # Vite build configuration
├── tailwind.config.js                  # Tailwind CSS configuration
├── postcss.config.js                   # PostCSS configuration
├── .eslintrc.js                        # ESLint configuration
├── .prettierrc                         # Prettier configuration
├── index.html                          # Main HTML template
├── public/                             # Static assets
│   ├── favicon.ico
│   ├── robots.txt
│   └── manifest.json
├── src/
│   ├── main.tsx                        # Application entry point
│   ├── App.tsx                         # Root application component
│   ├── index.css                       # Global styles
│   ├── components/                     # React components
│   │   ├── Canvas/                     # Workflow canvas components
│   │   │   ├── WorkflowCanvas.tsx      # Main workflow editor
│   │   │   ├── NodeTypes/              # Custom node components
│   │   │   │   ├── AgentNode.tsx       # Agent node component
│   │   │   │   ├── TaskNode.tsx        # Task node component
│   │   │   │   ├── ToolNode.tsx        # Tool node component
│   │   │   │   ├── ConditionalNode.tsx # Conditional node component
│   │   │   │   └── DataNode.tsx        # Data input/output node
│   │   │   └── EdgeTypes/              # Custom edge components
│   │   │       └── CustomEdge.tsx      # Custom edge component
│   │   ├── Sidebar/                    # Sidebar components
│   │   │   ├── ComponentLibrary.tsx    # Node palette
│   │   │   ├── PropertyPanel.tsx       # Node configuration panel
│   │   │   ├── TemplateGallery.tsx     # Template browser
│   │   │   └── ExecutionPanel.tsx      # Execution monitoring
│   │   ├── Toolbar/                    # Toolbar components
│   │   │   ├── CanvasToolbar.tsx       # Main canvas toolbar
│   │   │   └── NodeToolbar.tsx         # Node-specific toolbar
│   │   ├── Modals/                     # Modal components
│   │   │   ├── SaveWorkflowModal.tsx   # Save workflow modal
│   │   │   ├── ExportModal.tsx         # Export options modal
│   │   │   ├── TemplateModal.tsx       # Template details modal
│   │   │   └── SettingsModal.tsx       # Application settings
│   │   ├── Layout/                     # Layout components
│   │   │   ├── Header.tsx              # Application header
│   │   │   ├── Sidebar.tsx             # Main sidebar
│   │   │   └── Footer.tsx              # Application footer
│   │   └── Common/                     # Common UI components
│   │       ├── Button.tsx              # Reusable button component
│   │       ├── Input.tsx               # Input field component
│   │       ├── Select.tsx              # Select dropdown component
│   │       ├── Modal.tsx               # Modal wrapper component
│   │       └── Loading.tsx             # Loading spinner component
│   ├── stores/                         # Zustand state management
│   │   ├── workflowStore.ts            # Workflow state management
│   │   ├── executionStore.ts           # Execution state management
│   │   ├── templateStore.ts            # Template state management
│   │   ├── userStore.ts                # User state management
│   │   └── index.ts                    # Store exports
│   ├── services/                       # API and external services
│   │   ├── api.ts                      # API client configuration
│   │   ├── websocket.ts                # WebSocket client
│   │   ├── storage.ts                  # Local storage utilities
│   │   └── auth.ts                     # Authentication service
│   ├── hooks/                          # Custom React hooks
│   │   ├── useWorkflow.ts              # Workflow management hook
│   │   ├── useExecution.ts             # Execution management hook
│   │   ├── useWebSocket.ts             # WebSocket connection hook
│   │   ├── useLocalStorage.ts          # Local storage hook
│   │   └── useDebounce.ts              # Debounce utility hook
│   ├── types/                          # TypeScript type definitions
│   │   ├── workflow.ts                 # Workflow-related types
│   │   ├── execution.ts                # Execution-related types
│   │   ├── template.ts                 # Template-related types
│   │   ├── user.ts                     # User-related types
│   │   └── api.ts                      # API response types
│   ├── utils/                          # Utility functions
│   │   ├── cn.ts                       # Class name utility
│   │   ├── validation.ts               # Validation utilities
│   │   ├── formatting.ts               # Data formatting utilities
│   │   ├── constants.ts                # Application constants
│   │   └── helpers.ts                  # General helper functions
│   ├── pages/                          # Page components
│   │   ├── Dashboard.tsx               # Main dashboard page
│   │   ├── WorkflowEditor.tsx          # Workflow editor page
│   │   ├── Templates.tsx               # Templates page
│   │   ├── ExecutionHistory.tsx        # Execution history page
│   │   ├── Settings.tsx                # Settings page
│   │   └── Auth/                       # Authentication pages
│   │       ├── Login.tsx               # Login page
│   │       ├── Register.tsx            # Registration page
│   │       └── ForgotPassword.tsx      # Password reset page
│   └── router/                         # Routing configuration
│       ├── AppRouter.tsx               # Main router configuration
│       ├── ProtectedRoute.tsx          # Route protection component
│       └── routes.ts                   # Route definitions
├── tests/                              # Frontend tests
│   ├── unit/                           # Unit tests
│   ├── integration/                    # Integration tests
│   └── e2e/                            # End-to-end tests
├── stories/                            # Storybook stories
│   ├── components/                     # Component stories
│   └── pages/                          # Page stories
└── dist/                               # Build output (generated)
```

## Backend Structure

```
backend/
├── requirements.txt                    # Python dependencies
├── requirements-dev.txt                # Development dependencies
├── pyproject.toml                      # Python project configuration
├── Dockerfile                          # Production Dockerfile
├── Dockerfile.dev                      # Development Dockerfile
├── env.example                         # Environment variables example
├── alembic.ini                         # Database migration configuration
├── app/
│   ├── __init__.py
│   ├── main.py                         # FastAPI application entry point
│   ├── core/                           # Core application modules
│   │   ├── __init__.py
│   │   ├── config.py                   # Configuration settings
│   │   ├── database.py                 # Database connection
│   │   ├── security.py                 # Authentication & authorization
│   │   ├── celery.py                   # Celery configuration
│   │   └── logging.py                  # Logging configuration
│   ├── api/                            # API routes
│   │   ├── __init__.py
│   │   ├── deps.py                     # API dependencies
│   │   └── v1/                         # API version 1
│   │       ├── __init__.py
│   │       ├── api.py                  # Main API router
│   │       ├── crews.py                # Workflow management endpoints
│   │       ├── agents.py               # Agent management endpoints
│   │       ├── tasks.py                # Task management endpoints
│   │       ├── templates.py            # Template management endpoints
│   │       ├── execution.py            # Execution management endpoints
│   │       ├── auth.py                 # Authentication endpoints
│   │       ├── users.py                # User management endpoints
│   │       └── tools.py                # Tool management endpoints
│   ├── models/                         # Database models
│   │   ├── __init__.py
│   │   ├── database.py                 # SQLAlchemy models
│   │   ├── schemas.py                  # Pydantic schemas
│   │   └── enums.py                    # Enum definitions
│   ├── services/                       # Business logic services
│   │   ├── __init__.py
│   │   ├── crew_service.py             # Workflow business logic
│   │   ├── execution_service.py        # Execution business logic
│   │   ├── template_service.py         # Template business logic
│   │   ├── user_service.py             # User business logic
│   │   ├── auth_service.py             # Authentication business logic
│   │   └── notification_service.py     # Notification business logic
│   ├── utils/                          # Utility functions
│   │   ├── __init__.py
│   │   ├── yaml_converter.py           # YAML conversion utilities
│   │   ├── validators.py               # Validation utilities
│   │   ├── file_handlers.py            # File handling utilities
│   │   └── helpers.py                  # General helper functions
│   ├── websocket/                      # WebSocket management
│   │   ├── __init__.py
│   │   ├── manager.py                  # WebSocket connection manager
│   │   ├── handlers.py                 # WebSocket event handlers
│   │   └── events.py                   # WebSocket event definitions
│   ├── tasks/                          # Celery background tasks
│   │   ├── __init__.py
│   │   ├── execution_tasks.py          # Execution-related tasks
│   │   ├── notification_tasks.py       # Notification tasks
│   │   └── cleanup_tasks.py            # Cleanup tasks
│   └── middleware/                     # Custom middleware
│       ├── __init__.py
│       ├── auth.py                     # Authentication middleware
│       ├── logging.py                  # Logging middleware
│       └── cors.py                     # CORS middleware
├── alembic/                            # Database migrations
│   ├── versions/                       # Migration files
│   ├── env.py                          # Migration environment
│   └── script.py.mako                  # Migration template
├── tests/                              # Backend tests
│   ├── __init__.py
│   ├── conftest.py                     # Test configuration
│   ├── unit/                           # Unit tests
│   │   ├── test_services/              # Service tests
│   │   ├── test_utils/                 # Utility tests
│   │   └── test_models/                # Model tests
│   ├── integration/                    # Integration tests
│   │   ├── test_api/                   # API endpoint tests
│   │   └── test_database/              # Database tests
│   └── fixtures/                       # Test fixtures
├── scripts/                            # Utility scripts
│   ├── init_db.py                      # Database initialization
│   ├── create_admin.py                 # Admin user creation
│   ├── backup_db.py                    # Database backup
│   └── migrate.py                      # Migration runner
├── static/                             # Static files
│   ├── templates/                      # Template files
│   ├── exports/                        # Export files
│   └── uploads/                        # Uploaded files
├── logs/                               # Application logs
└── storage/                            # Local storage
    ├── crewai_storage/                 # CrewAI storage
    └── templates/                      # Template storage
```

## Shared Structure

```
shared/
├── types/                              # Shared TypeScript types
│   ├── workflow.ts                     # Workflow types
│   ├── execution.ts                    # Execution types
│   ├── template.ts                     # Template types
│   └── api.ts                          # API types
├── constants/                          # Shared constants
│   ├── nodeTypes.ts                    # Node type definitions
│   ├── edgeTypes.ts                    # Edge type definitions
│   └── validation.ts                   # Validation rules
└── utils/                              # Shared utilities
    ├── validation.ts                   # Shared validation
    └── formatting.ts                   # Shared formatting
```

## Docker Structure

```
docker/
├── nginx/                              # Nginx configuration
│   ├── nginx.conf                      # Main nginx configuration
│   ├── ssl/                            # SSL certificates
│   └── conf.d/                         # Additional configurations
├── postgres/                           # PostgreSQL configuration
│   ├── init.sql                        # Database initialization
│   └── postgresql.conf                 # PostgreSQL configuration
├── redis/                              # Redis configuration
│   └── redis.conf                      # Redis configuration
└── scripts/                            # Docker utility scripts
    ├── wait-for-it.sh                  # Service wait script
    ├── healthcheck.sh                  # Health check script
    └── backup.sh                       # Backup script
```

## Documentation Structure

```
docs/
├── README.md                           # Documentation index
├── architecture.md                     # System architecture
├── api-reference.md                    # API documentation
├── user-guide.md                       # User guide
├── developer-guide.md                  # Developer guide
├── deployment.md                       # Deployment guide
├── troubleshooting.md                  # Troubleshooting guide
├── contributing.md                     # Contributing guidelines
├── security.md                         # Security documentation
├── performance.md                      # Performance guide
└── examples/                           # Example workflows
    ├── basic-research.md               # Basic research workflow
    ├── content-creation.md             # Content creation workflow
    ├── data-analysis.md                # Data analysis workflow
    └── customer-support.md             # Customer support workflow
```

## Scripts Structure

```
scripts/
├── development/                        # Development scripts
│   ├── setup-dev.sh                    # Development environment setup
│   ├── start-dev.sh                    # Start development environment
│   ├── stop-dev.sh                     # Stop development environment
│   └── reset-dev.sh                    # Reset development environment
├── deployment/                         # Deployment scripts
│   ├── deploy-staging.sh               # Deploy to staging
│   ├── deploy-production.sh            # Deploy to production
│   ├── rollback.sh                     # Rollback deployment
│   └── health-check.sh                 # Health check script
├── database/                           # Database scripts
│   ├── init-db.sh                      # Initialize database
│   ├── backup-db.sh                    # Backup database
│   ├── restore-db.sh                   # Restore database
│   └── migrate-db.sh                   # Run migrations
└── maintenance/                        # Maintenance scripts
    ├── cleanup-logs.sh                 # Clean up logs
    ├── cleanup-storage.sh              # Clean up storage
    └── update-dependencies.sh          # Update dependencies
```

## Kubernetes Structure

```
k8s/
├── base/                               # Base Kubernetes manifests
│   ├── namespace.yaml                  # Namespace definition
│   ├── configmap.yaml                  # ConfigMap definitions
│   ├── secret.yaml                     # Secret definitions
│   └── kustomization.yaml              # Kustomize configuration
├── overlays/                           # Environment overlays
│   ├── development/                    # Development environment
│   │   ├── deployment.yaml             # Development deployment
│   │   ├── service.yaml                # Development services
│   │   └── kustomization.yaml          # Development kustomization
│   ├── staging/                        # Staging environment
│   │   ├── deployment.yaml             # Staging deployment
│   │   ├── service.yaml                # Staging services
│   │   └── kustomization.yaml          # Staging kustomization
│   └── production/                     # Production environment
│       ├── deployment.yaml             # Production deployment
│       ├── service.yaml                # Production services
│       ├── ingress.yaml                # Production ingress
│       └── kustomization.yaml          # Production kustomization
└── charts/                             # Helm charts (if using Helm)
    ├── crewai-visual-builder/          # Main application chart
    └── dependencies/                   # Dependency charts
```

## Testing Structure

```
tests/
├── e2e/                                # End-to-end tests
│   ├── specs/                          # Test specifications
│   │   ├── workflow-creation.spec.ts   # Workflow creation tests
│   │   ├── workflow-execution.spec.ts  # Workflow execution tests
│   │   ├── template-management.spec.ts # Template management tests
│   │   └── user-authentication.spec.ts # Authentication tests
│   ├── fixtures/                       # Test fixtures
│   ├── utils/                          # Test utilities
│   └── playwright.config.ts            # Playwright configuration
├── performance/                        # Performance tests
│   ├── load-tests/                     # Load testing
│   ├── stress-tests/                   # Stress testing
│   └── benchmark-tests/                # Benchmark tests
└── security/                           # Security tests
    ├── vulnerability-scan/             # Vulnerability scanning
    ├── penetration-tests/              # Penetration testing
    └── security-audit/                 # Security audit
```

## Key Files Summary

### Configuration Files
- `package.json` - Frontend dependencies and scripts
- `requirements.txt` - Backend Python dependencies
- `docker-compose.dev.yml` - Development environment
- `docker-compose.prod.yml` - Production environment
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `vite.config.ts` - Vite build configuration

### Entry Points
- `frontend/src/main.tsx` - Frontend application entry
- `backend/app/main.py` - Backend application entry
- `frontend/index.html` - Frontend HTML template

### Core Components
- `frontend/src/components/Canvas/WorkflowCanvas.tsx` - Main workflow editor
- `backend/app/api/v1/crews.py` - Workflow management API
- `backend/app/utils/yaml_converter.py` - YAML conversion utility
- `backend/app/models/database.py` - Database models

### State Management
- `frontend/src/stores/workflowStore.ts` - Workflow state
- `frontend/src/stores/executionStore.ts` - Execution state
- `frontend/src/stores/templateStore.ts` - Template state

### Documentation
- `README.md` - Project overview
- `docs/architecture.md` - System architecture
- `PROJECT_STRUCTURE.md` - This file

This structure provides a comprehensive foundation for the CrewAI Visual Builder project, with clear separation of concerns, modular design, and scalability in mind. 