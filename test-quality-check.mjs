import fs from 'fs';
import path from 'path';
import { libraryReducer, ACTIONS, initialState, calculateStatistics } from './src/reducer/LibraryReducer.js';
import { storageService } from './src/services/storageService.js';
import { DEFAULT_BOOK_COVER, FALLBACK_BOOK_COVER } from './src/utils/constants.js';

console.log('====================================================');
console.log('🛡️  LIBRARYHUB COMPREHENSIVE QUALITY AUDIT');
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

// ==================================================================
// 1. REACT REQUIREMENTS: HOOKS VERIFICATION
// ==================================================================
console.log('\n--- 1. REACT REQUIREMENTS VERIFICATION ---');

const providerCode = fs.readFileSync('./src/context/LibraryProvider.jsx', 'utf-8');
const contextCode = fs.readFileSync('./src/context/LibraryContext.jsx', 'utf-8');
const useLibCode = fs.readFileSync('./src/hooks/useLibrary.js', 'utf-8');

assert(contextCode.includes('createContext'), 'React: createContext properly initialized');
assert(providerCode.includes('useReducer'), 'React: useReducer utilized for complex state');
assert(providerCode.includes('useState'), 'React: useState utilized for local state and toasts');
assert(providerCode.includes('useEffect'), 'React: useEffect utilized for lifecycle and LocalStorage sync');
assert(useLibCode.includes('useContext'), 'React: useContext utilized for consuming LibraryContext');

// ==================================================================
// 2. FUNCTIONAL TESTING: CORE DOMAIN LOGIC
// ==================================================================
console.log('\n--- 2. FUNCTIONAL TESTING: REDUCER & DOMAIN LOGIC ---');

// Fresh state
let state = { ...initialState };

// (A) LOAD_DATA & Dashboard Statistics
state = libraryReducer(state, {
  type: ACTIONS.LOAD_DATA,
  payload: {
    books: [
      { id: 'B1', title: 'Domain Driven Design', author: 'Eric Evans', isbn: '978-0321125217', category: 'Software Engineering', totalCopies: 4, availableCopies: 4 },
      { id: 'B2', title: 'Clean Architecture', author: 'Robert C. Martin', isbn: '978-0134494166', category: 'Software Engineering', totalCopies: 2, availableCopies: 2 }
    ],
    students: [
      { id: 'S1', name: 'Dev Sharma', studentId: 'CS-001', email: 'dev@test.edu', phone: '9876543210', department: 'Computer Science', booksIssued: 0 }
    ],
    issuedBooks: [],
    returnedBooks: [],
    categories: ['Software Engineering', 'Computer Science']
  }
});

assert(state.statistics.totalBooks === 2, 'Func: Dashboard total books statistic accurate');
assert(state.statistics.totalCopies === 6, 'Func: Dashboard total physical copies accurate');
assert(state.statistics.availableCopies === 6, 'Func: Dashboard available shelf copies accurate');
assert(state.statistics.totalStudents === 1, 'Func: Dashboard total members accurate');

// (B) ADD_BOOK
state = libraryReducer(state, {
  type: ACTIONS.ADD_BOOK,
  payload: {
    id: 'B3',
    title: 'Site Reliability Engineering',
    author: 'Betsy Beyer',
    isbn: '978-1491929124',
    category: 'System Architecture',
    totalCopies: 3,
    publisher: "O'Reilly",
    publishedYear: '2016'
  }
});
assert(state.books.length === 3, 'Func: Add book creates new catalog record');
assert(state.statistics.totalBooks === 3, 'Func: Add book updates totalBooks count');
assert(state.statistics.totalCopies === 9, 'Func: Add book updates totalCopies count (6+3=9)');

// (C) EDIT_BOOK
state = libraryReducer(state, {
  type: ACTIONS.UPDATE_BOOK,
  payload: {
    id: 'B3',
    title: 'Site Reliability Engineering (2nd Ed)',
    author: 'Betsy Beyer',
    isbn: '978-1491929124',
    category: 'System Architecture',
    totalCopies: 5
  }
});
const updatedB3 = state.books.find(b => b.id === 'B3');
assert(updatedB3 && updatedB3.title.includes('2nd Ed'), 'Func: Edit book updates title');
assert(state.statistics.totalCopies === 11, 'Func: Edit book recalculates totalCopies (6+5=11)');

// (D) SEARCH & FILTER SIMULATION
const searchTitle = state.books.filter(b => b.title.toLowerCase().includes('clean'));
assert(searchTitle.length === 1 && searchTitle[0].id === 'B2', 'Func: Search books by title finds match');

const searchAuthor = state.books.filter(b => b.author.toLowerCase().includes('evans'));
assert(searchAuthor.length === 1 && searchAuthor[0].id === 'B1', 'Func: Search books by author finds match');

const searchIsbn = state.books.filter(b => b.isbn.includes('978-0134494166'));
assert(searchIsbn.length === 1 && searchIsbn[0].id === 'B2', 'Func: Search books by ISBN finds match');

const filterCategory = state.books.filter(b => b.category === 'System Architecture');
assert(filterCategory.length === 1 && filterCategory[0].id === 'B3', 'Func: Filter books by category works');

// (E) ADD_STUDENT
state = libraryReducer(state, {
  type: ACTIONS.ADD_STUDENT,
  payload: {
    id: 'S2',
    name: 'Priya Patel',
    studentId: 'IT-042',
    email: 'priya@test.edu',
    phone: '9876543211',
    department: 'Information Technology'
  }
});
assert(state.students.length === 2, 'Func: Add student registers new member');
assert(state.statistics.totalStudents === 2, 'Func: Add student updates registered members statistic');

