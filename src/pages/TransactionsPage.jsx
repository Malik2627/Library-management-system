import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ArrowLeftRight, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  RotateCcw, 
  Calendar, 
  User, 
  BookOpen, 
  X, 
  Check, 
  Filter
} from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';
import { formatDate } from '../utils/formatters';

export function TransactionsPage() {
  const { 
    books, 
    students, 
    issuedBooks, 
    returnedBooks, 
    issueBook, 
    returnBook 
  } = useLibrary();

  const [searchParams, setSearchParams] = useSearchParams();

  // Local state
  const [activeTab, setActiveTab] = useState('issued'); // 'issued' | 'returned' | 'overdue'
  const [searchQuery, setSearchQuery] = useState('');
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [returningTx, setReturningTx] = useState(null);

  // Issue Form State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [issueError, setIssueError] = useState('');

  // Return Form State
  const [returnDate, setReturnDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Today reference for overdue calculations
  const today = new Date().toISOString().split('T')[0];

  // Sync tab with URL query parameter (?tab=issue or ?tab=return)
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'return') {
      setActiveTab('returned');
    } else if (tab === 'issue') {
      setActiveTab('issued');
    } else if (tab === 'overdue') {
      setActiveTab('overdue');
    }
  }, [searchParams]);

  // Only books with availableCopies > 0 can be issued
  const availableBooks = useMemo(() => {
    return books.filter((b) => (b.availableCopies ?? b.copies) > 0);
  }, [books]);

  // Overdue transactions
  const overdueTransactions = useMemo(() => {
    return issuedBooks.filter((tx) => tx.dueDate && tx.dueDate < today);
  }, [issuedBooks, today]);

  // Open Issue Modal with preselected valid defaults
  const handleOpenIssueModal = () => {
    setSelectedStudentId(students[0]?.id || '');
    setSelectedBookId(availableBooks[0]?.id || '');
    setIssueDate(new Date().toISOString().split('T')[0]);
    const d = new Date();
    d.setDate(d.getDate() + 14);
    setDueDate(d.toISOString().split('T')[0]);
    setIssueError('');
    setIsIssueModalOpen(true);
  };

  // Submit Issue Book Transaction
  const handleConfirmIssue = (e) => {
    e.preventDefault();

    // 1. Validate student
    if (!selectedStudentId) {
      setIssueError('Please select a valid registered student member.');
      return;
    }
    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) {
      setIssueError('Selected student could not be found.');
      return;
    }

    // 2. Validate book & availability
    if (!selectedBookId) {
      setIssueError('Please select a book title.');
      return;
    }
    const book = books.find((b) => b.id === selectedBookId);
    if (!book) {
      setIssueError('Selected book not found in catalog.');
      return;
    }
    if ((book.availableCopies ?? book.copies) <= 0) {
      setIssueError(`Cannot issue "${book.title}". All copies are currently in loan status.`);
      return;
    }

    // 3. Validate dates
    if (!issueDate || !dueDate) {
      setIssueError('Please provide both Issue Date and Due Date.');
      return;
    }
    if (dueDate < issueDate) {
      setIssueError('Due Date cannot be earlier than Issue Date.');
      return;
    }

    // 4. Dispatch ISSUE_BOOK
    issueBook({
      bookId: selectedBookId,
      studentId: selectedStudentId,
      issueDate,
      dueDate
    });

    setIsIssueModalOpen(false);
  };

  // Submit Return Book
  const handleConfirmReturn = () => {
    if (!returningTx) return;

    // Check that transaction still exists in active issuedBooks
    const isStillActive = issuedBooks.some((tx) => tx.id === returningTx.id);
    if (!isStillActive) {
      alert('This book has already been returned or transaction is no longer active.');
      setReturningTx(null);
      return;
    }

    returnBook({
      id: returningTx.id,
      returnDate: returnDate || today
    });

    setReturningTx(null);
  };

  // Active dataset according to selected tab and search
  const displayedList = useMemo(() => {
    let list = [];
    if (activeTab === 'issued') list = issuedBooks;
    else if (activeTab === 'returned') list = returnedBooks;
    else if (activeTab === 'overdue') list = overdueTransactions;

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter((tx) => 
      (tx.id || '').toLowerCase().includes(q) ||
      (tx.bookTitle || '').toLowerCase().includes(q) ||
      (tx.studentName || '').toLowerCase().includes(q) ||
      (tx.issueDate || '').includes(q)
    );
  }, [activeTab, issuedBooks, returnedBooks, overdueTransactions, searchQuery]);

  return (
    <div className="page-container transactions-page">
      {/* Header */}
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Circulation & Transactions</h1>
          <p className="page-subtitle">
            Issue books, record return check-ins, identify overdue loans, and maintain full circulation history.
          </p>
        </div>
        <button 
          type="button" 
          className="glass-btn glass-btn-primary"
          onClick={handleOpenIssueModal}
          disabled={availableBooks.length === 0}
          title={availableBooks.length === 0 ? "No available books in catalog" : "Issue Book"}
        >
          <Plus size={18} />
          <span>Issue Book</span>
        </button>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="books-control-bar glass-panel">
        <div className="category-chips">
          <button
            type="button"
            className={`category-chip ${activeTab === 'issued' ? 'active' : ''}`}
            onClick={() => setActiveTab('issued')}
          >
            Active Borrows ({issuedBooks.length})
          </button>

          <button
            type="button"
            className={`category-chip ${activeTab === 'overdue' ? 'active-rose' : ''}`}
            onClick={() => setActiveTab('overdue')}
          >
            <AlertTriangle size={13} style={{ marginRight: 4 }} />
            Overdue Titles ({overdueTransactions.length})
          </button>

          <button
            type="button"
            className={`category-chip ${activeTab === 'returned' ? 'active' : ''}`}
            onClick={() => setActiveTab('returned')}
          >
            Returned Archives ({returnedBooks.length})
          </button>
        </div>

        <div className="search-control-wrapper" style={{ maxWidth: 360 }}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-control-input"
            placeholder="Search transactions by ID, title, or borrower..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button" 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="glass-card stat-accent-blue" style={{ padding: '1.25rem' }}>
          <span className="stat-title">Active Circulations</span>
          <div className="stat-value text-cyan">{issuedBooks.length}</div>
          <span className="stat-subtext">Books currently in student hands</span>
        </div>

        <div className="glass-card stat-accent-purple" style={{ padding: '1.25rem' }}>
          <span className="stat-title">Overdue Alerts</span>
          <div className="stat-value text-rose">{overdueTransactions.length}</div>
          <span className="stat-subtext">Loans exceeding the 14-day limit</span>
        </div>

        <div className="glass-card stat-accent-emerald" style={{ padding: '1.25rem' }}>
          <span className="stat-title">Completed Returns</span>
          <div className="stat-value text-emerald">{returnedBooks.length}</div>
          <span className="stat-subtext">Archived transactions safely returned</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card table-wrapper">
        <table className="glass-table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Book Title</th>
              <th>Borrower Member</th>
              <th>Issue Date</th>
              <th>{activeTab === 'returned' ? 'Returned On' : 'Due Date'}</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedList.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center empty-table-cell">
                  <div className="empty-state">
                    <ArrowLeftRight size={38} className="empty-icon" />
                    <p className="empty-title">
                      {activeTab === 'overdue' 
                        ? 'No overdue books! All loans are on schedule.' 
                        : activeTab === 'issued' 
                        ? 'No active book borrowings recorded.' 
                        : 'No returned records found in the archive.'}
                    </p>
                    <p className="empty-subtitle">
                      {activeTab === 'issued' && availableBooks.length > 0 && (
                        <button
                          type="button"
                          className="glass-btn glass-btn-primary"
                          onClick={handleOpenIssueModal}
                          style={{ marginTop: '0.75rem' }}
                        >
                          <Plus size={15} />
                          <span>Issue a Book Now</span>
                        </button>
                      )}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              displayedList.map((tx) => {
                const isOverdue = tx.status === 'Issued' && tx.dueDate && tx.dueDate < today;

                return (
                  <tr key={tx.id} className={isOverdue ? 'overdue-row' : ''}>
                    <td>
                      <span className="txn-id">{tx.id}</span>
                    </td>
                    <td>
                      <strong className="text-white table-book-title-cell" title={tx.bookTitle}>
                        {tx.bookTitle}
                      </strong>
                      <span className="text-muted" style={{ fontSize: '0.72rem' }}>Book ID: {tx.bookId}</span>
                    </td>
                    <td>
                      <span className="table-member-name">{tx.studentName}</span>
                      <span className="text-muted" style={{ fontSize: '0.72rem', display: 'block' }}>ID: {tx.studentId}</span>
                    </td>
                    <td>{formatDate(tx.issueDate)}</td>
                    <td>
                      {tx.status === 'Returned' ? (
                        <span className="text-emerald">{formatDate(tx.returnDate)}</span>
                      ) : (
                        <span className={isOverdue ? 'overdue-date-text' : ''}>
                          {formatDate(tx.dueDate)} {isOverdue && '⚠️ (Overdue)'}
                        </span>
                      )}
                    </td>
                    <td>
                      {isOverdue ? (
                        <span className="status-pill rose">Overdue</span>
                      ) : tx.status === 'Returned' ? (
                        <span className="status-pill emerald">Returned</span>
                      ) : (
                        <span className="status-pill purple">Active Loan</span>
                      )}
                    </td>
                    <td className="text-right">
                      {tx.status === 'Issued' ? (
                        <button
                          type="button"
                          className="glass-btn action-sm"
                          onClick={() => setReturningTx(tx)}
                          title="Record Book Return"
                        >
                          <RotateCcw size={14} />
                          <span>Return Book</span>
                        </button>
                      ) : (
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>Closed</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================
          MODAL 1: ISSUE BOOK SYSTEM
          ======================================================== */}
      {isIssueModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-glass-container glass-card">
            <div className="modal-header">
              <div className="modal-header-title-box">
                <div className="modal-icon-badge">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h2 className="modal-title">Issue Book to Student</h2>
                  <p className="modal-subtitle">
                    Select an available volume and student member to record an active loan.
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setIsIssueModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmIssue} className="modal-form">
              {issueError && (
                <div className="form-error-banner" style={{ color: 'var(--color-rose)', fontSize: '0.85rem' }}>
                  ⚠️ {issueError}
                </div>
              )}

              {/* Select Student */}
              <div className="form-group">
                <label className="form-label">
                  1. Select Student Member <span className="text-rose">*</span>
                </label>
                <select
                  className="glass-input"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  required
                >
                  <option value="" disabled>-- Choose a registered student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.studentId || s.rollNumber} • {s.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Available Book */}
              <div className="form-group">
                <label className="form-label">
                  2. Select Available Book <span className="text-rose">*</span>
                </label>
                <select
                  className="glass-input"
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  required
                >
                  <option value="" disabled>-- Choose an available book title --</option>
                  {availableBooks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} — ({b.availableCopies ?? b.copies} of {b.totalCopies ?? b.copies} available)
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Issue Date</label>
                  <input
                    type="date"
                    className="glass-input"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Due Return Date</label>
                  <input
                    type="date"
                    className="glass-input"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="glass-btn" 
                  onClick={() => setIsIssueModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="glass-btn glass-btn-primary">
                  <Check size={16} />
                  <span>Confirm Issue</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: RETURN BOOK SYSTEM
          ======================================================== */}
      {returningTx && (
        <div className="modal-backdrop">
          <div className="modal-glass-container glass-card confirm-modal-box">
            <div className="confirm-icon-glow" style={{ color: 'var(--color-electric-blue)', borderColor: 'rgba(14, 165, 233, 0.4)', background: 'rgba(14, 165, 233, 0.15)' }}>
              <RotateCcw size={32} />
            </div>

            <h3 className="confirm-title">Confirm Book Return</h3>

            <p className="confirm-message">
              Receive <strong className="text-white">"{returningTx.bookTitle}"</strong> back into shelf inventory from <strong className="text-white">{returningTx.studentName}</strong>.
            </p>

            <div className="form-group" style={{ width: '100%', textAlign: 'left', marginBottom: '1.25rem' }}>
              <label className="form-label">Return Date Received</label>
              <input
                type="date"
                className="glass-input"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>

            <div className="confirm-warning-pill" style={{ color: 'var(--color-emerald)', background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
              <span>Available shelf copies will automatically increment by 1.</span>
            </div>

            <div className="modal-actions confirm-actions">
              <button 
                type="button" 
                className="glass-btn" 
                onClick={() => setReturningTx(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="glass-btn glass-btn-primary"
                onClick={handleConfirmReturn}
              >
                <CheckCircle2 size={16} />
                <span>Confirm Check-In</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionsPage;
