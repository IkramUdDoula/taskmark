import React from 'react';
import { useNotes } from '../../../contexts/NotesContext';

export const SidebarFooter = () => {
  const { notes } = useNotes();
  
  return (
    <div className="p-4 text-xs text-[var(--text-secondary)] border-t border-[var(--border)]">
      <div className="flex items-center justify-between">
        <span>Total Notes</span>
        <span className="text-[var(--text-primary)]">{notes.length}</span>
      </div>
    </div>
  );
}; 