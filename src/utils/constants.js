export const APP_NAME = 'LIBRARYHUB';

export const DEFAULT_BOOK_COVER = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80';

export const FALLBACK_BOOK_COVER = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='420' viewBox='0 0 300 420'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23131b2e'/%3E%3Cstop offset='100%25' stop-color='%230b1120'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23bg)'/%3E%3Crect x='20' y='20' width='260' height='380' rx='12' fill='none' stroke='%2338bdf8' stroke-width='1.5' stroke-opacity='0.25' stroke-dasharray='6 6'/%3E%3Ccircle cx='150' cy='180' r='42' fill='%2338bdf8' fill-opacity='0.1'/%3E%3Cpath d='M130 180h40M150 160v40' stroke='%2338bdf8' stroke-width='3' stroke-linecap='round'/%3E%3Ctext x='150' y='255' text-anchor='middle' fill='%23f1f5f9' font-family='system-ui,sans-serif' font-size='15' font-weight='700'%3ELIBRARYHUB%3C/text%3E%3Ctext x='150' y='280' text-anchor='middle' fill='%2394a3b8' font-family='system-ui,sans-serif' font-size='12'%3ECover Unavailable%3C/text%3E%3C/svg%3E";


export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/books', label: 'All Books', icon: 'BookOpen' },
  { path: '/books?action=add', label: 'Add Book', icon: 'PlusCircle' },
  { path: '/students', label: 'Students', icon: 'Users' },
  { path: '/transactions?tab=issue', label: 'Issue Books', icon: 'BookUp2' },
  { path: '/transactions?tab=return', label: 'Return Books', icon: 'RotateCcw' },
  { path: '/categories', label: 'Categories', icon: 'FolderKanban' },
  { path: '/settings', label: 'Settings', icon: 'Settings' }
];

export const BOOK_STATUS = {
  AVAILABLE: 'Available',
  BORROWED: 'Borrowed',
  RESERVED: 'Reserved',
  MAINTENANCE: 'Maintenance'
};

export const INITIAL_CATEGORIES = [
  'Computer Science',
  'Software Engineering',
  'System Architecture',
  'Literature',
  'Data Science',
  'Mathematics'
];

export const INITIAL_BOOKS = [
  {
    id: 'BK-101',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category: 'Computer Science',
    publisher: 'Prentice Hall',
    publishedYear: '2008',
    description: 'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.',
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=400&q=80',
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
    description: 'The Pragmatic Programmer is one of those rare tech audiobooks and reads you will listen to, read, and refer to again and again over the years. Fresh content for modern developer careers.',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    totalCopies: 4,
    copies: 4,
    availableCopies: 3,
    status: 'Available',
    createdAt: '2026-09-05T11:30:00.000Z'
  },
  {
    id: 'BK-103',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    isbn: '978-0201633610',
    category: 'System Architecture',
    publisher: 'Addison-Wesley',
    publishedYear: '1994',
    description: 'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.',
    coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80',
    totalCopies: 3,
    copies: 3,
    availableCopies: 2,
    status: 'Available',
    createdAt: '2026-09-10T09:15:00.000Z'
  },
  {
    id: 'BK-104',
    title: 'Refactoring: Improving the Design of Existing Code',
    author: 'Martin Fowler',
    isbn: '978-0134757599',
    category: 'Software Engineering',
    publisher: 'Addison-Wesley Professional',
    publishedYear: '2018',
    description: 'For more than twenty years, serious programmers have relied on Martin Fowler’s Refactoring to improve the structural integrity and readability of existing software code bases.',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
    totalCopies: 3,
    copies: 3,
    availableCopies: 3,
    status: 'Available',
    createdAt: '2026-09-15T14:45:00.000Z'
  },
  {
    id: 'BK-105',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    isbn: '978-1449373320',
    category: 'Data Science',
    publisher: 'O’Reilly Media',
    publishedYear: '2017',
    description: 'Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability.',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=80',
    totalCopies: 4,
    copies: 4,
    availableCopies: 3,
    status: 'Available',
    createdAt: '2026-09-20T16:20:00.000Z'
  },
  {
    id: 'BK-106',
    title: 'To Kill a Mockingbird: Classic Commemorative Edition',
    author: 'Harper Lee',
    isbn: '978-0060935467',
    category: 'Literature',
    publisher: 'HarperCollins',
    publishedYear: '1960',
    description: 'A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice. It views a world of great beauty and savage inequities through the eyes of a young girl.',
    coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=400&q=80',
    totalCopies: 2,
    copies: 2,
    availableCopies: 2,
    status: 'Available',
    createdAt: '2026-09-25T12:00:00.000Z'
  }
];

export const INITIAL_STUDENTS = [
  {
    id: 'STU-1001',
    name: 'Aarav Sharma',
    studentId: 'CS2024-042',
    email: 'aarav.sharma@libraryhub.edu',
    phone: '+91 98765 43210',
    department: 'Computer Science',
    joinedDate: '2024-08-01',
    booksIssued: 1
  },
  {
    id: 'STU-1002',
    name: 'Diya Patel',
    studentId: 'SE2024-018',
    email: 'diya.patel@libraryhub.edu',
    phone: '+91 98765 43211',
    department: 'Software Engineering',
    joinedDate: '2024-08-05',
    booksIssued: 1
  },
  {
    id: 'STU-1003',
    name: 'Rohan Verma',
    studentId: 'DS2024-099',
    email: 'rohan.verma@libraryhub.edu',
    phone: '+91 98765 43212',
    department: 'Data Science',
    joinedDate: '2024-08-10',
    booksIssued: 0
  },
  {
    id: 'STU-1004',
    name: 'Ananya Deshmukh',
    studentId: 'EC2024-055',
    email: 'ananya.d@libraryhub.edu',
    phone: '+91 98765 43213',
    department: 'Electronics',
    joinedDate: '2024-08-15',
    booksIssued: 0
  }
];

export const INITIAL_ISSUED_BOOKS = [
  {
    id: 'TXN-8091',
    bookId: 'BK-101',
    bookTitle: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    studentId: 'STU-1001',
    studentName: 'Aarav Sharma',
    issueDate: '2026-10-15',
    dueDate: '2026-10-29', // Overdue since current date is 2026-11-01!
    returnDate: null,
    status: 'Issued'
  },
  {
    id: 'TXN-8092',
    bookId: 'BK-102',
    bookTitle: 'The Pragmatic Programmer: Your Journey To Mastery',
    studentId: 'STU-1002',
    studentName: 'Diya Patel',
    issueDate: '2026-10-25',
    dueDate: '2026-11-08',
    returnDate: null,
    status: 'Issued'
  }
];

export const INITIAL_RETURNED_BOOKS = [
  {
    id: 'TXN-8088',
    bookId: 'BK-103',
    bookTitle: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    studentId: 'STU-1002',
    studentName: 'Diya Patel',
    issueDate: '2026-09-15',
    dueDate: '2026-10-15',
    returnDate: '2026-10-12',
    status: 'Returned'
  },
  {
    id: 'TXN-8085',
    bookId: 'BK-105',
    bookTitle: 'Designing Data-Intensive Applications',
    studentId: 'STU-1004',
    studentName: 'Ananya Deshmukh',
    issueDate: '2026-09-01',
    dueDate: '2026-09-30',
    returnDate: '2026-09-28',
    status: 'Returned'
  }
];
