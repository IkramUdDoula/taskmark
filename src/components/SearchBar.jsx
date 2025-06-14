import React, { useRef, useEffect, useState } from 'react';

function SearchBar({ 
  isSearchOpen, 
  setIsSearchOpen, 
  searchQuery, 
  setSearchQuery, 
  onSearchSelect,
  notesAppRef
}) {
  const searchInputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Focus search input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Update suggestions when search query changes
  useEffect(() => {
    if (searchQuery && notesAppRef.current) {
      const filteredNotes = notesAppRef.current.getFilteredNotes();
      setSuggestions(filteredNotes.slice(0, 5)); // Show top 5 matches
    } else {
      setSuggestions([]);
    }
    setSelectedIndex(-1);
  }, [searchQuery, notesAppRef]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        notesAppRef.current?.selectNote(suggestions[selectedIndex].id);
        setIsSearchOpen(false);
        setSearchQuery('');
      } else if (searchQuery) {
        onSearchSelect();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) +
      ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="hidden sm:block">
      <div className="relative">
        {isSearchOpen ? (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 bg-black/20 backdrop-blur-sm">
            <div className="w-full max-w-2xl mx-4">
              <div className="relative bg-[var(--bg-secondary)] rounded-lg shadow-2xl border border-[var(--border)] transform transition-all duration-200 ease-out scale-100 opacity-100">
                <div className="flex items-center px-4 py-3 border-b border-[var(--border)]">
                  <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search notes..."
                    className="w-full ml-3 bg-transparent text-[var(--text-primary)] focus:outline-none text-lg placeholder-[var(--text-secondary)]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  {searchQuery && (
                    <button
                      className="ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        setSearchQuery('');
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  )}
                </div>

                {/* Suggestions Panel */}
                {suggestions.length > 0 && (
                  <div className="max-h-[60vh] overflow-y-auto">
                    {suggestions.map((note, index) => (
                      <div
                        key={note.id}
                        className={`px-4 py-3 cursor-pointer flex items-start space-x-3 hover:bg-[var(--hover)] transition-colors ${
                          index === selectedIndex ? 'bg-[var(--hover)]' : ''
                        }`}
                        onClick={() => {
                          notesAppRef.current?.selectNote(note.id);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-[var(--text-primary)] font-medium truncate">
                            {note.title || 'Untitled Note'}
                          </div>
                          <div className="text-sm text-[var(--text-secondary)] truncate">
                            {note.blocks?.[0]?.text?.substring(0, 100) || ''}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] mt-1">
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Created: {formatDate(note.created)}</span>
                            </div>
                            {note.updated && note.updated !== note.created && (
                              <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Updated: {formatDate(note.updated)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {note.tags && note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {note.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-0.5 text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="px-4 py-2 text-sm text-[var(--text-secondary)] border-t border-[var(--border)]">
                  {suggestions.length > 0 ? (
                    <span>↑↓ to navigate, Enter to select, Esc to close</span>
                  ) : searchQuery ? (
                    <span>No results found</span>
                  ) : (
                    <span>Start typing to search notes</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsSearchOpen(true);
            }}
            className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--hover)] transition-colors"
            aria-label="Search notes"
            title="Search Notes (Alt+S)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar; 