import React, { useState } from 'react';
import { User } from 'lucide-react';
import { DEFAULT_BOOK_COVER, FALLBACK_BOOK_COVER } from '../../utils/constants';

export function BookCoverCard({ book, onSelect }) {
  const [imgError, setImgError] = useState(false);

  // If first attempt fails, tries DEFAULT_BOOK_COVER; if that fails or url is empty, falls back to inline SVG
  const coverSrc = (!imgError && book.coverImage)
    ? book.coverImage
    : (imgError ? FALLBACK_BOOK_COVER : DEFAULT_BOOK_COVER);

  const isAvailable = (book.availableCopies ?? book.copies) > 0;

  return (
    <div
      className="book-cover-card glass-card"
      onClick={() => onSelect && onSelect(book)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(book);
        }
      }}
      aria-label={`View details for ${book.title}`}
    >
      <div className="book-cover-wrapper">
        <img
          src={coverSrc}
          alt={book.title}
          className="book-cover-image"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <div className="book-cover-gradient"></div>
        <div className="book-cover-badges">
          <span className="book-category-pill">{book.category || 'General'}</span>
          <span className={`book-status-pill ${isAvailable ? 'available' : 'borrowed'}`}>
            {isAvailable ? `${book.availableCopies ?? book.copies} Avail` : 'Borrowed'}
          </span>
        </div>
      </div>

      <div className="book-card-info">
        <h4 className="book-card-title" title={book.title}>
          {book.title}
        </h4>
        <div className="book-card-author-row">
          <User size={13} className="text-muted" />
          <span className="book-card-author">{book.author}</span>
        </div>
        <div className="book-card-meta-footer">
          <span className="book-card-year">{book.publishedYear || book.publicationYear || '2024'}</span>
          <span className="book-card-isbn">{book.isbn}</span>
        </div>
      </div>
    </div>
  );
}

export default BookCoverCard;
