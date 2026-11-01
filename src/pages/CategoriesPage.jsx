import React, { useState } from 'react';
import { FolderKanban, Plus, BookOpen, Check, ArrowRight, X } from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';
import { useNavigate } from 'react-router-dom';

export function CategoriesPage() {
  const { categories, books, addCategory } = useLibrary();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('Please provide a category name.');
      return;
    }
    if (categories.some((c) => c.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      setError('This category already exists.');
      return;
    }
    addCategory(newCategoryName.trim());
    setNewCategoryName('');
    setIsAddOpen(false);
    setError('');
  };

  return (
    <div className="page-container">
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Book Categories</h1>
          <p className="page-subtitle">Organize and classify library holdings by discipline, genre, and topic.</p>
        </div>
        <button
          type="button"
          className="glass-btn glass-btn-primary"
          onClick={() => {
            setIsAddOpen(!isAddOpen);
            setError('');
          }}
        >
          {isAddOpen ? <X size={16} /> : <Plus size={16} />}
          <span>{isAddOpen ? 'Cancel' : 'New Category'}</span>
        </button>
      </div>

      {isAddOpen && (
        <form onSubmit={handleAddSubmit} className="glass-card mb-4" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h3 className="section-title mb-2" style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Add New Book Category</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="glass-input"
              style={{ flex: 1, minWidth: '240px' }}
              placeholder="e.g. Artificial Intelligence, Cloud Computing..."
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                if (error) setError('');
              }}
              autoFocus
            />
            <button type="submit" className="glass-btn glass-btn-primary">
              <Check size={16} />
              <span>Create Category</span>
            </button>
          </div>
          {error && <p className="form-error-msg mt-2" style={{ marginTop: '0.5rem', color: '#f43f5e' }}>{error}</p>}
        </form>
      )}

      <div className="categories-grid">
        {categories.map((cat, idx) => {
          const matchingBooks = books.filter((b) => (b.category || 'General') === cat);
          const totalCopies = matchingBooks.reduce((acc, b) => acc + (Number(b.totalCopies ?? b.copies) || 1), 0);

          return (
            <div key={idx} className="glass-card category-card">
              <div className="category-card-top">
                <div className="category-icon-box">
                  <FolderKanban size={22} />
                </div>
                <span className="category-count-pill">{matchingBooks.length} Titles</span>
              </div>

              <h3 className="category-name">{cat}</h3>
              <p className="category-copies-text">{totalCopies} physical copies registered</p>

              <div className="category-card-footer">
                <button
                  type="button"
                  className="glass-btn action-sm"
                  onClick={() => navigate('/books')}
                >
                  <BookOpen size={14} />
                  <span>View Titles</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategoriesPage;
