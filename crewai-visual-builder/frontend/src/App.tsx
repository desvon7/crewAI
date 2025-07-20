import React, { useState } from 'react';
import { colors } from './theme';
import MainLayout from './components/Layout/MainLayout';
import FlowCanvas from './components/FlowEditor/FlowCanvas';
import FlowNode from './components/FlowEditor/FlowNode';
import PropertyPanel from './components/FlowEditor/PropertyPanel';
import { NodeType } from './components/FlowEditor/FlowNode';

interface Node {
  id: string;
  type: NodeType;
  title: string;
  description?: string;
  x: number;
  y: number;
  isSelected?: boolean;
  isExecuting?: boolean;
  isCompleted?: boolean;
  hasError?: boolean;
  properties?: Record<string, any>;
}

const App: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: '1',
      type: 'trigger',
      title: 'Message Received',
      description: 'Trigger when a message is received',
      x: 100,
      y: 100,
    },
    {
      id: '2',
      type: 'agent',
      title: 'Company To Lead Converter',
      description: 'Convert company names to leads',
      x: 100,
      y: 250,
    },
    {
      id: '3',
      type: 'task',
      title: 'Company Research',
      description: 'Research company information',
      x: 100,
      y: 400,
    },
    {
      id: '4',
      type: 'task',
      title: 'Lead Finder',
      description: 'Find leads within companies',
      x: 100,
      y: 550,
    },
    {
      id: '5',
      type: 'loop',
      title: 'Lead Researcher Loop',
      description: 'Loop through leads for research',
      x: 100,
      y: 700,
    },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showPropertyPanel, setShowPropertyPanel] = useState(false);

  const appStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    backgroundColor: colors.background.primary,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  };

  const handleNodeClick = (nodeId: string) => {
    setNodes(prev => prev.map(node => ({
      ...node,
      isSelected: node.id === nodeId,
    })));
    setSelectedNodeId(nodeId);
    setShowPropertyPanel(true);
  };

  const handleNodeDoubleClick = (nodeId: string) => {
    // Handle node editing or other double-click actions
    console.log('Double clicked node:', nodeId);
  };

  const handlePropertyChange = (property: string, value: any) => {
    if (!selectedNodeId) return;

    setNodes(prev => prev.map(node => 
      node.id === selectedNodeId 
        ? { 
            ...node, 
            properties: { ...node.properties, [property]: value },
            title: property === 'title' ? value : node.title,
            description: property === 'description' ? value : node.description,
          }
        : node
    ));
  };

  const handleClosePropertyPanel = () => {
    setShowPropertyPanel(false);
    setSelectedNodeId(null);
    setNodes(prev => prev.map(node => ({ ...node, isSelected: false })));
  };

  const selectedNode = nodes.find(node => node.id === selectedNodeId);

  return (
    <div style={appStyle}>
      <MainLayout title="AI Sales Development Representative" icon="👥">
        <div style={{ display: 'flex', height: '100%' }}>
          {/* Flow Canvas */}
          <div style={{ flex: 1, position: 'relative' }}>
            <FlowCanvas>
              {nodes.map((node) => (
                <div
                  key={node.id}
                  style={{
                    position: 'absolute',
                    left: node.x,
                    top: node.y,
                    zIndex: node.isSelected ? 10 : 1,
                  }}
                >
                  <FlowNode
                    id={node.id}
                    type={node.type}
                    title={node.title}
                    description={node.description}
                    isSelected={node.isSelected}
                    isExecuting={node.isExecuting}
                    isCompleted={node.isCompleted}
                    hasError={node.hasError}
                    onClick={() => handleNodeClick(node.id)}
                    onDoubleClick={() => handleNodeDoubleClick(node.id)}
                  />
                </div>
              ))}
            </FlowCanvas>
          </div>

          {/* Property Panel */}
          <PropertyPanel
            isVisible={showPropertyPanel}
            selectedNode={selectedNode}
            onClose={handleClosePropertyPanel}
            onPropertyChange={handlePropertyChange}
          />
        </div>
      </MainLayout>
    </div>
  );
};

export default App; 