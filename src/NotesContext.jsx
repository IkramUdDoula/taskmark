import React, { createContext, useContext, useEffect, useState } from 'react';

// IndexedDB helper
const DB_NAME = 'taskmark-db';
const STORE_NAME = 'notes';
const DB_VERSION = 2; // Ensure this matches the highest version ever used

// Helper function for deep cleaning serializable data, handling circular references
function deepCleanSerializable(obj, visited = new WeakSet()) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  if (visited.has(obj)) {
    return undefined; // Or some other placeholder for circular references
  }
  visited.add(obj);

  if (Array.isArray(obj)) {
    const cleanedArray = [];
    for (const item of obj) {
      const cleanedItem = deepCleanSerializable(item, visited);
      if (cleanedItem !== undefined) { // Don't add undefined for circular refs
        cleanedArray.push(cleanedItem);
      }
    }
    return cleanedArray;
  }

  // Handle specific BlockNote internal objects by returning only their basic serializable properties
  // This is crucial for Schema and NodeType objects that cause circularity
  if (obj.constructor && (obj.constructor.name === 'Schema' || obj.constructor.name === '_NodeType')) {
      return {}; // Return an empty object to strip all problematic references
  }


  const cleanedObject = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Skip known problematic properties that might link to editor internals
      if (['node', 'schema', 'parent', 'editor', 'dom', 'nodeType', 'linebreakReplacement'].includes(key)) {
        continue;
      }
      const value = obj[key];
      const cleanedValue = deepCleanSerializable(value, visited);
      if (cleanedValue !== undefined) { // Don't assign undefined for circular refs
        cleanedObject[key] = cleanedValue;
      }
    }
  }

  return cleanedObject;
}


// Helper function to deep clean BlockNote blocks for serialization
function serializeBlockData(block) {
  if (!block || typeof block !== 'object') {
    return block;
  }

  const cleanedBlock = {
    id: block.id,
    type: block.type,
    // Use deepCleanSerializable for props to catch nested non-serializable data
    props: deepCleanSerializable(block.props) || {},
    content: [],
    children: [],
  };

  if (Array.isArray(block.content)) {
    cleanedBlock.content = block.content.map(item => {
      // If the item is a nested block (has 'type' and 'id' like properties, and is an object)
      if (typeof item === 'object' && item !== null && item.type && item.id) {
        return serializeBlockData(item); // Recursively serialize nested blocks
      }
      // If item is an inline content object (e.g., {type: 'text', text: '...', styles: {...}})
      else if (typeof item === 'object' && item !== null && item.type && item.text !== undefined) {
        return {
          type: item.type,
          text: item.text,
          // Use deepCleanSerializable for styles to catch nested non-serializable data
          styles: deepCleanSerializable(item.styles) || undefined,
          marks: item.marks ? deepCleanSerializable(item.marks) : undefined, // marks are typically strings/arrays of strings
          href: item.href // href is typically a string
        };
      }
      return item; // Return primitive content directly
    }).filter(item => item !== undefined); // Filter out any undefined items (e.g., from circular refs)
  } else if (block.content !== undefined) {
    // Handle cases where content might be a simple string or other primitive
    cleanedBlock.content = block.content;
  }

  if (Array.isArray(block.children)) {
      cleanedBlock.children = block.children.map(serializeBlockData); // Recursively clean children
  }

  return cleanedBlock;
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
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
    const serializableNote = {
      id: note.id,
      title: note.title || '',
      blocks: note.blocks || [], // Now relying fully on pre-serialization in addOrUpdateNote
      content: note.content || '',
      checklist: note.checklist || [],
      created: note.created || new Date().toISOString(),
      updated: note.updated || new Date().toISOString(),
      tags: note.tags || []
    };
    const req = store.put(serializableNote);
    req.onsuccess = () => resolve();
    req.onerror = (e) => reject(e.target.error); // Reject with the actual error
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
    let patched = { ...note };

    if (note.blocks && Array.isArray(note.blocks)) {
      // Apply the deep serialization here before passing to saveNote
      patched.blocks = note.blocks.map(serializeBlockData);

      // Ensure that if it's a new note and blocks are empty, it still gets a default clean block
      if (patched.blocks.length === 0) {
        patched.blocks = [{ id: new Date().getTime().toString(), type: 'paragraph', props: {}, content: [], children: [] }];
      }

      patched.content = patched.blocks
        .map(block => {
          // BlockNote 'content' can be an array of text spans or nested blocks
          if (typeof block === 'object' && block !== null && block.type) {
            // Recursively extract text from nested blocks
            return block.content && Array.isArray(block.content)
              ? block.content.map(span => (typeof span === 'object' && span !== null && span.text) ? span.text : '').join('')
              : '';
          }
          // Fallback for simple text blocks or if 'text' property exists directly on block
          return block.text || '';
        })
        .filter(Boolean) // Remove any empty strings resulting from blocks without text
        .join('\n'); // Join with newlines for multi-block notes

      // Also extract checklist items if a checklist block exists
      const checklistBlock = note.blocks.find(b => b.type === 'checklist');
      patched.checklist = checklistBlock?.items || [];

    } else if (typeof note.content === 'string') {
      // This branch handles legacy notes that only had a 'content' string
      // We ensure checklist is an empty array if not present to prevent errors
      patched.checklist = note.checklist || [];
    } else {
      // Fallback for notes without blocks or existing content (e.g., brand new notes)
      patched.content = '';
      patched.checklist = [];
    }

    try {
      await saveNote(patched);
      setNotes((prev) => {
        const idx = prev.findIndex((n) => n.id === note.id);
        if (idx >= 0) {
          const newNotes = [...prev];
          newNotes[idx] = patched; // Update with the 'patched' version of the note
          return newNotes;
        }
        return [...prev, patched]; // Add the 'patched' version of the note
      });
    } catch (error) {
      console.error("Failed to save note:", error);
      // Potentially show a user-facing error message
    }
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
