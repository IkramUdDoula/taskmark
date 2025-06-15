import React, { useEffect, useRef } from 'react';

export default function Modal({ isOpen, onClose, title, children, footer }) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        <div 
          ref={modalRef}
          className="inline-block align-bottom bg-[var(--bg-secondary)] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div className="bg-[var(--bg-secondary)] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-left sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-[var(--text-primary)] mb-4">
                  {title}
                </h3>
                {children}
              </div>
            </div>
          </div>
          {footer && (
            <div className="bg-[var(--bg-tertiary)] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add button style constants
Modal.PrimaryButton = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[var(--accent)] text-base font-medium text-[var(--bg-primary)] hover:bg-[var(--accent-light)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] sm:ml-3 sm:w-auto sm:text-sm ${className}`}
  >
    {children}
  </button>
);

Modal.SecondaryButton = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] sm:ml-3 sm:w-auto sm:text-sm ${className}`}
  >
    {children}
  </button>
); 