# 📚 LIBRARYHUB — Modern Liquid Glass Library Management System

[![React](https://img.shields.io/badge/React-18.3.1-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4.11-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-v6.28.0-ca4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Lucide](https://img.shields.io/badge/Lucide_React-0.468.0-f97316?style=for-the-badge&logo=lucide&logoColor=white)](https://lucide.dev/)
[![Tests](https://img.shields.io/badge/Tests-222%20Passed-10b981?style=for-the-badge&logo=checkmarx&logoColor=white)](#automated-testing-suites)
[![License](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)](LICENSE)

> A high-performance, dark liquid glass Library Management System designed for modern universities and learning institutions. Built exclusively with **React 18**, **Vite**, **Pure CSS3 Design Tokens**, and **HTML5 LocalStorage** persistence.

---

## 🌐 Live Deployment & Repository

- **Live Demo URL**: [https://malik2627.github.io/Library-management-system/](https://malik2627.github.io/Library-management-system/)
- **GitHub Repository**: [https://github.com/Malik2627/Library-management-system](https://github.com/Malik2627/Library-management-system)
- **Author**: [@Malik2627](https://github.com/Malik2627)

---

## 📸 Screenshots & UI Showcase

```
+-----------------------------------------------------------------------------------------+
|  LIBRARYHUB PRO   | [ Search books, authors, ISBN... ]  | [Add Book]  [🔔 Alerts] [Admin] |
+-------------------+-------------------------------------+-------------------------------+
|  • Dashboard      |  Welcome to LIBRARYHUB                                              |
|  • All Books (6)  |  +---------------+  +---------------+  +---------------+  +----------+  |
|  • Add Book       |  |  TOTAL BOOKS  |  |  ON SHELF     |  |  ACTIVE LOANS |  | MEMBERS  |  |
|  • Students (4)   |  |     6 (21)    |  |    17 Copies  |  |    2 Borrows  |  | 4 Active |  |
|  • Transactions   |  +---------------+  +---------------+  +---------------+  +----------+  |
|  • Issue Book     |                                                                     |
|  • Return Book    |  [ Category Distribution ]         [ Recent Circulation Log ]        |
|  • Categories (6) |  CompSci ■■■■■ 33%                 TXN-8091 Clean Code -> Aarav      |
|  • Settings       |  Software ■■■■■ 33%                TXN-8092 Pragmatic -> Diya        |
+-------------------+---------------------------------------------------------------------+
```

*(Place full-resolution screenshots in `./docs/screenshots/` once deployed)*

---

## ✨ Key Features

### 1. 📊 Executive Analytics Dashboard
- Real-time library metric cards: **Total Catalog Titles**, **Physical Copies Registered**, **Available On Shelf**, **Active Borrow Loans**, and **Registered Student Members**.
- Interactive **Category Distribution Bar Chart** with percentage breakdowns.
- Recent Circulation table with loan status pills (`Issued`, `Returned`, `Overdue`).
- Quick Actions Bar for immediate Book Issue, Book Return, and Student Registration.

### 2. 📖 Complete Book Inventory Management
- **Catalog Inspection**: Responsive Grid Cards view and high-density Table view with real-time switching.
- **Multi-Field Live Search**: Filter catalog records simultaneously across **Title**, **Author**, and **ISBN** with instant, debounced responsiveness.
- **Smart Filtering & Sorting**: Filter by discipline category or stock availability; sort alphabetically by title (A-Z) or chronologically by publication year.
- **Dynamic Book Detail View (`/books/:id`)**: Inspect book synopsis, publication attributes, shelf copy counts, and active borrow history.
- **Dynamic Book Editor (`/books/edit/:id`)**: Modify volume metadata with controlled inputs and validation.
- **Safe Book Deletion**: Confirmation modal prevents accidental data loss and recalibrates library inventory totals.
- **Resilient Offline Cover Fallback**: Automatic SVG data URI fallback for broken or unreachable cover image URLs.

### 3. 🎓 Student & Member Registry
- Student Directory with departmental badges, student/member IDs, email links, and phone numbers.
- Register new students with field-level regex validation.
- Edit student departments, contact details, and member privileges.
- Student detail drawer with borrowing history and overdue warnings.
- Delete guard preventing member deletion while active unreturned books are checked out.

### 4. 🔄 Circulation Desk (Issue & Return System)
- **Book Issue Engine (`/issue`)**:
  - Automatically filters to books that have physical copies available on shelf ($availableCopies > 0$).
  - Prevents issuing unavailable books or issuing to non-existent students.
  - Automatically calculates default 14-day loan return due dates.
  - Decrements available shelf stock and increments the student's active loan counter.
- **Book Return Desk (`/return`)**:
  - Lists active loans with automated overdue calculation ($dueDate < today$).
  - One-click check-in restoring shelf inventory and updating transaction records to `Returned`.
  - Maintains complete historical circulation audit logs.

### 5. 🔔 Liquid Glass Toast Notifications
- Floating notifications with glowing border accents:
  - **Success** (emerald `#10b981`)
  - **Error** (rose `#f43f5e`)
  - **Warning** (amber `#f59e0b`)
  - **Info** (cyan `#06b6d4`)
- Auto-dismiss with smooth slide-in/out transitions and accessibility (`role="status"`).

### 6. 💾 Client-Side State Persistence
- HTML5 `localStorage` synchronization preserves all catalog additions, student edits, and circulation loans across browser refreshes.
- Dedicated **Settings Page** provides options to export, reset seed data, or clear library storage safely.

---

## 🛠️ Technology Stack

| Layer | Technology | Details / Notes |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18.3.1** | Functional components, pure hooks architecture |
| **Build Tooling** | **Vite 5.4.11** | Instant HMR, lightning-fast Rollup production bundling |
| **Routing** | **React Router DOM v6.28.0** | Declarative nested routing, dynamic `:id` params, 404 handler |
| **Icons** | **Lucide React 0.468.0** | Clean, accessible SVG iconography |
| **Styling** | **Pure CSS3 Design System** | Custom Liquid Glass CSS tokens, backdrop filters, CSS Grid & Flexbox |
| **Typography** | **Google Fonts** | *Outfit* (Headings) and *Plus Jakarta Sans* (Body) |
| **State Management** | **React Context + useReducer** | Pure React global state management without heavy external libraries |
| **Persistence** | **HTML5 LocalStorage** | Synchronous rehydration with error handling |

---

## ⚛️ Deep Dive: React Hooks Architecture

LIBRARYHUB demonstrates pure, idiomatic React 18 patterns without third-party state libraries:

### 1. `createContext`
- Defined in [`src/context/LibraryContext.jsx`](./src/context/LibraryContext.jsx) as the single global channel for books, students, circulation records, statistics, and dispatchers.

### 2. `useReducer`
- Defined in [`src/reducer/LibraryReducer.js`](./src/reducer/LibraryReducer.js) and utilized in [`LibraryProvider.jsx`](./src/context/LibraryProvider.jsx).
- Manages 14 distinct actions:
  - `ADD_BOOK`, `UPDATE_BOOK`, `DELETE_BOOK`
  - `ADD_STUDENT`, `UPDATE_STUDENT`, `DELETE_STUDENT`
  - `ISSUE_BOOK`, `RETURN_BOOK`
  - `LOAD_DATA`, `CLEAR_DATA`
  - `SET_SEARCH_QUERY`, `TOGGLE_SIDEBAR`, `TOGGLE_MOBILE_MENU`, `CLOSE_MOBILE_MENU`
- Employs immutable state updates and automated statistic recalculation via `calculateStatistics()`.

### 3. `useContext`
- Wrapped cleanly inside the custom [`useLibrary()`](./src/hooks/useLibrary.js) hook.
- Provides context boundary safety (`throw new Error('useLibrary must be used within LibraryProvider')`).

### 4. `useState`
- Manages local UI states across pages and modals:
  - Controlled form inputs and validation error maps.
  - Modal open/close state toggles.
  - Table vs Grid view display toggling.
  - Floating toast notification stack with timeout IDs.

### 5. `useEffect`
- Rehydrates catalog state from `localStorage` on initial component mount.
- Automatically synchronizes book, student, and transaction changes to `localStorage` when state updates.
- Synchronizes dynamic URL query parameters (`?action=add`, `?bookId=...`) with modal forms.

### 6. `useMemo` & `useCallback`
- `useMemo` caches filtered and sorted book arrays to avoid expensive recalculations on re-render.
- `useCallback` memoizes dispatch actions passed through context value to prevent unnecessary child component updates.

---

## 🗂️ Project Directory Structure

```
D:\Library_management_system/
├── dist/                              # Production build output
├── public/                            # Static assets
├── src/
│   ├── assets/                        # Static icons and logos
│   ├── components/
│   │   ├── books/                     # Book form, details, and delete confirmation modals
│   │   ├── common/                    # ToastContainer & notification portals
│   │   ├── dashboard/                 # StatsCard, BookCoverCard, Charts, QuickActions
│   │   ├── layout/                    # AppLayout, Navbar, Sidebar
│   │   ├── students/                  # Student cards, forms, and detail modals
│   │   └── transactions/              # Circulation transaction tables and badges
│   ├── context/
│   │   ├── LibraryContext.jsx         # createContext definition
│   │   └── LibraryProvider.jsx        # useReducer + LocalStorage provider
│   ├── hooks/
│   │   ├── useLibrary.js              # useContext custom wrapper
│   │   └── useLibraryStats.js         # Circulation statistics memoization
│   ├── pages/
│   │   ├── BookAddPage.jsx            # /books/add
│   │   ├── BookDetailPage.jsx         # /books/:id
│   │   ├── BookEditPage.jsx           # /books/edit/:id
│   │   ├── BooksPage.jsx              # /books
│   │   ├── CategoriesPage.jsx         # /categories
│   │   ├── DashboardPage.jsx          # / (Main dashboard)
│   │   ├── IssueBookPage.jsx          # /issue
│   │   ├── NotFoundPage.jsx           # 404 Fallback
│   │   ├── ReturnBookPage.jsx         # /return
│   │   ├── SettingsPage.jsx           # /settings
│   │   ├── StudentAddPage.jsx         # /students/add
│   │   ├── StudentsPage.jsx           # /students
│   │   └── TransactionsPage.jsx       # /transactions
│   ├── reducer/
│   │   └── LibraryReducer.js          # Pure reducer with calculateStatistics
│   ├── services/
│   │   └── storageService.js          # LocalStorage CRUD persistence
│   ├── styles/
│   │   ├── index.css                  # CSS reset and base typography
│   │   ├── layout.css                 # Liquid glass layout & responsive breakpoints
│   │   └── theme.css                  # Dark Liquid Glass CSS design tokens
│   ├── utils/
│   │   ├── constants.js               # Initial seed data and fallback SVG covers
│   │   └── formatters.js              # Date and currency formatters
│   ├── App.jsx                        # React Router DOM configuration
│   └── main.jsx                       # Application entry point
├── .gitignore                         # Git exclusion rules
├── index.html                         # HTML template with Google Fonts
├── package.json                       # Dependencies & scripts
├── test-book-features.mjs             # Book management tests (28 checks)
├── test-quality-check.mjs             # Quality audit suite (57 checks)
├── test-reducer.mjs                   # Reducer unit tests (33 checks)
├── test-routes.mjs                    # Navigation & router tests (66 checks)
├── test-student-transactions.mjs      # Circulation tests (38 checks)
└── vite.config.js                     # Vite build configuration
```

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Node.js** (v18.0.0 or later recommended)
- **npm** (v9.0.0 or later)

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Malik2627/Library-management-system.git
   cd Library-management-system
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Run the production build**:
   ```bash
   npm run build
   ```

5. **Preview production build locally**:
   ```bash
   npm run preview
   ```

---

## 🧪 Automated Testing Suites

LIBRARYHUB features an extensive automated test suite with **222 test cases** across 5 modules:

```bash
# Run all test suites
npm test

# Run individual verification suites
npm run test:reducer        # 33 unit tests verifying reducer state transitions
npm run test:books          # 28 tests verifying book CRUD, search, filter, sort
npm run test:transactions   # 38 tests verifying issue, return, and loan limits
npm run test:routes         # 66 tests verifying routes, params, and nav links
npm run test:quality        # 57 tests verifying React hooks, a11y, and fallbacks
```

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute for personal, educational, or commercial purposes.

