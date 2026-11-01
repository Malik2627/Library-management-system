export const ACTIONS = {
  // Books
  ADD_BOOK: 'ADD_BOOK',
  UPDATE_BOOK: 'UPDATE_BOOK',
  DELETE_BOOK: 'DELETE_BOOK',

  // Students
  ADD_STUDENT: 'ADD_STUDENT',
  UPDATE_STUDENT: 'UPDATE_STUDENT',
  DELETE_STUDENT: 'DELETE_STUDENT',

  // Transactions
  ISSUE_BOOK: 'ISSUE_BOOK',
  RETURN_BOOK: 'RETURN_BOOK',

  // Additional / Lifecycle
  LOAD_DATA: 'LOAD_DATA',
  CLEAR_DATA: 'CLEAR_DATA',

  // UI State
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  TOGGLE_MOBILE_MENU: 'TOGGLE_MOBILE_MENU',
  CLOSE_MOBILE_MENU: 'CLOSE_MOBILE_MENU'
};

export function calculateStatistics(books = [], students = [], issuedBooks = [], returnedBooks = []) {
  const totalBooks = books.length;
  const totalCopies = books.reduce((acc, book) => acc + (Number(book.totalCopies ?? book.copies) || 1), 0);
  const availableCopies = books.reduce((acc, book) => {
    const avail = book.availableCopies !== undefined 
      ? Number(book.availableCopies) 
      : Number(book.totalCopies ?? book.copies);
    return acc + Math.max(0, avail);
  }, 0);
  const totalIssued = issuedBooks.length;
  const totalReturned = returnedBooks.length;
  const totalStudents = students.length;

  return {
    totalBooks,
    totalCopies,
    availableCopies,
    totalIssued,
    totalReturned,
    totalStudents
  };
}

export const initialState = {
  books: [],
  students: [],
  issuedBooks: [],
  returnedBooks: [],
  categories: [
    'Computer Science',
    'Software Engineering',
    'System Architecture',
    'Literature',
    'Data Science',
    'Mathematics'
  ],
  statistics: {
    totalBooks: 0,
    totalCopies: 0,
    availableCopies: 0,
    totalIssued: 0,
    totalReturned: 0,
    totalStudents: 0
  },
  searchQuery: '',
  isSidebarCollapsed: false,
  isMobileMenuOpen: false
};

