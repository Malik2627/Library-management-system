import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  User, 
  Hash, 
  Calendar, 
  Building2, 
  Layers, 
  Clock, 
  Edit3, 
  Trash2, 
  BookUp2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';
import { formatDate } from '../utils/formatters';
import { DeleteConfirmModal } from '../components/books/DeleteConfirmModal';
import { DEFAULT_BOOK_COVER, FALLBACK_BOOK_COVER } from '../utils/constants';

export function BookDetailPage() {
  const { id } = useParams();
  const { books, deleteBook } = useLibrary();
  const navigate = useNavigate();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Look up book dynamically from state using param id
  const book = books.find((b) => b.id === id);

  if (!book) {
    return (
      <div className="page-container page-narrow">
        <div className="glass-card empty-catalog-box">
          <AlertCircle size={48} className="text-rose" style={{ marginBottom: '1rem' }} />
          <h2 className="empty-title">Book Not Found</h2>
          <p className="empty-subtitle">
            No catalog entry found matching identifier: <code className="text-white">{id}</code>.
          </p>
          <Link to="/books" className="glass-btn glass-btn-primary" style={{ marginTop: '1.25rem' }}>
            <ArrowLeft size={16} />
            <span>Return to All Books</span>
          </Link>
        </div>
      </div>
    );
  }

  const coverSrc = (!imgError && book.coverImage) 
    ? book.coverImage 
    : (imgError ? FALLBACK_BOOK_COVER : DEFAULT_BOOK_COVER);

  const totalCopies = Number(book.totalCopies ?? book.copies) || 1;
  const availableCopies = Number(book.availableCopies ?? totalCopies);
  const isAvailable = availableCopies > 0;

  const handleDeleteConfirm = (bookId) => {
    deleteBook(bookId);
    navigate('/books');
  };

  return (
    <div className="page-container">
      {/* Breadcrumb back navigation */}
      <div className="page-breadcrumb-nav">
        <Link to="/books" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to All Books</span>
        </Link>
      </div>

      <div className="glass-card book-detail-page-card">
        <div className="book-detail-page-layout">
          {/* Cover & Quick Stats Column */}
          <div className="detail-page-left">
            <div className="detail-page-cover-wrapper">
              <img 
                src={coverSrc} 
                alt={book.title} 
                className="detail-page-cover-img"
                onError={() => setImgError(true)}
              />
              <span className={`status-pill cover-status-pill ${isAvailable ? 'emerald' : 'purple'}`}>
                {isAvailable ? `${availableCopies} Available on Shelf` : 'Borrowed'}
              </span>
            </div>

            <div className="detail-stock-card glass-panel">
              <div className="stock-card-row">
                <span className="stock-label">Total Volume Count:</span>
                <span className="stock-val">{totalCopies} Copies</span>
              </div>
              <div className="stock-card-row">
                <span className="stock-label">Available on Shelf:</span>
                <span className="stock-val text-cyan">{availableCopies} Copies</span>
              </div>
              <div className="stock-card-row">
                <span className="stock-label">Currently Issued:</span>
                <span className="stock-val text-purple">{totalCopies - availableCopies} Copies</span>
              </div>
            </div>

            {/* Quick Circulation CTA */}
            {isAvailable ? (
              <Link 
                to={`/issue?bookId=${book.id}`}
                className="glass-btn glass-btn-primary full-width-btn"
              >
                <BookUp2 size={16} />
                <span>Issue This Book</span>
              </Link>
            ) : (
              <Link 
                to="/return" 
                className="glass-btn full-width-btn"
              >
                <span>View Loan / Return</span>
              </Link>
            )}
          </div>

          {/* Details & Metadata Column */}
          <div className="detail-page-right">
            <div className="detail-page-header">
              <div className="detail-page-tags">
                <span className="detail-book-id">{book.id}</span>
                <span className="category-badge">{book.category || 'General'}</span>
              </div>

              <div className="detail-page-action-buttons">
                <Link 
                  to={`/books/edit/${book.id}`} 
                  className="glass-btn action-sm"
                  title="Edit Book Record"
                >
                  <Edit3 size={15} />
                  <span>Edit</span>
                </Link>

                <button 
                  type="button" 
                  className="glass-btn action-sm action-danger"
                  onClick={() => setIsDeleteOpen(true)}
                  title="Delete Book"
                >
                  <Trash2 size={15} />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            <h1 className="detail-page-title">{book.title}</h1>
            
            <div className="detail-page-author-row">
              <User size={18} className="text-cyan" />
              <span className="detail-page-author">{book.author}</span>
            </div>

            <div className="detail-page-meta-grid">
              <div className="meta-box">
                <span className="meta-box-label"><Building2 size={14} /> Publisher</span>
                <span className="meta-box-value">{book.publisher || 'Independent Publisher'}</span>
              </div>

              <div className="meta-box">
                <span className="meta-box-label"><Calendar size={14} /> Publication Year</span>
                <span className="meta-box-value">{book.publishedYear || book.publicationYear || 'N/A'}</span>
              </div>

              <div className="meta-box">
                <span className="meta-box-label"><Hash size={14} /> ISBN Number</span>
                <span className="meta-box-value font-mono">{book.isbn}</span>
              </div>

              <div className="meta-box">
                <span className="meta-box-label"><Clock size={14} /> Registered In System</span>
                <span className="meta-box-value">{formatDate(book.createdAt)}</span>
              </div>
            </div>

            <div className="detail-page-synopsis-section">
              <h3 className="synopsis-title">Synopsis & Abstract</h3>
              <p className="synopsis-content">
                {book.description || 'No description provided for this volume.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        book={book}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default BookDetailPage;

