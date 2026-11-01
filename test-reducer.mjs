import { libraryReducer, ACTIONS, initialState, calculateStatistics } from './src/reducer/LibraryReducer.js';

console.log('====================================================');
console.log('🧪 RUNNING LIBRARYHUB REDUCER TEST SUITE');
console.log('====================================================');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    testsPassed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    testsFailed++;
  }
}

// ------------------------------------------------------------------
// TEST 1: LOAD_DATA
// ------------------------------------------------------------------
const sampleData = {
  books: [
    { id: 'BK-1', title: 'Test Book 1', author: 'Author 1', isbn: '111', copies: 3, availableCopies: 3, status: 'Available' },
    { id: 'BK-2', title: 'Test Book 2', author: 'Author 2', isbn: '222', copies: 2, availableCopies: 2, status: 'Available' }
  ],
  students: [
    { id: 'STU-1', name: 'Student 1', email: 's1@test.com', rollNumber: 'R1', booksIssued: 0 },
    { id: 'STU-2', name: 'Student 2', email: 's2@test.com', rollNumber: 'R2', booksIssued: 0 }
  ],
  issuedBooks: [],
  returnedBooks: [],
  categories: ['Computer Science', 'Literature']
};

let state = libraryReducer(initialState, { type: ACTIONS.LOAD_DATA, payload: sampleData });
assert(state.books.length === 2, 'LOAD_DATA loads initial books');
assert(state.students.length === 2, 'LOAD_DATA loads initial students');
assert(state.statistics.totalBooks === 2, 'LOAD_DATA calculates totalBooks metric');
assert(state.statistics.totalCopies === 5, 'LOAD_DATA calculates totalCopies metric');
assert(state.statistics.availableCopies === 5, 'LOAD_DATA calculates availableCopies metric');

// ------------------------------------------------------------------
// TEST 2: ADD_BOOK
// ------------------------------------------------------------------
const newBookPayload = {
  id: 'BK-3',
  title: 'JavaScript The Good Parts',
  author: 'Douglas Crockford',
  isbn: '978-0596517748',
  category: 'Computer Science',
  copies: 4,
  availableCopies: 4
};
state = libraryReducer(state, { type: ACTIONS.ADD_BOOK, payload: newBookPayload });
assert(state.books.length === 3, 'ADD_BOOK adds a new book to the catalog');
assert(state.books[0].id === 'BK-3', 'ADD_BOOK places new book at top of array');
assert(state.statistics.totalBooks === 3, 'ADD_BOOK updates totalBooks statistic');
assert(state.statistics.totalCopies === 9, 'ADD_BOOK updates totalCopies statistic (5 + 4 = 9)');

// ------------------------------------------------------------------
// TEST 3: UPDATE_BOOK
// ------------------------------------------------------------------
state = libraryReducer(state, {
  type: ACTIONS.UPDATE_BOOK,
  payload: { id: 'BK-3', title: 'JavaScript The Good Parts (2nd Edition)', copies: 6, availableCopies: 6 }
});
const updatedBook = state.books.find(b => b.id === 'BK-3');
assert(updatedBook.title === 'JavaScript The Good Parts (2nd Edition)', 'UPDATE_BOOK updates book title');
assert(state.statistics.totalCopies === 11, 'UPDATE_BOOK recalculates totalCopies (5 + 6 = 11)');

// ------------------------------------------------------------------
// TEST 4: DELETE_BOOK
// ------------------------------------------------------------------
state = libraryReducer(state, { type: ACTIONS.DELETE_BOOK, payload: 'BK-2' });
assert(state.books.length === 2, 'DELETE_BOOK removes the book from catalog');
assert(!state.books.some(b => b.id === 'BK-2'), 'DELETE_BOOK verified book ID removed');
assert(state.statistics.totalBooks === 2, 'DELETE_BOOK recalculates totalBooks (3 - 1 = 2)');

