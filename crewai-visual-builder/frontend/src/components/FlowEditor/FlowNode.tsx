import React, { useState } from 'react';
import { colors, spacing, typography } from '../../theme';

export type NodeType = 'agent' | 'task' | 'tool' | 'trigger' | 'condition' | 'loop';

interface FlowNodeProps {
  id: string;
  type: NodeType;
  title: string;
  description?: string;
  icon?: string;
  isSelected?: boolean;
  isExecuting?: boolean;
  isCompleted?: boolean;
  hasError?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  children?: React.ReactNode;
}

const FlowNode: React.FC<FlowNodeProps> = ({
  id,
  type,
  title,
  description,
  icon,
  isSelected = false,
  isExecuting = false,
  isCompleted = false,
  hasError = false,
  onClick,
  onDoubleClick,
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Node type configuration
  const nodeConfig = {
    agent: {
      color: colors.blue[500],
      bgColor: colors.blue[50],
      borderColor: colors.blue[200],
      icon: icon || '👤',
    },
    task: {
      color: colors.primary[500],
      bgColor: colors.primary[50],
      borderColor: colors.primary[200],
      icon: icon || '⚡',
    },
    tool: {
      color: colors.gray[600],
      bgColor: colors.gray[50],
      borderColor: colors.gray[200],
      icon: icon || '🔧',
    },
    trigger: {
      color: colors.success[500],
      bgColor: colors.success[50],
      borderColor: colors.success[500],
      icon: icon || '🚀',
    },
    condition: {
      color: colors.warning[500],
      bgColor: colors.warning[50],
      borderColor: colors.warning[500],
      icon: icon || '❓',
    },
    loop: {
      color: colors.blue[600],
      bgColor: colors.blue[50],
      borderColor: colors.blue[300],
      icon: icon || '🔄',
    },
  };

  const config = nodeConfig[type];

  const nodeStyle: React.CSSProperties = {
    minWidth: spacing.node.minWidth,
    minHeight: spacing.node.minHeight,
    padding: spacing.node.padding,
    backgroundColor: isSelected ? config.bgColor : colors.background.card,
    border: `2px solid ${isSelected ? config.color : config.borderColor}`,
    borderRadius: spacing.node.borderRadius,
    boxShadow: isSelected || isHovered ? colors.shadow.lg : colors.shadow.sm,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  };

  const iconStyle: React.CSSProperties = {
    fontSize: typography.fontSize.lg,
    color: config.color,
    flexShrink: 0,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    lineHeight: typography.lineHeight.tight,
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.normal,
  };

  const statusIndicatorStyle: React.CSSProperties = {
    position: 'absolute',
    top: spacing[1],
    right: spacing[1],
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: isExecuting 
      ? colors.warning[500] 
      : isCompleted 
      ? colors.success[500] 
      : hasError 
      ? colors.error[500] 
      : 'transparent',
    animation: isExecuting ? 'pulse 1.5s infinite' : 'none',
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    onClick?.();
  };

  const handleDoubleClick = () => {
    onDoubleClick?.();
  };

  return (
    <div
      style={nodeStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Status Indicator */}
      <div style={statusIndicatorStyle} />

      {/* Header */}
      <div style={headerStyle}>
        <span style={iconStyle}>{config.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={titleStyle}>{title}</div>
          {description && (
            <div style={descriptionStyle}>{description}</div>
          )}
        </div>
      </div>

      {/* Children (for nested content) */}
      {children && (
        <div style={{ marginTop: spacing[1] }}>
          {children}
        </div>
      )}

      {/* Execution Status */}
      {isExecuting && (
        <div style={{
          position: 'absolute',
          bottom: spacing[1],
          left: spacing[1],
          fontSize: typography.fontSize.xs,
          color: colors.warning[600],
          fontWeight: typography.fontWeight.medium,
        }}>
          Running...
        </div>
      )}

      {isCompleted && (
        <div style={{
          position: 'absolute',
          bottom: spacing[1],
          left: spacing[1],
          fontSize: typography.fontSize.xs,
          color: colors.success[600],
          fontWeight: typography.fontWeight.medium,
        }}>
          ✓ Complete
        </div>
      )}

      {hasError && (
        <div style={{
          position: 'absolute',
          bottom: spacing[1],
          left: spacing[1],
          fontSize: typography.fontSize.xs,
          color: colors.error[600],
          fontWeight: typography.fontWeight.medium,
        }}>
          ✗ Error
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default FlowNode; 