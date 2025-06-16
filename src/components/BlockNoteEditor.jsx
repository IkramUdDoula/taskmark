import React, { useEffect, useRef } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

/**
 * BlockNoteEditor - A reusable block-based editor component using BlockNote.js
 * @param {Object} props
 * @param {Array|string|undefined} props.initialContent - Initial content in BlockNote format, plain text, or undefined
 * @param {Function} props.onChange - Callback when content changes
 * @param {string} props.theme - Theme string (e.g., 'light', 'dark', 'pastel')
 */
export default function BlockNoteEditor({ initialContent, onChange, theme = "light" }) {
  // Always create the editor instance
  const editor = useCreateBlockNote();
  // Use a ref to store the stringified content that was last successfully applied to the editor
  const lastAppliedContentStr = useRef(JSON.stringify(initialContent || []));

  useEffect(() => {
    async function setEditorContent() {
      console.log("--- useEffect: setEditorContent --- START");
      console.log("initialContent (prop):", initialContent);
      console.log("editor.document (current):", editor.document);
      console.log("lastAppliedContentStr.current (ref):", lastAppliedContentStr.current);

      if (!initialContent) {
        console.log("initialContent is empty. Checking editor.document...");
        if (editor.document.length > 0 && lastAppliedContentStr.current !== JSON.stringify([])) {
            console.log("Clearing editor content.");
            editor.replaceBlocks(editor.document, []);
            lastAppliedContentStr.current = JSON.stringify([]);
        }
        console.log("--- useEffect: setEditorContent --- END (initialContent empty)");
        return;
      }

      const newContentStr = JSON.stringify(initialContent);

      if (newContentStr !== lastAppliedContentStr.current) {
        console.log("Content mismatch detected. Updating editor.");
        if (Array.isArray(initialContent) && initialContent[0]?.type === "text") {
          const html = initialContent.map(b => b.text).join("<br><br>");
          const blocks = await editor.tryParseHTMLToBlocks(html);
          editor.replaceBlocks(editor.document, blocks);
        } else if (typeof initialContent === "string") {
          const blocks = await editor.tryParseHTMLToBlocks(initialContent);
          editor.replaceBlocks(editor.document, blocks);
        } else if (Array.isArray(initialContent) && initialContent[0]?.type) {
          // Assume already BlockNote blocks
          editor.replaceBlocks(editor.document, initialContent);
        }
        lastAppliedContentStr.current = newContentStr; // Update the ref with the newly applied content
        console.log("Editor updated. lastAppliedContentStr.current now:", lastAppliedContentStr.current);
      } else {
        console.log("Content is already in sync. No editor update needed.");
      }
      console.log("--- useEffect: setEditorContent --- END");
    }
    setEditorContent();
  }, [initialContent, editor]);

  return (
    <div className={`blocknote-editor blocknote-theme-${theme} h-full`}>
      <style jsx global>{`
        .blocknote-editor {
          background: transparent !important;
        }
        .blocknote-editor .bn-container {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .blocknote-editor .bn-editor {
          background: transparent !important;
          color: var(--text-primary) !important;
          padding: 0 16px !important; /* Default padding for desktop */
          padding-top: 8px !important; /* Specific top padding for desktop */
          padding-bottom: 8px !important; /* Specific bottom padding for desktop */
          border: none !important; /* Remove inner border */
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

        @media (min-width: 640px) { /* Equivalent to sm: breakpoint in Tailwind */
          .blocknote-editor .bn-editor {
            padding: 0 24px !important; /* Equivalent to sm:p-4 for desktop */
            padding-top: 16px !important; /* Equivalent to sm:p-4 for desktop */
            padding-bottom: 16px !important; /* Equivalent to sm:p-4 for desktop */
          }
        }
      `}</style>
      <BlockNoteView
        editor={editor}
        onChange={() => {
          const currentEditorContentStr = JSON.stringify(editor.document);
          console.log("--- BlockNoteView onChange --- START");
          console.log("editor.document stringified:", currentEditorContentStr);
          console.log("lastAppliedContentStr.current (before check):", lastAppliedContentStr.current);

          if (lastAppliedContentStr.current !== currentEditorContentStr) {
              console.log("Parent onChange triggered. Updating lastAppliedContentStr.current.");
              onChange(editor.document);
              lastAppliedContentStr.current = currentEditorContentStr;
          } else {
              console.log("Editor content not actually changed. No parent onChange needed.");
          }
          console.log("--- BlockNoteView onChange --- END");
        }}
        sideMenu={false}
        editable={true} // Explicitly set editor to be editable
      />
    </div>
  );
}
