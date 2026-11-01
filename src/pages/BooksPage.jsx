import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Eye, 
  Filter, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  BookMarked,
  RotateCcw
} from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';
import { BookFormModal } from '../components/books/BookFormModal';
import { BookDetailModal } from '../components/books/BookDetailModal';
import { DeleteConfirmModal } from '../components/books/DeleteConfirmModal';
import { DEFAULT_BOOK_COVER, FALLBACK_BOOK_COVER } from '../utils/constants';

export function BooksPage() {
  const { 
    books, 
    categories, 
    addBook, 
    updateBook, 
    deleteBook, 
    searchQuery, 
    setSearchQuery,
    isLoaded 
  } = useLibrary();

  const [searchParams, setSearchParams] = useSearchParams();

  // Local component states using useState
  const [localSearch, setLocalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All'); // 'All' | 'Available' | 'Borrowed'
  const [sortBy, setSortBy] = useState('title-asc'); // 'title-asc' | 'title-desc' | 'year-desc' | 'year-asc' | 'copies-desc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [viewingBook, setViewingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);

  // Sync global search with local search if global search was typed in Navbar
  useEffect(() => {
    if (searchQuery && searchQuery !== localSearch) {
      setLocalSearch(searchQuery);
    }
  }, [searchQuery]);

  // Handle URL query action (e.g. /books?action=add)
  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      openAddModal();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  // Filter & Search Logic (Features 5, 6, 7, 8, 9, 10)
  const filteredAndSortedBooks = useMemo(() => {
    const query = localSearch.trim().toLowerCase();

    // 1. Filter by Search Query (Title, Author, or ISBN)
    let result = books.filter((book) => {
      const matchTitle = (book.title || '').toLowerCase().includes(query);
      const matchAuthor = (book.author || '').toLowerCase().includes(query);
      const matchIsbn = (book.isbn || '').toLowerCase().includes(query);
      const matchesSearch = !query || matchTitle || matchAuthor || matchIsbn;

      // 2. Filter by Category
      const matchesCategory = selectedCategory === 'All' || (book.category || 'General') === selectedCategory;

      // 3. Filter by Availability
      const isAvailable = (book.availableCopies ?? book.copies) > 0;
      let matchesAvailability = true;
      if (availabilityFilter === 'Available') matchesAvailability = isAvailable;
      if (availabilityFilter === 'Borrowed') matchesAvailability = !isAvailable;

      return matchesSearch && matchesCategory && matchesAvailability;
    });

    // 4. Sort Books (Features 9 & 10)
    result.sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'year-desc': {
          const yA = parseInt(a.publishedYear || a.publicationYear || 0, 10);
          const yB = parseInt(b.publishedYear || b.publicationYear || 0, 10);
          return yB - yA;
        }
        case 'year-asc': {
          const yA = parseInt(a.publishedYear || a.publicationYear || 0, 10);
          const yB = parseInt(b.publishedYear || b.publicationYear || 0, 10);
          return yA - yB;
        }
        case 'copies-desc': {
          const cA = Number(a.totalCopies ?? a.copies) || 1;
          const cB = Number(b.totalCopies ?? b.copies) || 1;
          return cB - cA;
        }
        default:
          return 0;
      }
    });

    return result;
  }, [books, localSearch, selectedCategory, availabilityFilter, sortBy]);

  // Action Handlers
  const openAddModal = () => {
    setEditingBook(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (editingBook) {
      updateBook({
        ...editingBook,
        ...formData
      });
    } else {
      addBook(formData);
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteConfirm = (bookId) => {
    deleteBook(bookId);
    setDeletingBook(null);
  };

  const allCategories = ['All', ...categories];

  return (
    <div className="page-container books-management-page">
      {/* Page Header */}
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Book Management & Catalog</h1>
          <p className="page-subtitle">
            Comprehensive inventory control, metadata curation, and circulation tracking for all titles.
          </p>
        </div>
        <button 
          type="button" 
          className="glass-btn glass-btn-primary"
          onClick={openAddModal}
        >
          <Plus size={18} />
          <span>Add New Book</span>
        </button>
      </div>

      {/* Search, Filter, Sort & View Control Bar */}
      <div className="books-control-bar glass-panel">
        {/* Search input (Title, Author, ISBN) */}
        <div className="search-control-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-control-input"
            placeholder="Search by title, author name, or ISBN..."
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setSearchQuery(e.target.value);
            }}
          />
          {localSearch && (
            <button 
              type="button" 
              className="clear-search-btn"
              onClick={() => {
                setLocalSearch('');
                setSearchQuery('');
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter & Sort Controls */}
        <div className="filter-sort-group">
          {/* Category Dropdown */}
          <div className="control-select-box">
            <Filter size={15} className="control-icon" />
            <select
              className="glass-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>Category: {cat}</option>
              ))}
            </select>
          </div>

          {/* Availability Dropdown */}
          <div className="control-select-box">
            <select
              className="glass-select"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available on Shelf</option>
              <option value="Borrowed">Currently Borrowed</option>
            </select>
          </div>

          {/* Sort By Dropdown (Features 9 & 10) */}
          <div className="control-select-box">
            <ArrowUpDown size={15} className="control-icon" />
            <select
              className="glass-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="title-asc">Sort: Title (A - Z)</option>
              <option value="title-desc">Sort: Title (Z - A)</option>
              <option value="year-desc">Sort: Year (Newest First)</option>
              <option value="year-asc">Sort: Year (Oldest First)</option>
              <option value="copies-desc">Sort: Copies (Highest)</option>
            </select>
          </div>

          {/* View Mode Switcher (Grid vs Table) */}
          <div className="view-mode-switch glass-panel">
            <button
              type="button"
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid Card View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="category-pill-chips">
        {allCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Count & Quick Reset */}
      <div className="results-status-row">
        <span className="results-text">
          Showing <strong>{filteredAndSortedBooks.length}</strong> of {books.length} cataloged volumes
        </span>
        {(localSearch || selectedCategory !== 'All' || availabilityFilter !== 'All') && (
          <button 
            type="button" 
            className="reset-filters-btn"
            onClick={() => {
              setLocalSearch('');
              setSearchQuery('');
              setSelectedCategory('All');
              setAvailabilityFilter('All');
            }}
          >
            <RotateCcw size={13} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Main Content Area: Grid or Table */}
      {filteredAndSortedBooks.length === 0 ? (
        <div className="glass-card empty-catalog-box">
          <BookOpen size={48} className="empty-catalog-icon" />
          <h3 className="empty-title">No matching books found</h3>
          <p className="empty-subtitle">
            {localSearch 
              ? `No catalog results matching "${localSearch}". Try searching with a different title, author, or ISBN.`
              : 'The catalog is currently empty. Click "Add New Book" to register the first volume.'}
          </p>
          <div className="empty-actions">
            {localSearch && (
              <button 
                type="button" 
                className="glass-btn"
                onClick={() => {
                  setLocalSearch('');
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                Clear Search
              </button>
            )}
            <button 
              type="button" 
              className="glass-btn glass-btn-primary"
              onClick={openAddModal}
            >
              <Plus size={16} />
              <span>Add Book</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* ========================================================
            CARD GRID VIEW
            ======================================================== */
        <div className="books-catalog-grid">
          {filteredAndSortedBooks.map((book) => {
            const totalCopies = Number(book.totalCopies ?? book.copies) || 1;
            const availableCopies = Number(book.availableCopies ?? totalCopies);
            const isAvailable = availableCopies > 0;

            return (
              <div key={book.id} className="book-item-card glass-card">
                <div className="book-card-top-row">
                  <span className="book-id-badge">{book.id}</span>
                  <span className={`status-pill ${isAvailable ? 'emerald' : 'purple'}`}>
                    {isAvailable ? `${availableCopies} Available` : 'Borrowed'}
                  </span>
                </div>

                <div className="book-card-main-content">
                  <div className="book-card-cover-container" onClick={() => setViewingBook(book)}>
                    <img 
                      src={book.coverImage || DEFAULT_BOOK_COVER} 
                      alt={book.title} 
                      className="book-thumbnail"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_BOOK_COVER;
                      }}
                    />
                  </div>

                  <div className="book-card-text-details">
                    <span className="book-card-category-tag">{book.category || 'General'}</span>
                    <h3 className="book-catalog-title" onClick={() => setViewingBook(book)} title={book.title}>
                      {book.title}
                    </h3>
                    <p className="book-catalog-author">by {book.author}</p>
                    
                    <div className="book-catalog-mini-meta">
                      <span>Pub: {book.publisher || 'Independent'}</span>
                      <span>Year: {book.publishedYear || book.publicationYear || '2024'}</span>
                    </div>

                    <div className="book-catalog-isbn-row">
                      <span className="isbn-tag">{book.isbn}</span>
                      <span className="copies-pill">{availableCopies} / {totalCopies} Copies</span>
                    </div>
                  </div>
                </div>

                <div className="book-card-bottom-actions">
                  <button 
                    type="button" 
                    className="glass-btn action-sm"
                    onClick={() => setViewingBook(book)}
                    title="View Book Details"
                  >
                    <Eye size={14} />
                    <span>Details</span>
                  </button>

                  <button 
                    type="button" 
                    className="glass-btn action-sm"
                    onClick={() => openEditModal(book)}
                    title="Edit Book Details"
                  >
                    <Edit3 size={14} />
                    <span>Edit</span>
                  </button>

                  <button 
                    type="button" 
                    className="glass-btn action-sm delete-btn"
                    onClick={() => setDeletingBook(book)}
                    title="Delete Book"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ========================================================
            SCANNABLE TABLE VIEW
            ======================================================== */
        <div className="glass-card table-wrapper">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Book Title & Author</th>
                <th>ISBN</th>
                <th>Category</th>
                <th>Publisher</th>
                <th>Year</th>
                <th>Inventory</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedBooks.map((book) => {
                const totalCopies = Number(book.totalCopies ?? book.copies) || 1;
                const availableCopies = Number(book.availableCopies ?? totalCopies);
                const isAvailable = availableCopies > 0;

                return (
                  <tr key={book.id}>
                    <td>
                      <div className="table-book-info" onClick={() => setViewingBook(book)} style={{ cursor: 'pointer' }}>
                        <img 
                          src={book.coverImage || DEFAULT_BOOK_COVER} 
                          alt="" 
                          className="table-book-thumb" 
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_BOOK_COVER;
                          }}
                        />
                        <div>
                          <div className="table-book-title">{book.title}</div>
                          <div className="table-book-author">{book.author}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="isbn-tag">{book.isbn}</span></td>
                    <td><span className="category-badge">{book.category || 'General'}</span></td>
                    <td><span className="text-secondary">{book.publisher || 'Independent'}</span></td>
                    <td>{book.publishedYear || book.publicationYear || '2024'}</td>
                    <td>
                      <strong className="text-white">{availableCopies}</strong>
                      <span className="text-muted"> / {totalCopies}</span>
                    </td>
                    <td>
                      <span className={`status-pill ${isAvailable ? 'emerald' : 'purple'}`}>
                        {isAvailable ? 'Available' : 'Borrowed'}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="table-actions">
                        <button 
                          type="button" 
                          className="action-icon-btn view"
                          onClick={() => setViewingBook(book)}
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button 
                          type="button" 
                          className="action-icon-btn edit"
                          onClick={() => openEditModal(book)}
                          title="Edit Book"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          type="button" 
                          className="action-icon-btn delete"
                          onClick={() => setDeletingBook(book)}
                          title="Delete Book"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================
          MODALS
          ======================================================== */}
      {/* 1. Add / Edit Book Controlled Form Modal */}
      <BookFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        editingBook={editingBook}
        categories={categories}
      />

      {/* 2. Book Detail Modal */}
      <BookDetailModal
        book={viewingBook}
        onClose={() => setViewingBook(null)}
        onEdit={(book) => {
          setViewingBook(null);
          openEditModal(book);
        }}
        onDelete={(book) => {
          setViewingBook(null);
          setDeletingBook(book);
        }}
      />

      {/* 3. Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingBook)}
        book={deletingBook}
        onClose={() => setDeletingBook(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default BooksPage;
