import React from "react";
import { insertOrUpdateBlock } from "@blocknote/core";
import { SuggestionMenuController } from "@blocknote/react";

// Only allow these block types
const ALLOWED_BLOCK_TYPES = [
  { type: "heading", props: { level: 1 }, title: "Heading 1", aliases: ["h1", "heading"], group: "" },
  { type: "paragraph", title: "Paragraph", aliases: ["p", "paragraph", "text"], group: "" },
  { type: "quote", title: "Quote", aliases: ["quote", "blockquote"], group: "" },
  { type: "numberedListItem", title: "Numbered List", aliases: ["ol", "numbered", "ordered list"], group: "" },
  { type: "bulletListItem", title: "Bullet List", aliases: ["ul", "bullet", "unordered list"], group: "" },
  { type: "checkListItem", title: "Check List", aliases: ["check", "checklist", "todo"], group: "" },
];

/**
 * Returns only the allowed slash commands for the BlockNote editor.
 * This is used as the getItems function for SuggestionMenuController.
 */
export function getCustomSlashMenuItems(editor) {
  return ALLOWED_BLOCK_TYPES.map((item) => ({
    title: item.title,
    onItemClick: () => {
      insertOrUpdateBlock(editor, {
        type: item.type,
        props: item.props || {},
      });
    },
    aliases: item.aliases,
    group: item.group,
  }));
}

// Custom filter function to match query against title and aliases
function filterItems(items, query) {
  if (!query) return items;
  const lowerQuery = query.toLowerCase();
  return items.filter(item =>
    item.title.toLowerCase().includes(lowerQuery) ||
    (item.aliases && item.aliases.some(alias => alias.toLowerCase().includes(lowerQuery)))
  );
}


/**
 * CustomSlashMenuController - renders a SuggestionMenuController for the slash menu with only allowed items
 */
export default function CustomSlashMenuController({ editor }) {
  return (
    <SuggestionMenuController
      triggerCharacter={"/"}
      getItems={async (query) => filterItems(getCustomSlashMenuItems(editor), query)}
    />
  );
}
