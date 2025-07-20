import React from 'react';
import { colors, spacing, typography } from '../../theme';

interface TopBarProps {
  title: string;
  icon?: string;
  isActive?: boolean;
  onToggleActive?: () => void;
  onShare?: () => void;
  onTest?: () => void;
  onSave?: () => void;
  onSettings?: () => void;
  onFlowEditor?: () => void;
  onTasks?: () => void;
}

interface TabItem {
  id: string;
  label: string;
  icon: string;
  isActive?: boolean;
  hasNotification?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  title,
  icon = '👥',
  isActive = true,
  onToggleActive,
  onShare,
  onTest,
  onSave,
  onSettings,
  onFlowEditor,
  onTasks,
}) => {
  const tabs: TabItem[] = [
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'flow-editor', label: 'Flow Editor', icon: '📊', isActive: true },
    { id: 'tasks', label: 'Tasks', icon: '📋', hasNotification: true },
  ];

  const topBarStyle: React.CSSProperties = {
    height: spacing.topBar.height,
    backgroundColor: colors.background.primary,
    borderBottom: `1px solid ${colors.border.light}`,
    padding: spacing.topBar.padding,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[4],
  };

  const leftSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
  };

  const titleSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  };

  const titleStyle: React.CSSProperties = {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  };

  const toggleSwitchStyle: React.CSSProperties = {
    width: '44px',
    height: '24px',
    backgroundColor: isActive ? colors.blue[500] : colors.gray[300],
    borderRadius: '12px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  const toggleThumbStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    backgroundColor: colors.background.primary,
    borderRadius: '50%',
    position: 'absolute',
    top: '2px',
    left: isActive ? '22px' : '2px',
    transition: 'left 0.2s ease',
    boxShadow: colors.shadow.sm,
  };

  const centerSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
  };

  const tabStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: `${spacing[2]} ${spacing[3]}`,
    borderRadius: spacing[1],
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    position: 'relative',
  };

  const activeTabStyle: React.CSSProperties = {
    ...tabStyle,
    backgroundColor: colors.blue[50],
    color: colors.blue[600],
  };

  const notificationDotStyle: React.CSSProperties = {
    position: 'absolute',
    top: spacing[1],
    right: spacing[1],
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: colors.blue[500],
  };

  const rightSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  };

  const buttonStyle: React.CSSProperties = {
    padding: `${spacing[2]} ${spacing[3]}`,
    backgroundColor: 'transparent',
    border: `1px solid ${colors.border.light}`,
    borderRadius: spacing[1],
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: colors.blue[500],
    color: colors.text.inverse,
    borderColor: colors.blue[500],
  };

  const separatorStyle: React.CSSProperties = {
    width: '1px',
    height: '24px',
    backgroundColor: colors.border.light,
    margin: `0 ${spacing[2]}`,
  };

  return (
    <div style={topBarStyle}>
      {/* Left Section - Title and Toggle */}
      <div style={leftSectionStyle}>
        <div style={titleSectionStyle}>
          <span style={{ fontSize: typography.fontSize.lg }}>{icon}</span>
          <span style={titleStyle}>{title}</span>
        </div>
        <div 
          style={toggleSwitchStyle}
          onClick={onToggleActive}
        >
          <div style={toggleThumbStyle} />
        </div>
      </div>

      {/* Center Section - Navigation Tabs */}
      <div style={centerSectionStyle}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            style={tab.isActive ? activeTabStyle : tabStyle}
            onClick={() => {
              if (tab.id === 'settings') onSettings?.();
              if (tab.id === 'flow-editor') onFlowEditor?.();
              if (tab.id === 'tasks') onTasks?.();
            }}
          >
            <span style={{ fontSize: typography.fontSize.sm }}>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.hasNotification && <div style={notificationDotStyle} />}
          </div>
        ))}
      </div>

      {/* Right Section - Action Buttons */}
      <div style={rightSectionStyle}>
        <button style={buttonStyle} onClick={onShare}>
          Share
        </button>
        <div style={separatorStyle} />
        <button style={buttonStyle} onClick={onTest}>
          Test
        </button>
        <button style={primaryButtonStyle} onClick={onSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default TopBar; 