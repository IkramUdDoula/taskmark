import React, { useState } from 'react';
import { useNotes } from './contexts/NotesContext';

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) +
    ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function truncateTitle(title, limit = 18) {
  if (!title) return 'Untitled Note';
  return title.length > limit ? title.substring(0, limit) + '...' : title;
}

export default function RecycleBinModal({ isOpen, onClose }) {
  const { deletedNotes, restoreNote, permanentlyDeleteNote } = useNotes();
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 5;

  if (!isOpen) return null;

  // Calculate pagination
  const totalPages = Math.ceil(deletedNotes.length / notesPerPage);
  const startIndex = (currentPage - 1) * notesPerPage;
  const endIndex = startIndex + notesPerPage;
  const currentNotes = deletedNotes.slice(startIndex, endIndex);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        <div className="inline-block align-bottom bg-[var(--bg-secondary)] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-[var(--bg-secondary)] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-left sm:mt-0 sm:text-left w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-[var(--text-primary)]">
                    Recycle Bin
                  </h3>
                  <span className="text-sm text-[var(--text-secondary)]">
                    {deletedNotes.length} {deletedNotes.length === 1 ? 'note' : 'notes'}
                  </span>
                </div>
                {deletedNotes.length === 0 ? (
                  <p className="text-[var(--text-secondary)]">No deleted notes</p>
                ) : (
                  <>
                    <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
                      {currentNotes.map(note => (
                        <div
                          key={note.id}
                          className="flex items-center justify-between p-2 bg-[var(--bg-tertiary)] rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="text-[var(--text-primary)] font-medium">
                              {truncateTitle(note.title)}
                            </h4>
                            <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              {formatDate(note.deletedAt)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => restoreNote(note.id)}
                              className="p-1 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--hover)] transition-colors"
                              title="Restore note"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                              </svg>
                            </button>
                            <button
                              onClick={() => permanentlyDeleteNote(note.id)}
                              className="p-1 rounded-full text-[var(--text-secondary)] hover:text-[var(--button-delete-icon)] hover:bg-[var(--hover)] transition-colors"
                              title="Delete permanently"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="text-sm text-[var(--text-secondary)]">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="bg-[var(--bg-secondary)] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[var(--accent)] text-base font-medium text-white hover:bg-[var(--accent-hover)] focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 