import React, { useState, useEffect } from 'react';
import { X, Check, User, AlertCircle, Mail, Phone, Hash, GraduationCap, Calendar } from 'lucide-react';

export function StudentFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingStudent = null 
}) {
  const departments = [
    'Computer Science',
    'Software Engineering',
    'Information Technology',
    'Data Science',
    'System Architecture',
    'Electronics',
    'Mechanical Engineering',
    'General Studies'
  ];

  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    phone: '',
    department: departments[0],
    joinedDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || '',
        studentId: editingStudent.studentId || editingStudent.rollNumber || '',
        email: editingStudent.email || '',
        phone: editingStudent.phone || '',
        department: editingStudent.department || departments[0],
        joinedDate: editingStudent.joinedDate || new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        name: '',
        studentId: '',
        email: '',
        phone: '',
        department: departments[0],
        joinedDate: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
    setTouched({});
  }, [editingStudent, isOpen]);

  if (!isOpen) return null;

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value || !value.trim()) return 'Student full name is required.';
        if (value.trim().length < 2) return 'Name must be at least 2 characters.';
        return null;

      case 'studentId':
        if (!value || !value.trim()) return 'Student / Member ID is required.';
        if (value.trim().length < 3) return 'Student ID must be at least 3 characters.';
        return null;

      case 'email':
        if (!value || !value.trim()) return 'Email address is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Please enter a valid email address.';
        }
        return null;

      case 'phone':
        if (!value || !value.trim()) return 'Contact phone number is required.';
        if (value.trim().length < 7) return 'Enter a valid phone number.';
        return null;

      case 'joinedDate':
        if (!value) return 'Joined date is required.';
        return null;

      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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
    Object.keys(formData).forEach((k) => {
      const err = validateField(k, formData[k]);
      if (err) newErrors[k] = err;
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
      rollNumber: formData.studentId // maintain compatibility
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-glass-container glass-card">
        <div className="modal-header">
          <div className="modal-header-title-box">
            <div className="modal-icon-badge">
              <User size={20} />
            </div>
            <div>
              <h2 className="modal-title">
                {editingStudent ? 'Edit Member Profile' : 'Register New Member'}
              </h2>
              <p className="modal-subtitle">
                {editingStudent 
                  ? 'Update student contact details and department assignment.' 
                  : 'Enter member credentials for library circulation privilege.'}
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

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">
              Full Name <span className="text-rose">*</span>
            </label>
            <input
              type="text"
              name="name"
              className={`glass-input ${touched.name && errors.name ? 'input-error' : ''}`}
              placeholder="e.g. Diya Patel"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.name && errors.name && (
              <span className="form-error-msg"><AlertCircle size={12} /> {errors.name}</span>
            )}
          </div>

          {/* Student ID & Department */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">
                Student ID / Roll No <span className="text-rose">*</span>
              </label>
              <input
                type="text"
                name="studentId"
                className={`glass-input ${touched.studentId && errors.studentId ? 'input-error' : ''}`}
                placeholder="e.g. SE2024-018"
                value={formData.studentId}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.studentId && errors.studentId && (
                <span className="form-error-msg"><AlertCircle size={12} /> {errors.studentId}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                name="department"
                className="glass-input"
                value={formData.department}
                onChange={handleChange}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">
                Email Address <span className="text-rose">*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`glass-input ${touched.email && errors.email ? 'input-error' : ''}`}
                placeholder="diya.patel@libraryhub.edu"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.email && errors.email && (
                <span className="form-error-msg"><AlertCircle size={12} /> {errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Phone Number <span className="text-rose">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                className={`glass-input ${touched.phone && errors.phone ? 'input-error' : ''}`}
                placeholder="+91 98765 43211"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.phone && errors.phone && (
                <span className="form-error-msg"><AlertCircle size={12} /> {errors.phone}</span>
              )}
            </div>
          </div>

          {/* Joined Date */}
          <div className="form-group">
            <label className="form-label">Registration / Joined Date</label>
            <input
              type="date"
              name="joinedDate"
              className="glass-input"
              value={formData.joinedDate}
              onChange={handleChange}
            />
          </div>

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
              <span>{editingStudent ? 'Save Profile' : 'Register Member'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentFormModal;

