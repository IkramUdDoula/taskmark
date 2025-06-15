import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { NotesProvider, useNotes } from './NotesContext';
import Notification from './Notification';
import RecycleBinModal from './RecycleBinModal';
import SearchBar from './components/SearchBar';
import NotesSidebar from './components/NotesSidebar';
import NoteEditor from './components/NoteEditor';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';
import { useTheme } from './hooks/useTheme';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useNoteManagement } from './hooks/useNoteManagement';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './index.css';

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) +
    ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

const NotesApp = React.forwardRef(({ isMobileSidebarOpen, setIsMobileSidebarOpen, searchQuery, setSearchQuery }, ref) => {
  const {
    notes: sortedNotes,
    selectedNote,
    selectedId,
    handleAdd,
    handleSave,
    handleDelete,
    setSelectedId
  } = useNoteManagement();

  React.useImperativeHandle(ref, () => ({
    triggerAddNote: handleAdd,
    getSelectedNote: () => selectedNote,
    handleDelete,
    getFilteredNotes: () => {
      return sortedNotes.filter(note => {
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
    },
    selectNote: setSelectedId
  }));

  return (
    <div className="flex flex-col sm:flex-row h-full sm:h-full gap-0 sm:gap-2 bg-[var(--bg-primary)] font-mono">
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
        border border-[var(--border)] rounded-lg font-mono
        transition-opacity duration-300 ease-in-out 
        ${isMobileSidebarOpen ? 'opacity-50 pointer-events-none sm:opacity-100 sm:pointer-events-auto' : 'opacity-100 pointer-events-auto'}
        sm:ml-0
      `}>
        <NoteEditor note={selectedNote} onSave={handleSave} onDelete={handleDelete} />
      </main>
    </div>
  );
});

function App() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);
  const notesAppRef = useRef(null);
  const { cycleTheme } = useTheme();

  useKeyboardShortcuts({
    onNewNote: () => notesAppRef.current?.triggerAddNote(),
    onDeleteNote: () => {
      const selectedNote = notesAppRef.current?.getSelectedNote();
      if (selectedNote) {
        notesAppRef.current?.handleDelete(selectedNote.id);
      }
    },
    onSearch: () => setIsSearchOpen(true),
    onEscape: () => {
      if (isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
      if (isRecycleBinOpen) {
        setIsRecycleBinOpen(false);
      }
    },
    isSearchOpen,
    isRecycleBinOpen
  });

  const handleSearchSelect = () => {
    const filteredNotes = notesAppRef.current?.getFilteredNotes();
    if (filteredNotes && filteredNotes.length > 0) {
      notesAppRef.current?.selectNote(filteredNotes[0].id);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <NotesProvider>
      <div className="flex flex-col h-screen">
        <main className="flex-1 w-full overflow-hidden bg-[var(--bg-primary)]">
          <NotesApp 
            ref={notesAppRef} 
            isMobileSidebarOpen={isMobileSidebarOpen} 
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </main>
        <NotificationWrapper />
        <RecycleBinModal isOpen={isRecycleBinOpen} onClose={() => setIsRecycleBinOpen(false)} />
        {/* <PWAUpdatePrompt /> */}
        <Analytics />
        <SpeedInsights />
        <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)] p-3 mx-4 mb-4 flex items-center rounded-lg">
          <div className="flex items-center">
            <h1 className="text-lg font-bold text-[var(--text-primary)] ml-2 font-mono">&lt;taskmark&gt;</h1>
          </div>
          
          <div className="flex-1"></div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => notesAppRef.current?.triggerAddNote()}
              className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--hover)] transition-colors"
              aria-label="Add a new note"
              title="Add a new note (Alt+N)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </button>
            <SearchBar
              isSearchOpen={isSearchOpen}
              setIsSearchOpen={setIsSearchOpen}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearchSelect={handleSearchSelect}
              notesAppRef={notesAppRef}
            />
            
            <button
              onClick={() => setIsRecycleBinOpen(true)}
              className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--hover)] transition-colors"
              aria-label="Recycle bin"
              title="Recycle Bin"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            
            <button
              onClick={cycleTheme}
              className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--hover)] transition-colors"
              aria-label="Toggle theme"
              title="Toggle Theme"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
            </button>
            
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="sm:hidden p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--hover)] transition-colors"
              aria-label="Toggle sidebar"
              aria-expanded={isMobileSidebarOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </footer>
      </div>
    </NotesProvider>
  );
}

function NotificationWrapper() {
  const { lastDeletedNote, undoDelete } = useNotes();
  const [key, setKey] = useState(Date.now());

  useEffect(() => {
    if (lastDeletedNote) {
      setKey(Date.now());
    }
  }, [lastDeletedNote]);

  if (!lastDeletedNote) return null;

  return (
    <Notification
      key={key}
      message="Note Deleted"
      onUndo={undoDelete}
      duration={5000}
    />
  );
}

export default App;
