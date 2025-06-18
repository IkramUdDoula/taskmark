import React from 'react';

export const ActionButtons = ({
  onThemeToggle,
  onSidebarToggle,
  onAddNote,
  onRecycleBinOpen,
  isSidebarOpen,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen
}) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onAddNote}
        className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--hover)] transition-colors"
        aria-label="Add a new note"
        title="Add a new note (Alt+N)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
      </button>
      <button
        onClick={onRecycleBinOpen}
        className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--hover)] transition-colors"
        aria-label="Recycle bin"
        title="Recycle Bin"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
      <button
        onClick={onThemeToggle}
        className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--hover)] transition-colors"
        aria-label="Toggle theme"
        title="Toggle Theme"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
        </svg>
      </button>
      <button
        onClick={onSidebarToggle}
        className="sm:hidden p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--hover)] transition-colors"
        aria-label="Toggle sidebar"
        aria-expanded={isMobileSidebarOpen}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </div>
  );
}; 