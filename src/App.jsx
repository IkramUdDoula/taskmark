import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { NotesProvider, useNotes } from './NotesContext';
import { useAuth } from './contexts/AuthContext';
import Notification from './Notification';
import RecycleBinModal from './RecycleBinModal';
import SearchBar from './components/SearchBar';
import NotesSidebar from './components/NotesSidebar';
import NoteEditor from './components/NoteEditor';
import { useTheme } from './hooks/useTheme';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useNoteManagement } from './hooks/useNoteManagement';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ResetPassword from './pages/auth/ResetPassword';
import Modal from './components/Modal';
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

function PrivateRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const isLocalMode = localStorage.getItem('taskmark_local_mode') === 'true';

  if (!user && !isLocalMode) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);
  const [showModeSwitch, setShowModeSwitch] = useState(false);
  const notesAppRef = useRef(null);
  const modeSwitchRef = useRef(null);
  const { cycleTheme } = useTheme();
  const isLocalMode = localStorage.getItem('taskmark_local_mode') === 'true';
  const { user } = useAuth();

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (modeSwitchRef.current && !modeSwitchRef.current.contains(event.target)) {
        setShowModeSwitch(false);
      }
    }

    if (showModeSwitch) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModeSwitch]);

  const handleModeSwitch = () => {
    if (isLocalMode) {
      // Switch to cloud mode
      localStorage.removeItem('taskmark_local_mode');
      window.location.reload();
    } else {
      // Switch to local mode
      localStorage.setItem('taskmark_local_mode', 'true');
      window.location.reload();
    }
  };

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
      if (showModeSwitch) {
        setShowModeSwitch(false);
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
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div className="flex flex-col h-screen">
                <header className="bg-[var(--bg-secondary)] border-b border-[var(--border)] p-[14px] mx-4 mt-4 flex items-center rounded-lg">
                  <div className="flex items-center">
                    <h1 className="text-lg font-bold text-[var(--text-primary)] ml-2 font-mono">&lt;taskmark&gt;</h1>
                  </div>
                  
                  <div className="flex-1"></div>
                  
                  <div className="flex items-center space-x-2">
                    <SearchBar
                      isSearchOpen={isSearchOpen}
                      setIsSearchOpen={setIsSearchOpen}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      onSearchSelect={handleSearchSelect}
                      notesAppRef={notesAppRef}
                    />
                    
                    {/* Mode Toggle Button */}
                    {(isLocalMode || user) && (
                      <div className="relative" ref={modeSwitchRef}>
                        <button
                          onClick={() => setShowModeSwitch(!showModeSwitch)}
                          className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--hover)] transition-colors"
                          aria-label={isLocalMode ? "Local Mode" : "Cloud Mode"}
                          title={isLocalMode ? "Local Mode" : "Cloud Mode"}
                        >
                          {isLocalMode ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                          )}
                        </button>

                        {showModeSwitch && (
                          <Modal
                            isOpen={showModeSwitch}
                            onClose={() => setShowModeSwitch(false)}
                            title={isLocalMode ? "Local Mode" : "Cloud Mode"}
                            footer={
                              <div className="flex justify-end space-x-3">
                                <Modal.SecondaryButton onClick={() => setShowModeSwitch(false)}>
                                  Close
                                </Modal.SecondaryButton>
                                <Modal.PrimaryButton
                                  onClick={() => {
                                    handleModeSwitch();
                                    setShowModeSwitch(false);
                                  }}
                                >
                                  {isLocalMode ? "Switch to Cloud Mode" : "Switch to Local Mode"}
                                </Modal.PrimaryButton>
                              </div>
                            }
                          >
                            <div className="mt-2">
                              <p className="text-[var(--text-primary)]">
                                {isLocalMode
                                  ? "You are currently in Local Mode. Your notes are stored only on this device."
                                  : "You are currently in Cloud Mode. Your notes are synced across all your devices."}
                              </p>
                              <p className="text-[var(--text-secondary)] mt-2">
                                {isLocalMode
                                  ? "Switch to Cloud Mode to sync your notes across devices and access them from anywhere."
                                  : "Switch to Local Mode to store your notes only on this device."}
                              </p>
                            </div>
                          </Modal>
                        )}
                      </div>
                    )}
                    
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
                      onClick={() => notesAppRef.current?.triggerAddNote()}
                      className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--hover)] transition-colors"
                      aria-label="Add a new note"
                      title="Add a new note (Alt+N)"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
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
                </header>
                <main className="flex-1 w-full overflow-hidden bg-[var(--bg-primary)] mt-0 ml-0 mr-4 mb-0">
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
                <Analytics />
                <SpeedInsights />
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
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
