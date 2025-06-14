import React, { useState } from 'react';

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) +
    ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function NotesSidebar({ notes, selectedId, onSelect, onAdd, isMobileOpen, onMobileClose, searchQuery, setSearchQuery }) {
  const [searchQueryLocal, setSearchQueryLocal] = useState('');

  const handleSelect = (id) => {
    onSelect(id);
    if (isMobileOpen) {
      onMobileClose();
    }
  };

  const handleAddInternal = () => {
    onAdd();
    if (isMobileOpen) {
      onMobileClose();
    }
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => {
    if (!searchQueryLocal && !searchQuery) return true;
    const query = (searchQueryLocal || searchQuery).toLowerCase();
    
    // Format dates for searching
    const createdDate = formatDate(note.created || '').toLowerCase();
    const updatedDate = formatDate(note.updated || note.created || '').toLowerCase();
    
    return (
      (note.title && note.title.toLowerCase().includes(query)) ||
      (note.blocks && note.blocks.some(block => 
        block.type === 'text' && block.text.toLowerCase().includes(query)
      )) ||
      (note.tags && note.tags.some(tag => 
        tag.toLowerCase().includes(query)
      )) ||
      createdDate.includes(query) ||
      updatedDate.includes(query)
    );
  });

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 sm:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        ></div>
      )}
      <aside
        className={`
          bg-[var(--bg-secondary)] border-[var(--border)] font-mono flex flex-col shadow-none 
          fixed inset-y-0 right-0 z-40 w-4/5 max-w-[280px] 
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'}
          border-l 
          sm:relative sm:left-auto sm:right-auto sm:translate-x-0 sm:w-60 sm:max-w-none
          sm:ml-4 sm:mt-4 sm:mr-2 sm:mb-4 sm:rounded-lg 
          sm:border-l-0 sm:border-b-0 sm:border-r 
          ${isMobileOpen ? 'flex' : 'hidden'} sm:flex
        `}
      >
        {/* Close button for mobile (visible only on mobile, inside the sidebar) */}
        <div className="sm:hidden flex justify-end p-2">
          <button onClick={onMobileClose} className="p-2 text-[var(--text-primary)] hover:bg-[var(--hover)] rounded">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        {/* Mobile search bar */}
        <div className="sm:hidden p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full pl-8 pr-8 py-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              value={searchQueryLocal}
              onChange={(e) => setSearchQueryLocal(e.target.value)}
            />
            <svg className="w-4 h-4 absolute left-2 top-3 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            {searchQueryLocal && (
              <button
                className="absolute right-2 top-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                onClick={() => setSearchQueryLocal('')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>
        </div>
        
        <button
          className="w-full p-4 text-left border-b border-[var(--border)] hover:bg-[var(--hover)] hover:rounded-t-lg transition-colors flex items-center justify-between group font-mono tracking-tight text-base rounded-t-lg"
          onClick={handleAddInternal}
          title="Add a new note (Alt+N)"
        >
          <span className="font-semibold text-lg text-[var(--text-primary)] font-mono tracking-tight">New Note</span>
          <span className="w-7 h-7 flex items-center justify-center text-[var(--accent)] bg-[var(--bg-tertiary)] rounded transition-colors">
            ＋
          </span>
        </button>
        <ul className="flex-1 overflow-x-auto sm:overflow-y-auto divide-y divide-[var(--border)] bg-[var(--bg-tertiary)] rounded-b-none sm:rounded-b-lg font-mono whitespace-nowrap sm:whitespace-normal">
          {filteredNotes.length === 0 && (
            <li className="px-4 py-3 text-xs text-[var(--text-muted)] italic font-mono">
              Add new note to begin
            </li>
          )}
          {filteredNotes.map(note => {
            // Highlight matches in title
            let titleDisplay = note.title || 'Untitled Note';
            const query = (searchQueryLocal || searchQuery || '').toLowerCase();
            
            if (query) {
              const regex = new RegExp(`(${query})`, 'gi');
              titleDisplay = titleDisplay.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600">$1</mark>');
            }
            
            return (
              <li
                key={note.id}
                className={`cursor-pointer transition-colors duration-150 relative ${ 
                  note.id === selectedId 
                    ? 'bg-[var(--selected)]' 
                    : 'hover:bg-[var(--hover)]'
                }`}
                onClick={() => handleSelect(note.id)}
              >
                {note.id === selectedId && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)]"></div>
                )}
                <div className="px-4 py-3">
                  <h3 
                    className="font-semibold text-[var(--text-primary)] truncate font-mono" 
                    dangerouslySetInnerHTML={{ __html: titleDisplay }}
                  />
                  <p className="text-xs text-[var(--text-secondary)] font-mono">
                    {formatDate(note.created)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
} 