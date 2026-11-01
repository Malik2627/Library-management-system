import fs from 'fs';

console.log('====================================================');
console.log('🧪 RUNNING ROUTE & COMPONENT VERIFICATION TEST');
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

// 1. Verify existence and content of every route page component
const routeFiles = [
  { file: './src/pages/DashboardPage.jsx', exportName: 'DashboardPage', route: '/' },
  { file: './src/pages/BooksPage.jsx', exportName: 'BooksPage', route: '/books' },
  { file: './src/pages/BookAddPage.jsx', exportName: 'BookAddPage', route: '/books/add' },
  { file: './src/pages/BookDetailPage.jsx', exportName: 'BookDetailPage', route: '/books/:id' },
  { file: './src/pages/BookEditPage.jsx', exportName: 'BookEditPage', route: '/books/edit/:id' },
  { file: './src/pages/StudentsPage.jsx', exportName: 'StudentsPage', route: '/students' },
  { file: './src/pages/StudentAddPage.jsx', exportName: 'StudentAddPage', route: '/students/add' },
  { file: './src/pages/TransactionsPage.jsx', exportName: 'TransactionsPage', route: '/transactions' },
  { file: './src/pages/IssueBookPage.jsx', exportName: 'IssueBookPage', route: '/issue' },
  { file: './src/pages/ReturnBookPage.jsx', exportName: 'ReturnBookPage', route: '/return' },
  { file: './src/pages/CategoriesPage.jsx', exportName: 'CategoriesPage', route: '/categories' },
  { file: './src/pages/SettingsPage.jsx', exportName: 'SettingsPage', route: '/settings' },
  { file: './src/pages/NotFoundPage.jsx', exportName: 'NotFoundPage', route: '*' }
];

routeFiles.forEach((rf) => {
  assert(fs.existsSync(rf.file), `FILE CHECK: ${rf.file} exists on disk`);
  const content = fs.readFileSync(rf.file, 'utf-8');
  assert(
    content.includes(`export function ${rf.exportName}`) || content.includes(`export const ${rf.exportName}`),
    `EXPORT CHECK: ${rf.exportName} exported in ${rf.file}`
  );
});

// 2. Verify dynamic parameter usage in BookDetailPage and BookEditPage
const detailCode = fs.readFileSync('./src/pages/BookDetailPage.jsx', 'utf-8');
assert(detailCode.includes('useParams()'), 'DYNAMIC PARAMS: BookDetailPage uses useParams() to read dynamic :id');
assert(detailCode.includes('books.find'), 'DYNAMIC LOOKUP: BookDetailPage looks up book dynamically from state');

const editCode = fs.readFileSync('./src/pages/BookEditPage.jsx', 'utf-8');
assert(editCode.includes('useParams()'), 'DYNAMIC PARAMS: BookEditPage uses useParams() to read dynamic :id');
assert(editCode.includes('books.find'), 'DYNAMIC LOOKUP: BookEditPage pre-populates selected book from state');

// 3. Verify App.jsx router configuration
const appCode = fs.readFileSync('./src/App.jsx', 'utf-8');
assert(appCode.includes('BrowserRouter'), 'ROUTER: App.jsx wraps with BrowserRouter');
assert(appCode.includes('LibraryProvider'), 'STATE PERSISTENCE: App.jsx wraps with LibraryProvider');

const expectedRoutes = [
  { path: 'index', name: 'Dashboard' },
  { path: 'books', name: 'All Books' },
  { path: 'books/add', name: 'Add Book' },
  { path: 'books/:id', name: 'Book Details (:id dynamic)' },
  { path: 'books/edit/:id', name: 'Edit Book (:id dynamic)' },
  { path: 'students', name: 'Students' },
  { path: 'students/add', name: 'Add Student' },
  { path: 'transactions', name: 'Transactions' },
  { path: 'issue', name: 'Issue Book' },
  { path: 'return', name: 'Return Book' },
  { path: 'categories', name: 'Categories' },
  { path: 'settings', name: 'Settings' },
  { path: '*', name: '404 Fallback' }
];

expectedRoutes.forEach((r) => {
  if (r.path === 'index') {
    assert(appCode.includes('index element={<DashboardPage />}'), `APP ROUTE: ${r.name} (index) configured`);
  } else {
    assert(appCode.includes(`path="${r.path}"`), `APP ROUTE: ${r.name} (path="${r.path}") configured`);
  }
});

// 4. Verify Sidebar.jsx has every required navlink
const sidebarCode = fs.readFileSync('./src/components/layout/Sidebar.jsx', 'utf-8');
const expectedSidebarPaths = [
  '/',
  '/books',
  '/books/add',
  '/students',
  '/transactions',
  '/issue',
  '/return',
  '/categories',
  '/settings'
];

expectedSidebarPaths.forEach((p) => {
  assert(sidebarCode.includes(`path: '${p}'`), `SIDEBAR LINK: Sidebar contains link to '${p}'`);
});

// 5. Verify Navbar.jsx handles dynamic page titles for all routes
const navbarCode = fs.readFileSync('./src/components/layout/Navbar.jsx', 'utf-8');
assert(navbarCode.includes("path === '/'"), 'NAVBAR TITLE: Handles /');
assert(navbarCode.includes("path === '/books'"), 'NAVBAR TITLE: Handles /books');
assert(navbarCode.includes("path === '/books/add'"), 'NAVBAR TITLE: Handles /books/add');
assert(navbarCode.includes("path.startsWith('/books/edit/')"), 'NAVBAR TITLE: Handles /books/edit/:id');
assert(navbarCode.includes("path.startsWith('/books/')"), 'NAVBAR TITLE: Handles /books/:id');
assert(navbarCode.includes("path === '/students'"), 'NAVBAR TITLE: Handles /students');
assert(navbarCode.includes("path === '/students/add'"), 'NAVBAR TITLE: Handles /students/add');
assert(navbarCode.includes("path === '/transactions'"), 'NAVBAR TITLE: Handles /transactions');
assert(navbarCode.includes("path === '/issue'"), 'NAVBAR TITLE: Handles /issue');
assert(navbarCode.includes("path === '/return'"), 'NAVBAR TITLE: Handles /return');
assert(navbarCode.includes("path === '/categories'"), 'NAVBAR TITLE: Handles /categories');
assert(navbarCode.includes("path === '/settings'"), 'NAVBAR TITLE: Handles /settings');

console.log('====================================================');
console.log(`SUMMARY: ${passed} passed, ${failed} failed.`);
console.log('====================================================');

if (failed > 0) process.exit(1);
