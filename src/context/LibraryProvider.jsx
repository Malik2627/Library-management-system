import React, { useReducer, useState, useEffect, useCallback, useMemo } from 'react';
import { LibraryContext } from './LibraryContext';
import { libraryReducer, initialState, ACTIONS } from '../reducer/LibraryReducer';
import { storageService } from '../services/storageService';

/**
 * LibraryProvider Component
 * Manages global state using useReducer and synchronizes with LocalStorage using useEffect.
 * Uses useState for local provider states (hydration, sync status, and toast notifications).
 */
export function LibraryProvider({ children }) {
  // 1. useReducer: Manages all complex library business logic and state transitions
  const [state, dispatch] = useReducer(libraryReducer, initialState);

  // 2. useState: Local component state for data hydration tracking & sync status
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ active: true, lastSynced: null, error: null });

  // 3. useState: Toast notifications system state
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', title = '', duration = 3800) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast = { id, message, type, title };
    setToasts((prev) => [...prev.slice(-4), newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const toast = useMemo(() => ({
    success: (msg, title) => showToast(msg, 'success', title),
    error: (msg, title) => showToast(msg, 'error', title),
    warning: (msg, title) => showToast(msg, 'warning', title),
    info: (msg, title) => showToast(msg, 'info', title)
  }), [showToast]);

  // 4. useEffect: Load data from LocalStorage once on mount (prevents data loss on browser refresh)
  useEffect(() => {
    try {
      const storedData = storageService.loadAllData();
      dispatch({ type: ACTIONS.LOAD_DATA, payload: storedData });
      setIsLoaded(true);
      setSyncStatus((prev) => ({ ...prev, lastSynced: new Date().toISOString() }));
    } catch (err) {
      console.error('Failed to initialize library data:', err);
      setSyncStatus((prev) => ({ ...prev, error: err.message }));
      setIsLoaded(true);
    }
  }, []);

  // 5. useEffect: Auto-sync books and categories state changes into LocalStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        storageService.saveBooks(state.books);
        storageService.saveCategories(state.categories);
      } catch (err) {
        console.error('Failed to auto-sync books:', err);
      }
    }
  }, [state.books, state.categories, isLoaded]);

  // 6. useEffect: Auto-sync students state changes into LocalStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        storageService.saveStudents(state.students);
      } catch (err) {
        console.error('Failed to auto-sync students:', err);
      }
    }
  }, [state.students, isLoaded]);

  // 7. useEffect: Auto-sync issuedBooks and returnedBooks into LocalStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        storageService.saveIssuedBooks(state.issuedBooks);
        storageService.saveReturnedBooks(state.returnedBooks);
      } catch (err) {
        console.error('Failed to auto-sync transaction records:', err);
      }
    }
  }, [state.issuedBooks, state.returnedBooks, isLoaded]);

  // --- Dispatch Helper Functions with Toast Feedback ---

  // Books Actions
  const addBook = useCallback((bookData) => {
    dispatch({ type: ACTIONS.ADD_BOOK, payload: bookData });
    toast.success(`"${bookData.title}" was added to the catalog.`);
  }, [toast]);

  const updateBook = useCallback((bookData) => {
    dispatch({ type: ACTIONS.UPDATE_BOOK, payload: bookData });
    toast.success(`"${bookData.title}" details updated.`);
  }, [toast]);

  const deleteBook = useCallback((bookId) => {
    dispatch({ type: ACTIONS.DELETE_BOOK, payload: bookId });
    toast.info('Book removed from catalog.');
  }, [toast]);

  // Students Actions
  const addStudent = useCallback((studentData) => {
    dispatch({ type: ACTIONS.ADD_STUDENT, payload: studentData });
    toast.success(`Student "${studentData.name}" registered.`);
  }, [toast]);

  const updateStudent = useCallback((studentData) => {
    dispatch({ type: ACTIONS.UPDATE_STUDENT, payload: studentData });
    toast.success(`Student "${studentData.name}" profile updated.`);
  }, [toast]);

  const deleteStudent = useCallback((studentId) => {
    dispatch({ type: ACTIONS.DELETE_STUDENT, payload: studentId });
    toast.info('Student record removed.');
  }, [toast]);

  // Transaction Actions
  const issueBook = useCallback(({ bookId, studentId, dueDate, issueDate }) => {
    dispatch({
      type: ACTIONS.ISSUE_BOOK,
      payload: { bookId, studentId, dueDate, issueDate }
    });
    toast.success('Book issued to student successfully!');
  }, [toast]);

  const returnBook = useCallback((payload) => {
    dispatch({
      type: ACTIONS.RETURN_BOOK,
      payload
    });
    toast.success('Book successfully returned and restored to shelf.');
  }, [toast]);

  // Category Actions
  const addCategory = useCallback((categoryName) => {
    if (!categoryName || !categoryName.trim()) return;
    const trimmed = categoryName.trim();
    if (state.categories.includes(trimmed)) {
      toast.warning(`Category "${trimmed}" already exists.`);
      return;
    }
    const updated = [...state.categories, trimmed];
    storageService.saveCategories(updated);
    dispatch({ type: ACTIONS.LOAD_DATA, payload: { ...state, categories: updated } });
    toast.success(`Category "${trimmed}" created.`);
  }, [state, toast]);

  // Lifecycle Actions
  const loadData = useCallback((data) => {
    dispatch({ type: ACTIONS.LOAD_DATA, payload: data });
  }, []);

  const clearData = useCallback(() => {
    storageService.clearAllData();
    dispatch({ type: ACTIONS.CLEAR_DATA });
    toast.warning('All library database records were reset.');
  }, [toast]);

  // UI Navigation Actions
  const setSearchQuery = useCallback((query) => {
    dispatch({ type: ACTIONS.SET_SEARCH_QUERY, payload: query });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE_SIDEBAR });
  }, []);

  const toggleMobileMenu = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE_MOBILE_MENU });
  }, []);

  const closeMobileMenu = useCallback(() => {
    dispatch({ type: ACTIONS.CLOSE_MOBILE_MENU });
  }, []);

  const value = {
    // Global State
    books: state.books,
    students: state.students,
    issuedBooks: state.issuedBooks,
    returnedBooks: state.returnedBooks,
    categories: state.categories,
    statistics: state.statistics,
    searchQuery: state.searchQuery,
    isSidebarCollapsed: state.isSidebarCollapsed,
    isMobileMenuOpen: state.isMobileMenuOpen,
    isLoaded,
    syncStatus,

    // Toast Notifications State & Helpers
    toasts,
    showToast,
    removeToast,
    toast,

    // Dispatch Actions
    addBook,
    updateBook,
    deleteBook,
    addStudent,
    updateStudent,
    deleteStudent,
    issueBook,
    returnBook,
    addCategory,
    loadData,
    clearData,
    setSearchQuery,
    toggleSidebar,
    toggleMobileMenu,
    closeMobileMenu
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
}

export default LibraryProvider;
