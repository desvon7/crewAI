"""
Base service class for all business logic services
"""

from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
import logging
from abc import ABC, abstractmethod

class BaseService(ABC):
    """
    Base service class providing common functionality
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.logger = logging.getLogger(self.__class__.__name__)
    
    def log_info(self, message: str, **kwargs):
        """Log info message with context"""
        self.logger.info(f"{message} | {kwargs}")
    
    def log_error(self, message: str, error: Exception = None, **kwargs):
        """Log error message with context"""
        if error:
            self.logger.error(f"{message} | {kwargs} | Error: {error}")
        else:
            self.logger.error(f"{message} | {kwargs}")
    
    def log_warning(self, message: str, **kwargs):
        """Log warning message with context"""
        self.logger.warning(f"{message} | {kwargs}")
    
    @abstractmethod
    def validate_input(self, data: Dict[str, Any]) -> bool:
        """Validate input data"""
        pass
    
    def handle_error(self, error: Exception, context: str = "") -> Dict[str, Any]:
        """Standard error handling"""
        self.log_error(f"Error in {context}", error)
        return {
            "success": False,
            "error": str(error),
            "context": context
        } 