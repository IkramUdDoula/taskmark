import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { NotesProvider, useNotes } from './NotesContext';
import './index.css';

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) +
    ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function NotesSidebar({ notes, selectedId, onSelect, onAdd, isMobileOpen, onMobileClose, searchQuery, setSearchQuery }) {
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
          title="Add a new note"
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
                className={`cursor-pointer transition-colors duration-150 ${ 
                  note.id === selectedId 
                    ? 'bg-[var(--selected)] border-l-4 border-[var(--accent)]' 
                    : 'hover:bg-[var(--hover)]'
                }`}
                onClick={() => handleSelect(note.id)}
              >
                <div className="px-4 py-3">
                  <h3 
                    className="font-semibold text-[var(--text-primary)] truncate font-mono" 
                    dangerouslySetInnerHTML={{ __html: titleDisplay }}
                  />
                  <p className="text-xs text-[var(--text-secondary)] font-mono">
                    {formatDate(note.updated || note.created)}
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

function AddBlockTextarea({ value, setValue, onAdd, placeholder, textareaRef, textareaKey }) {
  return (
    <textarea
      key={textareaKey}
      ref={textareaRef}
      className="w-full bg-transparent border-0 rounded px-2 py-1 focus:outline-none font-sans text-lg resize-none placeholder-gray-300 dark:placeholder-[var(--text-muted)] min-h-[32px] mt-2"
      value={value}
      onChange={e => setValue(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (value === '/text' || value === '/checklist') {
            onAdd(value);
            setValue('');
          }
        }
      }}
      placeholder={placeholder}
      rows={1}
    />
  );
}

const defaultBlocks = [
  { type: 'text', text: '' } // New notes start with a single, empty text block
];

