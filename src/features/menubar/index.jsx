import React, { useRef, useState } from 'react';
import { useMenuBar } from './hooks/useMenuBar';
import { SearchBar } from './components/SearchBar';
import { ActionButtons } from './components/ActionButtons';

export const MenuBar = ({ 
  notesAppRef, 
  onAddNote, 
  onRecycleBinOpen,
  isSearchOpen,
  setIsSearchOpen
}) => {
  const {
    searchQuery,
    setSearchQuery,
    onSidebarToggle,
    onThemeToggle,
    isMobileSidebarOpen
  } = useMenuBar();

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)] p-3 flex items-center rounded-lg">
      <div className="flex items-center">
        <h1 className="text-lg font-bold text-[var(--text-primary)] ml-2 font-mono">
          <span className="sm:hidden">&lt;t&gt;</span>
          <span className="hidden sm:inline">&lt;taskmark&gt;</span>
        </h1>
      </div>
      <div className="flex-1"></div>
      <SearchBar
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        notesAppRef={notesAppRef}
        onSearchSelect={() => {}}
      />
      <ActionButtons
        onThemeToggle={onThemeToggle}
        onSidebarToggle={onSidebarToggle}
        onAddNote={onAddNote}
        onRecycleBinOpen={onRecycleBinOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />
    </footer>
  );
}; 