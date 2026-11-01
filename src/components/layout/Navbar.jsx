import React, { useState } from 'react';
import { 
  Search, 
  Menu, 
  Bell, 
  Plus 
} from 'lucide-react';
import { useLibrary } from '../../hooks/useLibrary';
import { useLocation, Link } from 'react-router-dom';

export function Navbar() {
  const { searchQuery, setSearchQuery, toggleMobileMenu, books, issuedBooks } = useLibrary();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();

  // Dynamic page title based on current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard Overview';
    if (path === '/books') return 'All Books Catalog';
    if (path === '/books/add') return 'Add New Book';
    if (path.startsWith('/books/edit/')) return 'Edit Book Record';
    if (path.startsWith('/books/')) return 'Book Details';
    if (path === '/students') return 'Student Directory';
    if (path === '/students/add') return 'Register Student Member';
    if (path === '/transactions') return 'Circulation Logs';
    if (path === '/issue') return 'Issue Book System';
    if (path === '/return') return 'Return Book Check-In';
    if (path === '/categories') return 'Book Categories';
    if (path === '/settings') return 'System Settings';
    return 'LIBRARYHUB Portal';
  };

  return (
    <header className="app-navbar glass-panel">
      {/* Left side: Mobile menu toggle + Dynamic Page Title */}
      <div className="navbar-left">
        <button 
          type="button" 
          className="mobile-menu-btn" 
          onClick={toggleMobileMenu}
          aria-label="Toggle Mobile Menu"
        >
          <Menu size={22} />
        </button>

        <div className="navbar-title-section">
          <h2 className="navbar-page-title">{getPageTitle()}</h2>
          <span className="navbar-subtitle desktop-only">Realtime Library Management</span>
        </div>

        {/* Global Search Bar */}
        <div className="navbar-search-container desktop-only">
          <Search className="search-icon" size={17} />
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search books, authors, ISBN, or members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-shortcut">⌘K</span>
        </div>
      </div>

      {/* Right side: Quick Action, Alerts, User Profile */}
      <div className="navbar-right">
        {/* Quick Add Book Action */}
        <Link 
          to="/books/add"
          className="glass-btn glass-btn-primary quick-add-btn"
        >
          <Plus size={16} />
          <span className="btn-text">Add Book</span>
        </Link>

        {/* Live Circulation Pill */}
        <div className="system-status-pill desktop-only">
          <span className="status-dot"></span>
          <span className="status-text">{issuedBooks.length} Active Borrows</span>
        </div>

        {/* Notification Bell */}
        <div className="navbar-action-wrapper">
          <button 
            type="button" 
            className="navbar-icon-btn"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            title="System Alerts"
            aria-label="System Alerts"
          >
            <Bell size={18} />
            <span className="notification-badge"></span>
          </button>

          {notificationsOpen && (
            <div className="notifications-dropdown glass-card">
              <div className="dropdown-header">
                <span className="dropdown-title">System Activity</span>
                <span className="dropdown-badge">{books.length} Books Live</span>
              </div>
              <ul className="notification-items">
                <li className="notification-item">
                  <div className="notif-dot cyan"></div>
                  <div className="notif-content">
                    <p className="notif-text">Realtime LocalStorage persistence is active</p>
                    <span className="notif-time">Database in sync</span>
                  </div>
                </li>
                <li className="notification-item">
                  <div className="notif-dot emerald"></div>
                  <div className="notif-content">
                    <p className="notif-text">{issuedBooks.length} active loans currently in circulation</p>
                    <span className="notif-time">Circulation active</span>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Admin Profile Pill */}
        <div className="user-profile-pill">
          <div className="user-avatar-glow">
            <span className="avatar-initials">AD</span>
            <span className="user-online-dot"></span>
          </div>
          <div className="user-info desktop-only">
            <span className="user-name">Admin Librarian</span>
            <span className="user-role">Master Access</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
