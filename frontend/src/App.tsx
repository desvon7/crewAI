import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';

// --- Custom Node Components ---
const AgentNode = ({ data }: NodeProps) => (
  <div style={{
    background: '#e0f7fa',
    border: '2px solid #00796b',
    borderRadius: 8,
    padding: 12,
    minWidth: 120,
    textAlign: 'center',
    fontWeight: 600,
    color: '#00796b',
  }}>
    🤖 Agent<br />
    {data.label}
  </div>
);

const TaskNode = ({ data }: NodeProps) => (
  <div style={{
    background: '#fff3e0',
    border: '2px solid #f57c00',
    borderRadius: 8,
    padding: 12,
    minWidth: 120,
    textAlign: 'center',
    fontWeight: 600,
    color: '#f57c00',
  }}>
    📝 Task<br />
    {data.label}
  </div>
);

const ToolNode = ({ data }: NodeProps) => (
  <div style={{
    background: '#ede7f6',
    border: '2px solid #512da8',
    borderRadius: 8,
    padding: 12,
    minWidth: 120,
    textAlign: 'center',
    fontWeight: 600,
    color: '#512da8',
  }}>
    🛠️ Tool<br />
    {data.label}
  </div>
);

const nodeTypes = {
  agent: AgentNode,
  task: TaskNode,
  tool: ToolNode,
};

// --- Initial State ---
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'agent',
    position: { x: 250, y: 100 },
    data: { label: 'Hello World Agent' },
  },
  {
    id: '2',
    type: 'task',
    position: { x: 500, y: 200 },
    data: { label: 'Sample Task' },
  },
  {
    id: '3',
    type: 'tool',
    position: { x: 400, y: 350 },
    data: { label: 'Sample Tool' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'default' },
  { id: 'e2-3', source: '2', target: '3', type: 'default' },
];

// --- Sidebar for Drag-and-Drop ---
const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <aside style={{
      width: 120,
      background: '#f5f5f5',
      padding: 16,
      borderRight: '1px solid #ddd',
      height: '100vh',
      boxSizing: 'border-box',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 12 }}>Node Types</div>
      <div
        onDragStart={e => onDragStart(e, 'agent')}
        draggable
        style={{ marginBottom: 10, padding: 8, background: '#e0f7fa', borderRadius: 6, cursor: 'grab', textAlign: 'center' }}
      >
        🤖 Agent
      </div>
      <div
        onDragStart={e => onDragStart(e, 'task')}
        draggable
        style={{ marginBottom: 10, padding: 8, background: '#fff3e0', borderRadius: 6, cursor: 'grab', textAlign: 'center' }}
      >
        📝 Task
      </div>
      <div
        onDragStart={e => onDragStart(e, 'tool')}
        draggable
        style={{ marginBottom: 10, padding: 8, background: '#ede7f6', borderRadius: 6, cursor: 'grab', textAlign: 'center' }}
      >
        🛠️ Tool
      </div>
    </aside>
  );
};

// --- Main App ---
function App() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [id, setId] = React.useState(4);

  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge(params, eds)),
    [setEdges]
  );

  // Handle drop from sidebar
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowBounds) return;
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };
      const newNode: Node = {
        id: `${id}`,
        type,
        position,
        data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${id}` },
      };
      setNodes(nds => nds.concat(newNode));
      setId(id + 1);
    },
    [id, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <ReactFlowProvider>
      <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
        <Sidebar />
        <div
          style={{ flex: 1, height: '100vh' }}
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Controls />
            <Background />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App; 