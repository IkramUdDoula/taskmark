import React, { useRef, useEffect } from 'react';

function SearchBar({ 
  isSearchOpen, 
  setIsSearchOpen, 
  searchQuery, 
  setSearchQuery, 
  onSearchSelect 
}) {
  const searchInputRef = useRef(null);

  // Focus search input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <div className="hidden sm:block">
      <div className="relative">
        {isSearchOpen ? (
          <div className="relative w-64">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search notes..."
              className="w-full pl-8 pr-8 py-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => !searchQuery && setIsSearchOpen(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery) {
                  e.preventDefault();
                  onSearchSelect();
                }
              }}
            />
            <svg className="w-4 h-4 absolute left-2 top-3 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            {searchQuery && (
              <button
                className="absolute right-2 top-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                onClick={(e) => {
                  e.preventDefault();
                  setSearchQuery('');
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsSearchOpen(true);
            }}
            className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--hover)] transition-colors"
            aria-label="Search notes"
            data-tooltip="Search notes"
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