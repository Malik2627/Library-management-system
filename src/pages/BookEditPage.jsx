import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Check, AlertCircle } from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';

export function BookEditPage() {
  const { id } = useParams();
  const { books, updateBook, categories } = useLibrary();
  const navigate = useNavigate();

  // Find book from state
  const book = books.find((b) => b.id === id);

  const defaultCategories = categories.length > 0 ? categories : [
    'Computer Science',
    'Software Engineering',
    'System Architecture',
    'Literature',
    'Data Science',
    'Mathematics'
  ];

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: defaultCategories[0],
    publisher: '',
    publishedYear: '',
    description: '',
    coverImage: '',
    totalCopies: 1
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        category: book.category || defaultCategories[0],
        publisher: book.publisher || '',
        publishedYear: (book.publishedYear || book.publicationYear || '2024').toString(),
        description: book.description || '',
        coverImage: book.coverImage || '',
        totalCopies: Number(book.totalCopies ?? book.copies) || 1
      });
    }
  }, [book]);

  if (!book) {
    return (
      <div className="page-container page-narrow">
        <div className="glass-card empty-catalog-box">
          <AlertCircle size={48} className="text-rose" style={{ marginBottom: '1rem' }} />
          <h2 className="empty-title">Book Not Found</h2>
          <p className="empty-subtitle">Cannot edit nonexistent book ID: <code className="text-white">{id}</code>.</p>
          <Link to="/books" className="glass-btn glass-btn-primary" style={{ marginTop: '1.25rem' }}>
            <ArrowLeft size={16} />
            <span>Return to All Books</span>
          </Link>
        </div>
      </div>
    );
  }

  const validateField = (name, value) => {
    const currentYear = new Date().getFullYear() + 1;
    switch (name) {
      case 'title':
        if (!value || !value.trim()) return 'Book title is mandatory.';
        if (value.trim().length < 2) return 'Title must be at least 2 characters.';
        return null;
      case 'author':
        if (!value || !value.trim()) return 'Author name is required.';
        if (value.trim().length < 2) return 'Author name must be at least 2 characters.';
        return null;
      case 'isbn':
        if (!value || !value.trim()) return 'ISBN number is required.';
        if (value.trim().length < 8) return 'Enter a valid ISBN (e.g. 978-0132350884).';
        return null;
      case 'publisher':
        if (!value || !value.trim()) return 'Publisher name is required.';
        return null;
      case 'publishedYear': {
        const y = parseInt(value, 10);
        if (!value) return 'Publication year is required.';
        if (isNaN(y) || y < 1000 || y > currentYear) {
          return `Year must be between 1000 and ${currentYear}.`;
        }
        return null;
      }
      case 'description':
        if (!value || !value.trim()) return 'Description is required.';
        if (value.trim().length < 10) return 'Description must be at least 10 characters.';
        return null;
      case 'totalCopies': {
        const c = parseInt(value, 10);
        if (!value || isNaN(c) || c < 1) return 'Total copies must be at least 1.';
        return null;
      }
      case 'coverImage':
        if (value && value.trim() && !/^https?:\/\/.+/i.test(value.trim())) {
          return 'Enter a valid URL starting with http:// or https://';
        }
        return null;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateAll = () => {
    const errs = {};
    Object.keys(formData).forEach((k) => {
      const err = validateField(k, formData[k]);
      if (err) errs[k] = err;
    });
    setErrors(errs);
    setTouched(Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    updateBook({
      ...book,
      ...formData,
      totalCopies: parseInt(formData.totalCopies, 10),
      copies: parseInt(formData.totalCopies, 10),
      publishedYear: formData.publishedYear.toString()
    });

    navigate(`/books/${id}`);
  };

  return (
    <div className="page-container page-narrow">
      <div className="page-breadcrumb-nav">
        <Link to={`/books/${id}`} className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Book Details</span>
        </Link>
      </div>

      <div className="glass-card page-form-card">
        <div className="form-card-header">
          <div className="modal-icon-badge">
            <BookOpen size={22} />
          </div>
          <div>
            <h1 className="page-title" style={{ fontSize: '1.6rem' }}>Edit Book Record</h1>
            <p className="page-subtitle">Update metadata, publication details, and volume count for ID: {id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="form-group">
            <label className="form-label">Book Title <span className="text-rose">*</span></label>
            <input
              type="text"
              name="title"
              className={`glass-input ${touched.title && errors.title ? 'input-error' : ''}`}
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.title && errors.title && (
              <span className="form-error-msg"><AlertCircle size={12} /> {errors.title}</span>
            )}
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Author Name <span className="text-rose">*</span></label>
              <input
                type="text"
                name="author"
                className={`glass-input ${touched.author && errors.author ? 'input-error' : ''}`}
                value={formData.author}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.author && errors.author && (
                <span className="form-error-msg"><AlertCircle size={12} /> {errors.author}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">ISBN Number <span className="text-rose">*</span></label>
              <input
                type="text"
                name="isbn"
                className={`glass-input ${touched.isbn && errors.isbn ? 'input-error' : ''}`}
                value={formData.isbn}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.isbn && errors.isbn && (
                <span className="form-error-msg"><AlertCircle size={12} /> {errors.isbn}</span>
              )}
            </div>
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="glass-input"
                value={formData.category}
                onChange={handleChange}
              >
                {defaultCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Publisher <span className="text-rose">*</span></label>
              <input
                type="text"
                name="publisher"
                className={`glass-input ${touched.publisher && errors.publisher ? 'input-error' : ''}`}
                value={formData.publisher}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.publisher && errors.publisher && (
                <span className="form-error-msg"><AlertCircle size={12} /> {errors.publisher}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Publication Year <span className="text-rose">*</span></label>
              <input
                type="number"
                name="publishedYear"
                className={`glass-input ${touched.publishedYear && errors.publishedYear ? 'input-error' : ''}`}
                value={formData.publishedYear}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.publishedYear && errors.publishedYear && (
                <span className="form-error-msg"><AlertCircle size={12} /> {errors.publishedYear}</span>
              )}
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Total Inventory Copies <span className="text-rose">*</span></label>
              <input
                type="number"
                name="totalCopies"
                min="1"
                className={`glass-input ${touched.totalCopies && errors.totalCopies ? 'input-error' : ''}`}
                value={formData.totalCopies}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.totalCopies && errors.totalCopies && (
                <span className="form-error-msg"><AlertCircle size={12} /> {errors.totalCopies}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Cover Image URL</label>
              <input
                type="url"
                name="coverImage"
                className={`glass-input ${touched.coverImage && errors.coverImage ? 'input-error' : ''}`}
                value={formData.coverImage}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Book Synopsis / Description <span className="text-rose">*</span></label>
            <textarea
              name="description"
              rows="4"
              className={`glass-input textarea-input ${touched.description && errors.description ? 'input-error' : ''}`}
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.description && errors.description && (
              <span className="form-error-msg"><AlertCircle size={12} /> {errors.description}</span>
            )}
          </div>

          <div className="form-actions-bar">
            <button
              type="button"
              className="glass-btn"
              onClick={() => navigate(`/books/${id}`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="glass-btn glass-btn-primary"
            >
              <Check size={16} />
              <span>Save & Update Book</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookEditPage;

