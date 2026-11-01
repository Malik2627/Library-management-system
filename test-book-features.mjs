import { libraryReducer, ACTIONS, initialState, calculateStatistics } from './src/reducer/LibraryReducer.js';

console.log('====================================================');
console.log('🧪 RUNNING COMPLETE BOOK MANAGEMENT TEST SUITE');
console.log('====================================================');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failed++;
  }
}

// Initial state with 2 books
const initialSeed = {
  books: [
    {
      id: 'BK-101',
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      isbn: '978-0132350884',
      category: 'Computer Science',
      publisher: 'Prentice Hall',
      publishedYear: '2008',
      description: 'Even bad code can function...',
      coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a',
      totalCopies: 5,
      copies: 5,
      availableCopies: 4,
      status: 'Available',
      createdAt: '2026-09-01T10:00:00.000Z'
    },
    {
      id: 'BK-102',
      title: 'The Pragmatic Programmer: Your Journey To Mastery',
      author: 'Andrew Hunt & David Thomas',
      isbn: '978-0135957059',
      category: 'Software Engineering',
      publisher: 'Addison-Wesley Professional',
      publishedYear: '2019',
      description: 'Fresh content for modern developer careers...',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
      totalCopies: 4,
      copies: 4,
      availableCopies: 3,
      status: 'Available',
      createdAt: '2026-09-05T11:30:00.000Z'
    }
  ],
  students: [
    { id: 'STU-1001', name: 'Aarav Sharma', email: 'aarav@test.edu', booksIssued: 1 }
  ],
  issuedBooks: [],
  returnedBooks: []
};

let state = libraryReducer(initialState, { type: ACTIONS.LOAD_DATA, payload: initialSeed });
assert(state.books.length === 2, 'Initial books loaded successfully');
assert(state.statistics.totalBooks === 2, 'Total books statistic verified');
assert(state.statistics.totalCopies === 9, 'Total physical copies verified (5 + 4 = 9)');

// ----------------------------------------------------
// 1. TEST: ADD A NEW BOOK
// ----------------------------------------------------
const newBookPayload = {
  id: 'BK-107',
  title: 'Artificial Intelligence: A Modern Approach',
  author: 'Stuart Russell and Peter Norvig',
  isbn: '978-0134610993',
  category: 'Computer Science',
  publisher: 'Pearson',
  publishedYear: '2020',
  description: 'The most comprehensive, up-to-date introduction to the theory and practice of artificial intelligence.',
  coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
  totalCopies: 6
};

state = libraryReducer(state, { type: ACTIONS.ADD_BOOK, payload: newBookPayload });
const addedBook = state.books.find(b => b.id === 'BK-107');

assert(state.books.length === 3, 'ADD_BOOK increased catalog count to 3');
assert(addedBook !== undefined, 'ADD_BOOK newly created book exists in state');
assert(addedBook.publisher === 'Pearson', 'ADD_BOOK preserved publisher model attribute');
assert(addedBook.totalCopies === 6, 'ADD_BOOK preserved totalCopies attribute');
assert(addedBook.availableCopies === 6, 'ADD_BOOK initialized availableCopies equal to totalCopies');
assert(Boolean(addedBook.createdAt), 'ADD_BOOK assigned createdAt timestamp');
assert(state.statistics.totalBooks === 3, 'ADD_BOOK automatically updated dashboard totalBooks statistic');
assert(state.statistics.totalCopies === 15, 'ADD_BOOK automatically updated dashboard totalCopies (9 + 6 = 15)');

// ----------------------------------------------------
// 2. TEST: EDIT EXISTING BOOK
// ----------------------------------------------------
const editPayload = {
  id: 'BK-107',
  title: 'Artificial Intelligence: A Modern Approach (4th Global Edition)',
  publisher: 'Pearson Education Global',
  totalCopies: 8,
  publishedYear: '2021'
};

state = libraryReducer(state, { type: ACTIONS.UPDATE_BOOK, payload: editPayload });
const updatedBook = state.books.find(b => b.id === 'BK-107');

