"""
Crew service with CrewAI compatibility layer
Designed to be easily replaceable with our own implementation
"""

from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
import json
import uuid
from datetime import datetime

from .base_service import BaseService
from app.core.crewai_compat import crewai_compat, CrewAICompatError
from app.models.workflow import Workflow, Execution
from app.models.database import User

class CrewService(BaseService):
    """
    Service for managing CrewAI crews and executions
    Uses compatibility layer for stable CrewAI integration
    """
    
    def __init__(self, db: Session):
        super().__init__(db)
        self.crewai_available = crewai_compat.is_available
    
    def validate_input(self, data: Dict[str, Any]) -> bool:
        """Validate crew creation input"""
        required_fields = ["name", "description", "agents", "tasks"]
        return all(field in data for field in required_fields)
    
    async def get_user_workflows(
        self, 
        user_id: str, 
        skip: int = 0, 
        limit: int = 100, 
        search: Optional[str] = None,
        is_template: Optional[bool] = None
    ) -> List[Workflow]:
        """Get user's workflows with filtering and pagination"""
        try:
            query = self.db.query(Workflow).filter(Workflow.owner_id == user_id)
            
            if search:
                query = query.filter(
                    Workflow.name.ilike(f"%{search}%") | 
                    Workflow.description.ilike(f"%{search}%")
                )
            
            if is_template is not None:
                query = query.filter(Workflow.is_template == is_template)
            
            workflows = query.offset(skip).limit(limit).all()
            
            self.log_info("Retrieved user workflows", user_id=user_id, count=len(workflows))
            return workflows
            
        except Exception as e:
            self.log_error("Error retrieving user workflows", e, user_id=user_id)
            return []
    
    async def create_workflow(
        self, 
        owner_id: str, 
        name: str, 
        description: Optional[str] = None,
        is_public: bool = False,
        is_template: bool = False
    ) -> Optional[Workflow]:
        """Create a new workflow"""
        try:
            workflow = Workflow(
                name=name,
                description=description or "",
                owner_id=owner_id,
                is_public=is_public,
                is_template=is_template
            )
            
            self.db.add(workflow)
            self.db.commit()
            self.db.refresh(workflow)
            
            self.log_info("Workflow created", workflow_id=str(workflow.id), owner_id=owner_id)
            return workflow
            
        except Exception as e:
            self.db.rollback()
            self.log_error("Error creating workflow", e, owner_id=owner_id)
            return None
    
    async def get_workflow(self, workflow_id: str, user_id: str) -> Optional[Workflow]:
        """Get a specific workflow by ID"""
        try:
            workflow = self.db.query(Workflow).filter(
                Workflow.id == workflow_id,
                Workflow.owner_id == user_id
            ).first()
            
            if workflow:
                self.log_info("Workflow retrieved", workflow_id=workflow_id, user_id=user_id)
            else:
                self.log_warning("Workflow not found", workflow_id=workflow_id, user_id=user_id)
            
            return workflow
            
        except Exception as e:
            self.log_error("Error retrieving workflow", e, workflow_id=workflow_id)
            return None
    
    async def update_workflow(
        self, 
        workflow_id: str, 
        user_id: str, 
        updates: Dict[str, Any]
    ) -> Optional[Workflow]:
        """Update a workflow"""
        try:
            workflow = await self.get_workflow(workflow_id, user_id)
            if not workflow:
                return None
            
            # Update fields
            for field, value in updates.items():
                if hasattr(workflow, field):
                    setattr(workflow, field, value)
            
            workflow.updated_at = datetime.utcnow()
            self.db.commit()
            
            self.log_info("Workflow updated", workflow_id=workflow_id, user_id=user_id)
            return workflow
            
        except Exception as e:
            self.db.rollback()
            self.log_error("Error updating workflow", e, workflow_id=workflow_id)
            return None
    
    async def delete_workflow(self, workflow_id: str, user_id: str) -> bool:
        """Delete a workflow (soft delete)"""
        try:
            workflow = await self.get_workflow(workflow_id, user_id)
            if not workflow:
                return False
            
            # Soft delete by marking as not public
            workflow.is_public = False
            workflow.updated_at = datetime.utcnow()
            self.db.commit()
            
            self.log_info("Workflow deleted", workflow_id=workflow_id, user_id=user_id)
            return True
            
        except Exception as e:
            self.db.rollback()
            self.log_error("Error deleting workflow", e, workflow_id=workflow_id)
            return False
    
    def create_crew(self, workflow_data: Dict[str, Any], user: User) -> Dict[str, Any]:
        """Create a new crew from workflow data"""
        try:
            if not self.validate_input(workflow_data):
                return self.handle_error(
                    ValueError("Invalid workflow data"), 
                    "create_crew"
                )
            
            # Create workflow record
            workflow = Workflow(
                name=workflow_data["name"],
                description=workflow_data.get("description", ""),
                owner_id=user.id,
                is_public=False,
                is_template=False
            )
            
            self.db.add(workflow)
            self.db.commit()
            self.db.refresh(workflow)
            
            self.log_info("Workflow created", workflow_id=str(workflow.id), user_id=str(user.id))
            
            return {
                "success": True,
                "workflow_id": str(workflow.id),
                "message": "Workflow created successfully"
            }
            
        except Exception as e:
            self.db.rollback()
            return self.handle_error(e, "create_crew")
    
    def execute_workflow(self, workflow_id: str, inputs: Dict[str, Any] = None, user: User = None) -> Dict[str, Any]:
        """Execute a workflow using CrewAI or fallback"""
        try:
            # Get workflow
            workflow = self.db.query(Workflow).filter(
                Workflow.id == workflow_id
            ).first()
            
            if not workflow:
                return self.handle_error(
                    ValueError("Workflow not found"), 
                    "execute_workflow"
                )
            
            # Create execution record
            execution = Execution(
                workflow_id=workflow_id,
                user_id=user.id if user else workflow.owner_id,
                status="pending",
                inputs=inputs or {},
                started_at=datetime.utcnow()
            )
            
            self.db.add(execution)
            self.db.commit()
            self.db.refresh(execution)
            
            # Execute with CrewAI if available
            if self.crewai_available:
                result = self._execute_with_crewai(workflow, execution, inputs)
            else:
                result = self._execute_mock(workflow, execution, inputs)
            
            # Update execution record
            execution.status = "completed" if result["success"] else "failed"
            execution.outputs = result.get("outputs", {})
            execution.completed_at = datetime.utcnow()
            execution.error_message = result.get("error")
            
            self.db.commit()
            
            return result
            
        except Exception as e:
            self.db.rollback()
            return self.handle_error(e, "execute_workflow")
    
    def _execute_with_crewai(self, workflow: Workflow, execution: Execution, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """Execute workflow using CrewAI compatibility layer"""
        try:
            # For now, use a simple configuration approach
            # In the future, this will parse the workflow nodes and edges
            
            # Create a simple agent
            agent = crewai_compat.create_agent(
                role="Research Assistant",
                goal="Help with research tasks",
                backstory="You are a helpful research assistant",
                verbose=True
            )
            
            # Create a simple task
            task = crewai_compat.create_task(
                description="Perform research on the given topic",
                expected_output="A comprehensive research report",
                agent=agent
            )
            
            # Create and execute crew
            crew = crewai_compat.create_crew(
                agents=[agent],
                tasks=[task],
                process=crewai_compat.Process.sequential,
                verbose=True
            )
            
            result = crew.kickoff(inputs=inputs or {})
            
            return {
                "success": True,
                "outputs": {
                    "raw": result.raw if hasattr(result, 'raw') else str(result),
                    "tasks_output": result.tasks_output if hasattr(result, 'tasks_output') else [],
                    "token_usage": result.token_usage if hasattr(result, 'token_usage') else {}
                },
                "execution_id": str(execution.id)
            }
            
        except CrewAICompatError as e:
            return self.handle_error(e, "crewai_execution")
        except Exception as e:
            return self.handle_error(e, "crewai_execution")
    
    def _execute_mock(self, workflow: Workflow, execution: Execution, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """Mock execution when CrewAI is not available"""
        self.log_warning("CrewAI not available, using mock execution", workflow_id=str(workflow.id))
        
        # Simulate execution delay
        import time
        time.sleep(2)
        
        return {
            "success": True,
            "outputs": {
                "raw": f"Mock execution of workflow '{workflow.name}'",
                "tasks_output": ["Mock task completed"],
                "token_usage": {"total": 0, "prompt": 0, "completion": 0}
            },
            "execution_id": str(execution.id),
            "mock": True
        }
    
    def get_workflow_status(self, workflow_id: str) -> Dict[str, Any]:
        """Get workflow execution status"""
        try:
            workflow = self.db.query(Workflow).filter(
                Workflow.id == workflow_id
            ).first()
            
            if not workflow:
                return self.handle_error(
                    ValueError("Workflow not found"), 
                    "get_workflow_status"
                )
            
            # Get latest execution
            latest_execution = self.db.query(Execution).filter(
                Execution.workflow_id == workflow_id
            ).order_by(Execution.started_at.desc()).first()
            
            return {
                "success": True,
                "workflow": {
                    "id": str(workflow.id),
                    "name": workflow.name,
                    "description": workflow.description,
                    "created_at": workflow.created_at.isoformat(),
                    "updated_at": workflow.updated_at.isoformat()
                },
                "latest_execution": {
                    "id": str(latest_execution.id),
                    "status": latest_execution.status.value,
                    "started_at": latest_execution.started_at.isoformat() if latest_execution.started_at else None,
                    "completed_at": latest_execution.completed_at.isoformat() if latest_execution.completed_at else None,
                    "error_message": latest_execution.error_message
                } if latest_execution else None
            }
            
        except Exception as e:
            return self.handle_error(e, "get_workflow_status")
    
    def list_workflows(self, user_id: str, limit: int = 50, offset: int = 0) -> Dict[str, Any]:
        """List user's workflows"""
        try:
            workflows = self.db.query(Workflow).filter(
                Workflow.owner_id == user_id
            ).offset(offset).limit(limit).all()
            
            return {
                "success": True,
                "workflows": [
                    {
                        "id": str(w.id),
                        "name": w.name,
                        "description": w.description,
                        "created_at": w.created_at.isoformat(),
                        "updated_at": w.updated_at.isoformat()
                    }
                    for w in workflows
                ],
                "total": len(workflows)
            }
            
        except Exception as e:
            return self.handle_error(e, "list_workflows") 