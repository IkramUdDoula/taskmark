import React, { useCallback, useEffect, useRef } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import CustomSlashMenuController from "./CustomSlashMenu.jsx";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

/**
 * BlockNoteEditor - A reusable block-based editor component using BlockNote.js
 * @param {Object} props
 * @param {Array|string|undefined} props.initialContent - Initial content in BlockNote format, plain text, or undefined
 * @param {Function} props.onChange - Callback when content changes
 * @param {string} props.theme - Theme string (e.g., 'light', 'dark', 'pastel')
 */
export default function BlockNoteEditor({ noteId, initialContent, onChange, theme = "light", className = "" }) {
  // Always create the editor instance
  // Initialize editor with initialContent so content appears immediately upon mount
  // Initialize the editor **without** any initial blocks.
  // We will safely inject the real content later inside `setEditorContent`.
  const editor = useCreateBlockNote();
  // Use a ref to store the stringified content that was last successfully applied to the editor
  const lastAppliedContentStr = useRef(JSON.stringify([]));
  // Flag to ignore onChange events triggered by our own programmatic updates
  const isApplyingContentRef = useRef(false);
  // Track if we're currently handling a key press
  const isHandlingKeyPress = useRef(false);
  // Track if the current change is from user input
  const isUserInput = useRef(false);
  // Store the last selection to restore cursor position
  const lastSelection = useRef(null);
  // Store pending changes during rapid key presses
  const pendingChanges = useRef(null);
  // Debounce timer for handling rapid key presses
  const debounceTimer = useRef(null);

  // Only reset editor content when the noteId changes (i.e., when switching notes)
  useEffect(() => {
    async function setEditorContent() {
      if (isUserInput.current) return;
      
      if (!initialContent) {
        if (editor.document.length > 0 && lastAppliedContentStr.current !== JSON.stringify([])) {
          isApplyingContentRef.current = true;
          await editor.replaceBlocks(editor.document, []);
          lastAppliedContentStr.current = JSON.stringify([]);
          isApplyingContentRef.current = false;
        }
        return;
      }

      const newContentStr = JSON.stringify(initialContent);

      if (newContentStr !== lastAppliedContentStr.current) {
        isApplyingContentRef.current = true;
        
        try {
          if (Array.isArray(initialContent) && initialContent[0]?.type) {
            // Save current selection if it exists
            const selection = window.getSelection();
            const range = selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null;
            
            await editor.replaceBlocks(editor.document, initialContent);
            
            // Try to restore selection if it was within the editor
            if (range && editor.domElement.contains(range.commonAncestorContainer)) {
              try {
                selection.removeAllRanges();
                selection.addRange(range);
              } catch (e) {
                console.warn('Could not restore selection:', e);
              }
            }
          }
          
          lastAppliedContentStr.current = newContentStr;
        } catch (error) {
          console.error('Error updating editor content:', error);
        } finally {
          isApplyingContentRef.current = false;
        }
      }
    }
    
    setEditorContent();
  }, [noteId, editor, initialContent]);

  return (
    <div className={`blocknote-editor blocknote-theme-${theme} h-full ${className}`}>
      <style>{`
        .blocknote-editor {
          /* Layout to allow internal scrolling instead of page grow */
          display: flex;
          flex-direction: column;
          height: 100%;

          background: transparent !important;
          overflow-y: auto; /* Allow scrolling within editor */
          -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
        }
        .blocknote-editor .bn-container {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          min-height: 0;

          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .blocknote-editor .bn-editor {
          background: transparent !important;
          color: var(--text-primary) !important;
          padding: 0 16px !important;
          padding-top: 8px !important;
          padding-bottom: 8px !important;
          border: none !important;
          flex: 1 1 auto !important;
          min-height: 0 !important;
          max-height: 100% !important;
          overflow-y: auto !important;
          overflow-x: hidden !important; /* Prevent horizontal scrollbar */
          word-wrap: break-word !important; /* Ensure long words break */
          white-space: pre-wrap !important; /* Preserve line breaks and wrap text */
          width: 100% !important; /* Ensure full width */
          @media (max-width: 640px) {
            padding: 0 12px !important;
            padding-top: 6px !important;
            padding-bottom: 6px !important;
          }
        }
        .blocknote-editor .bn-toolbar {
          background: var(--bg-tertiary) !important;
          border-color: var(--border) !important;
          color: var(--text-primary) !important;
        }
        .blocknote-editor .bn-toolbar button {
          color: var(--text-primary) !important;
        }
        .blocknote-editor .bn-toolbar button:hover {
          background: var(--hover) !important;
        }
        .blocknote-editor .bn-toolbar button[data-active="true"] {
          background: var(--hover) !important;
        }
        .blocknote-editor .bn-toolbar .bn-toolbar-divider {
          border-color: var(--border) !important;
        }
        .blocknote-editor .bn-toolbar .bn-toolbar-dropdown {
          background: var(--bg-tertiary) !important;
          border-color: var(--border) !important;
        }
        .blocknote-editor .bn-toolbar .bn-toolbar-dropdown button {
          color: var(--text-primary) !important;
        }
        .blocknote-editor .bn-toolbar .bn-toolbar-dropdown button:hover {
          background: var(--hover) !important;
        }
        .blocknote-editor .bn-toolbar .bn-toolbar-dropdown button[data-active="true"] {
          background: var(--hover) !important;
        }
        .blocknote-editor .bn-toolbar .bn-toolbar-dropdown .bn-toolbar-dropdown-content {
          background: var(--bg-tertiary) !important;
          border-color: var(--border) !important;
        }
        .blocknote-editor .bn-toolbar .bn-toolbar-dropdown .bn-toolbar-dropdown-content button {
          color: var(--text-primary) !important;
        }
        .blocknote-editor .bn-toolbar .bn-toolbar-dropdown .bn-toolbar-dropdown-content button:hover {
          background: var(--hover) !important;
        }
        .blocknote-editor .bn-toolbar .bn-toolbar-dropdown .bn-toolbar-dropdown-content button[data-active="true"] {
          background: var(--hover) !important;
        }

        /* Ensure content within blocks wraps properly */
        .blocknote-editor .bn-block-content {
          width: 100% !important;
          max-width: 100% !important;
          overflow-wrap: break-word !important;
          word-wrap: break-word !important;
          word-break: break-word !important;
        }

        /* Fix for code blocks and other pre-formatted content */
        .blocknote-editor pre,
        .blocknote-editor code {
          white-space: pre-wrap !important;
          word-break: break-word !important;
          max-width: 100% !important;
        }

        @media (min-width: 640px) {
          .blocknote-editor .bn-editor {
            padding: 0 24px !important;
            padding-top: 16px !important;
            padding-bottom: 16px !important;
          }
        }
      `}</style>
      <BlockNoteView
        editor={editor}
        onKeyDown={() => {
          isUserInput.current = true;
          isHandlingKeyPress.current = true;
          
          // Clear any pending debounced updates when a new key is pressed
          if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
          }
        }}
        onKeyUp={() => {
          // Schedule the update to happen after a short delay
          debounceTimer.current = setTimeout(() => {
            isHandlingKeyPress.current = false;
            
            if (pendingChanges.current) {
              const { currentContent, currentContentStr } = pendingChanges.current;
              
              // Only update if the content has actually changed
              if (lastAppliedContentStr.current !== currentContentStr) {
                isApplyingContentRef.current = true;
                const cloned = JSON.parse(JSON.stringify(currentContent));
                onChange(cloned);
                lastAppliedContentStr.current = currentContentStr;
                isApplyingContentRef.current = false;
              }
              
              pendingChanges.current = null;
            }
            
            isUserInput.current = false;
          }, 50);
        }}
        onChange={() => {
          if (isApplyingContentRef.current) return;
          
          const currentContent = editor.document;
          const currentContentStr = JSON.stringify(currentContent);
          
          // Only process changes if the content has actually changed
          if (lastAppliedContentStr.current !== currentContentStr) {
            if (isHandlingKeyPress.current) {
              // If we're in the middle of a key press, store the change but don't apply it yet
              pendingChanges.current = { currentContent, currentContentStr };
            } else {
              // If not in a key press (programmatic change), apply immediately
              isApplyingContentRef.current = true;
              const cloned = JSON.parse(JSON.stringify(currentContent));
              onChange(cloned);
              lastAppliedContentStr.current = currentContentStr;
              isApplyingContentRef.current = false;
            }
          }
        }}
        sideMenu={false}
        editable={true}
        slashMenu={false}
        formattingToolbar={false}
      >
        {/* Custom Slash Menu Controller for only allowed commands */}
        <CustomSlashMenuController editor={editor} />
      </BlockNoteView>
    </div>
  );
}