export function libraryReducer(state = initialState, action) {
  switch (action.type) {
    // ----------------------------------------------------
    // LIFECYCLE: LOAD_DATA
    // ----------------------------------------------------
    case ACTIONS.LOAD_DATA: {
      const books = action.payload?.books || [];
      const students = action.payload?.students || [];
      const issuedBooks = action.payload?.issuedBooks || [];
      const returnedBooks = action.payload?.returnedBooks || [];
      const categories = action.payload?.categories || state.categories;

      return {
        ...state,
        books,
        students,
        issuedBooks,
        returnedBooks,
        categories,
        statistics: calculateStatistics(books, students, issuedBooks, returnedBooks)
      };
    }

    // ----------------------------------------------------
    // LIFECYCLE: CLEAR_DATA
    // ----------------------------------------------------
    case ACTIONS.CLEAR_DATA: {
      return {
        ...state,
        books: [],
        students: [],
        issuedBooks: [],
        returnedBooks: [],
        statistics: {
          totalBooks: 0,
          totalCopies: 0,
          availableCopies: 0,
          totalIssued: 0,
          totalReturned: 0,
          totalStudents: 0
        }
      };
    }

    // ----------------------------------------------------
    // BOOKS: ADD_BOOK
    // ----------------------------------------------------
    case ACTIONS.ADD_BOOK: {
      if (!action.payload) return state;

      const totalCopies = Number(action.payload.totalCopies ?? action.payload.copies) || 1;
      const availableCopies = action.payload.availableCopies !== undefined
        ? Number(action.payload.availableCopies)
        : totalCopies;

      const newBook = {
        ...action.payload,
        id: action.payload.id || `BK-${Date.now().toString().slice(-4)}`,
        title: action.payload.title?.trim() || 'Untitled Book',
        author: action.payload.author?.trim() || 'Unknown Author',
        isbn: action.payload.isbn?.trim() || 'N/A',
        category: action.payload.category || 'General',
        publisher: action.payload.publisher?.trim() || 'Independent Publisher',
        publishedYear: (action.payload.publishedYear || action.payload.publicationYear || new Date().getFullYear()).toString(),
        description: action.payload.description?.trim() || 'No description provided for this volume.',
        coverImage: action.payload.coverImage?.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
        totalCopies,
        copies: totalCopies,
        availableCopies,
        status: availableCopies > 0 ? (action.payload.status || 'Available') : 'Borrowed',
        createdAt: action.payload.createdAt || new Date().toISOString()
      };

      const updatedBooks = [newBook, ...state.books];
      const categoryExists = newBook.category && state.categories.includes(newBook.category);
      const updatedCategories = newBook.category && !categoryExists
        ? [...state.categories, newBook.category]
        : state.categories;

      return {
        ...state,
        books: updatedBooks,
        categories: updatedCategories,
        statistics: calculateStatistics(updatedBooks, state.students, state.issuedBooks, state.returnedBooks)
      };
    }

    // ----------------------------------------------------
    // BOOKS: UPDATE_BOOK
    // ----------------------------------------------------
    case ACTIONS.UPDATE_BOOK: {
      if (!action.payload?.id) return state;

      const updatedBooks = state.books.map((book) => {
        if (book.id !== action.payload.id) return book;

        const newTotalCopies = Number(action.payload.totalCopies ?? action.payload.copies ?? book.totalCopies ?? book.copies) || 1;
        const previousTotal = Number(book.totalCopies ?? book.copies) || 1;
        const copyDiff = newTotalCopies - previousTotal;

        let newAvailableCopies = action.payload.availableCopies !== undefined
          ? Number(action.payload.availableCopies)
          : Math.max(0, (book.availableCopies ?? previousTotal) + copyDiff);

        newAvailableCopies = Math.min(newTotalCopies, Math.max(0, newAvailableCopies));

        return {
          ...book,
          ...action.payload,
          totalCopies: newTotalCopies,
          copies: newTotalCopies,
          availableCopies: newAvailableCopies,
          publishedYear: (action.payload.publishedYear || action.payload.publicationYear || book.publishedYear || book.publicationYear).toString(),
          status: newAvailableCopies > 0 ? (action.payload.status || 'Available') : 'Borrowed'
        };
      });

      return {
        ...state,
        books: updatedBooks,
        statistics: calculateStatistics(updatedBooks, state.students, state.issuedBooks, state.returnedBooks)
      };
    }

    // ----------------------------------------------------
    // BOOKS: DELETE_BOOK
    // ----------------------------------------------------
    case ACTIONS.DELETE_BOOK: {
      const bookId = action.payload;
      const updatedBooks = state.books.filter((b) => b.id !== bookId);

      return {
        ...state,
        books: updatedBooks,
        statistics: calculateStatistics(updatedBooks, state.students, state.issuedBooks, state.returnedBooks)
      };
    }

    // ----------------------------------------------------
    // STUDENTS: ADD_STUDENT
    // ----------------------------------------------------
    case ACTIONS.ADD_STUDENT: {
      if (!action.payload) return state;

      const newStudent = {
        ...action.payload,
        id: action.payload.id || `STU-${Date.now().toString().slice(-4)}`,
        name: action.payload.name?.trim() || 'New Student',
        studentId: action.payload.studentId?.trim() || action.payload.rollNumber?.trim() || `STU-${Date.now().toString().slice(-4)}`,
        email: action.payload.email?.trim() || '',
        phone: action.payload.phone?.trim() || 'N/A',
        department: action.payload.department?.trim() || 'General Studies',
        joinedDate: action.payload.joinedDate || new Date().toISOString().split('T')[0],
        booksIssued: Number(action.payload.booksIssued) || 0
      };

      const updatedStudents = [newStudent, ...state.students];

      return {
        ...state,
        students: updatedStudents,
        statistics: calculateStatistics(state.books, updatedStudents, state.issuedBooks, state.returnedBooks)
      };
    }

    // ----------------------------------------------------
    // STUDENTS: UPDATE_STUDENT
    // ----------------------------------------------------
    case ACTIONS.UPDATE_STUDENT: {
      if (!action.payload?.id) return state;

      const updatedStudents = state.students.map((student) => {
        if (student.id !== action.payload.id) return student;
        return {
          ...student,
          ...action.payload,
          studentId: action.payload.studentId || action.payload.rollNumber || student.studentId || student.rollNumber,
          booksIssued: action.payload.booksIssued !== undefined
            ? Number(action.payload.booksIssued)
            : student.booksIssued
        };
      });

      return {
        ...state,
        students: updatedStudents,
        statistics: calculateStatistics(state.books, updatedStudents, state.issuedBooks, state.returnedBooks)
      };
    }

    // ----------------------------------------------------
    // STUDENTS: DELETE_STUDENT
    // ----------------------------------------------------
    case ACTIONS.DELETE_STUDENT: {
      const studentId = action.payload;
      const updatedStudents = state.students.filter((s) => s.id !== studentId);

      return {
        ...state,
        students: updatedStudents,
        statistics: calculateStatistics(state.books, updatedStudents, state.issuedBooks, state.returnedBooks)
      };
    }

    // ----------------------------------------------------
    // TRANSACTIONS: ISSUE_BOOK
    // ----------------------------------------------------
    case ACTIONS.ISSUE_BOOK: {
      const { bookId, studentId, dueDate } = action.payload;
      const targetBook = state.books.find((b) => b.id === bookId);
      const targetStudent = state.students.find((s) => s.id === studentId);

      // PREVENT ISSUING TO NONEXISTENT STUDENT OR BOOK
      if (!targetBook || !targetStudent) {
        console.warn('ISSUE_BOOK error: Target book or student not found.');
        return state;
      }

      // PREVENT ISSUING UNAVAILABLE BOOKS
      if ((targetBook.availableCopies || 0) <= 0) {
        console.warn('ISSUE_BOOK error: No available copies to issue.');
        return state;
      }

      // Update book copies
      const newAvailable = Math.max(0, targetBook.availableCopies - 1);
      const updatedBooks = state.books.map((b) => {
        if (b.id !== bookId) return b;
        return {
          ...b,
          availableCopies: newAvailable,
          status: newAvailable === 0 ? 'Borrowed' : b.status
        };
      });

      // Update student issued count
      const updatedStudents = state.students.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          booksIssued: (s.booksIssued || 0) + 1
        };
      });

      // Create new transaction in issuedBooks
      const newTransaction = {
        id: action.payload.id || `TXN-${Date.now().toString().slice(-4)}`,
        bookId: targetBook.id,
        bookTitle: targetBook.title,
        studentId: targetStudent.id,
        studentName: targetStudent.name,
        issueDate: action.payload.issueDate || new Date().toISOString().split('T')[0],
        dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        returnDate: null,
        status: 'Issued'
      };

      const updatedIssuedBooks = [newTransaction, ...state.issuedBooks];

      return {
        ...state,
        books: updatedBooks,
        students: updatedStudents,
        issuedBooks: updatedIssuedBooks,
        statistics: calculateStatistics(updatedBooks, updatedStudents, updatedIssuedBooks, state.returnedBooks)
      };
    }

    // ----------------------------------------------------
    // TRANSACTIONS: RETURN_BOOK
    // ----------------------------------------------------
    case ACTIONS.RETURN_BOOK: {
      const transactionId = typeof action.payload === 'string' ? action.payload : action.payload?.id;
      const transaction = state.issuedBooks.find((tx) => tx.id === transactionId);

      // PREVENT RETURNING AN ALREADY RETURNED BOOK OR NON-EXISTENT TRANSACTION
      if (!transaction) {
        console.warn('RETURN_BOOK error: Transaction not found in active issued books (or already returned).');
        return state;
      }

      // 1. Remove from issuedBooks
      const updatedIssuedBooks = state.issuedBooks.filter((tx) => tx.id !== transactionId);

      // 2. Add to returnedBooks
      const returnDate = (typeof action.payload === 'object' && action.payload?.returnDate)
        ? action.payload.returnDate
        : new Date().toISOString().split('T')[0];

      const returnedRecord = {
        ...transaction,
        status: 'Returned',
        returnDate
      };
      const updatedReturnedBooks = [returnedRecord, ...state.returnedBooks];

      // 3. Increment available copies for book
      const updatedBooks = state.books.map((b) => {
        if (b.id !== transaction.bookId) return b;
        const total = Number(b.totalCopies ?? b.copies) || 1;
        const restoredCopies = Math.min(total, (b.availableCopies || 0) + 1);
        return {
          ...b,
          availableCopies: restoredCopies,
          status: restoredCopies > 0 ? 'Available' : b.status
        };
      });

      // 4. Decrement student booksIssued count
      const updatedStudents = state.students.map((s) => {
        if (s.id !== transaction.studentId) return s;
        return {
          ...s,
          booksIssued: Math.max(0, (s.booksIssued || 1) - 1)
        };
      });

      return {
        ...state,
        books: updatedBooks,
        students: updatedStudents,
        issuedBooks: updatedIssuedBooks,
        returnedBooks: updatedReturnedBooks,
        statistics: calculateStatistics(updatedBooks, updatedStudents, updatedIssuedBooks, updatedReturnedBooks)
      };
    }

    // ----------------------------------------------------
    // UI ACTIONS
    // ----------------------------------------------------
    case ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };

    case ACTIONS.TOGGLE_SIDEBAR:
      return { ...state, isSidebarCollapsed: !state.isSidebarCollapsed };

    case ACTIONS.TOGGLE_MOBILE_MENU:
      return { ...state, isMobileMenuOpen: !state.isMobileMenuOpen };

    case ACTIONS.CLOSE_MOBILE_MENU:
      return { ...state, isMobileMenuOpen: false };

    default:
      return state;
  }
}

export default libraryReducer;
