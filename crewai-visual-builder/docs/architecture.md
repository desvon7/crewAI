# CrewAI Visual Builder - Architecture Documentation

## Overview

The CrewAI Visual Builder is a comprehensive web application that provides a visual interface for creating and managing CrewAI workflows. It consists of a React/TypeScript frontend with a drag-and-drop interface and a FastAPI Python backend that integrates with the CrewAI framework.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   External      │
│   (React/TS)    │◄──►│   (FastAPI)     │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WebSocket     │    │   PostgreSQL    │    │   CrewAI        │
│   (Real-time)   │    │   (Database)    │    │   Framework     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │   Redis         │              │
         │              │   (Cache/Queue) │              │
         │              └─────────────────┘              │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   File Storage  │
                        │   (S3/Local)    │
                        └─────────────────┘
```

## Frontend Architecture

### Technology Stack
- **React 18** with TypeScript for type safety
- **React Flow** for visual workflow editor
- **Zustand** for state management
- **React Query** for API data fetching
- **Tailwind CSS** for styling
- **Socket.io** for real-time communication

### Component Structure

```
src/
├── components/
│   ├── Canvas/
│   │   ├── WorkflowCanvas.tsx      # Main workflow editor
│   │   ├── NodeTypes/              # Custom node components
│   │   │   ├── AgentNode.tsx
│   │   │   ├── TaskNode.tsx
│   │   │   ├── ToolNode.tsx
│   │   │   └── ConditionalNode.tsx
│   │   └── EdgeTypes/              # Custom edge components
│   │       └── CustomEdge.tsx
│   ├── Sidebar/
│   │   ├── ComponentLibrary.tsx    # Node palette
│   │   ├── PropertyPanel.tsx       # Node configuration
│   │   └── TemplateGallery.tsx     # Template browser
│   ├── Toolbar/
│   │   └── CanvasToolbar.tsx       # Main toolbar
│   └── Modals/                     # Various modals
├── stores/
│   ├── workflowStore.ts            # Workflow state management
│   ├── executionStore.ts           # Execution state management
│   └── templateStore.ts            # Template state management
├── services/
│   ├── api.ts                      # API client
│   ├── websocket.ts                # WebSocket client
│   └── storage.ts                  # Local storage utilities
├── hooks/                          # Custom React hooks
├── types/                          # TypeScript type definitions
└── utils/                          # Utility functions
```

### State Management

The application uses Zustand for state management with three main stores:

1. **WorkflowStore**: Manages the current workflow state
   - Nodes and edges
   - Selected elements
   - Workflow metadata
   - Validation state

2. **ExecutionStore**: Manages workflow execution
   - Execution status
   - Real-time logs
   - Progress tracking
   - Error handling

3. **TemplateStore**: Manages templates
   - Template library
   - Template categories
   - Import/export functionality

### Real-time Features

- **WebSocket Connection**: Real-time execution updates
- **Collaborative Editing**: Multi-user workflow editing
- **Live Validation**: Real-time workflow validation
- **Execution Monitoring**: Live execution status and logs

## Backend Architecture

### Technology Stack
- **FastAPI** for REST API
- **SQLAlchemy** for ORM
- **PostgreSQL** for primary database
- **Redis** for caching and message queue
- **CrewAI** for workflow execution
- **Celery** for background tasks
- **WebSocket** for real-time communication

### API Structure

```
app/
├── main.py                         # FastAPI application entry point
├── core/
│   ├── config.py                   # Configuration settings
│   ├── database.py                 # Database connection
│   ├── security.py                 # Authentication & authorization
│   └── celery.py                   # Celery configuration
├── api/
│   └── v1/
│       ├── crews.py                # Workflow management
│       ├── agents.py               # Agent management
│       ├── tasks.py                # Task management
│       ├── templates.py            # Template management
│       ├── execution.py            # Execution management
│       └── auth.py                 # Authentication
├── models/
│   └── database.py                 # SQLAlchemy models
├── services/
│   ├── crew_service.py             # Workflow business logic
│   ├── execution_service.py        # Execution business logic
│   └── template_service.py         # Template business logic
├── utils/
│   ├── yaml_converter.py           # YAML conversion utilities
│   └── validators.py               # Validation utilities
└── websocket/
    └── manager.py                  # WebSocket connection management