assert(updatedBook.title.includes('4th Global Edition'), 'UPDATE_BOOK successfully updated title');
assert(updatedBook.publisher === 'Pearson Education Global', 'UPDATE_BOOK successfully updated publisher');
assert(updatedBook.publishedYear === '2021', 'UPDATE_BOOK successfully updated publishedYear');
assert(updatedBook.totalCopies === 8, 'UPDATE_BOOK updated totalCopies to 8');
assert(updatedBook.availableCopies === 8, 'UPDATE_BOOK adjusted availableCopies proportionally');
assert(state.statistics.totalCopies === 17, 'UPDATE_BOOK automatically updated dashboard totalCopies (15 + 2 = 17)');

// ----------------------------------------------------
// 3. TEST: DELETE BOOK
// ----------------------------------------------------
state = libraryReducer(state, { type: ACTIONS.DELETE_BOOK, payload: 'BK-107' });
const deletedBookLookup = state.books.find(b => b.id === 'BK-107');

assert(deletedBookLookup === undefined, 'DELETE_BOOK removed target book from catalog');
assert(state.books.length === 2, 'DELETE_BOOK restored catalog count to 2');
assert(state.statistics.totalBooks === 2, 'DELETE_BOOK updated dashboard totalBooks statistic');
assert(state.statistics.totalCopies === 9, 'DELETE_BOOK updated dashboard totalCopies (17 - 8 = 9)');

// ----------------------------------------------------
// 4. TEST: SEARCH BY TITLE, AUTHOR & ISBN
// ----------------------------------------------------
function searchBooks(query) {
  const q = query.toLowerCase();
  return state.books.filter(b => 
    (b.title || '').toLowerCase().includes(q) ||
    (b.author || '').toLowerCase().includes(q) ||
    (b.isbn || '').toLowerCase().includes(q)
  );
}

// Search by Title
const titleSearchResults = searchBooks('Pragmatic');
assert(titleSearchResults.length === 1 && titleSearchResults[0].id === 'BK-102', 'SEARCH BY TITLE: found "The Pragmatic Programmer"');

// Search by Author
const authorSearchResults = searchBooks('Martin');
assert(authorSearchResults.length === 1 && authorSearchResults[0].id === 'BK-101', 'SEARCH BY AUTHOR: found book by Robert C. Martin');

// Search by ISBN
const isbnSearchResults = searchBooks('978-0135957059');
assert(isbnSearchResults.length === 1 && isbnSearchResults[0].id === 'BK-102', 'SEARCH BY ISBN: found book by exact ISBN number');

// Case insensitivity
const caseInsensitiveResults = searchBooks('clean code');
assert(caseInsensitiveResults.length === 1 && caseInsensitiveResults[0].id === 'BK-101', 'SEARCH CASE INSENSITIVITY: "clean code" matches "Clean Code"');

// ----------------------------------------------------
// 5. TEST: CATEGORY FILTERING & SORTING
// ----------------------------------------------------
// Filter by category
const csBooks = state.books.filter(b => b.category === 'Computer Science');
assert(csBooks.length === 1 && csBooks[0].id === 'BK-101', 'FILTER BY CATEGORY: isolated Computer Science titles');

// Sort by Title A-Z
const sortedAtoZ = [...state.books].sort((a, b) => a.title.localeCompare(b.title));
assert(sortedAtoZ[0].id === 'BK-101' && sortedAtoZ[1].id === 'BK-102', 'SORT BY TITLE A-Z: Clean Code precedes The Pragmatic Programmer');

// Sort by Publication Year Newest First
const sortedByYear = [...state.books].sort((a, b) => parseInt(b.publishedYear) - parseInt(a.publishedYear));
assert(sortedByYear[0].id === 'BK-102' && sortedByYear[1].id === 'BK-101', 'SORT BY YEAR NEWEST FIRST: 2019 precedes 2008');

console.log('====================================================');
console.log(`SUMMARY: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) process.exit(1);

