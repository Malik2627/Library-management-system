import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Check, AlertCircle } from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';

export function StudentAddPage() {
  const { addStudent } = useLibrary();
  const navigate = useNavigate();

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
          return 'Enter a valid email address.';
        }
        return null;
      case 'phone':
        if (!value || !value.trim()) return 'Phone number is required.';
        if (value.trim().length < 7) return 'Enter a valid phone number.';
        return null;
      case 'joinedDate':
        if (!value) return 'Registration date is required.';
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

    addStudent({
      ...formData,
      rollNumber: formData.studentId
    });

    navigate('/students');
  };

  return (
    <div className="page-container page-narrow">
      <div className="page-breadcrumb-nav">
        <Link to="/students" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Member Directory</span>
        </Link>
      </div>

      <div className="glass-card page-form-card">
        <div className="form-card-header">
          <div className="modal-icon-badge">
            <User size={22} />
          </div>
          <div>
            <h1 className="page-title" style={{ fontSize: '1.6rem' }}>Register New Student Member</h1>
            <p className="page-subtitle">Add a student to grant library circulation borrowing privileges.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="form-group">
            <label className="form-label">Full Name <span className="text-rose">*</span></label>
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

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Student ID / Roll Number <span className="text-rose">*</span></label>
              <input
                type="text"
                name="studentId"
                className={`glass-input ${touched.studentId && errors.studentId ? 'input-error' : ''}`}
                placeholder="e.g. SE2026-018"
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

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Email Address <span className="text-rose">*</span></label>
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
              <label className="form-label">Contact Phone <span className="text-rose">*</span></label>
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

          <div className="form-group">
            <label className="form-label">Registration Date</label>
            <input
              type="date"
              name="joinedDate"
              className="glass-input"
              value={formData.joinedDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions-bar">
            <button
              type="button"
              className="glass-btn"
              onClick={() => navigate('/students')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="glass-btn glass-btn-primary"
            >
              <Check size={16} />
              <span>Confirm & Register</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentAddPage;

