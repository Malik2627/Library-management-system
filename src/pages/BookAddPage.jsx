import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Check, AlertCircle } from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';

export function BookAddPage() {
  const { addBook, categories } = useLibrary();
  const navigate = useNavigate();

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
    publishedYear: new Date().getFullYear().toString(),
    description: '',
    coverImage: '',
    totalCopies: 3
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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

    addBook({
      ...formData,
      totalCopies: parseInt(formData.totalCopies, 10),
      copies: parseInt(formData.totalCopies, 10),
      publishedYear: formData.publishedYear.toString()
    });

    navigate('/books');
  };

  return (
    <div className="page-container page-narrow">
      <div className="page-breadcrumb-nav">
        <Link to="/books" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to All Books</span>
        </Link>
      </div>

      <div className="glass-card page-form-card">
        <div className="form-card-header">
          <div className="modal-icon-badge">
            <BookOpen size={22} />
          </div>
          <div>
            <h1 className="page-title" style={{ fontSize: '1.6rem' }}>Add New Book</h1>
            <p className="page-subtitle">Register a new physical volume into the LIBRARYHUB catalog.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="form-group">
            <label className="form-label">Book Title <span className="text-rose">*</span></label>
            <input
              type="text"
              name="title"
              className={`glass-input ${touched.title && errors.title ? 'input-error' : ''}`}
              placeholder="e.g. Structure and Interpretation of Computer Programs"
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
                placeholder="e.g. Harold Abelson"
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
                placeholder="e.g. 978-0262510875"
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
                placeholder="e.g. MIT Press"
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
              <label className="form-label">Cover Image URL (Optional)</label>
              <input
                type="url"
                name="coverImage"
                className={`glass-input ${touched.coverImage && errors.coverImage ? 'input-error' : ''}`}
                placeholder="https://images.unsplash.com/..."
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
              placeholder="Enter comprehensive synopsis, topics covered, and prerequisites..."
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
              onClick={() => navigate('/books')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="glass-btn glass-btn-primary"
            >
              <Check size={16} />
              <span>Save & Add to Catalog</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookAddPage;

