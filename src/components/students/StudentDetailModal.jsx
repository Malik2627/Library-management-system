import React from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Calendar, 
  BookMarked, 
  Clock, 
  Edit3, 
  Trash2, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export function StudentDetailModal({ 
  student, 
  issuedBooks = [], 
  onClose, 
  onEdit, 
  onDelete,
  onReturnBook 
}) {
  if (!student) return null;

  // Find all active loans for this student
  const studentLoans = issuedBooks.filter((tx) => tx.studentId === student.id);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-backdrop">
      <div className="modal-glass-container glass-card student-detail-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-title-box">
            <div className="student-modal-avatar">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="modal-title">{student.name}</h2>
              <span className="member-id-pill">{student.studentId || student.rollNumber}</span>
            </div>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Member Info Cards */}
        <div className="student-detail-info-grid">
          <div className="student-info-item">
            <span className="info-label"><Mail size={13} /> Email</span>
            <span className="info-val">{student.email}</span>
          </div>

          <div className="student-info-item">
            <span className="info-label"><Phone size={13} /> Phone</span>
            <span className="info-val">{student.phone || 'N/A'}</span>
          </div>

          <div className="student-info-item">
            <span className="info-label"><GraduationCap size={13} /> Department</span>
            <span className="info-val">{student.department}</span>
          </div>

          <div className="student-info-item">
            <span className="info-label"><Calendar size={13} /> Member Since</span>
            <span className="info-val">{formatDate(student.joinedDate)}</span>
          </div>
        </div>

        {/* Current Active Loans Section */}
        <div className="student-loans-section">
          <div className="loans-section-header">
            <h4 className="loans-title">Currently Borrowed Titles ({studentLoans.length})</h4>
          </div>

          {studentLoans.length === 0 ? (
            <div className="empty-loans-box glass-panel">
              <BookMarked size={28} className="empty-icon text-muted" />
              <p className="empty-text">No active borrowings. All books have been returned.</p>
            </div>
          ) : (
            <div className="student-loans-list">
              {studentLoans.map((loan) => {
                const isOverdue = loan.dueDate && loan.dueDate < today;
                return (
                  <div key={loan.id} className="student-loan-item glass-panel">
                    <div className="loan-item-details">
                      <strong className="loan-book-title">{loan.bookTitle}</strong>
                      <div className="loan-dates-row">
                        <span>Issued: {loan.issueDate}</span>
                        <span className={`due-date ${isOverdue ? 'overdue-text' : ''}`}>
                          Due: {loan.dueDate} {isOverdue && '(OVERDUE)'}
                        </span>
                      </div>
                    </div>
                    {onReturnBook && (
                      <button
                        type="button"
                        className="glass-btn action-sm"
                        onClick={() => onReturnBook(loan.id)}
                        title="Confirm Return"
                      >
                        <RotateCcw size={13} />
                        <span>Return</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="modal-actions detail-actions">
          <div className="actions-left">
            {onDelete && (
              <button 
                type="button" 
                className="glass-btn action-danger"
                onClick={() => {
                  onClose();
                  onDelete(student);
                }}
              >
                <Trash2 size={15} />
                <span>Remove Member</span>
              </button>
            )}
          </div>
          <div className="actions-right">
            {onEdit && (
              <button 
                type="button" 
                className="glass-btn"
                onClick={() => {
                  onClose();
                  onEdit(student);
                }}
              >
                <Edit3 size={15} />
                <span>Edit Profile</span>
              </button>
            )}
            <button 
              type="button" 
              className="glass-btn glass-btn-primary"
              onClick={onClose}
            >
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDetailModal;

