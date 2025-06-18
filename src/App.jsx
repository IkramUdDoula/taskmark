import React, { useRef, useState } from 'react';
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
  const notesAppRef = useRef(null);
  const { addNote, deleteNote } = useNotes();
  const { selectedNoteId, setSelectedNoteId } = useAppContext();

  const handleAddNote = () => {
    const newNoteId = addNote();
    setSelectedNoteId(newNoteId);
  };

  const handleDeleteNote = () => {
    if (selectedNoteId) {
      deleteNote(selectedNoteId);
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
