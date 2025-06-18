import { createContext, useContext, useState, useEffect } from 'react';

const NotesContext = createContext();

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [deletedNotes, setDeletedNotes] = useState(() => {
    const savedDeletedNotes = localStorage.getItem('deletedNotes');
    return savedDeletedNotes ? JSON.parse(savedDeletedNotes) : [];
  });

  const [lastDeletedNote, setLastDeletedNote] = useState(null);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('deletedNotes', JSON.stringify(deletedNotes));
  }, [deletedNotes]);

  const addNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: '',
      blocks: [{ id: '1', type: 'text', text: '' }],
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    setNotes(prevNotes => [newNote, ...prevNotes]);
    return newNote.id;
  };

  const updateNote = (id, updates) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id ? { ...note, ...updates } : note
      )
    );
  };

  const deleteNote = (id) => {
    const noteToDelete = notes.find(note => note.id === id);
    if (noteToDelete) {
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      setDeletedNotes(prevDeleted => [...prevDeleted, { ...noteToDelete, deletedAt: new Date().toISOString() }]);
      setLastDeletedNote(noteToDelete);
    }
  };

  const restoreNote = (id) => {
    const noteToRestore = deletedNotes.find(note => note.id === id);
    if (noteToRestore) {
      const { deletedAt, ...note } = noteToRestore;
      setNotes(prevNotes => [note, ...prevNotes]);
      setDeletedNotes(prevDeleted => prevDeleted.filter(note => note.id !== id));
    }
  };

  const permanentlyDeleteNote = (id) => {
    setDeletedNotes(prevDeleted => prevDeleted.filter(note => note.id !== id));
  };

  const undoDelete = () => {
    if (lastDeletedNote) {
      setNotes(prevNotes => [lastDeletedNote, ...prevNotes]);
      setDeletedNotes(prevDeleted => prevDeleted.filter(note => note.id !== lastDeletedNote.id));
      setLastDeletedNote(null);
    }
  };

  return (
    <NotesContext.Provider value={{ 
      notes, 
      deletedNotes,
      lastDeletedNote,
      addNote, 
      updateNote, 
      deleteNote,
      restoreNote,
      permanentlyDeleteNote,
      undoDelete
    }}>
      {children}
    </NotesContext.Provider>
  );
}; 