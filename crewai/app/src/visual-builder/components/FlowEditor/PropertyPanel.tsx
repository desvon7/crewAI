import React from 'react';
import { colors, spacing, typography } from '../../theme';

interface PropertyPanelProps {
  selectedNode: string | null;
  nodes: any[];
  onNodeUpdate: (nodeId: string, updates: any) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedNode,
  nodes,
  onNodeUpdate,
}) => {
  const selectedNodeData = nodes.find(node => node.id === selectedNode);

  const panelStyle: React.CSSProperties = {
    padding: spacing.panel.padding,
    height: '100%',
    overflow: 'auto',
  };

  const headerStyle: React.CSSProperties = {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing[4],
    paddingBottom: spacing[3],
    borderBottom: `1px solid ${colors.border.light}`,
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: spacing[4],
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
    marginBottom: spacing[2],
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing[2],
    border: `1px solid ${colors.border.light}`,
    borderRadius: spacing[1],
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    transition: 'border-color 0.2s ease',
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '80px',
    resize: 'vertical',
    fontFamily: typography.fontFamily.sans.join(', '),
  };

  const labelStyle: React.CSSProperties = {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing[1],
    display: 'block',
  };

  const emptyStateStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: colors.text.secondary,
    textAlign: 'center',
    padding: spacing[4],
  };

  const handleInputChange = (field: string, value: string) => {
    if (selectedNode) {
      onNodeUpdate(selectedNode, {
        data: {
          ...selectedNodeData?.data,
          [field]: value,
        },
      });
    }
  };

  if (!selectedNode || !selectedNodeData) {
    return (
      <div style={panelStyle}>
        <div style={emptyStateStyle}>
          <div style={{ fontSize: typography.fontSize['3xl'], marginBottom: spacing[3] }}>
            ⚙️
          </div>
          <h3 style={{ 
            fontSize: typography.fontSize.lg, 
            fontWeight: typography.fontWeight.medium,
            color: colors.text.primary,
            marginBottom: spacing[2]
          }}>
            Properties
          </h3>
          <p style={{ 
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            lineHeight: typography.lineHeight.relaxed
          }}>
            Select a node to edit its properties
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        Node Properties
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>
          Node Type
        </label>
        <select 
          style={inputStyle}
          value={selectedNodeData.type || 'agent'}
          onChange={(e) => handleInputChange('type', e.target.value)}
        >
          <option value="agent">Agent</option>
          <option value="task">Task</option>
          <option value="tool">Tool</option>
        </select>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>
          Label
        </label>
        <input
          type="text"
          style={inputStyle}
          value={selectedNodeData.data?.label || ''}
          onChange={(e) => handleInputChange('label', e.target.value)}
          placeholder="Enter node label"
        />
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>
          Role
        </label>
        <input
          type="text"
          style={inputStyle}
          value={selectedNodeData.data?.role || ''}
          onChange={(e) => handleInputChange('role', e.target.value)}
          placeholder="Enter role description"
        />
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>
          Goal
        </label>
        <textarea
          style={textareaStyle}
          value={selectedNodeData.data?.goal || ''}
          onChange={(e) => handleInputChange('goal', e.target.value)}
          placeholder="Define the goal for this node"
        />
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>
          Backstory
        </label>
        <textarea
          style={textareaStyle}
          value={selectedNodeData.data?.backstory || ''}
          onChange={(e) => handleInputChange('backstory', e.target.value)}
          placeholder="Define the backstory for this node"
        />
      </div>

      {selectedNodeData.type === 'task' && (
        <div style={sectionStyle}>
          <label style={labelStyle}>
            Expected Output
          </label>
          <textarea
            style={textareaStyle}
            value={selectedNodeData.data?.expectedOutput || ''}
            onChange={(e) => handleInputChange('expectedOutput', e.target.value)}
            placeholder="Define the expected output for this task"
          />
        </div>
      )}

      <div style={sectionStyle}>
        <label style={labelStyle}>
          Position
        </label>
        <div style={{ display: 'flex', gap: spacing[2] }}>
          <input
            type="number"
            style={{ ...inputStyle, flex: 1 }}
            value={selectedNodeData.position?.x || 0}
            onChange={(e) => {
              if (selectedNode) {
                onNodeUpdate(selectedNode, {
                  position: {
                    ...selectedNodeData.position,
                    x: parseInt(e.target.value) || 0,
                  },
                });
              }
            }}
            placeholder="X"
          />
          <input
            type="number"
            style={{ ...inputStyle, flex: 1 }}
            value={selectedNodeData.position?.y || 0}
            onChange={(e) => {
              if (selectedNode) {
                onNodeUpdate(selectedNode, {
                  position: {
                    ...selectedNodeData.position,
                    y: parseInt(e.target.value) || 0,
                  },
                });
              }
            }}
            placeholder="Y"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel; 