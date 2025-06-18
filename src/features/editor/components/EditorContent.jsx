import React from 'react';

export const EditorContent = ({ blocks, onContentChange }) => {
  return (
    <div className="flex-1 min-h-0 p-2 sm:p-4">
      {blocks.map((block, index) => (
        <div key={block.id} className="h-full">
          <textarea
            className="w-full h-full p-2 bg-transparent text-[var(--text-primary)] resize-none focus:outline-none font-mono text-base leading-relaxed"
            value={block.text}
            onChange={(e) => onContentChange(index, e.target.value)}
            placeholder={index === 0 ? "Start typing..." : ""}
          />
        </div>
      ))}
    </div>
  );
}; 