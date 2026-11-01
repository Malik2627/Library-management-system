import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  GraduationCap, 
  BookMarked, 
  Trash2, 
  Edit3, 
  Eye, 
  Filter, 
  LayoutGrid, 
  List, 
  RotateCcw
} from 'lucide-react';
import { useLibrary } from '../hooks/useLibrary';
import { StudentFormModal } from '../components/students/StudentFormModal';
import { StudentDetailModal } from '../components/students/StudentDetailModal';
import { StudentDeleteConfirmModal } from '../components/students/StudentDeleteConfirmModal';

export function StudentsPage() {
  const { 
    students, 
    issuedBooks, 
    addStudent, 
    updateStudent, 
    deleteStudent, 
    returnBook,
    searchQuery, 
    setSearchQuery 
  } = useLibrary();

  const [searchParams, setSearchParams] = useSearchParams();

  // Local state
  const [localSearch, setLocalSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);

  // Sync with global navbar search
  useEffect(() => {
    if (searchQuery && searchQuery !== localSearch) {
      setLocalSearch(searchQuery);
    }
  }, [searchQuery]);

  // Action query parameter (/students?action=add)
  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      openAddModal();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  // Extract unique departments
  const departmentList = useMemo(() => {
    const set = new Set(students.map((s) => s.department).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [students]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    const q = localSearch.trim().toLowerCase();
    return students.filter((s) => {
      const matchName = (s.name || '').toLowerCase().includes(q);
      const matchId = (s.studentId || s.rollNumber || '').toLowerCase().includes(q);
      const matchEmail = (s.email || '').toLowerCase().includes(q);
      const matchPhone = (s.phone || '').toLowerCase().includes(q);
      const matchDept = (s.department || '').toLowerCase().includes(q);

      const matchesSearch = !q || matchName || matchId || matchEmail || matchPhone || matchDept;
      const matchesDept = selectedDept === 'All' || s.department === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [students, localSearch, selectedDept]);

  const openAddModal = () => {
    setEditingStudent(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        ...data
      });
    } else {
      addStudent(data);
    }
    setIsFormModalOpen(false);
  };

  const handleDeleteConfirm = (id) => {
    deleteStudent(id);
    setDeletingStudent(null);
  };

  return (
    <div className="page-container students-management-page">
      {/* Header */}
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Students & Member Directory</h1>
          <p className="page-subtitle">
            Manage student registrations, departments, contact info, and track active circulation privileges.
          </p>
        </div>
        <button 
          type="button" 
          className="glass-btn glass-btn-primary"
          onClick={openAddModal}
        >
          <Plus size={18} />
          <span>Register New Member</span>
        </button>
      </div>

      {/* Control Bar: Search & Department Filter */}
      <div className="books-control-bar glass-panel">
        <div className="search-control-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-control-input"
            placeholder="Search by name, student ID, email, or department..."
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

        <div className="filter-sort-group">
          <div className="control-select-box">
            <Filter size={15} className="control-icon" />
            <select
              className="glass-select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              {departmentList.map((dept) => (
                <option key={dept} value={dept}>Dept: {dept}</option>
              ))}
            </select>
          </div>

          <div className="view-mode-switch glass-panel">
            <button
              type="button"
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
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

      {/* Results Count */}
      <div className="results-status-row">
        <span>Showing <strong>{filteredStudents.length}</strong> of {students.length} registered members</span>
        {(localSearch || selectedDept !== 'All') && (
          <button 
            type="button" 
            className="reset-filters-btn"
            onClick={() => {
              setLocalSearch('');
              setSearchQuery('');
              setSelectedDept('All');
            }}
          >
            <RotateCcw size={13} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Members Grid or Table */}
      {filteredStudents.length === 0 ? (
        <div className="glass-card empty-catalog-box">
          <Users size={48} className="empty-catalog-icon" />
          <h3 className="empty-title">No members found</h3>
          <p className="empty-subtitle">
            {localSearch 
              ? `No student records matching "${localSearch}". Try a different name or roll number.` 
              : 'The member directory is currently empty.'}
          </p>
          <button 
            type="button" 
            className="glass-btn glass-btn-primary"
            onClick={openAddModal}
            style={{ marginTop: '1rem' }}
          >
            <Plus size={16} />
            <span>Register First Member</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="members-grid">
          {filteredStudents.map((student) => {
            const loans = issuedBooks.filter((tx) => tx.studentId === student.id);
            return (
              <div key={student.id} className="glass-card member-card">
                <div className="member-card-header">
                  <div className="member-avatar" onClick={() => setViewingStudent(student)} style={{ cursor: 'pointer' }}>
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="member-meta" onClick={() => setViewingStudent(student)} style={{ cursor: 'pointer' }}>
                    <h3 className="member-name">{student.name}</h3>
                    <span className="member-id-tag">{student.studentId || student.rollNumber}</span>
                  </div>
                </div>

                <div className="member-details-list">
                  <div className="member-detail-row">
                    <Mail size={15} className="detail-icon" />
                    <span className="detail-text">{student.email}</span>
                  </div>
                  <div className="member-detail-row">
                    <Phone size={15} className="detail-icon" />
                    <span className="detail-text">{student.phone || 'N/A'}</span>
                  </div>
                  <div className="member-detail-row">
                    <GraduationCap size={15} className="detail-icon" />
                    <span className="detail-text">{student.department}</span>
                  </div>
                  <div className="member-detail-row">
                    <BookMarked size={15} className="detail-icon" />
                    <span className="detail-text">
                      <strong className={loans.length > 0 ? "text-purple" : "text-cyan"}>
                        {loans.length}
                      </strong> books currently on loan
                    </span>
                  </div>
                </div>

                <div className="member-card-footer">
                  <button 
                    type="button" 
                    className="glass-btn action-sm"
                    onClick={() => setViewingStudent(student)}
                    title="View Profile & Active Loans"
                  >
                    <Eye size={14} />
                    <span>Details</span>
                  </button>
                  <button 
                    type="button" 
                    className="glass-btn action-sm"
                    onClick={() => openEditModal(student)}
                    title="Edit Member Details"
                  >
                    <Edit3 size={14} />
                    <span>Edit</span>
                  </button>
                  <button 
                    type="button" 
                    className="glass-btn action-sm delete-btn"
                    onClick={() => setDeletingStudent(student)}
                    title="Delete Member"
                  >
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card table-wrapper">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Student ID</th>
                <th>Department</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Active Loans</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const loans = issuedBooks.filter((tx) => tx.studentId === student.id);
                return (
                  <tr key={student.id}>
                    <td>
                      <div className="table-book-info" onClick={() => setViewingStudent(student)} style={{ cursor: 'pointer' }}>
                        <div className="member-avatar table-avatar-sm">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <strong className="text-white">{student.name}</strong>
                      </div>
                    </td>
                    <td><span className="isbn-tag">{student.studentId || student.rollNumber}</span></td>
                    <td><span className="category-badge">{student.department}</span></td>
                    <td><span className="text-secondary">{student.email}</span></td>
                    <td><span className="text-muted">{student.phone || 'N/A'}</span></td>
                    <td>
                      <span className={`status-pill ${loans.length > 0 ? 'purple' : 'emerald'}`}>
                        {loans.length} Borrowed
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="table-actions">
                        <button 
                          type="button" 
                          className="action-icon-btn view"
                          onClick={() => setViewingStudent(student)}
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button 
                          type="button" 
                          className="action-icon-btn edit"
                          onClick={() => openEditModal(student)}
                          title="Edit"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          type="button" 
                          className="action-icon-btn delete"
                          onClick={() => setDeletingStudent(student)}
                          title="Delete"
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

      {/* Modals */}
      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        editingStudent={editingStudent}
      />

      <StudentDetailModal
        student={viewingStudent}
        issuedBooks={issuedBooks}
        onClose={() => setViewingStudent(null)}
        onEdit={(student) => {
          setViewingStudent(null);
          openEditModal(student);
        }}
        onDelete={(student) => {
          setViewingStudent(null);
          setDeletingStudent(student);
        }}
        onReturnBook={(txId) => {
          returnBook(txId);
        }}
      />

      <StudentDeleteConfirmModal
        isOpen={Boolean(deletingStudent)}
        student={deletingStudent}
        issuedBooks={issuedBooks}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default StudentsPage;
