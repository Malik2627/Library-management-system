import React from 'react';
import { Plus, BookUp2, UserPlus, BookOpen, FolderKanban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActions({ onOpenIssueModal, onOpenAddBookModal, onOpenAddStudentModal }) {
  const navigate = useNavigate();

  return (
    <div className="quick-actions-bar">
      <button 
        type="button" 
        className="quick-action-btn primary-gradient"
        onClick={onOpenIssueModal || (() => navigate('/transactions?tab=issue'))}
      >
        <BookUp2 size={18} />
        <span>Issue Book</span>
      </button>

      <button 
        type="button" 
        className="quick-action-btn purple-gradient"
        onClick={onOpenAddBookModal || (() => navigate('/books?action=add'))}
      >
        <Plus size={18} />
        <span>Add New Book</span>
      </button>

      <button 
        type="button" 
        className="quick-action-btn glass-neutral"
        onClick={onOpenAddStudentModal || (() => navigate('/students?action=add'))}
      >
        <UserPlus size={18} />
        <span>Register Member</span>
      </button>

      <button 
        type="button" 
        className="quick-action-btn glass-neutral"
        onClick={() => navigate('/books')}
      >
        <BookOpen size={18} />
        <span>Browse Catalog</span>
      </button>

      <button 
        type="button" 
        className="quick-action-btn glass-neutral desktop-only"
        onClick={() => navigate('/categories')}
      >
        <FolderKanban size={18} />
        <span>Manage Categories</span>
      </button>
    </div>
  );
}

export default QuickActions;

