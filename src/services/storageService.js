import { 
  INITIAL_BOOKS, 
  INITIAL_STUDENTS, 
  INITIAL_ISSUED_BOOKS, 
  INITIAL_RETURNED_BOOKS,
  INITIAL_CATEGORIES 
} from '../utils/constants.js';

const STORAGE_KEYS = {
  BOOKS: 'libraryhub_books',
  STUDENTS: 'libraryhub_students',
  ISSUED_BOOKS: 'libraryhub_issued_books',
  RETURNED_BOOKS: 'libraryhub_returned_books',
  CATEGORIES: 'libraryhub_categories'
};

export const storageService = {
  loadAllData: () => {
    try {
      const booksData = localStorage.getItem(STORAGE_KEYS.BOOKS);
      const studentsData = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      const issuedData = localStorage.getItem(STORAGE_KEYS.ISSUED_BOOKS);
      const returnedData = localStorage.getItem(STORAGE_KEYS.RETURNED_BOOKS);
      const categoriesData = localStorage.getItem(STORAGE_KEYS.CATEGORIES);

      const books = booksData ? JSON.parse(booksData) : INITIAL_BOOKS;
      const students = studentsData ? JSON.parse(studentsData) : INITIAL_STUDENTS;
      const issuedBooks = issuedData ? JSON.parse(issuedData) : INITIAL_ISSUED_BOOKS;
      const returnedBooks = returnedData ? JSON.parse(returnedData) : INITIAL_RETURNED_BOOKS;
      const categories = categoriesData ? JSON.parse(categoriesData) : INITIAL_CATEGORIES;

      // Seed if first time run
      if (!booksData) localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
      if (!studentsData) localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      if (!issuedData) localStorage.setItem(STORAGE_KEYS.ISSUED_BOOKS, JSON.stringify(INITIAL_ISSUED_BOOKS));
      if (!returnedData) localStorage.setItem(STORAGE_KEYS.RETURNED_BOOKS, JSON.stringify(INITIAL_RETURNED_BOOKS));
      if (!categoriesData) localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));

      return {
        books,
        students,
        issuedBooks,
        returnedBooks,
        categories
      };
    } catch (err) {
      console.error('Failed to load library data from LocalStorage:', err);
      return {
        books: INITIAL_BOOKS,
        students: INITIAL_STUDENTS,
        issuedBooks: INITIAL_ISSUED_BOOKS,
        returnedBooks: INITIAL_RETURNED_BOOKS,
        categories: INITIAL_CATEGORIES
      };
    }
  },

  saveBooks: (books) => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    } catch (err) {
      console.error('Failed to persist books to LocalStorage:', err);
    }
  },

  saveStudents: (students) => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (err) {
      console.error('Failed to persist students to LocalStorage:', err);
    }
  },

  saveIssuedBooks: (issuedBooks) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ISSUED_BOOKS, JSON.stringify(issuedBooks));
    } catch (err) {
      console.error('Failed to persist issued books to LocalStorage:', err);
    }
  },

  saveReturnedBooks: (returnedBooks) => {
    try {
      localStorage.setItem(STORAGE_KEYS.RETURNED_BOOKS, JSON.stringify(returnedBooks));
    } catch (err) {
      console.error('Failed to persist returned books to LocalStorage:', err);
    }
  },

  saveCategories: (categories) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (err) {
      console.error('Failed to persist categories to LocalStorage:', err);
    }
  },

  clearAllData: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.BOOKS);
      localStorage.removeItem(STORAGE_KEYS.STUDENTS);
      localStorage.removeItem(STORAGE_KEYS.ISSUED_BOOKS);
      localStorage.removeItem(STORAGE_KEYS.RETURNED_BOOKS);
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    } catch (err) {
      console.error('Failed to clear LocalStorage:', err);
    }
  }
};
