"""
YAML converter utility for converting visual workflows to CrewAI configurations
"""

import yaml
from typing import Dict, List, Any, Optional
from app.models.database import Workflow, WorkflowNode, WorkflowEdge, NodeType


class YAMLConverter:
    """Convert visual workflows to CrewAI YAML configurations"""
    
    def convert_visual_to_crew(self, workflow: Workflow) -> Dict[str, Any]:
        """Convert visual workflow to CrewAI configuration"""
        crew_config = {
            "name": workflow.name,
            "description": workflow.description or "",
            "agents": {},
            "tasks": {},
            "tools": {},
            "process": "sequential",
            "verbose": True,
        }
        
        # Convert nodes to CrewAI components
        for node in workflow.nodes:
            if node.node_type == NodeType.AGENT:
                crew_config["agents"][node.name] = self._convert_agent_node(node)
            elif node.node_type == NodeType.TASK:
                crew_config["tasks"][node.name] = self._convert_task_node(node)
            elif node.node_type == NodeType.TOOL:
                crew_config["tools"][node.name] = self._convert_tool_node(node)
        
        # Determine process type based on workflow structure
        crew_config["process"] = self._determine_process_type(workflow)
        
        return crew_config
    
    def _convert_agent_node(self, node: WorkflowNode) -> Dict[str, Any]:
        """Convert agent node to CrewAI agent configuration"""
        config = node.config or {}
        
        agent_config = {
            "role": config.get("role", "AI Agent"),
            "goal": config.get("goal", "Complete assigned tasks"),
            "backstory": config.get("backstory", ""),
        }
        
        # Add optional configurations
        if config.get("llm_model"):
            agent_config["llm"] = config["llm_model"]
        
        if config.get("tools"):
            agent_config["tools"] = config["tools"]
        
        if config.get("memory"):
            agent_config["memory"] = config["memory"]
        
        if config.get("verbose") is not None:
            agent_config["verbose"] = config["verbose"]
        
        return agent_config
    
    def _convert_task_node(self, node: WorkflowNode) -> Dict[str, Any]:
        """Convert task node to CrewAI task configuration"""
        config = node.config or {}
        
        task_config = {
            "description": config.get("description", "Complete the assigned task"),
            "expected_output": config.get("expected_output", "Task results"),
        }
        
        # Add agent assignment
        if config.get("agent"):
            task_config["agent"] = config["agent"]
        
        # Add context from connected nodes
        context = self._get_task_context(node, node.workflow.edges)
        if context:
            task_config["context"] = context
        
        # Add tools
        if config.get("tools"):
            task_config["tools"] = config["tools"]
        
        # Add output file
        if config.get("output_file"):
            task_config["output_file"] = config["output_file"]
        
        return task_config
    
    def _convert_tool_node(self, node: WorkflowNode) -> Dict[str, Any]:
        """Convert tool node to CrewAI tool configuration"""
        config = node.config or {}
        
        tool_config = {
            "name": node.name,
            "description": config.get("description", ""),
            "type": config.get("tool_type", "custom"),
        }
        
        # Add tool-specific configuration
        if config.get("parameters"):
            tool_config["parameters"] = config["parameters"]
        
        if config.get("api_key"):
            tool_config["api_key"] = config["api_key"]
        
        return tool_config
    
    def _get_task_context(self, task_node: WorkflowNode, edges: List[WorkflowEdge]) -> List[str]:
        """Get context for a task from connected nodes"""
        context = []
        
        # Find nodes that connect to this task
        for edge in edges:
            if edge.target_node_id == task_node.id:
                source_node = next(
                    (n for n in task_node.workflow.nodes if n.id == edge.source_node_id),
                    None
                )
                if source_node:
                    if source_node.node_type == NodeType.AGENT:
                        context.append(f"Agent: {source_node.name}")
                    elif source_node.node_type == NodeType.TASK:
                        context.append(f"Previous task: {source_node.name}")
                    elif source_node.node_type == NodeType.DATA_INPUT:
                        context.append(f"Input: {source_node.name}")
        
        return context
    
    def _determine_process_type(self, workflow: Workflow) -> str:
        """Determine the process type based on workflow structure"""
        # Count different types of connections
        agent_to_task = 0
        task_to_task = 0
        task_to_agent = 0
        
        for edge in workflow.edges:
            source_node = next(
                (n for n in workflow.nodes if n.id == edge.source_node_id),
                None
            )
            target_node = next(
                (n for n in workflow.nodes if n.id == edge.target_node_id),
                None
            )
            
            if source_node and target_node:
                if source_node.node_type == NodeType.AGENT and target_node.node_type == NodeType.TASK:
                    agent_to_task += 1
                elif source_node.node_type == NodeType.TASK and target_node.node_type == NodeType.TASK:
                    task_to_task += 1
                elif source_node.node_type == NodeType.TASK and target_node.node_type == NodeType.AGENT:
                    task_to_agent += 1
        
        # Determine process type
        if task_to_agent > 0:
            return "hierarchical"  # Tasks can assign work to agents
        elif task_to_task > 0:
            return "sequential"  # Tasks depend on each other
        else:
            return "sequential"  # Default to sequential
    
    def convert_to_yaml(self, workflow: Workflow) -> str:
        """Convert workflow to YAML string"""
        crew_config = self.convert_visual_to_crew(workflow)
        return yaml.dump(crew_config, default_flow_style=False, sort_keys=False)
    
    def convert_to_python(self, workflow: Workflow) -> str:
        """Convert workflow to Python code"""
        crew_config = self.convert_visual_to_crew(workflow)
        
        python_code = f'''"""
{workflow.name}
{workflow.description or "Generated from CrewAI Visual Builder"}
"""

from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool, FileReadTool

# Agents
'''
        
        # Generate agent code
        for agent_name, agent_config in crew_config["agents"].items():
            python_code += f'''
{agent_name} = Agent(
    role="{agent_config["role"]}",
    goal="{agent_config["goal"]}",
    backstory="""{agent_config.get("backstory", "")}""",
'''
            
            if agent_config.get("llm"):
                python_code += f'    llm="{agent_config["llm"]}",\n'
            
            if agent_config.get("tools"):
                python_code += f'    tools={agent_config["tools"]},\n'
            
            if agent_config.get("memory"):
                python_code += f'    memory={agent_config["memory"]},\n'
            
            if agent_config.get("verbose") is not None:
                python_code += f'    verbose={agent_config["verbose"]},\n'
            
            python_code += ')\n'
        
        python_code += '\n# Tasks\n'
        
        # Generate task code
        for task_name, task_config in crew_config["tasks"].items():
            python_code += f'''
{task_name} = Task(
    description="""{task_config["description"]}""",
    expected_output="""{task_config["expected_output"]}""",
'''
            
            if task_config.get("agent"):
                python_code += f'    agent={task_config["agent"]},\n'
            
            if task_config.get("context"):
                context_str = ', '.join([f'"{ctx}"' for ctx in task_config["context"]])
                python_code += f'    context=[{context_str}],\n'
            
            if task_config.get("tools"):
                python_code += f'    tools={task_config["tools"]},\n'
            
            if task_config.get("output_file"):
                python_code += f'    output_file="{task_config["output_file"]}",\n'
            
            python_code += ')\n'
        
        python_code += f'''
# Crew
crew = Crew(
    agents=[{', '.join(crew_config["agents"].keys())}],
    tasks=[{', '.join(crew_config["tasks"].keys())}],
    process=Process.{crew_config["process"].upper()},
    verbose={crew_config["verbose"]},
)

# Execute
result = crew.kickoff()
print(result)
'''
        
        return python_code
    
    def validate_workflow(self, workflow: Workflow) -> Dict[str, Any]:
        """Validate workflow and return validation results"""
        errors = []
        warnings = []
        
        # Check for required nodes
        agents = [n for n in workflow.nodes if n.node_type == NodeType.AGENT]
        tasks = [n for n in workflow.nodes if n.node_type == NodeType.TASK]
        
        if not agents:
            errors.append("Workflow must contain at least one agent")
        
        if not tasks:
            errors.append("Workflow must contain at least one task")
        
        # Check node configurations
        for node in workflow.nodes:
            if node.node_type == NodeType.AGENT:
                config = node.config or {}
                if not config.get("role"):
                    errors.append(f"Agent '{node.name}' must have a role")
                if not config.get("goal"):
                    errors.append(f"Agent '{node.name}' must have a goal")
            
            elif node.node_type == NodeType.TASK:
                config = node.config or {}
                if not config.get("description"):
                    errors.append(f"Task '{node.name}' must have a description")
                if not config.get("expected_output"):
                    errors.append(f"Task '{node.name}' must have expected output")
        
        # Check for disconnected nodes
        connected_node_ids = set()
        for edge in workflow.edges:
            connected_node_ids.add(edge.source_node_id)
            connected_node_ids.add(edge.target_node_id)
        
        disconnected_nodes = [
            n for n in workflow.nodes 
            if n.id not in connected_node_ids and n.node_type not in [NodeType.DATA_INPUT, NodeType.DATA_OUTPUT]
        ]
        
        if disconnected_nodes:
            warnings.append(f"Found {len(disconnected_nodes)} disconnected nodes")
        
        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings,
        } 