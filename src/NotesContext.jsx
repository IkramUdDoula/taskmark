import React, { createContext, useContext, useEffect, useState } from 'react';

// IndexedDB helper
const DB_NAME = 'taskmark-db';
const STORE_NAME = 'notes';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAllNotes() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveNote(note) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(note);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function deleteNote(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

const NotesContext = createContext();

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDeletedNote, setLastDeletedNote] = useState(null);
  const [deletedNotes, setDeletedNotes] = useState([]);

  useEffect(() => {
    getAllNotes().then((n) => {
      setNotes(n);
      setLoading(false);
    });
  }, []);

  const addOrUpdateNote = async (note) => {
    // For backward compatibility: always save content and checklist fields
    let patched = { ...note };
    if (note.blocks) {
      patched.content = note.blocks.filter(b => b.type === 'text').map(b => b.text).join('\n\n');
      patched.checklist = note.blocks.find(b => b.type === 'checklist')?.items || [];
    }
    await saveNote(patched);
    setNotes((prev) => {
      const idx = prev.findIndex((n) => n.id === note.id);
      if (idx >= 0) {
        const newNotes = [...prev];
        newNotes[idx] = note;
        return newNotes;
      }
      return [...prev, note];
    });
  };

  const removeNote = async (id) => {
    const noteToDelete = notes.find(n => n.id === id);
    if (noteToDelete) {
      setLastDeletedNote(noteToDelete);
      setDeletedNotes(prev => [...prev, { ...noteToDelete, deletedAt: new Date().toISOString() }]);
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const restoreNote = async (id) => {
    const noteToRestore = deletedNotes.find(n => n.id === id);
    if (noteToRestore) {
      await addOrUpdateNote(noteToRestore);
      setDeletedNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  const permanentlyDeleteNote = async (id) => {
    setDeletedNotes(prev => prev.filter(n => n.id !== id));
  };

  const undoDelete = async () => {
    if (lastDeletedNote) {
      await addOrUpdateNote(lastDeletedNote);
      setLastDeletedNote(null);
      setDeletedNotes(prev => prev.filter(n => n.id !== lastDeletedNote.id));
    }
  };

  return (
    <NotesContext.Provider value={{ 
      notes, 
      loading, 
      addOrUpdateNote, 
      removeNote, 
      lastDeletedNote,
      undoDelete,
      deletedNotes,
      restoreNote,
      permanentlyDeleteNote
    }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  return useContext(NotesContext);
}
