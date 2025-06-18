import React from 'react';
import { formatDate } from '../../../shared/utils/date';

export const EditorFooter = ({ note, onDelete, stats }) => {
  return (
    <div className="shrink-0 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="flex items-center justify-between p-2 px-4 text-xs text-[var(--text-secondary)]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-1" title={`Last updated: ${formatDate(note.updated || note.created)}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{formatDate(note.updated || note.created)}</span>
          </div>
          <span className="text-[var(--text-muted)]">•</span>
          <div className="flex items-center gap-1" title="Word count">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{stats.words}</span>
          </div>
          <span className="text-[var(--text-muted)]">•</span>
          <div className="hidden sm:inline-flex items-center gap-2" title="Keyboard shortcuts">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}; 