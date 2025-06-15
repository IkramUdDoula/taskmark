import { useState, useEffect } from 'react';
import { useNotes } from '../NotesContext';

export function useNoteManagement() {
  const { notes, addOrUpdateNote, removeNote } = useNotes();
  const [selectedId, setSelectedId] = useState(null);
  const [pendingNewId, setPendingNewId] = useState(null);

  // Sort notes newest to oldest (with seconds precision)
  const sortedNotes = [...notes].sort((a, b) => new Date(b.created) - new Date(a.created));

  useEffect(() => {
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
      blocks: [{ type: 'text', text: '' }],
      created: now.toISOString(),
      updated: now.toISOString(),
      tags: [],
      content: '', // For backward compatibility
      checklist: [] // For backward compatibility
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

  return {
    notes: sortedNotes,
    selectedNote,
    selectedId,
    handleAdd,
    handleSave,
    handleDelete,
    setSelectedId
  };
} 