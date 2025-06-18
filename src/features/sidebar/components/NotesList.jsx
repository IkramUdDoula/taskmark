import React from 'react';
import { formatDate } from '../../../shared/utils/date';

export const NotesList = ({ notes, selectedId, onSelect, searchQuery }) => {
  // Filter notes based on search query
  const filteredNotes = notes.filter(note => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
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
    <ul className="flex-1 overflow-x-auto sm:overflow-y-auto divide-y divide-[var(--border)] bg-[var(--bg-tertiary)] rounded-b-none sm:rounded-b-lg font-mono whitespace-nowrap sm:whitespace-normal">
      {filteredNotes.length === 0 && (
        <li className="px-4 py-3 text-xs text-[var(--text-muted)] italic font-mono">
          Add new note to begin
        </li>
      )}
      {filteredNotes.map(note => {
        // Highlight matches in title
        let titleDisplay = note.title || 'Untitled Note';
        const query = searchQuery?.toLowerCase() || '';
        
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
            onClick={() => onSelect(note.id)}
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
  );
}; 