function NoteEditor({ note, onSave, onDelete }) {
  const [title, setTitle] = useState(note?.title || '');
  const [blocks, setBlocks] = useState(note?.blocks && note.blocks.length > 0 ? note.blocks : defaultBlocks);
  const [stats, setStats] = useState({ words: 0, lines: 0 });
  const [focusedBlockIdx, setFocusedBlockIdx] = useState(null);
  const textareaRefs = useRef([]);

  // Helper: Apply formatting to text
  const applyFormatting = (text, action) => {
    switch (action) {
      case 'bold':
        return wrapSelection(text, '**');
      case 'italic':
        return wrapSelection(text, '*');
      case 'underline':
        return wrapSelection(text, '__');
      case 'strike':
        return wrapSelection(text, '~~');
      case 'h1':
        return '# ' + text;
      case 'h2':
        return '## ' + text;
      case 'h3':
        return '### ' + text;
      case 'h4':
        return '#### ' + text;
      case 'h5':
        return '##### ' + text;
      case 'h6':
        return '###### ' + text;
      case 'paragraph':
        return text.replace(/^#+\s+/,'');
      case 'bullet':
        return text.startsWith('- ') ? text : '- ' + text;
      case 'numbered':
        return text.match(/^\d+\. /) ? text : '1. ' + text;
      case 'checkbox':
        return text.startsWith('- [ ] ') ? text : '- [ ] ' + text;
      case 'quote':
        return text.startsWith('> ') ? text : '> ' + text;
      case 'codeblock':
        return '```\n' + text + '\n```';
      case 'pre':
        return '<pre>' + text + '</pre>';
      case 'link':
        return '[Link Text](https://example.com)';
      case 'table':
        return '| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |';
      case 'hr':
        return text + '\n---\n';
      case 'inlinecode':
        return wrapSelection(text, '`');
      default:
        return text;
    }
  };

  // Helper: Wrap selection or all text
  const wrapSelection = (text, wrapper) => {
    return wrapper + text + wrapper;
  };

  // Handler for toolbar actions
  const handleToolbarAction = (action) => {
    if (focusedBlockIdx === null) return;
    setBlocks(prevBlocks => {
      const newBlocks = [...prevBlocks];
      const block = { ...newBlocks[focusedBlockIdx] };
      block.text = applyFormatting(block.text, action);
      newBlocks[focusedBlockIdx] = block;
      handleSave(title, newBlocks);
      return newBlocks;
    });
    // Refocus the textarea after formatting
    setTimeout(() => {
      if (textareaRefs.current[focusedBlockIdx]) {
        textareaRefs.current[focusedBlockIdx].focus();
      }
    }, 0);
  };

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setBlocks(note.blocks && note.blocks.length > 0 ? note.blocks : defaultBlocks);
    } else {
      setTitle('');
      setBlocks(defaultBlocks);
    }
  }, [note]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!note) return; // Don't add blocks if no note is active

      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        insertBlock('text', blocks.length); 
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [note, blocks]); // Include dependencies used in insertBlock indirectly via handleSave

  const handleSave = (newTitle, newBlocks) => {
    if (note) {
      onSave({ 
        ...note, 
        title: newTitle, 
        blocks: newBlocks,
        updated: new Date().toISOString() // Add/update the 'updated' timestamp
      });
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    handleSave(newTitle, blocks);
  };

  const handleTextChange = (blockIndex, newText) => {
    const newBlocks = blocks.map((block, idx) =>
      idx === blockIndex ? { ...block, text: newText } : block
    );
    setBlocks(newBlocks);
    handleSave(title, newBlocks);
  };

  // Auto-resize textarea
  const autoResizeTextarea = (element) => {
    element.style.height = 'auto';
    element.style.height = (element.scrollHeight) + 'px';
  };

  const insertBlock = (type, index) => { // Type will always be 'text' now
    const newBlock = { type: 'text', text: '' }; 
    
    // Ensure index is within bounds for insertion (e.g., blocks.length for appending)
    const safeIndex = Math.max(0, Math.min(index, blocks.length));

    const newBlocks = [
      ...blocks.slice(0, safeIndex),
      newBlock,
      ...blocks.slice(safeIndex)
    ];
    setBlocks(newBlocks);
    handleSave(title, newBlocks);
    // Future enhancement: focus the newly added block.
  };

  useEffect(() => {
    if (!blocks) return;
    
    let totalWords = 0;
    let totalLines = 0;
    
    blocks.forEach(block => {
      if (block.text) {
        const words = block.text.trim() ? block.text.trim().split(/\s+/).length : 0;
        const lines = block.text ? block.text.split('\n').length : 0;
        totalWords += words;
        totalLines += lines;
      }
    });
    
    setStats({ words: totalWords, lines: totalLines });
  }, [blocks]);

  if (!note) {
    return <div className="flex-1 flex items-center justify-center text-[var(--text-secondary)] p-8 font-mono" data-component-name="NoteEditor">Select or add a note to get started.</div>;
  }

  // --- Render blocks ---
  return (
    <div className="flex flex-col h-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-none sm:rounded-lg overflow-hidden">
      {/* Fixed Header Area */}
      <div className="shrink-0 border-b border-[var(--border)] bg-[var(--bg-tertiary)]">
        <input
          type="text"
          className="w-full p-2 sm:p-4 text-lg sm:text-2xl font-bold bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none font-mono tracking-tight"
          placeholder="Untitled Note"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      
      {/* Scrollable Textarea Section */}
      <div className="flex-1 min-h-0 p-2 sm:p-4"> {/* Outer container defines space and padding for the content area */}
        {blocks.map((block, index) => (
          <div key={block.id} className="h-full"> {/* Wrapper for textarea, takes full height of parent */}
            <textarea
              className="w-full h-full p-2 bg-transparent text-[var(--text-primary)] resize-none focus:outline-none font-mono text-base leading-relaxed"
              value={block.text}
              onChange={(e) => {
                handleTextChange(index, e.target.value);
              }}
              onInput={(e) => {
                // Future: any specific onInput logic if needed, e.g. live parsing
              }}
              placeholder={index === 0 ? "Start typing..." : ""}
            />
          </div>
        ))}
      </div>
      {/* Fixed Footer */}
      <div className="shrink-0 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="flex items-center justify-between p-2 px-4 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center space-x-4">
            <span>Last updated: {formatDate(note.updated || note.created)}</span>
            <span className="text-[var(--text-muted)]">•</span>
            <span>{stats.words} words</span>
            <span className="text-[var(--text-muted)]">•</span>
            <span>{stats.lines} lines</span>
          </div>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            title="Delete note"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const NotesApp = forwardRef(({ isMobileSidebarOpen, setIsMobileSidebarOpen, searchQuery, setSearchQuery }, ref) => {
  const { notes, loading, addOrUpdateNote, removeNote } = useNotes();
  const [selectedId, setSelectedId] = React.useState(null);
  const [pendingNewId, setPendingNewId] = React.useState(null);

  // Sort notes newest to oldest (with seconds precision)
  const sortedNotes = [...notes].sort((a, b) => new Date(b.created) - new Date(a.created));

  React.useEffect(() => {
    // If a new note was just added and appears in the list, select it
    if (pendingNewId && sortedNotes.find(n => n.id === pendingNewId)) {
      setSelectedId(pendingNewId);
      setPendingNewId(null);
      return;
    }
    // Otherwise, if selectedId is not present, select the first note
    if (sortedNotes.length > 0 && !sortedNotes.find(n => n.id === selectedId)) {
      setSelectedId(sortedNotes[0].id);
    }
  }, [sortedNotes, selectedId, pendingNewId]);

  const handleAdd = () => {
    const now = new Date();
    const newNote = {
      id: now.getTime().toString(),
      title: '',
      blocks: [{ type: 'text', text: '' }], // default block
      created: now.toISOString(),
      updated: now.toISOString(),
    };
    addOrUpdateNote(newNote);
    setPendingNewId(newNote.id);
  };

  const handleSave = (note) => {
    addOrUpdateNote(note);
  };

  const handleDelete = (id) => {
    removeNote(id);
    setTimeout(() => {
      const remaining = sortedNotes.filter(n => n.id !== id);
      if (remaining.length > 0) {
        setSelectedId(remaining[0].id);
      } else {
        setSelectedId(null);
      }
    }, 100);
  };

  const selectedNote = sortedNotes.find(n => n.id === selectedId) || null;

  useImperativeHandle(ref, () => ({
    triggerAddNote: () => {
      handleAdd();
    }
  }));

  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="flex flex-col sm:flex-row h-[calc(100vh-56px)] sm:h-[calc(100vh-72px)] gap-0 sm:gap-2 bg-[var(--bg-primary)] font-mono">
      <NotesSidebar
        notes={sortedNotes}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onAdd={handleAdd}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <main className={`
        note-editor-container flex-1 relative flex flex-col 
        bg-[var(--bg-secondary)] shadow-none 
        m-4 p-4
        border border-[var(--border)] 
        rounded-lg
        font-mono
        transition-opacity duration-300 ease-in-out 
        ${isMobileSidebarOpen ? 'opacity-50 pointer-events-none sm:opacity-100 sm:pointer-events-auto' : 'opacity-100 pointer-events-auto'}
      `}>
        <NoteEditor note={selectedNote} onSave={handleSave} onDelete={handleDelete} />
      </main>
    </div>
  );
});

function App() {
  const [theme, setTheme] = useState('pastel');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const notesAppRef = useRef(null);

  // Focus search input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const cycleTheme = () => {
    const themes = ['pastel', 'light', 'dark'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  React.useEffect(() => {
    // Remove all theme classes first
    document.documentElement.classList.remove('theme-pastel', 'theme-light', 'theme-dark');
    // Add the current theme class
    document.documentElement.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <NotesProvider>
      <div className={`min-h-screen flex flex-col ${theme}-theme bg-[var(--bg-primary)]`}>
        <header className="bg-[var(--bg-secondary)] border-b border-[var(--border)] p-[14px] mx-4 mt-4 flex items-center rounded-lg">
          <div className="flex items-center">
            <h1 className="text-lg font-bold text-[var(--text-primary)] ml-2 font-mono">&lt;taskmark&gt;</h1>
          </div>
          
          <div className="flex-1"></div>
          
          {/* All header icons container */}
          <div className="flex items-center space-x-2">
            {/* Search */}
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

            {/* Export/Import Buttons */}
            <div className="flex items-center space-x-2">
              <ExportImportButtons notesAppRef={notesAppRef} />
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={cycleTheme}
              className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--hover)] transition-colors"
              aria-label="Toggle theme"
              data-tooltip="Toggle theme"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
            </button>
            
            {/* Add Note */}
            <button
              onClick={() => notesAppRef.current?.triggerAddNote()}
              className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--hover)] transition-colors"
              aria-label="Add new note"
              data-tooltip="Add new note"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </button>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="sm:hidden p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--hover)] transition-colors"
              aria-label="Toggle sidebar"
              aria-expanded={isMobileSidebarOpen}
              data-tooltip="Toggle sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </header>
        <main className="flex-1 w-full h-full bg-[var(--bg-primary)] mt-0 ml-0 mr-4 mb-0">
          <NotesApp 
            ref={notesAppRef} 
            isMobileSidebarOpen={isMobileSidebarOpen} 
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </main>
      </div>
    </NotesProvider>
  );
}

function ExportImportButtons({ notesAppRef }) {
  const { notes, addOrUpdateNote, removeNote } = useNotes();

  // Export notes as JSON
  const handleExport = () => {
    const data = JSON.stringify(notes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taskmark-notes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import notes from JSON
  const handleImportClick = () => {
    document.getElementById('import-notes-input').click();
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const importedNotes = JSON.parse(text);
      if (!Array.isArray(importedNotes)) throw new Error('Invalid notes JSON');
      // Remove all current notes, then add imported
      for (const note of notes) {
        await removeNote(note.id);
      }
      for (const note of importedNotes) {
        await addOrUpdateNote(note);
      }
      alert('Notes imported successfully!');
    } catch (err) {
      alert('Failed to import notes: ' + err.message);
    }
    e.target.value = '';
  };

  return (
    <>
      <button
        onClick={handleExport}
        className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--hover)] transition-colors"
        aria-label="Export notes"
        data-tooltip="Export notes"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
        </svg>
      </button>
      <button
        onClick={handleImportClick}
        className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--hover)] transition-colors"
        aria-label="Import notes"
        type="button"
        data-tooltip="Import notes"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
      </button>
      <input
        id="import-notes-input"
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        onChange={handleImport}
      />
    </>
  );
}

export default App;
