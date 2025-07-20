import React from 'react';
import { colors, spacing, typography } from '../../theme';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  isActive?: boolean;
  hasNotification?: boolean;
}

interface RecentItem {
  id: string;
  label: string;
  icon: string;
  isActive?: boolean;
  hasNotification?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed = false, 
  onToggleCollapse 
}) => {
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: '🏠', isActive: true },
    { id: 'my-workflows', label: 'My Workflows', icon: '📁' },
    { id: 'new-workflow', label: 'New Workflow', icon: '➕' },
  ];

  const recentItems: RecentItem[] = [
    { 
      id: 'ai-sales', 
      label: 'AI Sales Development Representative', 
      icon: '👥', 
      isActive: true,
      hasNotification: true 
    },
    { id: 'meeting-scheduler', label: 'Meeting Scheduler', icon: '📅' },
    { id: 'meeting-notetaker', label: 'Meeting Notetaker', icon: '📝' },
    { id: 'meeting-prep', label: 'Meeting Prep Assistant', icon: '💡' },
  ];

  const sidebarStyle: React.CSSProperties = {
    width: isCollapsed ? '80px' : spacing.sidebar.width,
    height: '100vh',
    backgroundColor: colors.background.sidebar,
    borderRight: `1px solid ${colors.border.light}`,
    padding: spacing.sidebar.padding,
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease',
    overflow: 'hidden',
  };

  const userSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    paddingBottom: spacing[4],
    borderBottom: `1px solid ${colors.border.light}`,
    marginBottom: spacing[4],
  };

  const avatarStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: colors.primary[500],
    color: colors.text.inverse,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  };

  const navSectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sidebar.itemGap,
    marginBottom: spacing[6],
  };

  const navItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[2],
    borderRadius: spacing[1],
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  };

  const activeNavItemStyle: React.CSSProperties = {
    ...navItemStyle,
    backgroundColor: colors.blue[50],
    color: colors.blue[600],
  };

  const recentSectionStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sidebar.itemGap,
  };

  const recentItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: spacing[2],
    borderRadius: spacing[1],
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.normal,
  };

  const activeRecentItemStyle: React.CSSProperties = {
    ...recentItemStyle,
    backgroundColor: colors.blue[50],
    color: colors.blue[600],
  };

  const notificationDotStyle: React.CSSProperties = {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: colors.blue[500],
    marginLeft: 'auto',
  };

  const creditsSectionStyle: React.CSSProperties = {
    padding: spacing[3],
    backgroundColor: colors.background.card,
    borderRadius: spacing[1],
    border: `1px solid ${colors.border.light}`,
    marginBottom: spacing[3],
  };

  const progressBarStyle: React.CSSProperties = {
    width: '100%',
    height: '4px',
    backgroundColor: colors.gray[200],
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: spacing[1],
  };

  const progressFillStyle: React.CSSProperties = {
    height: '100%',
    backgroundColor: colors.primary[500],
    width: '91.66%', // 4,583 / 5,000
    transition: 'width 0.3s ease',
  };

  const upgradeButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing[2],
    backgroundColor: colors.gray[100],
    color: colors.text.primary,
    border: `1px solid ${colors.border.light}`,
    borderRadius: spacing[1],
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  return (
    <div style={sidebarStyle}>
      {/* User Section */}
      <div style={userSectionStyle}>
        <div style={avatarStyle}>J</div>
        {!isCollapsed && (
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontSize: typography.fontSize.sm, 
              fontWeight: typography.fontWeight.medium,
              color: colors.text.primary 
            }}>
              Javon J (Von)'s...
            </div>
          </div>
        )}
        {!isCollapsed && (
          <button 
            onClick={onToggleCollapse}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: colors.text.secondary,
              fontSize: typography.fontSize.sm,
            }}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        )}
      </div>

      {/* Navigation */}
      <div style={navSectionStyle}>
        {navItems.map((item) => (
          <div
            key={item.id}
            style={item.isActive ? activeNavItemStyle : navItemStyle}
          >
            <span style={{ fontSize: typography.fontSize.lg }}>{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
          </div>
        ))}
      </div>

      {/* Recents */}
      {!isCollapsed && (
        <div style={recentSectionStyle}>
          <div style={{ 
            fontSize: typography.fontSize.sm, 
            fontWeight: typography.fontWeight.medium,
            color: colors.text.primary,
            marginBottom: spacing[2]
          }}>
            Recents
          </div>
          {recentItems.map((item) => (
            <div
              key={item.id}
              style={item.isActive ? activeRecentItemStyle : recentItemStyle}
            >
              <span style={{ fontSize: typography.fontSize.sm }}>{item.icon}</span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.label}
              </span>
              {item.hasNotification && <div style={notificationDotStyle} />}
            </div>
          ))}
        </div>
      )}

      {/* Credits Section */}
      {!isCollapsed && (
        <div style={creditsSectionStyle}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: spacing[1],
            marginBottom: spacing[1]
          }}>
            <span style={{ fontSize: typography.fontSize.sm }}>🎁</span>
            <span style={{ 
              fontSize: typography.fontSize.xs, 
              color: colors.text.secondary 
            }}>
              Get $50 for every friend you refer.
            </span>
          </div>
          <div style={{ 
            fontSize: typography.fontSize.xs, 
            color: colors.text.secondary,
            marginBottom: spacing[1]
          }}>
            Credits remaining
          </div>
          <div style={progressBarStyle}>
            <div style={progressFillStyle} />
          </div>
          <div style={{ 
            fontSize: typography.fontSize.xs, 
            color: colors.text.secondary,
            marginTop: spacing[1]
          }}>
            4,583 / 5,000
          </div>
        </div>
      )}

      {/* Upgrade Button */}
      <button style={upgradeButtonStyle}>
        {isCollapsed ? '↑' : 'Upgrade'}
      </button>
    </div>
  );
};

export default Sidebar; 