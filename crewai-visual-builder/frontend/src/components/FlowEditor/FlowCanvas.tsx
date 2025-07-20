import React, { useCallback, useRef, useState } from 'react';
import { colors, spacing, typography } from '../../theme';

interface FlowCanvasProps {
  children: React.ReactNode;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  onResetView?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({
  children,
  onZoomIn,
  onZoomOut,
  onFitView,
  onResetView,
  onUndo,
  onRedo,
}) => {
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  const canvasStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background.primary,
    backgroundImage: `
      radial-gradient(circle at 1px 1px, ${colors.gray[200]} 1px, transparent 0)
    `,
    backgroundSize: '20px 20px',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'grab',
  };

  const canvasContentStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'relative',
    transform: `scale(${zoom})`,
    transformOrigin: 'center center',
    transition: 'transform 0.1s ease',
  };

  const controlsStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: spacing[4],
    right: spacing[4],
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
    backgroundColor: colors.background.card,
    border: `1px solid ${colors.border.light}`,
    borderRadius: spacing[1],
    padding: spacing[2],
    boxShadow: colors.shadow.md,
  };

  const controlButtonStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    backgroundColor: colors.background.primary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: spacing[1],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  };

  const controlButtonHoverStyle: React.CSSProperties = {
    ...controlButtonStyle,
    backgroundColor: colors.gray[50],
    borderColor: colors.border.medium,
    color: colors.text.primary,
  };

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.1, 2));
    onZoomIn?.();
  }, [onZoomIn]);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.1, 0.1));
    onZoomOut?.();
  }, [onZoomOut]);

  const handleFitView = useCallback(() => {
    setZoom(1);
    onFitView?.();
  }, [onFitView]);

  const handleResetView = useCallback(() => {
    setZoom(1);
    onResetView?.();
  }, [onResetView]);

  const handleUndo = useCallback(() => {
    onUndo?.();
  }, [onUndo]);

  const handleRedo = useCallback(() => {
    onRedo?.();
  }, [onRedo]);

  return (
    <div style={canvasStyle} ref={canvasRef}>
      <div style={canvasContentStyle}>
        {children}
      </div>

      {/* Zoom and Control Buttons */}
      <div style={controlsStyle}>
        <button
          style={controlButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.gray[50];
            e.currentTarget.style.borderColor = colors.border.medium;
            e.currentTarget.style.color = colors.text.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.background.primary;
            e.currentTarget.style.borderColor = colors.border.light;
            e.currentTarget.style.color = colors.text.secondary;
          }}
          onClick={handleZoomIn}
          title="Zoom In"
        >
          +
        </button>
        <button
          style={controlButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.gray[50];
            e.currentTarget.style.borderColor = colors.border.medium;
            e.currentTarget.style.color = colors.text.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.background.primary;
            e.currentTarget.style.borderColor = colors.border.light;
            e.currentTarget.style.color = colors.text.secondary;
          }}
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          −
        </button>
        <button
          style={controlButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.gray[50];
            e.currentTarget.style.borderColor = colors.border.medium;
            e.currentTarget.style.color = colors.text.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.background.primary;
            e.currentTarget.style.borderColor = colors.border.light;
            e.currentTarget.style.color = colors.text.secondary;
          }}
          onClick={handleUndo}
          title="Undo"
        >
          ↶
        </button>
        <button
          style={controlButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.gray[50];
            e.currentTarget.style.borderColor = colors.border.medium;
            e.currentTarget.style.color = colors.text.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.background.primary;
            e.currentTarget.style.borderColor = colors.border.light;
            e.currentTarget.style.color = colors.text.secondary;
          }}
          onClick={handleRedo}
          title="Redo"
        >
          ↷
        </button>
        <button
          style={controlButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.gray[50];
            e.currentTarget.style.borderColor = colors.border.medium;
            e.currentTarget.style.color = colors.text.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.background.primary;
            e.currentTarget.style.borderColor = colors.border.light;
            e.currentTarget.style.color = colors.text.secondary;
          }}
          onClick={handleFitView}
          title="Fit View"
        >
          ⊞
        </button>
        <button
          style={controlButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.gray[50];
            e.currentTarget.style.borderColor = colors.border.medium;
            e.currentTarget.style.color = colors.text.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.background.primary;
            e.currentTarget.style.borderColor = colors.border.light;
            e.currentTarget.style.color = colors.text.secondary;
          }}
          onClick={handleResetView}
          title="Reset View"
        >
          ⌂
        </button>
        <button
          style={controlButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.gray[50];
            e.currentTarget.style.borderColor = colors.border.medium;
            e.currentTarget.style.color = colors.text.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.background.primary;
            e.currentTarget.style.borderColor = colors.border.light;
            e.currentTarget.style.color = colors.text.secondary;
          }}
          title="Help"
        >
          ?
        </button>
      </div>
    </div>
  );
};

export default FlowCanvas; 