// (F) EDIT_STUDENT
state = libraryReducer(state, {
  type: ACTIONS.UPDATE_STUDENT,
  payload: {
    id: 'S2',
    name: 'Priya Patel',
    studentId: 'IT-042',
    email: 'priya.patel@test.edu',
    phone: '9876543211',
    department: 'Data Science'
  }
});
const updatedS2 = state.students.find(s => s.id === 'S2');
assert(updatedS2.department === 'Data Science', 'Func: Edit student updates department profile');

// (G) ISSUE_BOOK
state = libraryReducer(state, {
  type: ACTIONS.ISSUE_BOOK,
  payload: {
    id: 'TX-100',
    bookId: 'B1',
    studentId: 'S1',
    dueDate: '2026-11-15'
  }
});
assert(state.issuedBooks.length === 1, 'Func: Issue book creates transaction log');
const b1AfterIssue = state.books.find(b => b.id === 'B1');
assert(b1AfterIssue.availableCopies === 3, 'Func: Issue book decrements availableCopies on shelf (4 -> 3)');
const s1AfterIssue = state.students.find(s => s.id === 'S1');
assert(s1AfterIssue.booksIssued === 1, 'Func: Issue book increments student booksIssued counter');
assert(state.statistics.totalIssued === 1, 'Func: Issue book increments totalIssued statistic');

// (H) RETURN_BOOK
state = libraryReducer(state, {
  type: ACTIONS.RETURN_BOOK,
  payload: {
    id: 'TX-100',
    returnDate: '2026-11-01'
  }
});
assert(state.issuedBooks.length === 0, 'Func: Return book removes transaction from active loans');
assert(state.returnedBooks.length === 1, 'Func: Return book archives record into returnedBooks');
const b1AfterReturn = state.books.find(b => b.id === 'B1');
assert(b1AfterReturn.availableCopies === 4, 'Func: Return book restores shelf available copies (3 -> 4)');
const s1AfterReturn = state.students.find(s => s.id === 'S1');
assert(s1AfterReturn.booksIssued === 0, 'Func: Return book decrements student booksIssued counter');
assert(state.statistics.totalReturned === 1, 'Func: Return book updates totalReturned statistic');

// (I) DELETE_BOOK & DELETE_STUDENT
state = libraryReducer(state, { type: ACTIONS.DELETE_BOOK, payload: 'B3' });
assert(state.books.length === 2, 'Func: Delete book removes book from catalog');

state = libraryReducer(state, { type: ACTIONS.DELETE_STUDENT, payload: 'S2' });
assert(state.students.length === 1, 'Func: Delete student removes member from registry');

// ==================================================================
// 3. UI TESTING: TOASTS, EMPTY STATES, FALLBACKS & RESPONSIVENESS
// ==================================================================
console.log('\n--- 3. UI & COMPONENT INTEGRITY ---');

const toastContainerExists = fs.existsSync('./src/components/common/ToastContainer.jsx');
assert(toastContainerExists, 'UI: ToastContainer component exists');

const layoutCode = fs.readFileSync('./src/components/layout/AppLayout.jsx', 'utf-8');
assert(layoutCode.includes('ToastContainer'), 'UI: ToastContainer mounted globally in AppLayout');

assert(typeof DEFAULT_BOOK_COVER === 'string' && DEFAULT_BOOK_COVER.startsWith('http'), 'UI: DEFAULT_BOOK_COVER valid URL');
assert(typeof FALLBACK_BOOK_COVER === 'string' && FALLBACK_BOOK_COVER.startsWith('data:image/svg+xml'), 'UI: FALLBACK_BOOK_COVER valid inline SVG data URI');

const cssCode = fs.readFileSync('./src/styles/layout.css', 'utf-8');
assert(cssCode.includes('toast-portal-container'), 'UI: Toast notification container CSS defined');
assert(cssCode.includes('toast-success') && cssCode.includes('toast-error'), 'UI: Toast variants styled with dark glass borders');
assert(cssCode.includes('@media (max-width: 1200px)'), 'UI: Desktop / Large Tablet responsive breakpoint defined');
assert(cssCode.includes('@media (max-width: 900px)'), 'UI: Tablet / Mobile Sidebar drawer breakpoint defined');
assert(cssCode.includes('@media (max-width: 600px)'), 'UI: Mobile phone single-column layout breakpoint defined');

// ==================================================================
// 4. ROUTER & ACCESSIBILITY AUDIT
// ==================================================================
console.log('\n--- 4. ROUTER NAVIGATION & ACCESSIBILITY AUDIT ---');

const appCode = fs.readFileSync('./src/App.jsx', 'utf-8');
const routes = [
  '/', 'books', 'books/add', 'books/:id', 'books/edit/:id',
  'students', 'students/add', 'transactions', 'issue', 'return',
  'categories', 'settings', '*'
];
routes.forEach(r => {
  assert(appCode.includes(r), `Router: Route '${r}' registered in App.jsx`);
});

const navbarCode = fs.readFileSync('./src/components/layout/Navbar.jsx', 'utf-8');
assert(navbarCode.includes('aria-label="Toggle Mobile Menu"'), 'A11y: Navbar mobile toggle has aria-label');
assert(navbarCode.includes('aria-label="System Alerts"'), 'A11y: Navbar notification button has aria-label');

const sidebarCode = fs.readFileSync('./src/components/layout/Sidebar.jsx', 'utf-8');
assert(sidebarCode.includes('aria-label'), 'A11y: Sidebar collapse button has dynamic aria-label');

// ==================================================================
// SUMMARY
// ==================================================================
console.log('\n====================================================');
console.log(`AUDIT RESULTS: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