```

### Database Schema

#### Core Tables
- **users**: User accounts and authentication
- **workflows**: Visual workflow definitions
- **workflow_nodes**: Individual nodes in workflows
- **workflow_edges**: Connections between nodes
- **executions**: Workflow execution records
- **execution_logs**: Execution logs and metrics
- **templates**: Reusable workflow templates
- **agent_configs**: Agent configurations
- **task_configs**: Task configurations
- **tool_configs**: Tool configurations

#### Collaboration Tables
- **collaboration_sessions**: Real-time collaboration sessions
- **collaboration_participants**: Session participants

### Service Layer

1. **CrewService**: Manages workflow CRUD operations
2. **ExecutionService**: Handles workflow execution
3. **TemplateService**: Manages template library
4. **YAMLConverter**: Converts visual workflows to CrewAI configs

## Data Flow

### Workflow Creation Flow

1. **User Interface**: User drags nodes from palette to canvas
2. **State Management**: Zustand stores update workflow state
3. **Validation**: Real-time validation of node connections
4. **API Call**: Save workflow to backend
5. **Database**: Store workflow in PostgreSQL
6. **Response**: Return workflow ID and status

### Workflow Execution Flow

1. **User Action**: User clicks "Execute" button
2. **Validation**: Backend validates workflow
3. **Conversion**: Convert visual workflow to CrewAI config
4. **Execution**: Start CrewAI workflow execution
5. **Monitoring**: Real-time status updates via WebSocket
6. **Results**: Store and return execution results

### Real-time Collaboration Flow

1. **Session Creation**: User starts collaboration session
2. **WebSocket Connection**: Establish real-time connection
3. **Change Broadcasting**: Broadcast changes to all participants
4. **Conflict Resolution**: Handle concurrent edits
5. **State Synchronization**: Keep all clients in sync

## Security Architecture

### Authentication
- **JWT Tokens**: Stateless authentication
- **OAuth2**: Support for external providers
- **Session Management**: Redis-based session storage

### Authorization
- **Role-based Access Control (RBAC)**
- **Resource-level permissions**
- **API rate limiting**

### Data Protection
- **Input validation**: Pydantic models
- **SQL injection prevention**: SQLAlchemy ORM
- **XSS protection**: Content Security Policy
- **CSRF protection**: Token-based validation

## Performance Considerations

### Frontend Optimization
- **Code splitting**: Lazy loading of components
- **Virtual scrolling**: For large node lists
- **Memoization**: React.memo and useMemo
- **Bundle optimization**: Tree shaking and minification

### Backend Optimization
- **Database indexing**: Optimized queries
- **Caching**: Redis for frequently accessed data
- **Connection pooling**: Database connection management
- **Async processing**: Celery for background tasks

### Scalability
- **Horizontal scaling**: Load balancer support
- **Microservices**: Service decomposition
- **Message queues**: Redis for task distribution
- **CDN**: Static asset delivery

## Deployment Architecture

### Development Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Port 3000)   │◄──►│   (Port 8000)   │◄──►│   (Port 5432)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Production Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   Application   │    │   Database      │
│   (Nginx)       │◄──►│   Cluster       │◄──►│   Cluster       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   Redis Cluster │    │   File Storage  │
│   (Static)      │    │   (Cache/Queue) │    │   (S3)          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Monitoring and Observability

### Logging
- **Structured logging**: JSON format logs
- **Log aggregation**: Centralized log collection
- **Log levels**: DEBUG, INFO, WARNING, ERROR

### Metrics
- **Application metrics**: Response times, error rates
- **Business metrics**: Workflow execution success rates
- **Infrastructure metrics**: CPU, memory, disk usage

### Tracing
- **Distributed tracing**: Request flow tracking
- **Performance profiling**: Bottleneck identification
- **Error tracking**: Exception monitoring

## Testing Strategy

### Frontend Testing
- **Unit tests**: Jest for component testing
- **Integration tests**: React Testing Library
- **E2E tests**: Playwright for user workflows
- **Visual regression**: Screenshot testing

### Backend Testing
- **Unit tests**: Pytest for service testing
- **Integration tests**: API endpoint testing
- **Database tests**: Transaction rollback testing
- **Performance tests**: Load testing

### Test Coverage
- **Target**: >85% code coverage
- **Critical paths**: 100% coverage
- **Business logic**: Comprehensive testing

## Future Enhancements

### Planned Features
1. **Advanced Flow Control**: Loops, conditionals, parallel execution
2. **Custom Node Types**: User-defined node types
3. **Plugin System**: Extensible functionality
4. **Advanced Analytics**: Execution analytics and optimization
5. **Enterprise Features**: SSO, audit logs, compliance

### Technical Improvements
1. **GraphQL API**: More efficient data fetching
2. **Real-time Collaboration**: Operational transformation
3. **Offline Support**: Progressive web app features
4. **Mobile Support**: Responsive design and mobile app
5. **AI-Powered Suggestions**: Intelligent workflow recommendations

## Conclusion

The CrewAI Visual Builder provides a comprehensive solution for creating and managing CrewAI workflows through an intuitive visual interface. The architecture is designed for scalability, maintainability, and extensibility, with a focus on real-time collaboration and seamless integration with the CrewAI framework.

The system successfully bridges the gap between technical and non-technical users, making CrewAI accessible to a broader audience while maintaining the power and flexibility of the underlying framework. 