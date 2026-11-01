import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  User, 
  Hash, 
  Calendar, 
  Building2, 
  Layers, 
  Clock, 
  Edit3, 
  Trash2, 
  CheckCircle2,
  BookmarkCheck
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { DEFAULT_BOOK_COVER, FALLBACK_BOOK_COVER } from '../../utils/constants';

export function BookDetailModal({ 
  book, 
  onClose, 
  onEdit, 
  onDelete 
}) {
  const [imgError, setImgError] = useState(false);

  if (!book) return null;

  const coverSrc = (!imgError && book.coverImage) 
    ? book.coverImage 
    : (imgError ? FALLBACK_BOOK_COVER : DEFAULT_BOOK_COVER);

  const totalCopies = Number(book.totalCopies ?? book.copies) || 1;
  const availableCopies = Number(book.availableCopies ?? totalCopies);
  const isAvailable = availableCopies > 0;

  return (
    <div className="modal-backdrop">
      <div className="modal-glass-container glass-card book-detail-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-title-box">
            <span className="detail-book-id">{book.id}</span>
            <span className={`status-pill ${isAvailable ? 'emerald' : 'purple'}`}>
              {isAvailable ? `${availableCopies} Available on Shelf` : 'Fully Borrowed'}
            </span>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="book-detail-grid">
          {/* Left Column: Book Cover Image & Stock Bar */}
          <div className="detail-cover-pane">
            <div className="detail-cover-box">
              <img 
                src={coverSrc} 
                alt={book.title} 
                className="detail-cover-img"
                onError={() => setImgError(true)}
              />
            </div>
            
            <div className="detail-stock-card glass-panel">
              <div className="stock-card-row">
                <span className="stock-label">Total Inventory:</span>
                <span className="stock-val">{totalCopies} Copies</span>
              </div>
              <div className="stock-card-row">
                <span className="stock-label">Available Now:</span>
                <span className="stock-val text-cyan">{availableCopies} Copies</span>
              </div>
              <div className="stock-card-row">
                <span className="stock-label">In Circulation:</span>
                <span className="stock-val text-purple">{totalCopies - availableCopies} Copies</span>
              </div>
            </div>
          </div>

          {/* Right Column: Metadata & Full Description */}
          <div className="detail-info-pane">
            <h2 className="detail-title">{book.title}</h2>
            <div className="detail-author-row">
              <User size={16} className="text-cyan" />
              <span className="detail-author">{book.author}</span>
            </div>

            <div className="detail-meta-grid">
              <div className="detail-meta-item">
                <span className="meta-label"><Layers size={13} /> Category</span>
                <span className="meta-value">{book.category || 'General'}</span>
              </div>

              <div className="detail-meta-item">
                <span className="meta-label"><Building2 size={13} /> Publisher</span>
                <span className="meta-value">{book.publisher || 'Independent Publisher'}</span>
              </div>

              <div className="detail-meta-item">
                <span className="meta-label"><Calendar size={13} /> Published Year</span>
                <span className="meta-value">{book.publishedYear || book.publicationYear || 'N/A'}</span>
              </div>

              <div className="detail-meta-item">
                <span className="meta-label"><Hash size={13} /> ISBN</span>
                <span className="meta-value font-mono">{book.isbn}</span>
              </div>

              <div className="detail-meta-item full-width">
                <span className="meta-label"><Clock size={13} /> Registered Date</span>
                <span className="meta-value">{formatDate(book.createdAt)}</span>
              </div>
            </div>

            <div className="detail-description-section">
              <h4 className="description-heading">Synopsis / Description</h4>
              <p className="detail-description-text">
                {book.description || 'No description provided for this catalog volume.'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-actions detail-actions">
          <div className="actions-left">
            {onDelete && (
              <button 
                type="button" 
                className="glass-btn action-danger"
                onClick={() => {
                  onClose();
                  onDelete(book);
                }}
              >
                <Trash2 size={15} />
                <span>Delete Book</span>
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
                  onEdit(book);
                }}
              >
                <Edit3 size={15} />
                <span>Edit Details</span>
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

export default BookDetailModal;

