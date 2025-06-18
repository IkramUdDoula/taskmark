import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { useNotes } from '../../../contexts/NotesContext';

export const useEditor = () => {
  const { selectedNoteId } = useAppContext();
  const { notes, updateNote, deleteNote } = useNotes();
  
  const selectedNote = notes.find(note => note.id === selectedNoteId);
  const [title, setTitle] = useState(selectedNote?.title || '');
  const [blocks, setBlocks] = useState(selectedNote?.blocks || [{ id: '1', type: 'text', text: '' }]);
  const [stats, setStats] = useState({ words: 0, lines: 0 });
  const [newTag, setNewTag] = useState('');
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);

  // Update local state when selected note changes
  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title || '');
      setBlocks(selectedNote.blocks || [{ id: '1', type: 'text', text: '' }]);
    }
  }, [selectedNote]);

  // Calculate stats
  useEffect(() => {
    const text = blocks.map(block => block.text).join(' ');
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = blocks.length;
    setStats({ words, lines });
  }, [blocks]);

  // Auto-save content changes with debounce
  useEffect(() => {
    if (selectedNoteId) {
      const saveTimeout = setTimeout(() => {
        updateNote(selectedNoteId, {
          blocks,
          updated: new Date().toISOString()
        });
      }, 100);

      return () => clearTimeout(saveTimeout);
    }
  }, [selectedNoteId, blocks, updateNote]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedNote) return;

      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setIsTagsExpanded(true);
        setTimeout(() => {
          const tagInput = document.querySelector('input[placeholder="Add tag..."]');
          if (tagInput) {
            tagInput.focus();
          }
        }, 100);
      } else if (e.key === 'Escape' && isTagsExpanded) {
        e.preventDefault();
        setIsTagsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNote, isTagsExpanded]);

  const handleTitleChange = useCallback((e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Update title immediately without debounce
    if (selectedNoteId) {
      updateNote(selectedNoteId, {
        title: newTitle,
        updated: new Date().toISOString()
      });
    }
  }, [selectedNoteId, updateNote]);

  const handleContentChange = useCallback((index, value) => {
    setBlocks(prevBlocks => {
      const newBlocks = [...prevBlocks];
      newBlocks[index] = { ...newBlocks[index], text: value };
      return newBlocks;
    });
  }, []);

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTag.trim() || !selectedNote) return;
    
    const tag = newTag.trim().toLowerCase();
    if (!selectedNote.tags?.includes(tag) && (selectedNote.tags?.length || 0) < 4) {
      updateNote(selectedNoteId, {
        tags: [...(selectedNote.tags || []), tag],
        updated: new Date().toISOString()
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    if (!selectedNote) return;
    updateNote(selectedNoteId, {
      tags: (selectedNote.tags || []).filter(tag => tag !== tagToRemove),
      updated: new Date().toISOString()
    });
  };

  return {
    note: selectedNote,
    title,
    blocks,
    stats,
    newTag,
    isTagsExpanded,
    onTitleChange: handleTitleChange,
    onContentChange: handleContentChange,
    onDelete: deleteNote,
    onAddTag: handleAddTag,
    onRemoveTag: handleRemoveTag,
    onTagInputChange: (e) => setNewTag(e.target.value)
  };
}; 