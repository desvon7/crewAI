"""
Crew management API endpoints
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
import uuid

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.database import User, Workflow, WorkflowNode, WorkflowEdge
from app.services.crew_service import CrewService
from app.services.execution_service import ExecutionService
from app.utils.yaml_converter import YAMLConverter

router = APIRouter(prefix="/crews", tags=["crews"])


class WorkflowCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    is_public: bool = Field(default=False)
    is_template: bool = Field(default=False)


class WorkflowUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    is_public: Optional[bool] = None
    is_template: Optional[bool] = None


class WorkflowResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    owner_id: str
    is_public: bool
    is_template: bool
    version: int
    created_at: str
    updated_at: str
    node_count: int
    edge_count: int

    class Config:
        from_attributes = True


class WorkflowDetailResponse(WorkflowResponse):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]


class ExecutionRequest(BaseModel):
    inputs: Optional[Dict[str, Any]] = Field(default_factory=dict)
    timeout: Optional[int] = Field(default=3600)  # 1 hour default


class ExecutionResponse(BaseModel):
    execution_id: str
    status: str
    message: str


@router.get("/", response_model=List[WorkflowResponse])
async def list_workflows(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = Query(None),
    is_template: Optional[bool] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List user's workflows"""
    crew_service = CrewService(db)
    workflows = await crew_service.get_user_workflows(
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        search=search,
        is_template=is_template,
    )
    
    return [
        WorkflowResponse(
            id=str(w.id),
            name=w.name,
            description=w.description,
            owner_id=str(w.owner_id),
            is_public=w.is_public,
            is_template=w.is_template,
            version=w.version,
            created_at=w.created_at.isoformat(),
            updated_at=w.updated_at.isoformat(),
            node_count=len(w.nodes),
            edge_count=len(w.edges),
        )
        for w in workflows
    ]


@router.post("/", response_model=WorkflowResponse, status_code=status.HTTP_201_CREATED)
async def create_workflow(
    workflow_data: WorkflowCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new workflow"""
    crew_service = CrewService(db)
    
    workflow = await crew_service.create_workflow(
        owner_id=current_user.id,
        name=workflow_data.name,
        description=workflow_data.description,
        is_public=workflow_data.is_public,
        is_template=workflow_data.is_template,
    )
    
    return WorkflowResponse(
        id=str(workflow.id),
        name=workflow.name,
        description=workflow.description,
        owner_id=str(workflow.owner_id),
        is_public=workflow.is_public,
        is_template=workflow.is_template,
        version=workflow.version,
        created_at=workflow.created_at.isoformat(),
        updated_at=workflow.updated_at.isoformat(),
        node_count=0,
        edge_count=0,
    )


@router.get("/{workflow_id}", response_model=WorkflowDetailResponse)
async def get_workflow(
    workflow_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get workflow details"""
    crew_service = CrewService(db)
    
    workflow = await crew_service.get_workflow(
        workflow_id=workflow_id,
        user_id=current_user.id,
    )
    
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found"
        )
    
    return WorkflowDetailResponse(
        id=str(workflow.id),
        name=workflow.name,
        description=workflow.description,
        owner_id=str(workflow.owner_id),
        is_public=workflow.is_public,
        is_template=workflow.is_template,
        version=workflow.version,
        created_at=workflow.created_at.isoformat(),
        updated_at=workflow.updated_at.isoformat(),
        node_count=len(workflow.nodes),
        edge_count=len(workflow.edges),
        nodes=[
            {
                "id": str(node.id),
                "type": node.node_type.value,
                "name": node.name,
                "position_x": node.position_x,
                "position_y": node.position_y,
                "data": node.data,
                "config": node.config,
            }
            for node in workflow.nodes
        ],
        edges=[
            {
                "id": str(edge.id),
                "source": str(edge.source_node_id),
                "target": str(edge.target_node_id),
                "source_handle": edge.source_handle,
                "target_handle": edge.target_handle,
                "data": edge.data,
            }
            for edge in workflow.edges
        ],
    )


