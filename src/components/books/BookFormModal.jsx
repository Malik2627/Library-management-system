import React, { useState, useEffect } from 'react';
import { X, Check, BookOpen, AlertCircle, Image as ImageIcon } from 'lucide-react';

export function BookFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingBook = null, 
  categories = [] 
}) {
  const defaultCategories = categories.length > 0 ? categories : [
    'Computer Science',
    'Software Engineering',
    'System Architecture',
    'Literature',
    'Data Science',
    'Mathematics',
    'General'
  ];

  // Controlled form state using useState
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

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title || '',
        author: editingBook.author || '',
        isbn: editingBook.isbn || '',
        category: editingBook.category || defaultCategories[0],
        publisher: editingBook.publisher || '',
        publishedYear: (editingBook.publishedYear || editingBook.publicationYear || '2024').toString(),
        description: editingBook.description || '',
        coverImage: editingBook.coverImage || '',
        totalCopies: Number(editingBook.totalCopies ?? editingBook.copies) || 1
      });
    } else {
      setFormData({
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
    }
    setErrors({});
    setTouched({});
  }, [editingBook, isOpen]);

  if (!isOpen) return null;

  // Validation function
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
        if (!value || !value.trim()) return 'ISBN is required.';
        if (value.trim().length < 8) return 'Enter a valid ISBN (e.g., 978-0132350884).';
        return null;

      case 'publisher':
        if (!value || !value.trim()) return 'Publisher name is required.';
        return null;

      case 'publishedYear': {
        const year = parseInt(value, 10);
        if (!value) return 'Publication year is required.';
        if (isNaN(year) || year < 1000 || year > currentYear) {
          return `Year must be between 1000 and ${currentYear}.`;
        }
        return null;
      }

      case 'description':
        if (!value || !value.trim()) return 'Description is required.';
        if (value.trim().length < 10) return 'Description must be at least 10 characters.';
        return null;

      case 'totalCopies': {
        const copies = parseInt(value, 10);
        if (!value || isNaN(copies) || copies < 1) {
          return 'Total copies must be at least 1.';
        }
        return null;
      }

      case 'coverImage':
        if (value && value.trim() && !/^https?:\/\/.+/i.test(value.trim())) {
          return 'Please enter a valid URL starting with http:// or https://';
        }
        return null;

      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation if field was touched
    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    setTouched(
      Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    );
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    onSubmit({
      ...formData,
      totalCopies: parseInt(formData.totalCopies, 10),
      copies: parseInt(formData.totalCopies, 10),
      publishedYear: formData.publishedYear.toString()
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-glass-container glass-card book-modal-wide">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-title-box">
            <div className="modal-icon-badge">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="modal-title">
                {editingBook ? 'Edit Book Details' : 'Add New Book to Catalog'}
              </h2>
              <p className="modal-subtitle">
                {editingBook 
                  ? 'Update book metadata, publisher, and shelf inventory count.' 
                  : 'Enter complete book details with valid ISBN and inventory counts.'}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">
              Book Title <span className="text-rose">*</span>
            </label>
            <input
              type="text"
              name="title"
              className={`glass-input ${touched.title && errors.title ? 'input-error' : ''}`}
              placeholder="e.g. Clean Architecture: A Craftsman's Guide"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.title && errors.title && (
              <span className="form-error-msg"><AlertCircle size={12} /> {errors.title}</span>
            )}
          </div>

          {/* Author & ISBN */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">
                Author Name <span className="text-rose">*</span>
              </label>
              <input
                type="text"
                name="author"
                className={`glass-input ${touched.author && errors.author ? 'input-error' : ''}`}
                placeholder="e.g. Robert C. Martin"
                value={formData.author}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.author && errors.author && (
                <span className="form-error-msg"><AlertCircle size={12} /> {errors.author}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                ISBN Number <span className="text-rose">*</span>
              </label>
              <input
                type="text"
                name="isbn"
                className={`glass-input ${touched.isbn && errors.isbn ? 'input-error' : ''}`}
                placeholder="e.g. 978-0134494166"
                value={formData.isbn}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.isbn && errors.isbn && (
                <span className="form-error-msg"><AlertCircle size={12} /> {errors.isbn}</span>
              )}
            </div>
          </div>

          {/* Category, Publisher & Published Year */}
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="glass-input"
                value={formData.category}
                onChange={handleChange}
              >
                {defaultCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Publisher <span className="text-rose">*</span>
              </label>
              <input
                type="text"
                name="publisher"
                className={`glass-input ${touched.publisher && errors.publisher ? 'input-error' : ''}`}
                placeholder="e.g. Prentice Hall"
                value={formData.publisher}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.publisher && errors.publisher && (
                <span className="form-error-msg"><AlertCircle size={12} /> {errors.publisher}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Published Year <span className="text-rose">*</span>
              </label>
              <input
                type="number"
                name="publishedYear"
                className={`glass-input ${touched.publishedYear && errors.publishedYear ? 'input-error' : ''}`}
                placeholder="2024"
                value={formData.publishedYear}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.publishedYear && errors.publishedYear && (
                <span className="form-error-msg"><AlertCircle size={12} /> {errors.publishedYear}</span>
              )}
            </div>
          </div>

          {/* Total Copies & Cover Image URL */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">
                Total Copies in Inventory <span className="text-rose">*</span>
              </label>
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
                placeholder="https://images.unsplash.com/photo-..."
                value={formData.coverImage}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.coverImage && errors.coverImage && (
                <span className="form-error-msg"><AlertCircle size={12} /> {errors.coverImage}</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">
              Book Description / Abstract <span className="text-rose">*</span>
            </label>
            <textarea
              name="description"
              rows="3"
              className={`glass-input textarea-input ${touched.description && errors.description ? 'input-error' : ''}`}
              placeholder="Enter comprehensive synopsis, key topics covered, and target audience..."
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.description && errors.description && (
              <span className="form-error-msg"><AlertCircle size={12} /> {errors.description}</span>
            )}
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button 
              type="button" 
              className="glass-btn" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="glass-btn glass-btn-primary">
              <Check size={16} />
              <span>{editingBook ? 'Save Changes' : 'Add Book to Catalog'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookFormModal;

