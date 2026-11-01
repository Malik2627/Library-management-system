import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, CheckCircle2, AlertTriangle, BookOpen, User, Calendar } from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';
import { formatDate } from '../utils/formatters';

export function ReturnBookPage() {
  const { issuedBooks, returnBook } = useLibrary();
  const navigate = useNavigate();

  const [selectedTxId, setSelectedTxId] = useState(issuedBooks[0]?.id || '');
  const [returnDate, setReturnDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [successMessage, setSuccessMessage] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const selectedTransaction = issuedBooks.find((tx) => tx.id === selectedTxId);

  const handleReturn = (txId) => {
    const idToReturn = txId || selectedTxId;
    if (!idToReturn) return;

    const tx = issuedBooks.find((t) => t.id === idToReturn);
    if (!tx) return;

    returnBook({
      id: idToReturn,
      returnDate: returnDate || today
    });

    setSuccessMessage(`Successfully returned "${tx.bookTitle}". Available copies restored.`);
    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  return (
    <div className="page-container">
      <div className="page-breadcrumb-nav">
        <Link to="/transactions" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Circulation Logs</span>
        </Link>
      </div>

      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Return Book Check-In</h1>
          <p className="page-subtitle">
            Process returned titles, check for overdue penalties, and restore shelf inventory availability.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="form-success-banner glass-card" style={{ borderColor: 'rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Active loans table for quick return */}
      <div className="glass-card table-wrapper">
        <div className="card-header-flex" style={{ padding: '1.25rem 1.25rem 0.5rem' }}>
          <div>
            <h3 className="section-title">Active Borrowed Titles Awaiting Return ({issuedBooks.length})</h3>
            <p className="section-desc">Select any record to check in the volume</p>
          </div>
        </div>

        <table className="glass-table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Book Title</th>
              <th>Borrower Member</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Loan Status</th>
              <th className="text-right">Check-In</th>
            </tr>
          </thead>
          <tbody>
            {issuedBooks.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center empty-table-cell">
                  <div className="empty-state">
                    <CheckCircle2 size={38} className="text-emerald" style={{ marginBottom: '0.75rem' }} />
                    <p className="empty-title">All books are accounted for!</p>
                    <p className="empty-subtitle">There are currently no active loans out in circulation.</p>
                  </div>
                </td>
              </tr>
            ) : (
              issuedBooks.map((tx) => {
                const isOverdue = tx.dueDate && tx.dueDate < today;
                return (
                  <tr key={tx.id} className={isOverdue ? 'overdue-row' : ''}>
                    <td><span className="txn-id">{tx.id}</span></td>
                    <td><strong className="text-white">{tx.bookTitle}</strong></td>
                    <td><span className="table-member-name">{tx.studentName}</span></td>
                    <td>{formatDate(tx.issueDate)}</td>
                    <td>
                      <span className={isOverdue ? 'overdue-date-text' : ''}>
                        {formatDate(tx.dueDate)} {isOverdue && '(OVERDUE)'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill ${isOverdue ? 'rose' : 'purple'}`}>
                        {isOverdue ? 'Overdue' : 'Active Loan'}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="glass-btn action-sm glass-btn-primary"
                        onClick={() => handleReturn(tx.id)}
                        title="Confirm Return"
                      >
                        <RotateCcw size={14} />
                        <span>Return Book</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReturnBookPage;

