import React, { useRef, useState, useCallback, useEffect } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { NotesProvider, useNotes } from './contexts/NotesContext';
import Notification from './Notification';
import RecycleBinModal from './RecycleBinModal';
import { Sidebar } from './features/sidebar';
import { Editor } from './features/editor';
import { MenuBar } from './features/menubar';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './index.css';

class NotesApp {
  constructor(notes, searchQuery, setSelectedNoteId) {
    this.notes = notes;
    this.searchQuery = searchQuery;
    this.setSelectedNoteId = setSelectedNoteId;
  }

  getFilteredNotes(query) {
    if (!query || query.trim() === '') return [];
    query = query.toLowerCase();
    return this.notes.filter(note => {
      // Format dates for searching
      const createdDate = new Date(note.created).toLocaleString().toLowerCase();
      const updatedDate = new Date(note.updated || note.created).toLocaleString().toLowerCase();
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
  }

  selectNote(id) {
    this.setSelectedNoteId(id);
  }
}

function NotificationWrapper() {
  const { lastDeletedNote, undoDelete } = useNotes();
  const [key, setKey] = useState(Date.now());

  React.useEffect(() => {
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

function MainContent() {
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { notes, addNote, deleteNote } = useNotes();
  const { selectedNoteId, setSelectedNoteId, searchQuery } = useAppContext();
  
  const notesAppRef = useRef(null);
  
  // Update notesAppRef when dependencies change
  useEffect(() => {
    notesAppRef.current = new NotesApp(notes, searchQuery, setSelectedNoteId);
  }, [notes, searchQuery, setSelectedNoteId]);

  const handleAddNote = () => {
    const newNoteId = addNote();
    setSelectedNoteId(newNoteId);
  };

  const handleDeleteNote = () => {
    if (selectedNoteId) {
      const currentIndex = notes.findIndex(note => note.id === selectedNoteId);
      deleteNote(selectedNoteId);
      
      // After deletion, select the next note if available, otherwise the previous note
      setTimeout(() => {
        const remaining = notes.filter(note => note.id !== selectedNoteId);
        if (remaining.length > 0) {
          // If we're deleting the last note, select the previous one
          if (currentIndex === remaining.length) {
            setSelectedNoteId(remaining[currentIndex - 1].id);
          } else {
            // Otherwise select the next note
            setSelectedNoteId(remaining[currentIndex].id);
          }
        } else {
          setSelectedNoteId(null);
        }
      }, 100);
    }
  };

  useKeyboardShortcuts({
    onNewNote: handleAddNote,
    onDeleteNote: handleDeleteNote,
    onSearch: () => setIsSearchOpen(true),
    onEscape: () => {
      setIsSearchOpen(false);
      setIsRecycleBinOpen(false);
    },
    isSearchOpen,
    isRecycleBinOpen
  });

  return (
    <div className="flex flex-col h-screen p-4 gap-4">
      <main className="flex-1 w-full overflow-hidden bg-[var(--bg-primary)] flex flex-row gap-4">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Editor />
        </div>
      </main>
      <MenuBar
        notesAppRef={notesAppRef}
        onAddNote={handleAddNote}
        onRecycleBinOpen={() => setIsRecycleBinOpen(true)}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />
      <NotificationWrapper />
      <RecycleBinModal isOpen={isRecycleBinOpen} onClose={() => setIsRecycleBinOpen(false)} />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <NotesProvider>
        <MainContent />
      </NotesProvider>
    </AppProvider>
  );
}

export default App;
