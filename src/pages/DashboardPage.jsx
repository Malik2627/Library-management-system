import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowUpRight, 
  BookUp2, 
  Plus, 
  UserPlus, 
  X,
  Check
} from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';
import { Link, useNavigate } from 'react-router-dom';
import { StatsCard } from '../components/dashboard/StatsCard';
import { BookCoverCard } from '../components/dashboard/BookCoverCard';
import { CategoryDistributionChart } from '../components/dashboard/CategoryDistributionChart';
import { RecentTransactionsTable } from '../components/dashboard/RecentTransactionsTable';
import { QuickActions } from '../components/dashboard/QuickActions';

export function DashboardPage() {
  const { 
    books, 
    students, 
    issuedBooks, 
    returnedBooks, 
    categories, 
    statistics, 
    issueBook, 
    returnBook,
    addBook
  } = useLibrary();

  const navigate = useNavigate();

  // Local state for modals triggered from dashboard
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [modalError, setModalError] = useState('');

  // Form state for Quick Add Book
  const [newBookData, setNewBookData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: categories[0] || 'Computer Science',
    publicationYear: new Date().getFullYear().toString(),
    copies: 3,
    coverImage: ''
  });

  const availableBooks = books.filter((b) => (b.availableCopies || 0) > 0);

  // Combine and sort recent transactions (both issued and returned)
  const combinedTransactions = [...issuedBooks, ...returnedBooks].sort((a, b) => {
    return new Date(b.issueDate || 0) - new Date(a.issueDate || 0);
  });

  const handleOpenIssueModal = () => {
    setSelectedBookId(availableBooks[0]?.id || '');
    setSelectedStudentId(students[0]?.id || '');
    setModalError('');
    setIsIssueModalOpen(true);
  };

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!selectedBookId) {
      setModalError('Please select an available book.');
      return;
    }
    if (!selectedStudentId) {
      setModalError('Please select a student.');
      return;
    }
    issueBook({
      bookId: selectedBookId,
      studentId: selectedStudentId,
      dueDate
    });
    setIsIssueModalOpen(false);
  };

  const handleQuickAddBookSubmit = (e) => {
    e.preventDefault();
    if (!newBookData.title.trim() || !newBookData.author.trim() || !newBookData.isbn.trim()) {
      setModalError('Title, Author, and ISBN are required.');
      return;
    }
    addBook(newBookData);
    setIsAddBookModalOpen(false);
    setNewBookData({
      title: '',
      author: '',
      isbn: '',
      category: categories[0] || 'Computer Science',
      publicationYear: new Date().getFullYear().toString(),
      copies: 3,
      coverImage: ''
    });
  };

  const handleQuickReturn = (txId) => {
    if (window.confirm('Confirm returning this book to shelf?')) {
      returnBook(txId);
    }
  };

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  return (
    <div className="page-container dashboard-page">
      {/* ========================================================
          1. WELCOME SECTION
          ======================================================== */}
      <section className="hero-glass-banner">
        <div className="hero-content">
          <div className="hero-pill">
            <Sparkles size={14} />
            <span>LIBRARYHUB Core System • {todayFormatted}</span>
          </div>
          <h1 className="hero-title">
            Welcome to LIBRARY<span className="text-gradient-purple">HUB</span>
          </h1>
          <p className="hero-subtitle">
            Next-generation library circulation, real-time inventory management, and student borrowing analytics wrapped in a dark liquid glass dashboard.
          </p>
        </div>

        <div className="hero-actions">
          <button 
            type="button" 
            className="glass-btn glass-btn-primary"
            onClick={handleOpenIssueModal}
            disabled={availableBooks.length === 0}
          >
            <BookUp2 size={16} />
            <span>Issue Book</span>
          </button>
          <button 
            type="button" 
            className="glass-btn"
            onClick={() => setIsAddBookModalOpen(true)}
          >
            <Plus size={16} />
            <span>Add Book</span>
          </button>
        </div>
      </section>

      {/* ========================================================
          9. QUICK ACTIONS BAR
          ======================================================== */}
      <QuickActions 
        onOpenIssueModal={handleOpenIssueModal}
        onOpenAddBookModal={() => setIsAddBookModalOpen(true)}
        onOpenAddStudentModal={() => navigate('/students')}
      />

      {/* ========================================================
          2-5. METRICS STATS CARDS
          ======================================================== */}
      <section className="stats-grid">
        {/* 2. Total Books */}
        <StatsCard
          title="Total Books Cataloged"
          value={statistics.totalBooks}
          subtext={`${statistics.totalCopies} physical copies across all shelves`}
          icon={BookOpen}
          accent="blue"
          trend={{ text: `${categories.length} Categories`, type: 'neutral' }}
          onClick={() => navigate('/books')}
        />

        {/* 3. Available Books */}
        <StatsCard
          title="Available On Shelf"
          value={statistics.availableCopies}
          subtext="Ready for immediate circulation loan"
          icon={CheckCircle2}
          accent="emerald"
          trend={{ text: `${Math.round((statistics.availableCopies / (statistics.totalCopies || 1)) * 100)}% Stocked`, type: 'positive' }}
          onClick={() => navigate('/books')}
        />

        {/* 4. Borrowed Books */}
        <StatsCard
          title="Currently Borrowed"
          value={statistics.totalIssued}
          subtext={`${statistics.totalReturned} archived historical returns`}
          icon={Clock}
          accent="purple"
          trend={{ text: `${statistics.totalIssued} Active Loans`, type: 'neutral' }}
          onClick={() => navigate('/transactions?tab=issue')}
        />

        {/* 5. Registered Students */}
        <StatsCard
          title="Registered Students"
          value={statistics.totalStudents}
          subtext="Active student and staff library members"
          icon={Users}
          accent="blue"
          trend={{ text: "100% Verified", type: 'positive' }}
          onClick={() => navigate('/students')}
        />
      </section>

      {/* ========================================================
          7. RECENTLY ADDED BOOKS (with Attractive Book Covers)
          ======================================================== */}
      <section className="dashboard-section">
        <div className="section-header-flex">
          <div>
            <h2 className="section-title">Recently Added Titles</h2>
            <p className="section-desc">Latest acquisitions in the library collection with live availability status</p>
          </div>
          <Link to="/books" className="section-link">
            <span>Explore All Books ({books.length})</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="books-cover-grid">
          {books.slice(0, 4).map((book) => (
            <BookCoverCard 
              key={book.id} 
              book={book} 
              onSelect={() => navigate('/books')}
            />
          ))}
        </div>
      </section>

      {/* ========================================================
          6 & 8. RECENT TRANSACTIONS + CATEGORY DISTRIBUTION
          ======================================================== */}
      <section className="dashboard-grid-2col">
        {/* 6. Recent Transactions */}
        <RecentTransactionsTable 
          transactions={combinedTransactions}
          onReturn={handleQuickReturn}
        />

        {/* 8. Book Category Distribution Chart */}
        <CategoryDistributionChart 
          books={books}
          categories={categories}
        />
      </section>

      {/* ========================================================
          MODAL: ISSUE BOOK
          ======================================================== */}
      {isIssueModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-glass-container glass-card">
            <div className="modal-header">
              <h2 className="modal-title">Issue Book to Student</h2>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setIsIssueModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="modal-form">
              {modalError && (
                <div className="form-error-banner" style={{ color: 'var(--color-rose)', fontSize: '0.85rem' }}>
                  {modalError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Select Available Book *</label>
                <select
                  className="glass-input"
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                >
                  {availableBooks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} — ({b.availableCopies} available)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select Student Borrower *</label>
                <select
                  className="glass-input"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNumber} • {s.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Due Return Date *</label>
                <input
                  type="date"
                  className="glass-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="glass-btn" 
                  onClick={() => setIsIssueModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="glass-btn glass-btn-primary">
                  <Check size={16} />
                  <span>Issue Title Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD BOOK
          ======================================================== */}
      {isAddBookModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-glass-container glass-card">
            <div className="modal-header">
              <h2 className="modal-title">Register New Book to Catalog</h2>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setIsAddBookModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleQuickAddBookSubmit} className="modal-form">
              {modalError && (
                <div className="form-error-banner" style={{ color: 'var(--color-rose)', fontSize: '0.85rem' }}>
                  {modalError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Book Title *</label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="e.g. Structure and Interpretation of Computer Programs"
                  value={newBookData.title}
                  onChange={(e) => setNewBookData({ ...newBookData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Author Name *</label>
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="e.g. Harold Abelson"
                    value={newBookData.author}
                    onChange={(e) => setNewBookData({ ...newBookData, author: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ISBN Number *</label>
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="e.g. 978-0262510875"
                    value={newBookData.isbn}
                    onChange={(e) => setNewBookData({ ...newBookData, isbn: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="glass-input"
                    value={newBookData.category}
                    onChange={(e) => setNewBookData({ ...newBookData, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Publication Year</label>
                  <input
                    type="number"
                    className="glass-input"
                    value={newBookData.publicationYear}
                    onChange={(e) => setNewBookData({ ...newBookData, publicationYear: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Copies</label>
                  <input
                    type="number"
                    min="1"
                    className="glass-input"
                    value={newBookData.copies}
                    onChange={(e) => setNewBookData({ ...newBookData, copies: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Cover Image URL (Optional)</label>
                <input
                  type="url"
                  className="glass-input"
                  placeholder="https://images.unsplash.com/..."
                  value={newBookData.coverImage}
                  onChange={(e) => setNewBookData({ ...newBookData, coverImage: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="glass-btn" 
                  onClick={() => setIsAddBookModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="glass-btn glass-btn-primary">
                  <Check size={16} />
                  <span>Register Book</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
