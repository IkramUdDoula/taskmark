import React from 'react';

const toolbarButtons = [
  { type: 'header', label: 'H1', title: 'Header 1', action: 'h1' },
  { type: 'paragraph', label: 'P', title: 'Paragraph', action: 'paragraph' },
  { type: 'divider' },
  { type: 'format', label: <b>B</b>, title: 'Bold', action: 'bold', shortcut: 'Ctrl+B' },
  { type: 'format', label: <i>I</i>, title: 'Italic', action: 'italic', shortcut: 'Ctrl+I' },
  { type: 'divider' },
  { type: 'block', label: '❝', title: 'Quote Block', action: 'quote' },
  { type: 'divider' },
  { type: 'list', label: '•', title: 'Bullet List', action: 'bullet' },
  { type: 'list', label: '☐', title: 'Checkbox', action: 'checkbox' },
  { type: 'divider' },
  { type: 'link', label: '🔗', title: 'Link', action: 'link' },
];

export default function FloatingToolbar({ onAction }) {
  return (
    <div
      className="absolute left-0 right-0 bottom-16 z-40 flex flex-nowrap sm:flex-wrap items-center justify-center bg-[var(--bg-secondary)] border-t border-[var(--border)] shadow-lg gap-1 sm:gap-2 py-2 px-2 sm:px-4 rounded-b-lg overflow-x-auto whitespace-nowrap"
      style={{ pointerEvents: 'auto' }}
    >
      {toolbarButtons.map((btn, idx) =>
        btn.type === 'divider' ? (
          <span key={idx} className="mx-1 sm:mx-2 border-l border-[var(--border)] h-6" />
        ) : (
          <button
            key={btn.action}
            className="rounded px-3 py-2 sm:px-2 sm:py-1 text-lg sm:text-base hover:bg-[var(--hover)] focus:outline-none min-w-[40px]"
            title={btn.title + (btn.shortcut ? ` (${btn.shortcut})` : '')}
            onMouseDown={e => {
              e.preventDefault();
              onAction(btn.action);
            }}
            tabIndex={-1}
          >
            {btn.label}
          </button>
        )
      )}
    </div>
  );
}
