import React from 'react';
import Modal from './Modal';

export default function RecycleBinModal({ isOpen, onClose, deletedNotes, onRestore, onDeletePermanently }) {
  const handleRestoreAll = () => {
    deletedNotes.forEach(note => onRestore(note.id));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Recycle Bin"
      footer={
        <div className="flex justify-end space-x-3">
          <Modal.SecondaryButton onClick={onClose}>
            Close
          </Modal.SecondaryButton>
          {deletedNotes.length > 0 && (
            <Modal.PrimaryButton onClick={handleRestoreAll}>
              Restore All
            </Modal.PrimaryButton>
          )}
        </div>
      }
    >
      <div className="mt-2">
        {deletedNotes.length === 0 ? (
          <p className="text-[var(--text-secondary)]">No deleted notes</p>
        ) : (
          <div className="space-y-4">
            {deletedNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 bg-[var(--bg-tertiary)] rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[var(--text-primary)] font-medium">
                      {note.title}
                    </h4>
                    <p className="text-[var(--text-secondary)] text-sm mt-1">
                      Deleted on {new Date(note.deletedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onRestore(note.id)}
                      className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
                      title="Restore note"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeletePermanently(note.id)}
                      className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
                      title="Delete permanently"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
} 