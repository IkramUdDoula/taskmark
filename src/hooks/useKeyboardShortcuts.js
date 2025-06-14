import { useEffect } from 'react';

export function useKeyboardShortcuts({
  onNewNote,
  onDeleteNote,
  onSearch,
  onEscape,
  isSearchOpen,
  isRecycleBinOpen
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + N: New Note
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        onNewNote?.();
      }
      
      // Alt + Delete: Delete Note
      if (e.altKey && e.key.toLowerCase() === 'delete') {
        e.preventDefault();
        onDeleteNote?.();
      }
      
      // Alt + S: Search
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        onSearch?.();
      }

      // Escape: Close search or recycle bin
      if (e.key === 'Escape' && (isSearchOpen || isRecycleBinOpen)) {
        e.preventDefault();
        onEscape?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNewNote, onDeleteNote, onSearch, onEscape, isSearchOpen, isRecycleBinOpen]);
} 