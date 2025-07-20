import React from 'react';
import { colors, spacing, typography } from '../../theme';

interface FlowEditorProps {
  nodes: any[];
  edges: any[];
  onNodesChange: (nodes: any[]) => void;
  onEdgesChange: (edges: any[]) => void;
  onNodeSelect: (nodeId: string | null) => void;
}

const FlowEditor: React.FC<FlowEditorProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeSelect,
}) => {
  const canvasStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background.secondary,
    position: 'relative',
    overflow: 'auto',
  };

  const emptyStateStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: colors.text.secondary,
    textAlign: 'center',
    padding: spacing[6],
  };

  const addNodeButtonStyle: React.CSSProperties = {
    padding: `${spacing[3]} ${spacing[4]}`,
    backgroundColor: colors.blue[500],
    color: colors.text.inverse,
    border: 'none',
    borderRadius: spacing[1],
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: spacing[4],
  };

  const handleAddNode = () => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'agent',
      position: { x: 100, y: 100 },
      data: {
        label: 'New Agent',
        role: 'Agent',
        goal: 'Define agent goal',
        backstory: 'Define agent backstory',
      },
    };

    onNodesChange([...nodes, newNode]);
  };

  if (nodes.length === 0) {
    return (
      <div style={canvasStyle}>
        <div style={emptyStateStyle}>
          <div style={{ fontSize: typography.fontSize['4xl'], marginBottom: spacing[4] }}>
            🤖
          </div>
          <h2 style={{ 
            fontSize: typography.fontSize['2xl'], 
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.primary,
            marginBottom: spacing[2]
          }}>
            Welcome to CrewAI Visual Builder
          </h2>
          <p style={{ 
            fontSize: typography.fontSize.lg,
            color: colors.text.secondary,
            maxWidth: '400px',
            lineHeight: typography.lineHeight.relaxed
          }}>
            Start building your AI crew by adding agents and connecting them with tasks. 
            Drag and drop to create your workflow.
          </p>
          <button style={addNodeButtonStyle} onClick={handleAddNode}>
            Add Your First Agent
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={canvasStyle}>
      {/* Render nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          style={{
            position: 'absolute',
            left: node.position.x,
            top: node.position.y,
            backgroundColor: colors.background.card,
            border: `2px solid ${colors.border.light}`,
            borderRadius: spacing.node.borderRadius,
            padding: spacing.node.padding,
            minWidth: spacing.node.minWidth,
            minHeight: spacing.node.minHeight,
            cursor: 'pointer',
            boxShadow: colors.shadow.md,
            transition: 'all 0.2s ease',
          }}
          onClick={() => onNodeSelect(node.id)}
        >
          <div style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: colors.text.primary,
            marginBottom: spacing[1],
          }}>
            {node.data.label}
          </div>
          <div style={{
            fontSize: typography.fontSize.xs,
            color: colors.text.secondary,
          }}>
            {node.data.role}
          </div>
        </div>
      ))}
      
      {/* Add node button */}
      <button 
        style={{
          ...addNodeButtonStyle,
          position: 'absolute',
          bottom: spacing[4],
          right: spacing[4],
        }}
        onClick={handleAddNode}
      >
        + Add Agent
      </button>
    </div>
  );
};

export default FlowEditor; 