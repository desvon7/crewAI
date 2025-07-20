"""
Workflow service for managing workflow metadata and configurations
"""

from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
import json
import uuid
from datetime import datetime

from .base_service import BaseService
from app.models.workflow import Workflow, Execution
from app.models.database import User

class WorkflowService(BaseService):
    """
    Service for managing workflow metadata and configurations
    """
    
    def __init__(self, db: Session):
        super().__init__(db)
    
    def validate_input(self, data: Dict[str, Any]) -> bool:
        """Validate workflow input"""
        required_fields = ["name"]
        return all(field in data for field in required_fields)
    
    def create_workflow(self, workflow_data: Dict[str, Any], user: User) -> Dict[str, Any]:
        """Create a new workflow"""
        try:
            if not self.validate_input(workflow_data):
                return self.handle_error(
                    ValueError("Invalid workflow data"), 
                    "create_workflow"
                )
            
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
            return self.handle_error(e, "create_workflow")
    
    def update_workflow(self, workflow_id: str, workflow_data: Dict[str, Any], user: User) -> Dict[str, Any]:
        """Update an existing workflow"""
        try:
            workflow = self.db.query(Workflow).filter(
                Workflow.id == workflow_id,
                Workflow.owner_id == user.id
            ).first()
            
            if not workflow:
                return self.handle_error(
                    ValueError("Workflow not found"), 
                    "update_workflow"
                )
            
            # Update fields
            if "name" in workflow_data:
                workflow.name = workflow_data["name"]
            if "description" in workflow_data:
                workflow.description = workflow_data["description"]
            
            workflow.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            self.log_info("Workflow updated", workflow_id=str(workflow.id), user_id=str(user.id))
            
            return {
                "success": True,
                "message": "Workflow updated successfully"
            }
            
        except Exception as e:
            self.db.rollback()
            return self.handle_error(e, "update_workflow")
    
    def delete_workflow(self, workflow_id: str, user: User) -> Dict[str, Any]:
        """Soft delete a workflow"""
        try:
            workflow = self.db.query(Workflow).filter(
                Workflow.id == workflow_id,
                Workflow.owner_id == user.id
            ).first()
            
            if not workflow:
                return self.handle_error(
                    ValueError("Workflow not found"), 
                    "delete_workflow"
                )
            
            # For now, we'll just mark it as not public (soft delete)
            workflow.is_public = False
            workflow.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            self.log_info("Workflow deleted", workflow_id=str(workflow.id), user_id=str(user.id))
            
            return {
                "success": True,
                "message": "Workflow deleted successfully"
            }
            
        except Exception as e:
            self.db.rollback()
            return self.handle_error(e, "delete_workflow")
    
    def get_workflow(self, workflow_id: str, user: User) -> Dict[str, Any]:
        """Get a specific workflow"""
        try:
            workflow = self.db.query(Workflow).filter(
                Workflow.id == workflow_id,
                Workflow.owner_id == user.id
            ).first()
            
            if not workflow:
                return self.handle_error(
                    ValueError("Workflow not found"), 
                    "get_workflow"
                )
            
            return {
                "success": True,
                "workflow": {
                    "id": str(workflow.id),
                    "name": workflow.name,
                    "description": workflow.description,
                    "created_at": workflow.created_at.isoformat(),
                    "updated_at": workflow.updated_at.isoformat()
                }
            }
            
        except Exception as e:
            return self.handle_error(e, "get_workflow")
    
    def list_workflows(self, user: User, limit: int = 50, offset: int = 0) -> Dict[str, Any]:
        """List user's workflows"""
        try:
            workflows = self.db.query(Workflow).filter(
                Workflow.owner_id == user.id
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