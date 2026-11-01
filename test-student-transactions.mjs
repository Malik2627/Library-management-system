import { libraryReducer, ACTIONS, initialState, calculateStatistics } from './src/reducer/LibraryReducer.js';

console.log('====================================================');
console.log('🧪 RUNNING STUDENT MANAGEMENT & TRANSACTIONS TEST SUITE');
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

// Prepare initial state
const testData = {
  books: [
    {
      id: 'BK-001',
      title: 'Operating Systems: Three Easy Pieces',
      author: 'Remzi Arpaci-Dusseau',
      isbn: '978-1985086593',
      category: 'Computer Science',
      publisher: 'Arpaci-Dusseau Books',
      publishedYear: '2018',
      totalCopies: 1, // Only 1 copy available!
      copies: 1,
      availableCopies: 1,
      status: 'Available',
      createdAt: '2026-01-01'
    },
    {
      id: 'BK-002',
      title: 'Database System Concepts',
      author: 'Abraham Silberschatz',
      isbn: '978-0078022159',
      category: 'Data Science',
      publisher: 'McGraw-Hill',
      publishedYear: '2019',
      totalCopies: 2,
      copies: 2,
      availableCopies: 2,
      status: 'Available',
      createdAt: '2026-01-01'
    }
  ],
  students: [
    {
      id: 'STU-001',
      name: 'Priya Sharma',
      studentId: 'CS2026-101',
      email: 'priya@test.edu',
      phone: '+91 98765 00001',
      department: 'Computer Science',
      joinedDate: '2026-08-01',
      booksIssued: 0
    }
  ],
  issuedBooks: [],
  returnedBooks: []
};

let state = libraryReducer(initialState, { type: ACTIONS.LOAD_DATA, payload: testData });
assert(state.students.length === 1, 'Initial student loaded');
assert(state.books.length === 2, 'Initial books loaded');

// ----------------------------------------------------
// 1. STUDENT MANAGEMENT: ADD STUDENT
// ----------------------------------------------------
const newStudent = {
  id: 'STU-002',
  name: 'Vikram Joshi',
  studentId: 'IT2026-202',
  email: 'vikram@test.edu',
  phone: '+91 98765 00002',
  department: 'Information Technology',
  joinedDate: '2026-08-15'
};

state = libraryReducer(state, { type: ACTIONS.ADD_STUDENT, payload: newStudent });
const addedStudent = state.students.find(s => s.id === 'STU-002');

assert(state.students.length === 2, 'ADD_STUDENT increased student count to 2');
assert(addedStudent !== undefined, 'ADD_STUDENT student found in state');
assert(addedStudent.studentId === 'IT2026-202', 'ADD_STUDENT preserved studentId field');
assert(addedStudent.phone === '+91 98765 00002', 'ADD_STUDENT preserved phone field');
assert(state.statistics.totalStudents === 2, 'ADD_STUDENT recalculated totalStudents statistics');

// ----------------------------------------------------
// 2. STUDENT MANAGEMENT: EDIT STUDENT
// ----------------------------------------------------
state = libraryReducer(state, {
  type: ACTIONS.UPDATE_STUDENT,
  payload: { id: 'STU-002', department: 'Software Engineering', phone: '+91 98765 99999' }
});
const updatedStudent = state.students.find(s => s.id === 'STU-002');

assert(updatedStudent.department === 'Software Engineering', 'UPDATE_STUDENT updated department');
assert(updatedStudent.phone === '+91 98765 99999', 'UPDATE_STUDENT updated phone number');

// ----------------------------------------------------
// 3. STUDENT MANAGEMENT: SEARCH STUDENTS
// ----------------------------------------------------
function searchStudents(query) {
  const q = query.toLowerCase();
  return state.students.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.studentId.toLowerCase().includes(q) ||
    s.email.toLowerCase().includes(q) ||
    s.department.toLowerCase().includes(q)
  );
}

assert(searchStudents('Priya').length === 1, 'SEARCH STUDENT: found by name');
assert(searchStudents('IT2026-202').length === 1, 'SEARCH STUDENT: found by studentId');
assert(searchStudents('vikram@test.edu').length === 1, 'SEARCH STUDENT: found by email');
assert(searchStudents('Software Engineering').length === 1, 'SEARCH STUDENT: found by department');

// ----------------------------------------------------
// 4. BOOK ISSUE SYSTEM: VALID ISSUE
// ----------------------------------------------------
state = libraryReducer(state, {
  type: ACTIONS.ISSUE_BOOK,
  payload: {
    id: 'TXN-5001',
    bookId: 'BK-001',
    studentId: 'STU-001',
    issueDate: '2026-10-10',
    dueDate: '2026-10-24'
  }
});

const book1AfterIssue = state.books.find(b => b.id === 'BK-001');
const student1AfterIssue = state.students.find(s => s.id === 'STU-001');
const createdTx = state.issuedBooks.find(tx => tx.id === 'TXN-5001');

