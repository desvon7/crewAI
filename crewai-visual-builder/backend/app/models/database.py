"""
Database models for the CrewAI Visual Builder
"""

import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
from sqlalchemy import (
    Column, String, DateTime, Text, Boolean, Integer, 
    ForeignKey, JSON, Float, Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql import func
import enum

Base = declarative_base()


class NodeType(str, enum.Enum):
    """Node types for the visual workflow"""
    AGENT = "agent"
    TASK = "task"
    TOOL = "tool"
    CONDITIONAL = "conditional"
    LOOP = "loop"
    DATA_INPUT = "data_input"
    DATA_OUTPUT = "data_output"
    INTEGRATION = "integration"
    WEBHOOK = "webhook"


class ProcessType(str, enum.Enum):
    """CrewAI process types"""
    SEQUENTIAL = "sequential"
    HIERARCHICAL = "hierarchical"


class ExecutionStatus(str, enum.Enum):
    """Workflow execution status"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    workflows: Mapped[List["Workflow"]] = relationship("Workflow", back_populates="owner")
    executions: Mapped[List["Execution"]] = relationship("Execution", back_populates="user")
    templates: Mapped[List["Template"]] = relationship("Template", back_populates="creator")


class Workflow(Base):
    """Visual workflow model"""
    __tablename__ = "workflows"
    
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    owner_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False)
    is_template: Mapped[bool] = mapped_column(Boolean, default=False)
    version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owner: Mapped["User"] = relationship("User", back_populates="workflows")
    nodes: Mapped[List["WorkflowNode"]] = relationship("WorkflowNode", back_populates="workflow", cascade="all, delete-orphan")
    edges: Mapped[List["WorkflowEdge"]] = relationship("WorkflowEdge", back_populates="workflow", cascade="all, delete-orphan")
    executions: Mapped[List["Execution"]] = relationship("Execution", back_populates="workflow")


class WorkflowNode(Base):
    """Workflow node model"""
    __tablename__ = "workflow_nodes"
    
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workflows.id"), nullable=False)
    node_type: Mapped[NodeType] = mapped_column(SQLEnum(NodeType), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    position_x: Mapped[float] = mapped_column(Float, nullable=False)
    position_y: Mapped[float] = mapped_column(Float, nullable=False)
    data: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict)
    config: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    workflow: Mapped["Workflow"] = relationship("Workflow", back_populates="nodes")
    source_edges: Mapped[List["WorkflowEdge"]] = relationship("WorkflowEdge", foreign_keys="WorkflowEdge.source_node_id", back_populates="source_node")
    target_edges: Mapped[List["WorkflowEdge"]] = relationship("WorkflowEdge", foreign_keys="WorkflowEdge.target_node_id", back_populates="target_node")


class WorkflowEdge(Base):
    """Workflow edge model"""
    __tablename__ = "workflow_edges"
    
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workflows.id"), nullable=False)
    source_node_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workflow_nodes.id"), nullable=False)
    target_node_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workflow_nodes.id"), nullable=False)
    source_handle: Mapped[Optional[str]] = mapped_column(String(100))
    target_handle: Mapped[Optional[str]] = mapped_column(String(100))
    data: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    workflow: Mapped["Workflow"] = relationship("Workflow", back_populates="edges")
    source_node: Mapped["WorkflowNode"] = relationship("WorkflowNode", foreign_keys=[source_node_id], back_populates="source_edges")
    target_node: Mapped["WorkflowNode"] = relationship("WorkflowNode", foreign_keys=[target_node_id], back_populates="target_edges")


class Execution(Base):
    """Workflow execution model"""
    __tablename__ = "executions"
    
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workflows.id"), nullable=False)
    user_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status: Mapped[ExecutionStatus] = mapped_column(SQLEnum(ExecutionStatus), default=ExecutionStatus.PENDING)
    inputs: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict)
    outputs: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict)
    error_message: Mapped[Optional[str]] = mapped_column(Text)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    workflow: Mapped["Workflow"] = relationship("Workflow", back_populates="executions")
    user: Mapped["User"] = relationship("User", back_populates="executions")
    logs: Mapped[List["ExecutionLog"]] = relationship("ExecutionLog", back_populates="execution", cascade="all, delete-orphan")


class ExecutionLog(Base):
    """Execution log model"""
    __tablename__ = "execution_logs"
    
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    execution_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("executions.id"), nullable=False)
    node_id: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("workflow_nodes.id"))
    level: Mapped[str] = mapped_column(String(20), nullable=False)  # INFO, WARNING, ERROR, DEBUG
    message: Mapped[str] = mapped_column(Text, nullable=False)
    data: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    execution: Mapped["Execution"] = relationship("Execution", back_populates="logs")
    node: Mapped[Optional["WorkflowNode"]] = relationship("WorkflowNode")


class Template(Base):
    """Template model for reusable workflows"""
    __tablename__ = "templates"
    
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    creator_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True)
    is_official: Mapped[bool] = mapped_column(Boolean, default=False)
    workflow_data: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)
    tags: Mapped[List[str]] = mapped_column(JSONB, default=list)
    usage_count: Mapped[int] = mapped_column(Integer, default=0)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    creator: Mapped["User"] = relationship("User", back_populates="templates")


class AgentConfig(Base):
    """Agent configuration model"""
    __tablename__ = "agent_configs"
    
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(Text, nullable=False)
    goal: Mapped[str] = mapped_column(Text, nullable=False)
    backstory: Mapped[Optional[str]] = mapped_column(Text)
    tools: Mapped[List[str]] = mapped_column(JSONB, default=list)
    llm_config: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict)
    memory_config: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now())


class TaskConfig(Base):
    """Task configuration model"""
    __tablename__ = "task_configs"
    
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    expected_output: Mapped[str] = mapped_column(Text, nullable=False)
    agent_name: Mapped[str] = mapped_column(String(255), nullable=False)
    context: Mapped[List[str]] = mapped_column(JSONB, default=list)
    tools: Mapped[List[str]] = mapped_column(JSONB, default=list)
    output_file: Mapped[Optional[str]] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now())


class ToolConfig(Base):
    """Tool configuration model"""
    __tablename__ = "tool_configs"
    
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    tool_type: Mapped[str] = mapped_column(String(100), nullable=False)
    config: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now())


class CollaborationSession(Base):
    """Real-time collaboration session model"""
    __tablename__ = "collaboration_sessions"
    
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workflow_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workflows.id"), nullable=False)
    session_name: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    workflow: Mapped["Workflow"] = relationship("Workflow")
    participants: Mapped[List["CollaborationParticipant"]] = relationship("CollaborationParticipant", back_populates="session", cascade="all, delete-orphan")


class CollaborationParticipant(Base):
    """Collaboration participant model"""
    __tablename__ = "collaboration_participants"
    
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("collaboration_sessions.id"), nullable=False)
    user_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    is_online: Mapped[bool] = mapped_column(Boolean, default=False)
    last_seen: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    permissions: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict)
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    session: Mapped["CollaborationSession"] = relationship("CollaborationSession", back_populates="participants")
    user: Mapped["User"] = relationship("User") 