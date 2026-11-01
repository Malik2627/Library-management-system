import React from 'react';
import { Database, RefreshCw, Trash2 } from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';

export function SettingsPage() {
  const { books, students, issuedBooks, returnedBooks, clearData } = useLibrary();

  const handleReset = () => {
    if (window.confirm('Reset all catalog data back to default initial seed books & members?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleClear = () => {
    if (window.confirm('WARNING: This will clear all books, students, and circulation records. Proceed?')) {
      clearData();
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">System Settings</h1>
          <p className="page-subtitle">Configure library environment, persistence storage, and administration preferences.</p>
        </div>
      </div>

      <div className="dashboard-grid-2col">
        {/* Storage Engine Status */}
        <div className="glass-card">
          <div className="card-header-flex">
            <div>
              <h3 className="section-title">Persistence & Engine Details</h3>
              <p className="section-desc">Client-side state synchronization status</p>
            </div>
            <div className="status-badge-live">
              <span className="pulse-dot"></span>
              <span>Active</span>
            </div>
          </div>

          <div className="settings-stats-list">
            <div className="settings-stat-row">
              <span className="setting-label">Storage Engine:</span>
              <span className="setting-val text-white">Browser LocalStorage (HTML5)</span>
            </div>
            <div className="settings-stat-row">
              <span className="setting-label">Total Books Cataloged:</span>
              <span className="setting-val text-cyan">{books.length} records</span>
            </div>
            <div className="settings-stat-row">
              <span className="setting-label">Total Members Registered:</span>
              <span className="setting-val text-purple">{students.length} members</span>
            </div>
            <div className="settings-stat-row">
              <span className="setting-label">Active Loans (Issued):</span>
              <span className="setting-val text-white">{issuedBooks.length} active</span>
            </div>
            <div className="settings-stat-row">
              <span className="setting-label">Archived Returns:</span>
              <span className="setting-val text-emerald">{returnedBooks.length} records</span>
            </div>
          </div>
        </div>

        {/* Database Actions */}
        <div className="glass-card">
          <div className="card-header-flex">
            <div>
              <h3 className="section-title">Database Maintenance</h3>
              <p className="section-desc">Reset or clear persistent state</p>
            </div>
            <Database size={20} className="text-muted" />
          </div>

          <div className="database-actions-list">
            <div className="db-action-item">
              <div>
                <h4 className="db-action-title">Reset to Default Library Seed</h4>
                <p className="db-action-desc">Restore curated initial books, members, and transactions.</p>
              </div>
              <button 
                type="button" 
                className="glass-btn action-sm"
                onClick={handleReset}
              >
                <RefreshCw size={14} />
                <span>Reset Seed</span>
              </button>
            </div>

            <div className="db-action-item">
              <div>
                <h4 className="db-action-title text-rose">Clear All Library Data</h4>
                <p className="db-action-desc">Permanently remove all records from LocalStorage.</p>
              </div>
              <button 
                type="button" 
                className="glass-btn action-sm delete-btn"
                onClick={handleClear}
              >
                <Trash2 size={14} />
                <span>Clear All</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;

