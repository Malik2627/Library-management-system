import { useContext } from 'react';
import { LibraryContext } from '../context/LibraryContext.jsx';

/**
 * Custom Hook: useLibrary
 * Uses React's useContext hook to access global library state & actions.
 * Enforces usage strictly within a LibraryProvider with proper error handling.
 */
export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}

export default useLibrary;
