import React from 'react';

export const SidebarHeader = ({ onAdd, isMobileOpen, onMobileClose }) => {
  return (
    <>
      {/* Mobile close button */}
      {isMobileOpen && (
        <div className="sm:hidden flex justify-end p-2">
          <button 
            onClick={onMobileClose} 
            className="p-2 text-[var(--text-primary)] hover:bg-[var(--hover)] rounded"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}

      {/* New Note Button */}
      <button
        className="w-full p-4 text-left border-b border-[var(--border)] hover:bg-[var(--hover)] hover:rounded-t-lg transition-colors flex items-center justify-between group font-mono tracking-tight text-base rounded-t-lg"
        onClick={onAdd}
        title="Add a new note (Alt+N)"
      >
        <span className="font-semibold text-lg text-[var(--text-primary)] font-mono tracking-tight">
          New Note
        </span>
        <span className="w-7 h-7 flex items-center justify-center text-[var(--accent)] bg-[var(--bg-tertiary)] rounded transition-colors">
          ＋
        </span>
      </button>
    </>
  );
}; 