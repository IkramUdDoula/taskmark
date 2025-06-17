import React from "react";
import { SuggestionMenuController, filterSuggestionItems } from "@blocknote/react";

// Only allow these block types
const ALLOWED_BLOCK_TYPES = [
  { type: "heading", props: { level: 1 }, title: "Heading 1", aliases: ["h1", "heading"], group: "Formatting" },
  { type: "paragraph", title: "Paragraph", aliases: ["p", "paragraph", "text"], group: "Formatting" },
  { type: "quote", title: "Quote", aliases: ["quote", "blockquote"], group: "Formatting" },
  { type: "numberedListItem", title: "Numbered List", aliases: ["ol", "numbered", "ordered list"], group: "Lists" },
  { type: "bulletListItem", title: "Bullet List", aliases: ["ul", "bullet", "unordered list"], group: "Lists" },
  { type: "checklistItem", title: "Check List", aliases: ["check", "checklist", "todo"], group: "Lists" },
];

/**
 * Returns only the allowed slash commands for the BlockNote editor.
 * This is used as the getItems function for SuggestionMenuController.
 */
export function getCustomSlashMenuItems(editor) {
  return ALLOWED_BLOCK_TYPES.map((item) => ({
    title: item.title,
    onItemClick: () => {
      // Insert or change the block type
      editor.insertOrUpdateBlock({
        type: item.type,
        props: item.props || {},
      });
    },
    aliases: item.aliases,
    group: item.group,
  }));
}

/**
 * CustomSlashMenuController - renders a SuggestionMenuController for the slash menu with only allowed items
 */
export default function CustomSlashMenuController({ editor }) {
  return (
    <SuggestionMenuController
      triggerCharacter={"/"}
      getItems={async (query) => filterSuggestionItems(getCustomSlashMenuItems(editor), query)}
    />
  );
}
