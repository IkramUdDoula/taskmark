import React, { useState, useEffect, useRef } from 'react';
import BlockNoteEditor from "./BlockNoteEditor";

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) +
    ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

const defaultBlocks = [
  { type: 'text', text: '' } // New notes start with a single, empty text block
];

export default function NoteEditor({ note, onSave, onDelete }) {
  const [title, setTitle] = useState(note?.title || '');
  const [blocks, setBlocks] = useState(note?.blocks && note.blocks.length > 0 ? note.blocks : defaultBlocks);
  const [stats, setStats] = useState({ words: 0, lines: 0 });
  const [focusedBlockIdx, setFocusedBlockIdx] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);
  const textareaRefs = useRef([]);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setBlocks(note.blocks && note.blocks.length > 0 ? note.blocks : defaultBlocks);
    } else {
      setTitle('');
      setBlocks(defaultBlocks);
    }
  }, [note]);

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
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [note]);

  const handleSave = (newTitle, newBlocks) => {
    if (note) {
      onSave({ 
        ...note, 
        title: newTitle, 
        blocks: newBlocks,
        updated: new Date().toISOString()
      });
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    handleSave(newTitle, blocks);
  };

  const handleTextChange = (blockIndex, newText) => {
    const newBlocks = blocks.map((block, idx) =>
      idx === blockIndex ? { ...block, text: newText } : block
    );
    setBlocks(newBlocks);
    handleSave(title, newBlocks);
  };

  useEffect(() => {
    if (!blocks || !Array.isArray(blocks)) return;
    
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

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    
    const tag = newTag.trim().toLowerCase();
    if (!note.tags?.includes(tag) && (note.tags?.length || 0) < 4) {
      const updatedNote = {
        ...note,
        tags: [...(note.tags || []), tag]
      };
      onSave(updatedNote);
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedNote = {
      ...note,
      tags: (note.tags || []).filter(tag => tag !== tagToRemove)
    };
    onSave(updatedNote);
  };

  if (!note) {
    return <div className="flex-1 flex items-center justify-center text-[var(--text-secondary)] p-8 font-mono" data-component-name="NoteEditor">Select or add a note to get started.</div>;
  }

  return (
    <div className="flex flex-col h-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg overflow-hidden">
      <div className="shrink-0 border-b border-[var(--border)] bg-[var(--bg-tertiary)]">
        <input
          type="text"
          className="w-full p-2 sm:p-4 text-lg sm:text-2xl font-bold bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none font-mono tracking-tight"
          placeholder="Untitled Note"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      
      <div className="flex-1 min-h-0">
        <BlockNoteEditor
          initialContent={blocks}
          onChange={(newBlocks) => {
            setBlocks(newBlocks);
            handleSave(title, newBlocks);
          }}
          theme={document.documentElement.getAttribute('data-theme') || 'light'}
        />
      </div>
      
      <div className="relative">
        <button
          onClick={() => setIsTagsExpanded(!isTagsExpanded)}
          className="absolute right-4 -top-6 px-3 py-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover)] transition-colors bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center gap-1.5"
          title={isTagsExpanded ? "Collapse tags" : "Expand tags"}
        >
          <span className="text-sm">Tags</span>
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${isTagsExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>

        <div className={`
          mt-4 px-4 py-2 border-t border-[var(--border)] 
          transition-all duration-200 ease-in-out
          ${isTagsExpanded ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}
        `}>
          <div className="flex flex-wrap gap-2 items-center">
            {note?.tags?.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--hover)] transition-colors"
              >
                #{tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
            {(note?.tags?.length || 0) < 4 && (
              <form onSubmit={handleAddTag} className="flex items-center">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag..."
                  className="bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-full px-3 py-1 focus:outline-none text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] hover:bg-[var(--hover)] transition-colors"
                />
                <button
                  type="submit"
                  className="ml-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </form>
            )}
            {(note?.tags?.length || 0) >= 4 && (
              <span className="text-sm text-[var(--text-secondary)]">Maximum 4 tags reached</span>
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="flex items-center justify-between p-2 px-4 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-1" title={`Last updated: ${formatDate(note.updated || note.created)}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{formatDate(note.updated || note.created)}</span>
            </div>
            <span className="text-[var(--text-muted)]">•</span>
            <div className="flex items-center gap-1" title="Word count">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{stats.words}</span>
            </div>
            <span className="text-[var(--text-muted)]">•</span>
            <div className="hidden sm:inline-flex items-center gap-2" title="Keyboard shortcuts">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span>Alt+N - New | Alt+S - Search | Alt+T - Add Tag | Alt+Del - Delete</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            title="Delete note"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}