@router.put("/{workflow_id}", response_model=WorkflowResponse)
async def update_workflow(
    workflow_id: str,
    workflow_data: WorkflowUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update workflow"""
    crew_service = CrewService(db)
    
    workflow = await crew_service.update_workflow(
        workflow_id=workflow_id,
        user_id=current_user.id,
        updates=workflow_data.dict(exclude_unset=True),
    )
    
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found"
        )
    
    return WorkflowResponse(
        id=str(workflow.id),
        name=workflow.name,
        description=workflow.description,
        owner_id=str(workflow.owner_id),
        is_public=workflow.is_public,
        is_template=workflow.is_template,
        version=workflow.version,
        created_at=workflow.created_at.isoformat(),
        updated_at=workflow.updated_at.isoformat(),
        node_count=len(workflow.nodes),
        edge_count=len(workflow.edges),
    )


@router.delete("/{workflow_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workflow(
    workflow_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete workflow"""
    crew_service = CrewService(db)
    
    success = await crew_service.delete_workflow(
        workflow_id=workflow_id,
        user_id=current_user.id,
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found"
        )


@router.post("/{workflow_id}/execute", response_model=ExecutionResponse)
async def execute_workflow(
    workflow_id: str,
    execution_data: ExecutionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Execute workflow"""
    crew_service = CrewService(db)
    execution_service = ExecutionService(db)
    
    # Get workflow
    workflow = await crew_service.get_workflow(
        workflow_id=workflow_id,
        user_id=current_user.id,
    )
    
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found"
        )
    
    # Convert visual workflow to CrewAI configuration
    yaml_converter = YAMLConverter()
    crew_config = yaml_converter.convert_visual_to_crew(workflow)
    
    # Start execution
    execution = await execution_service.start_execution(
        workflow_id=workflow_id,
        user_id=current_user.id,
        crew_config=crew_config,
        inputs=execution_data.inputs,
        timeout=execution_data.timeout,
    )
    
    return ExecutionResponse(
        execution_id=str(execution.id),
        status=execution.status.value,
        message="Execution started successfully",
    )


@router.get("/{workflow_id}/export/yaml")
async def export_workflow_yaml(
    workflow_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Export workflow as YAML"""
    crew_service = CrewService(db)
    
    workflow = await crew_service.get_workflow(
        workflow_id=workflow_id,
        user_id=current_user.id,
    )
    
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found"
        )
    
    yaml_converter = YAMLConverter()
    yaml_content = yaml_converter.convert_to_yaml(workflow)
    
    return {
        "yaml": yaml_content,
        "filename": f"{workflow.name.replace(' ', '_')}.yaml",
    }


@router.get("/{workflow_id}/export/python")
async def export_workflow_python(
    workflow_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Export workflow as Python code"""
    crew_service = CrewService(db)
    
    workflow = await crew_service.get_workflow(
        workflow_id=workflow_id,
        user_id=current_user.id,
    )
    
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found"
        )
    
    yaml_converter = YAMLConverter()
    python_code = yaml_converter.convert_to_python(workflow)
    
    return {
        "python": python_code,
        "filename": f"{workflow.name.replace(' ', '_')}.py",
    }


@router.post("/{workflow_id}/duplicate", response_model=WorkflowResponse)
async def duplicate_workflow(
    workflow_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Duplicate workflow"""
    crew_service = CrewService(db)
    
    workflow = await crew_service.duplicate_workflow(
        workflow_id=workflow_id,
        user_id=current_user.id,
    )
    
    if not workflow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow not found"
        )
    
    return WorkflowResponse(
        id=str(workflow.id),
        name=workflow.name,
        description=workflow.description,
        owner_id=str(workflow.owner_id),
        is_public=workflow.is_public,
        is_template=workflow.is_template,
        version=workflow.version,
        created_at=workflow.created_at.isoformat(),
        updated_at=workflow.updated_at.isoformat(),
        node_count=len(workflow.nodes),
        edge_count=len(workflow.edges),
    ) 