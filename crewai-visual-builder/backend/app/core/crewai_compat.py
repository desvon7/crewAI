"""
CrewAI Compatibility Layer
Handles dependency conflicts and provides a stable interface for CrewAI integration
"""

import sys
import warnings
from typing import Optional, Dict, Any, List
from contextlib import contextmanager

# Suppress CrewAI-related warnings during import
warnings.filterwarnings("ignore", category=UserWarning, module="crewai")

class CrewAICompatError(Exception):
    """Custom exception for CrewAI compatibility issues"""
    pass

class CrewAICompatLayer:
    """
    Compatibility layer that patches CrewAI dependencies and provides stable interface
    """
    
    def __init__(self):
        self._crewai_available = False
        self._patched = False
        self._init_crewai()
    
    def _init_crewai(self):
        """Initialize CrewAI with necessary patches"""
        try:
            # Apply patches before importing CrewAI
            self._apply_aiohttp_patch()
            
            # Import CrewAI components
            import crewai
            from crewai import Agent, Task, Crew, Process
            
            self._crewai_available = True
            self.Agent = Agent
            self.Task = Task
            self.Crew = Crew
            self.Process = Process
            
            print("✅ CrewAI compatibility layer initialized successfully")
            
        except Exception as e:
            print(f"⚠️  CrewAI not available: {e}")
            self._crewai_available = False
    
    def _apply_aiohttp_patch(self):
        """Patch aiohttp to resolve ConnectionTimeoutError issue"""
        try:
            import aiohttp
            
            # Add missing ConnectionTimeoutError if it doesn't exist
            if not hasattr(aiohttp, 'ConnectionTimeoutError'):
                class ConnectionTimeoutError(aiohttp.ClientError):
                    """Compatibility class for aiohttp.ConnectionTimeoutError"""
                    pass
                
                aiohttp.ConnectionTimeoutError = ConnectionTimeoutError
                print("✅ Applied aiohttp.ConnectionTimeoutError patch")
                
        except ImportError:
            print("⚠️  aiohttp not available, skipping patch")
    
    @property
    def is_available(self) -> bool:
        """Check if CrewAI is available and patched"""
        return self._crewai_available
    
    def create_agent(self, **kwargs) -> Optional[Any]:
        """Create a CrewAI agent with error handling"""
        if not self.is_available:
            raise CrewAICompatError("CrewAI is not available")
        
        try:
            return self.Agent(**kwargs)
        except Exception as e:
            raise CrewAICompatError(f"Failed to create agent: {e}")
    
    def create_task(self, **kwargs) -> Optional[Any]:
        """Create a CrewAI task with error handling"""
        if not self.is_available:
            raise CrewAICompatError("CrewAI is not available")
        
        try:
            return self.Task(**kwargs)
        except Exception as e:
            raise CrewAICompatError(f"Failed to create task: {e}")
    
    def create_crew(self, **kwargs) -> Optional[Any]:
        """Create a CrewAI crew with error handling"""
        if not self.is_available:
            raise CrewAICompatError("CrewAI is not available")
        
        try:
            return self.Crew(**kwargs)
        except Exception as e:
            raise CrewAICompatError(f"Failed to create crew: {e}")

# Global compatibility layer instance
crewai_compat = CrewAICompatLayer()

# Convenience functions
def is_crewai_available() -> bool:
    """Check if CrewAI is available"""
    return crewai_compat.is_available

def get_crewai_components():
    """Get CrewAI components if available"""
    if not is_crewai_available():
        return None, None, None, None
    
    return (
        crewai_compat.Agent,
        crewai_compat.Task, 
        crewai_compat.Crew,
        crewai_compat.Process
    )

@contextmanager
def crewai_context():
    """Context manager for CrewAI operations with error handling"""
    if not is_crewai_available():
        raise CrewAICompatError("CrewAI is not available")
    
    try:
        yield crewai_compat
    except Exception as e:
        raise CrewAICompatError(f"CrewAI operation failed: {e}") 