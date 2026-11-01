import React from 'react';
import { BookOpen, Edit3, Trash2 } from 'lucide-react';

export function BookCard({ book, onEdit, onDelete }) {
  return (
    <div className="glass-card book-card">
      <div className="book-card-header">
        <div className="book-card-icon">
          <BookOpen size={20} />
        </div>
        <span className={`status-pill ${book.status === 'Available' ? 'emerald' : 'amber'}`}>
          {book.status}
        </span>
      </div>
      <h3 className="book-card-title">{book.title}</h3>
      <p className="book-card-author">by {book.author}</p>
      <div className="book-card-meta">
        <span className="category-badge">{book.category}</span>
        <span className="isbn-tag">{book.isbn}</span>
      </div>
      <div className="book-card-footer">
        <span className="copies-count">{book.availableCopies ?? book.copies} / {book.copies} available</span>
        <div className="card-actions">
          {onEdit && (
            <button type="button" className="action-icon-btn edit" onClick={() => onEdit(book)}>
              <Edit3 size={15} />
            </button>
          )}
          {onDelete && (
            <button type="button" className="action-icon-btn delete" onClick={() => onDelete(book.id)}>
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

