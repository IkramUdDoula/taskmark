import React from 'react';

export const EditorContent = ({ 
  blocks, 
  onContentChange,
  note,
  newTag,
  isTagsExpanded,
  onAddTag,
  onRemoveTag,
  onTagInputChange,
  onTagsExpand
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTag(e);
  };

  // Debug logging
  console.log('blocks:', blocks);
  console.log('block keys:', blocks.map((block, index) => `block-${block.id ?? index}`));
  console.log('tags:', note?.tags);
  console.log('tag keys:', note?.tags?.map((tag, index) => `tag-${tag}-${index}`));

  return (
    <div className="flex-1 min-h-0 p-2 sm:p-4 flex flex-col">
      <div className="flex-1">
        {blocks.map((block, index) => (
          <div key={`block-${block.id ?? index}`} className="h-full">
            <textarea
              className="w-full h-full bg-transparent text-[var(--text-primary)] resize-none focus:outline-none font-mono text-base leading-relaxed"
              value={block.text}
              onChange={(e) => onContentChange(index, e.target.value)}
              placeholder={index === 0 ? "Start typing..." : ""}
            />
          </div>
        ))}
      </div>

      <div className={`
        border-t border-[var(--border)] 
        transition-all duration-200 ease-in-out
        ${isTagsExpanded ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}
      `}>
        <div className="flex flex-wrap gap-2 items-center p-2">
          {note?.tags?.map((tag, index) => (
            <span
              key={`tag-${tag}-${index}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--hover)] transition-colors"
            >
              #{tag}
              <button
                onClick={() => onRemoveTag(tag)}
                className="ml-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          {(note?.tags?.length || 0) < 4 && (
            <form onSubmit={handleSubmit} className="flex items-center">
              <input
                type="text"
                value={newTag}
                onChange={onTagInputChange}
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
  );
}; 