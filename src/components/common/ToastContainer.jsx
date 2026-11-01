import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useLibrary } from '../../hooks/useLibrary';

export function ToastContainer() {
  const { toasts, removeToast } = useLibrary();

  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="toast-icon text-emerald" size={20} />;
      case 'error':
        return <AlertCircle className="toast-icon text-rose" size={20} />;
      case 'warning':
        return <AlertTriangle className="toast-icon text-amber" size={20} />;
      case 'info':
      default:
        return <Info className="toast-icon text-cyan" size={20} />;
    }
  };

  return (
    <div className="toast-portal-container" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`toast-notification glass-card toast-${toast.type || 'info'}`}
        >
          <div className="toast-icon-wrapper">
            {getIcon(toast.type)}
          </div>
          <div className="toast-content">
            {toast.title && <h5 className="toast-title">{toast.title}</h5>}
            <p className="toast-message">{toast.message}</p>
          </div>
          <button 
            type="button" 
            className="toast-close-btn"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;

