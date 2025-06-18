import React from 'react';

export const EditorHeader = ({ title, onTitleChange }) => {
  return (
    <div className="shrink-0 border-b border-[var(--border)] bg-[var(--bg-tertiary)]">
      <input
        type="text"
        className="w-full p-2 sm:p-4 text-lg sm:text-2xl font-bold bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none font-mono tracking-tight"
        placeholder="Untitled Note"
        value={title}
        onChange={onTitleChange}
      />
    </div>
  );
}; 