import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { useNotes } from '../../../contexts/NotesContext';

export const useEditor = () => {
  const { selectedNoteId } = useAppContext();
  const { notes, updateNote, deleteNote } = useNotes();
  
  const note = notes.find(n => n.id === selectedNoteId);
  const [title, setTitle] = useState(note?.title || '');
  const [blocks, setBlocks] = useState(note?.blocks || [{ type: 'text', text: '' }]);
  const [stats, setStats] = useState({ words: 0, lines: 0 });
  const [newTag, setNewTag] = useState('');
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);

  // Update local state when selected note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setBlocks(note.blocks && note.blocks.length > 0 ? note.blocks : [{ type: 'text', text: '' }]);
    } else {
      setTitle('');
      setBlocks([{ type: 'text', text: '' }]);
    }
  }, [note]);

  // Calculate stats
  useEffect(() => {
    let totalWords = 0;
    let totalLines = 0;
    
    blocks.forEach(block => {
      if (block.text) {
        const words = block.text.trim() ? block.text.trim().split(/\s+/).length : 0;
        const lines = block.text ? block.text.split('\n').length : 0;
        totalWords += words;
        totalLines += lines;
      }
    });
    
    setStats({ words: totalWords, lines: totalLines });
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
      if (!note) return;

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
  }, [note, isTagsExpanded]);

  const handleTitleChange = useCallback((e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
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
    if (!newTag.trim() || !note) return;
    
    const tag = newTag.trim().toLowerCase();
    if (!note.tags?.includes(tag) && (note.tags?.length || 0) < 4) {
      updateNote(selectedNoteId, {
        tags: [...(note.tags || []), tag],
        updated: new Date().toISOString()
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    if (!note) return;
    updateNote(selectedNoteId, {
      tags: (note.tags || []).filter(tag => tag !== tagToRemove),
      updated: new Date().toISOString()
    });
  };

  return {
    note,
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
    onTagInputChange: (e) => setNewTag(e.target.value),
    onTagsExpand: () => setIsTagsExpanded(!isTagsExpanded)
  };
}; 