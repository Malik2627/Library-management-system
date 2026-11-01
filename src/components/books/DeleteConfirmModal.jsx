import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

export function DeleteConfirmModal({ 
  isOpen, 
  book, 
  onClose, 
  onConfirm 
}) {
  if (!isOpen || !book) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-glass-container glass-card confirm-modal-box">
        <div className="confirm-icon-glow">
          <AlertTriangle size={32} />
        </div>

        <h3 className="confirm-title">Delete Book From Catalog?</h3>
        
        <p className="confirm-message">
          Are you sure you want to permanently remove <strong className="text-white">"{book.title}"</strong> by {book.author} (ISBN: {book.isbn})?
        </p>

        <div className="confirm-warning-pill">
          <span>This action updates inventory statistics and cannot be undone.</span>
        </div>

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
              onConfirm(book.id);
              onClose();
            }}
          >
            <Trash2 size={16} />
            <span>Permanently Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;

