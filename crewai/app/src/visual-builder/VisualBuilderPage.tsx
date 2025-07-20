import React, { useState } from 'react';
import MainLayout from './components/Layout/MainLayout';
import FlowEditor from './components/FlowEditor/FlowEditor';
import PropertyPanel from './components/FlowEditor/PropertyPanel';
import { colors, spacing } from './theme';

const VisualBuilderPage: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    height: '100%',
    backgroundColor: colors.background.secondary,
  };

  const flowEditorStyle: React.CSSProperties = {
    flex: 1,
    position: 'relative',
  };

  const propertyPanelStyle: React.CSSProperties = {
    width: spacing.panel.width,
    backgroundColor: colors.background.primary,
    borderLeft: `1px solid ${colors.border.light}`,
    overflow: 'auto',
  };

  const handleNodeSelect = (nodeId: string | null) => {
    setSelectedNode(nodeId);
  };

  const handleNodesChange = (newNodes: any[]) => {
    setNodes(newNodes);
  };

  const handleEdgesChange = (newEdges: any[]) => {
    setEdges(newEdges);
  };

  return (
    <MainLayout title="CrewAI Visual Builder" icon="🤖">
      <div style={contentStyle}>
        <div style={flowEditorStyle}>
          <FlowEditor
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onNodeSelect={handleNodeSelect}
          />
        </div>
        <div style={propertyPanelStyle}>
          <PropertyPanel
            selectedNode={selectedNode}
            nodes={nodes}
            onNodeUpdate={(nodeId, updates) => {
              setNodes(prev => prev.map(node => 
                node.id === nodeId ? { ...node, ...updates } : node
              ));
            }}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default VisualBuilderPage; 