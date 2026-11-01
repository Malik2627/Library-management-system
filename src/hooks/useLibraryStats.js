import { useLibrary } from './useLibrary';

/**
 * Custom Hook: useLibraryStats
 * Exposes specialized computed metrics and distribution statistics.
 */
export function useLibraryStats() {
  const { statistics, books } = useLibrary();

  const circulationRate = statistics.totalCopies > 0
    ? Math.round((statistics.totalIssued / statistics.totalCopies) * 100)
    : 0;

  const categoryDistribution = books.reduce((acc, book) => {
    const category = book.category || 'General';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  return {
    ...statistics,
    circulationRate,
    categoryDistribution
  };
}

export default useLibraryStats;

