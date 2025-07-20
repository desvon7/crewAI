import React, { useState } from 'react';
import { colors, spacing } from '../../theme';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  icon?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'CrewAI Visual Builder',
  icon = '🤖',
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const layoutStyle: React.CSSProperties = {
    display: 'flex',
    height: '100vh',
    backgroundColor: colors.background.primary,
  };

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const contentAreaStyle: React.CSSProperties = {
    flex: 1,
    backgroundColor: colors.background.primary,
    overflow: 'auto',
    position: 'relative',
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleToggleActive = () => {
    setIsActive(!isActive);
  };

  const handleShare = () => {
    console.log('Share clicked');
  };

  const handleTest = () => {
    console.log('Test clicked');
  };

  const handleSave = () => {
    console.log('Save clicked');
  };

  const handleSettings = () => {
    console.log('Settings clicked');
  };

  const handleFlowEditor = () => {
    console.log('Flow Editor clicked');
  };

  const handleTasks = () => {
    console.log('Tasks clicked');
  };

  return (
    <div style={layoutStyle}>
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      {/* Main Content Area */}
      <div style={mainContentStyle}>
        {/* Top Bar */}
        <TopBar
          title={title}
          icon={icon}
          isActive={isActive}
          onToggleActive={handleToggleActive}
          onShare={handleShare}
          onTest={handleTest}
          onSave={handleSave}
          onSettings={handleSettings}
          onFlowEditor={handleFlowEditor}
          onTasks={handleTasks}
        />

        {/* Content Area */}
        <div style={contentAreaStyle}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout; 