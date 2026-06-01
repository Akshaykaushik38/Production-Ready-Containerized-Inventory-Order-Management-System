import React, { useState, useEffect } from 'react';
import './Toast.css';

let toastCallback = null;

export const Toast = () => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    toastCallback = (msg, type) => {
      setToast({ msg, type });
    };
    return () => {
      toastCallback = null;
    };
  }, []);

  // Auto-dismiss logic when toast changes
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  return (
    <div className={`toast-box ${toast.type}`}>
      <span className="toast-icon">
        {toast.type === 'success' ? '✓' : '⚠'}
      </span>
      <span className="toast-message">{toast.msg}</span>
      <button className="toast-close" onClick={() => setToast(null)}>✕</button>
    </div>
  );
};

Toast.success = (msg) => {
  if (toastCallback) toastCallback(msg, 'success');
  else console.log("Success Toast:", msg);
};

Toast.error = (msg) => {
  if (toastCallback) toastCallback(msg, 'error');
  else console.warn("Error Toast:", msg);
};

export default Toast;