assert(state.issuedBooks.length === 1, 'ISSUE_BOOK added record to issuedBooks');
assert(createdTx !== undefined, 'ISSUE_BOOK transaction record exists');
assert(createdTx.status === 'Issued', 'ISSUE_BOOK transaction status is "Issued"');
assert(createdTx.returnDate === null, 'ISSUE_BOOK transaction returnDate is null');
assert(book1AfterIssue.availableCopies === 0, 'ISSUE_BOOK decremented availableCopies to 0');
assert(book1AfterIssue.status === 'Borrowed', 'ISSUE_BOOK changed book status to "Borrowed" when copies reached 0');
assert(student1AfterIssue.booksIssued === 1, 'ISSUE_BOOK incremented student booksIssued count to 1');
assert(state.statistics.totalIssued === 1, 'ISSUE_BOOK updated totalIssued statistics');

// ----------------------------------------------------
// 5. GUARD RAIL: PREVENT ISSUING UNAVAILABLE BOOK
// ----------------------------------------------------
const stateBeforeUnavailableTry = state;
state = libraryReducer(state, {
  type: ACTIONS.ISSUE_BOOK,
  payload: {
    id: 'TXN-5002',
    bookId: 'BK-001', // availableCopies is now 0!
    studentId: 'STU-002',
    dueDate: '2026-11-15'
  }
});

assert(state.issuedBooks.length === 1, 'PREVENT ISSUE: blocked issuing book with 0 available copies');
assert(!state.issuedBooks.some(tx => tx.id === 'TXN-5002'), 'PREVENT ISSUE: invalid transaction was rejected');

// ----------------------------------------------------
// 6. GUARD RAIL: PREVENT ISSUING TO NONEXISTENT STUDENT
// ----------------------------------------------------
state = libraryReducer(state, {
  type: ACTIONS.ISSUE_BOOK,
  payload: {
    id: 'TXN-5003',
    bookId: 'BK-002',
    studentId: 'NON-EXISTENT-STUDENT',
    dueDate: '2026-11-15'
  }
});
assert(state.issuedBooks.length === 1, 'PREVENT ISSUE: blocked issuing to nonexistent student');

// ----------------------------------------------------
// 7. BOOK RETURN SYSTEM: VALID RETURN
// ----------------------------------------------------
state = libraryReducer(state, {
  type: ACTIONS.RETURN_BOOK,
  payload: {
    id: 'TXN-5001',
    returnDate: '2026-10-23'
  }
});

const book1AfterReturn = state.books.find(b => b.id === 'BK-001');
const student1AfterReturn = state.students.find(s => s.id === 'STU-001');
const returnedTx = state.returnedBooks.find(tx => tx.id === 'TXN-5001');

assert(state.issuedBooks.length === 0, 'RETURN_BOOK removed transaction from issuedBooks');
assert(state.returnedBooks.length === 1, 'RETURN_BOOK appended record to returnedBooks');
assert(returnedTx.status === 'Returned', 'RETURN_BOOK updated status to "Returned"');
assert(returnedTx.returnDate === '2026-10-23', 'RETURN_BOOK recorded valid returnDate');
assert(book1AfterReturn.availableCopies === 1, 'RETURN_BOOK restored availableCopies to 1');
assert(book1AfterReturn.status === 'Available', 'RETURN_BOOK restored book status to "Available"');
assert(student1AfterReturn.booksIssued === 0, 'RETURN_BOOK decremented student booksIssued back to 0');
assert(state.statistics.totalReturned === 1, 'RETURN_BOOK updated totalReturned statistics');

// ----------------------------------------------------
// 8. GUARD RAIL: PREVENT RETURNING AN ALREADY RETURNED BOOK
// ----------------------------------------------------
const stateBeforeDuplicateReturn = state;
state = libraryReducer(state, {
  type: ACTIONS.RETURN_BOOK,
  payload: 'TXN-5001' // Already returned!
});

assert(state.returnedBooks.length === 1, 'PREVENT DUPLICATE RETURN: returnedBooks count unchanged');
assert(state.books.find(b => b.id === 'BK-001').availableCopies === 1, 'PREVENT DUPLICATE RETURN: availableCopies not inflated');

// ----------------------------------------------------
// 9. STUDENT MANAGEMENT: DELETE STUDENT
// ----------------------------------------------------
state = libraryReducer(state, { type: ACTIONS.DELETE_STUDENT, payload: 'STU-002' });
assert(state.students.length === 1, 'DELETE_STUDENT successfully removed student');
assert(!state.students.some(s => s.id === 'STU-002'), 'DELETE_STUDENT verified removed from state');

// ----------------------------------------------------
// 10. OVERDUE DETECTION TEST
// ----------------------------------------------------
const testToday = '2026-11-01';
const overdueTx = {
  id: 'TXN-OVERDUE-TEST',
  dueDate: '2026-10-25', // 7 days past testToday
  status: 'Issued'
};
const onTimeTx = {
  id: 'TXN-ONTIME-TEST',
  dueDate: '2026-11-10', // In the future
  status: 'Issued'
};

const isTxOverdue = (tx, refDate) => tx.status === 'Issued' && tx.dueDate < refDate;
assert(isTxOverdue(overdueTx, testToday) === true, 'OVERDUE CHECK: successfully flagged overdue loan');
assert(isTxOverdue(onTimeTx, testToday) === false, 'OVERDUE CHECK: verified on-time loan is not flagged');

console.log('====================================================');
console.log(`SUMMARY: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) process.exit(1);