// ------------------------------------------------------------------
// TEST 5: ADD_STUDENT
// ------------------------------------------------------------------
const newStudentPayload = {
  id: 'STU-3',
  name: 'Meera Rao',
  email: 'meera@test.com',
  rollNumber: 'CS2024-088'
};
state = libraryReducer(state, { type: ACTIONS.ADD_STUDENT, payload: newStudentPayload });
assert(state.students.length === 3, 'ADD_STUDENT adds student to registry');
assert(state.statistics.totalStudents === 3, 'ADD_STUDENT recalculates totalStudents');

// ------------------------------------------------------------------
// TEST 6: UPDATE_STUDENT
// ------------------------------------------------------------------
state = libraryReducer(state, {
  type: ACTIONS.UPDATE_STUDENT,
  payload: { id: 'STU-3', department: 'Information Science' }
});
const updatedStudent = state.students.find(s => s.id === 'STU-3');
assert(updatedStudent.department === 'Information Science', 'UPDATE_STUDENT updates department');

// ------------------------------------------------------------------
// TEST 7: DELETE_STUDENT
// ------------------------------------------------------------------
state = libraryReducer(state, { type: ACTIONS.DELETE_STUDENT, payload: 'STU-2' });
assert(state.students.length === 2, 'DELETE_STUDENT removes student from registry');
assert(!state.students.some(s => s.id === 'STU-2'), 'DELETE_STUDENT verified student ID removed');

// ------------------------------------------------------------------
// TEST 8: ISSUE_BOOK
// ------------------------------------------------------------------
const bookToIssue = state.books.find(b => b.id === 'BK-1');
const initialAvail = bookToIssue.availableCopies;

state = libraryReducer(state, {
  type: ACTIONS.ISSUE_BOOK,
  payload: {
    id: 'TXN-9001',
    bookId: 'BK-1',
    studentId: 'STU-1',
    dueDate: '2024-12-01'
  }
});

const bookAfterIssue = state.books.find(b => b.id === 'BK-1');
const studentAfterIssue = state.students.find(s => s.id === 'STU-1');

assert(state.issuedBooks.length === 1, 'ISSUE_BOOK creates transaction in issuedBooks');
assert(bookAfterIssue.availableCopies === initialAvail - 1, 'ISSUE_BOOK decrements book availableCopies');
assert(studentAfterIssue.booksIssued === 1, 'ISSUE_BOOK increments student booksIssued counter');
assert(state.statistics.totalIssued === 1, 'ISSUE_BOOK updates totalIssued statistics');

// ------------------------------------------------------------------
// TEST 9: RETURN_BOOK
// ------------------------------------------------------------------
state = libraryReducer(state, {
  type: ACTIONS.RETURN_BOOK,
  payload: 'TXN-9001'
});

const bookAfterReturn = state.books.find(b => b.id === 'BK-1');
const studentAfterReturn = state.students.find(s => s.id === 'STU-1');

assert(state.issuedBooks.length === 0, 'RETURN_BOOK removes transaction from issuedBooks');
assert(state.returnedBooks.length === 1, 'RETURN_BOOK archives record in returnedBooks');
assert(bookAfterReturn.availableCopies === initialAvail, 'RETURN_BOOK restores book availableCopies');
assert(studentAfterReturn.booksIssued === 0, 'RETURN_BOOK decrements student booksIssued counter');
assert(state.statistics.totalReturned === 1, 'RETURN_BOOK increments totalReturned statistics');

// ------------------------------------------------------------------
// TEST 10: CLEAR_DATA
// ------------------------------------------------------------------
state = libraryReducer(state, { type: ACTIONS.CLEAR_DATA });
assert(state.books.length === 0, 'CLEAR_DATA empties books');
assert(state.students.length === 0, 'CLEAR_DATA empties students');
assert(state.issuedBooks.length === 0, 'CLEAR_DATA empties issuedBooks');
assert(state.returnedBooks.length === 0, 'CLEAR_DATA empties returnedBooks');
assert(state.statistics.totalBooks === 0, 'CLEAR_DATA resets statistics');

console.log('====================================================');
console.log(`SUMMARY: ${testsPassed} passed, ${testsFailed} failed.`);
console.log('====================================================');

if (testsFailed > 0) {
  process.exit(1);
}

