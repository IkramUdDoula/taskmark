import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './services/supabase';
import { useAuth } from './contexts/AuthContext';
import { useLocalMode } from './hooks/useLocalMode';

// IndexedDB helper
const DB_NAME = 'taskmark-db';
const STORE_NAME = 'notes';
const DB_VERSION = 2; // Increment version to trigger upgrade

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        // Create indexes for better querying
        store.createIndex('created', 'created', { unique: false });
        store.createIndex('updated', 'updated', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      console.error('Error opening IndexedDB:', request.error);
      reject(request.error);
    };
  });
}

async function getAllNotes() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => {
        console.error('Error getting notes:', req.error);
        reject(req.error);
      };
    });
  } catch (error) {
    console.error('Error in getAllNotes:', error);
    return [];
  }
}

async function saveNote(note) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      
      // Ensure all required fields exist
      const noteWithDefaults = {
        id: note.id,
        title: note.title || '',
        blocks: note.blocks || [{ type: 'text', text: '' }],
        created: note.created || new Date().toISOString(),
        updated: note.updated || new Date().toISOString(),
        tags: note.tags || [],
        content: note.content || '',
        checklist: note.checklist || []
      };

      const req = store.put(noteWithDefaults);
      req.onsuccess = () => resolve();
      req.onerror = () => {
        console.error('Error saving note:', req.error);
        reject(req.error);
      };
    });
  } catch (error) {
    console.error('Error in saveNote:', error);
    throw error;
  }
}

async function deleteNote(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => {
        console.error('Error deleting note:', req.error);
        reject(req.error);
      };
    });
  } catch (error) {
    console.error('Error in deleteNote:', error);
    throw error;
  }
}

const NotesContext = createContext();

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDeletedNote, setLastDeletedNote] = useState(null);
  const [deletedNotes, setDeletedNotes] = useState([]);
  const { user } = useAuth();
  const { isLocalMode } = useLocalMode();

  // Load notes based on mode
  useEffect(() => {
    if (isLocalMode) {
      // Load from IndexedDB in local mode
      getAllNotes().then((n) => {
        setNotes(n);
        setLoading(false);
      }).catch(error => {
        console.error('Error loading notes:', error);
        setNotes([]);
        setLoading(false);
      });
    } else if (user) {
      // Load from Supabase in cloud mode
      loadNotesFromSupabase();
    }
  }, [isLocalMode, user]);

  // Set up real-time subscription for cloud mode
  useEffect(() => {
    if (!isLocalMode && user) {
      const subscription = supabase
        .channel('notes_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'notes',
            filter: `user_id=eq.${user.id}`
          }, 
          (payload) => {
            console.log('Real-time update:', payload);
            handleRealtimeUpdate(payload);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isLocalMode, user]);

  const loadNotesFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading notes from Supabase:', error);
      setNotes([]);
      setLoading(false);
    }
  };

  const handleRealtimeUpdate = (payload) => {
    if (payload.eventType === 'INSERT') {
      setNotes(prev => [payload.new, ...prev]);
    } else if (payload.eventType === 'UPDATE') {
      setNotes(prev => prev.map(note => 
        note.id === payload.new.id ? payload.new : note
      ));
    } else if (payload.eventType === 'DELETE') {
      setNotes(prev => prev.filter(note => note.id !== payload.old.id));
    }
  };

  const addOrUpdateNote = async (note) => {
    try {
      if (isLocalMode) {
        // Save to IndexedDB in local mode
        await saveNote(note);
        setNotes((prev) => {
          const idx = prev.findIndex((n) => n.id === note.id);
          if (idx >= 0) {
            const newNotes = [...prev];
            newNotes[idx] = note;
            return newNotes;
          }
          return [...prev, note];
        });
      } else if (user) {
        // Save to Supabase in cloud mode
        const { error } = await supabase
          .from('notes')
          .upsert({
            ...note,
            user_id: user.id,
            updated: new Date().toISOString()
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error in addOrUpdateNote:', error);
      throw error;
    }
  };

  const removeNote = async (id) => {
    try {
      const noteToDelete = notes.find(n => n.id === id);
      if (noteToDelete) {
        setLastDeletedNote(noteToDelete);
        setDeletedNotes(prev => [...prev, { ...noteToDelete, deletedAt: new Date().toISOString() }]);
        
        if (isLocalMode) {
          await deleteNote(id);
        } else if (user) {
          const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

          if (error) throw error;
        }
        
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error('Error in removeNote:', error);
      throw error;
    }
  };

  const restoreNote = async (id) => {
    try {
      const noteToRestore = deletedNotes.find(n => n.id === id);
      if (noteToRestore) {
        await addOrUpdateNote(noteToRestore);
        setDeletedNotes(prev => prev.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error('Error in restoreNote:', error);
      throw error;
    }
  };

  const permanentlyDeleteNote = async (id) => {
    setDeletedNotes(prev => prev.filter(n => n.id !== id));
  };

  const undoDelete = async () => {
    try {
      if (lastDeletedNote) {
        await addOrUpdateNote(lastDeletedNote);
        setLastDeletedNote(null);
        setDeletedNotes(prev => prev.filter(n => n.id !== lastDeletedNote.id));
      }
    } catch (error) {
      console.error('Error in undoDelete:', error);
      throw error;
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
