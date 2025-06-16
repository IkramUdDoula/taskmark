import React, { useEffect } from "react";
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

  // On mount, if initialContent is legacy, convert and set it
  useEffect(() => {
    async function setInitialContent() {
      if (!initialContent) return;
      if (Array.isArray(initialContent) && initialContent[0]?.type === "text") {
        // Convert array of text blocks to HTML
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
    }
    setInitialContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContent, editor]);

  return (
    <div className={`blocknote-editor blocknote-theme-${theme}`}>
      <BlockNoteView editor={editor} onChange={onChange} />
    </div>
  );
}
