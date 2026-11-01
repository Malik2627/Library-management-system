import React from 'react';
import { Mail, GraduationCap, BookMarked, Edit3, Trash2 } from 'lucide-react';

export function StudentCard({ student, onEdit, onDelete }) {
  return (
    <div className="glass-card member-card">
      <div className="member-card-header">
        <div className="member-avatar">
          {student.name.charAt(0).toUpperCase()}
        </div>
        <div className="member-meta">
          <h3 className="member-name">{student.name}</h3>
          <span className="member-id-tag">{student.rollNumber}</span>
        </div>
      </div>
      <div className="member-details-list">
        <div className="member-detail-row">
          <Mail size={15} className="detail-icon" />
          <span className="detail-text">{student.email}</span>
        </div>
        <div className="member-detail-row">
          <GraduationCap size={15} className="detail-icon" />
          <span className="detail-text">{student.department}</span>
        </div>
        <div className="member-detail-row">
          <BookMarked size={15} className="detail-icon" />
          <span className="detail-text">
            <strong className="text-cyan">{student.booksIssued || 0}</strong> books issued
          </span>
        </div>
      </div>
      <div className="member-card-footer">
        {onEdit && (
          <button type="button" className="glass-btn action-sm" onClick={() => onEdit(student)}>
            <Edit3 size={14} />
            <span>Edit</span>
          </button>
        )}
        {onDelete && (
          <button type="button" className="glass-btn action-sm delete-btn" onClick={() => onDelete(student.id)}>
            <Trash2 size={14} />
            <span>Remove</span>
          </button>
        )}
      </div>
    </div>
  );
}

