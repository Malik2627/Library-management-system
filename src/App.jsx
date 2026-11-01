import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LibraryProvider } from './context/LibraryProvider';
import { AppLayout } from './components/layout/AppLayout';

// Page Imports
import { DashboardPage } from './pages/DashboardPage';
import { BooksPage } from './pages/BooksPage';
import { BookAddPage } from './pages/BookAddPage';
import { BookDetailPage } from './pages/BookDetailPage';
import { BookEditPage } from './pages/BookEditPage';
import { StudentsPage } from './pages/StudentsPage';
import { StudentAddPage } from './pages/StudentAddPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { IssueBookPage } from './pages/IssueBookPage';
import { ReturnBookPage } from './pages/ReturnBookPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <LibraryProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            {/* Dashboard */}
            <Route index element={<DashboardPage />} />

            {/* Book Routes */}
            <Route path="books" element={<BooksPage />} />
            <Route path="books/add" element={<BookAddPage />} />
            <Route path="books/:id" element={<BookDetailPage />} />
            <Route path="books/edit/:id" element={<BookEditPage />} />

            {/* Student Routes */}
            <Route path="students" element={<StudentsPage />} />
            <Route path="students/add" element={<StudentAddPage />} />

            {/* Transactions & Circulation Routes */}
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="issue" element={<IssueBookPage />} />
            <Route path="return" element={<ReturnBookPage />} />

            {/* System Categories & Settings */}
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="settings" element={<SettingsPage />} />

            {/* Fallback 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LibraryProvider>
  );
}

export default App;
