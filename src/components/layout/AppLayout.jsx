import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ToastContainer } from '../common/ToastContainer';
import { useLibrary } from '../../hooks/useLibrary';

export function AppLayout() {
  const { isSidebarCollapsed } = useLibrary();

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="app-main-wrapper">
        <Navbar />
        <main className="app-content-area">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AppLayout;
