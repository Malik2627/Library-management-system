import { createContext } from 'react';

/**
 * Global Library Context
 * Created using React's createContext() API.
 * Holds all global library state: books, students, issuedBooks, returnedBooks,
 * categories, statistics, and UI state along with their dispatch actions.
 */
export const LibraryContext = createContext(null);

export { LibraryProvider } from './LibraryProvider';

export default LibraryContext;

