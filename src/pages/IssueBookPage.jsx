import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, BookUp2, Check, AlertCircle, BookOpen, User, Calendar } from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';

export function IssueBookPage() {
  const { books, students, issueBook } = useLibrary();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Books with available copies > 0
  const availableBooks = useMemo(() => {
    return books.filter((b) => (b.availableCopies ?? b.copies) > 0);
  }, [books]);

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [error, setError] = useState('');

  // Pre-select if URL has query param ?bookId=...
  useEffect(() => {
    const qBookId = searchParams.get('bookId');
    if (qBookId && books.some((b) => b.id === qBookId)) {
      setSelectedBookId(qBookId);
    } else if (availableBooks.length > 0 && !selectedBookId) {
      setSelectedBookId(availableBooks[0].id);
    }

    if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [searchParams, books, students, availableBooks]);

  const selectedBook = books.find((b) => b.id === selectedBookId);
  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!selectedStudentId) {
      setError('Please choose a registered student.');
      return;
    }
    if (!selectedBookId) {
      setError('Please choose an available book.');
      return;
    }
    if (!selectedBook || (selectedBook.availableCopies ?? selectedBook.copies) <= 0) {
      setError('Selected book has no available copies on shelf.');
      return;
    }
    if (!issueDate || !dueDate) {
      setError('Both issue date and due date are required.');
      return;
    }
    if (dueDate < issueDate) {
      setError('Due date cannot precede issue date.');
      return;
    }

    issueBook({
      bookId: selectedBookId,
      studentId: selectedStudentId,
      issueDate,
      dueDate
    });

    navigate('/transactions');
  };

  return (
    <div className="page-container page-narrow">
      <div className="page-breadcrumb-nav">
        <Link to="/transactions" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Transactions</span>
        </Link>
      </div>

      <div className="glass-card page-form-card">
        <div className="form-card-header">
          <div className="modal-icon-badge">
            <BookUp2 size={22} />
          </div>
          <div>
            <h1 className="page-title" style={{ fontSize: '1.6rem' }}>Issue Book to Student</h1>
            <p className="page-subtitle">Check out an available catalog volume to a registered member.</p>
          </div>
        </div>

        {availableBooks.length === 0 ? (
          <div className="confirm-warning-pill" style={{ marginTop: '1rem' }}>
            <span>No books currently have available copies in inventory. Return loans to restock shelf.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            {error && (
              <div className="form-error-banner" style={{ color: 'var(--color-rose)' }}>
                ⚠️ {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Select Student Borrower <span className="text-rose">*</span></label>
              <select
                className="glass-input"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                required
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.studentId || s.rollNumber} • {s.department})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Available Book <span className="text-rose">*</span></label>
              <select
                className="glass-input"
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                required
              >
                {availableBooks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} — ({b.availableCopies ?? b.copies} of {b.totalCopies ?? b.copies} available)
                  </option>
                ))}
              </select>
            </div>

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

            {/* Live Summary Preview Box */}
            {selectedBook && selectedStudent && (
              <div className="issue-preview-box glass-panel">
                <h4 className="preview-heading">Loan Summary Confirmation</h4>
                <div className="preview-row">
                  <span className="preview-label">Book:</span>
                  <span className="preview-val text-white">{selectedBook.title}</span>
                </div>
                <div className="preview-row">
                  <span className="preview-label">Author:</span>
                  <span className="preview-val">{selectedBook.author}</span>
                </div>
                <div className="preview-row">
                  <span className="preview-label">Borrower:</span>
                  <span className="preview-val text-cyan">{selectedStudent.name} ({selectedStudent.studentId || selectedStudent.rollNumber})</span>
                </div>
                <div className="preview-row">
                  <span className="preview-label">Due By:</span>
                  <span className="preview-val text-purple">{dueDate} (14 days standard period)</span>
                </div>
              </div>
            )}

            <div className="form-actions-bar">
              <button
                type="button"
                className="glass-btn"
                onClick={() => navigate('/transactions')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="glass-btn glass-btn-primary"
              >
                <Check size={16} />
                <span>Confirm & Issue Book</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default IssueBookPage;

