import React from 'react';
import { useEditor } from './hooks/useEditor';
import { EditorHeader } from './components/EditorHeader';
import { EditorContent } from './components/EditorContent';
import { EditorFooter } from './components/EditorFooter';

export const Editor = () => {
  const {
    note,
    title,
    blocks,
    stats,
    onTitleChange,
    onContentChange,
    onDelete
  } = useEditor();

  if (!note) {
    return <main className="editor-container flex items-center justify-center text-[var(--text-muted)] bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg h-full">Select or create a note to begin</main>;
  }

  return (
    <main className="editor-container flex flex-col h-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg overflow-hidden">
      <EditorHeader title={title} onTitleChange={onTitleChange} />
      <EditorContent blocks={blocks} onContentChange={onContentChange} />
      <EditorFooter note={note} onDelete={onDelete} stats={stats} />
    </main>
  );
}; 