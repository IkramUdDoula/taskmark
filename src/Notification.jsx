import React, { useEffect, useState } from 'react';

export default function Notification({ message, onUndo, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, []); // Empty dependency array since we want this to run only once per mount

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px] z-50">
      <div className="flex items-center">
        <p className="text-[var(--text-primary)] flex-1">{message}</p>
        <div className="h-6 w-px bg-[var(--border)] mx-3" />
        <div className="flex items-center gap-3">
          <button
            onClick={onUndo}
            className="text-[var(--accent)] hover:text-[var(--accent-hover)] p-1 rounded-full hover:bg-[var(--hover)] transition-colors"
            title="Undo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
          <div className="h-6 w-px bg-[var(--border)]" />
          <button
            onClick={() => setIsVisible(false)}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded-full hover:bg-[var(--hover)] transition-colors"
            title="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 