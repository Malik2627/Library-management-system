import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Users,
  BookUp2,
  RotateCcw,
  FolderKanban,
  Settings,
  Library,
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight
} from 'lucide-react';
import { useLibrary } from '../../hooks/useLibrary';

export function Sidebar() {
  const { 
    isSidebarCollapsed, 
    toggleSidebar, 
    isMobileMenuOpen, 
    closeMobileMenu, 
    books, 
    students,
    issuedBooks 
  } = useLibrary();

  const sidebarLinks = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/books', label: 'All Books', icon: BookOpen, count: books.length, end: true },
    { path: '/books/add', label: 'Add Book', icon: PlusCircle },
    { path: '/students', label: 'Students', icon: Users, count: students.length, end: true },
    { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight, end: true },
    { path: '/issue', label: 'Issue Book', icon: BookUp2 },
    { path: '/return', label: 'Return Book', icon: RotateCcw, count: issuedBooks.length },
    { path: '/categories', label: 'Categories', icon: FolderKanban },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-backdrop"
          onClick={closeMobileMenu}
        />
      )}

      <aside className={`app-sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <NavLink to="/" className="brand-logo-container" onClick={closeMobileMenu}>
            <div className="brand-icon-glow">
              <Library className="brand-icon" size={22} />
            </div>
            {!isSidebarCollapsed && (
              <div className="brand-text">
                <span className="brand-title">LIBRARY<span>HUB</span></span>
                <span className="brand-badge">PRO</span>
              </div>
            )}
          </NavLink>
          <button 
            type="button"
            className="collapse-toggle-btn desktop-only" 
            onClick={toggleSidebar}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">
            {!isSidebarCollapsed ? 'NAVIGATION' : '•'}
          </div>
          <ul className="nav-list">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path} className="nav-item">
                  <NavLink
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <div className="nav-icon-wrapper">
                      <Icon size={19} />
                    </div>
                    {!isSidebarCollapsed && (
                      <span className="nav-label">{item.label}</span>
                    )}
                    {!isSidebarCollapsed && item.count !== undefined && item.count > 0 && (
                      <span className="nav-count-badge">{item.count}</span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Quick Card */}
        {!isSidebarCollapsed && (
          <div className="sidebar-footer-card">
            <div className="card-top-icon">
              <Sparkles size={15} />
              <span>Persistent State</span>
            </div>
            <p className="card-desc">{books.length} Books • {students.length} Members</p>
            <div className="card-status-indicator">
              <span className="pulse-dot"></span>
              <span>Online • LocalStorage</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
