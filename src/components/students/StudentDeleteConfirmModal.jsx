import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export function StudentDeleteConfirmModal({ 
  isOpen, 
  student, 
  issuedBooks = [], 
  onClose, 
  onConfirm 
}) {
  if (!isOpen || !student) return null;

  const activeLoans = issuedBooks.filter((tx) => tx.studentId === student.id);
  const hasActiveLoans = activeLoans.length > 0;

  return (
    <div className="modal-backdrop">
      <div className="modal-glass-container glass-card confirm-modal-box">
        <div className="confirm-icon-glow">
          <AlertTriangle size={32} />
        </div>

        <h3 className="confirm-title">Remove Member Record?</h3>
        
        <p className="confirm-message">
          Are you sure you want to remove <strong className="text-white">"{student.name}"</strong> (ID: {student.studentId || student.rollNumber}) from the member directory?
        </p>

        {hasActiveLoans && (
          <div className="confirm-warning-pill">
            <span>
              ⚠️ Notice: This student currently has <strong>{activeLoans.length}</strong> unreturned book(s). Please ensure books are accounted for.
            </span>
          </div>
        )}

        <div className="modal-actions confirm-actions">
          <button 
            type="button" 
            className="glass-btn" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="glass-btn glass-btn-danger"
            onClick={() => {
              onConfirm(student.id);
              onClose();
            }}
          >
            <Trash2 size={16} />
            <span>Confirm Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentDeleteConfirmModal;

