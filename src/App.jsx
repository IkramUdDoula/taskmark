import React, { useState, useEffect } from 'react';
import { NotesProvider, useNotes } from './NotesContext';
import './index.css';

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) +
    ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function NotesSidebar({ notes, selectedId, onSelect, onAdd }) {

  return (
    <aside className="w-60 bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col shadow-none m-4 mb-0 rounded-lg font-mono">
      <button
        className="w-full p-4 text-left border-b border-[var(--border)] hover:bg-[var(--hover)] hover:rounded-t-lg transition-colors flex items-center justify-between group font-mono tracking-tight text-base rounded-t-lg"
        onClick={onAdd}
        title="Add a new note"
      >
        <span className="font-semibold text-lg text-[var(--text-primary)] font-mono tracking-tight">New Note</span>
        <span className="w-7 h-7 flex items-center justify-center text-[var(--accent)] group-hover:text-white bg-[var(--bg-tertiary)] rounded transition-colors">
          ＋
        </span>
      </button>
      <ul className="flex-1 overflow-y-auto divide-y divide-[var(--border)] bg-[var(--bg-tertiary)] rounded-b-lg font-mono">
        {notes.length === 0 && (
          <li className="px-4 py-3 text-xs text-[var(--text-muted)] italic font-mono">Add new note to begin</li>
        )}
        {notes.map(note => (
          <li
            key={note.id}
            className={`cursor-pointer transition-colors duration-150 ${ 
              note.id === selectedId 
                ? 'bg-[var(--selected)] border-l-4 border-[var(--accent)]' 
                : 'hover:bg-[var(--hover)]'
            }`}
            onClick={() => onSelect(note.id)}
          >
            <div className="px-4 py-3">
              <h3 className="font-semibold text-[var(--text-primary)] truncate font-mono">
                {note.title || 'Untitled Note'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-mono">
                {formatDate(note.updated || note.created)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function AddBlockTextarea({ value, setValue, onAdd, placeholder, textareaRef, textareaKey }) {
  return (
    <textarea
      key={textareaKey}
      ref={textareaRef}
      className="w-full bg-transparent border-0 rounded px-2 py-1 focus:outline-none font-sans text-lg resize-none placeholder-gray-300 dark:placeholder-[var(--text-muted)] min-h-[32px] mt-2"
      value={value}
      onChange={e => setValue(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (value === '/text' || value === '/checklist') {
            onAdd(value);
            setValue('');
          }
        }
      }}
      placeholder={placeholder}
      rows={1}
    />
  );
}


const defaultBlocks = [
  { type: 'text', text: '' } // New notes start with a single, empty text block
];

function NoteEditor({ note, onSave, onDelete }) {
  const [title, setTitle] = useState(note?.title || '');
  const [blocks, setBlocks] = useState(note?.blocks && note.blocks.length > 0 ? note.blocks : defaultBlocks);
  const [stats, setStats] = useState({ words: 0, lines: 0 });

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
      if (!note) return; // Don't add blocks if no note is active

      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        insertBlock('text', blocks.length); 
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [note, blocks]); // Include dependencies used in insertBlock indirectly via handleSave

  const handleSave = (newTitle, newBlocks) => {
    if (note) {
      onSave({ 
        ...note, 
        title: newTitle, 
        blocks: newBlocks,
        updated: new Date().toISOString() // Add/update the 'updated' timestamp
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

  // Auto-resize textarea
  const autoResizeTextarea = (element) => {
    element.style.height = 'auto';
    element.style.height = (element.scrollHeight) + 'px';
  };

  const insertBlock = (type, index) => { // Type will always be 'text' now
    const newBlock = { type: 'text', text: '' }; 
    
    // Ensure index is within bounds for insertion (e.g., blocks.length for appending)
    const safeIndex = Math.max(0, Math.min(index, blocks.length));

    const newBlocks = [
      ...blocks.slice(0, safeIndex),
      newBlock,
      ...blocks.slice(safeIndex)
    ];
    setBlocks(newBlocks);
    handleSave(title, newBlocks);
    // Future enhancement: focus the newly added block.
  };

  useEffect(() => {
    if (!blocks) return;
    
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

  if (!note) {
    return <div className="flex-1 flex items-center justify-center text-[var(--text-secondary)] p-8 font-mono" data-component-name="NoteEditor">Select or add a note to get started.</div>;
  }

  // --- Render blocks ---
  return (
    <div className="flex flex-col h-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg overflow-hidden">
      {/* Fixed Header Area */}
      <div className="shrink-0 border-b border-[var(--border)] bg-[var(--bg-tertiary)]">
        <input
          type="text"
          className="w-full p-4 text-2xl font-bold bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none font-mono tracking-tight"
          placeholder="Untitled Note"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      
      {/* Scrollable Textarea Section */}
      <div className="flex-1 min-h-0 p-4"> {/* Outer container defines space and padding for the content area */}
        {blocks.map((block, index) => (
          <div key={block.id} className="h-full"> {/* Wrapper for textarea, takes full height of parent */} 
            <textarea
              className="w-full h-full p-2 bg-transparent text-[var(--text-primary)] resize-none focus:outline-none font-mono text-base leading-relaxed" // Textarea fills this wrapper, has its own padding
              value={block.text}
              onChange={(e) => {
                handleTextChange(index, e.target.value);
              }}
              onInput={(e) => {
                // Future: any specific onInput logic if needed, e.g. live parsing
              }}
              placeholder={index === 0 ? "Start typing..." : ""}
            />
          </div>
        ))}
      </div>
      
      {/* Fixed Footer */}
      <div className="shrink-0 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="flex items-center justify-between p-2 px-4 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center space-x-4">
            <span>Last updated: {formatDate(note.updated || note.created)}</span>
            <span className="text-[var(--text-muted)]">•</span>
            <span>{stats.words} words</span>
            <span className="text-[var(--text-muted)]">•</span>
            <span>{stats.lines} lines</span>
          </div>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            title="Delete note"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function NotesApp() {
  const { notes, loading, addOrUpdateNote, removeNote } = useNotes();
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
      blocks: JSON.parse(JSON.stringify(defaultBlocks)), // Deep copy defaultBlocks
      created: now.toISOString(),
      updated: now.toISOString(),
    };
    addOrUpdateNote(newNote);
    setPendingNewId(newNote.id);
  };

  const handleSave = (note) => {
    addOrUpdateNote(note);
  };

  const handleDelete = (id) => {
    removeNote(id);
    // After deletion, select the next most recent note (newest)
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

  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-72px)] gap-2 bg-[var(--bg-primary)] font-mono">
      <NotesSidebar notes={sortedNotes} selectedId={selectedId} onSelect={setSelectedId} onAdd={handleAdd} />
      <main className="note-editor-container flex-1 relative flex flex-col bg-[var(--bg-secondary)] shadow-none m-4 ml-0 p-6 border border-[var(--border)] rounded-lg font-mono">
        <NoteEditor note={selectedNote} onSave={handleSave} onDelete={handleDelete} />
      </main>
    </div>
  );
}


function App() {
  return (
    <NotesProvider>
      <div className="min-h-screen flex flex-col">
        <header className="app-header flex items-center justify-between p-4 border-b bg-[var(--bg-primary)] border-[var(--border)] backdrop-blur-md sticky top-0 z-10 font-mono">
          <h1 className="app-logo font-mono font-bold text-2xl tracking-tight text-[var(--text-primary)]">&lt;taskmark&gt;</h1>

        </header>
        <main className="flex-1 bg-[var(--bg-primary)]">
          <NotesApp />
        </main>
      </div>
    </NotesProvider>
  );
}

export default App;
