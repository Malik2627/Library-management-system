import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="not-found-container">
      <div className="glass-card not-found-card">
        <Compass size={64} className="not-found-icon text-cyan" />
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-desc">
          The catalog shelf you are looking for does not exist or has been relocated.
        </p>
        <Link to="/" className="glass-btn glass-btn-primary">
          <Home size={16} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}

