
# 🧱 BlockNote.js Integration Plan for Taskmark

---

## 🥅 Goals

- Replace the current `<textarea>`-based note editor with a modern **block-based editor** using [BlockNote.js](https://blocknote.js.org/).
- Maintain the **existing UI layout** and **features**:
  - Notes list sidebar
  - Note title input
  - Footer
  - Theme toggle (light/dark/pastel)
  - Offline support
  - PWA compatibility
  - Metadata (timestamps, word count)
- Introduce an enhanced editing experience with support for:
  - Headings, bold/italic/underline
  - Lists, checkboxes
  - Code blocks, quotes
  - Slash command menu for block types
- Preserve **backward compatibility** with notes stored as plain text.

---

## 🗂️ Plan (Phase-by-Phase)

### ✅ Phase 1: Setup BlockNote Editor Component

#### Iteration Goals
- Install and create a reusable `BlockNoteEditor.jsx` component.
- Render a working BlockNote editor.
- Accept initial content (in BlockNote format or plain HTML).

#### Key Tasks
- Install dependencies:
  ```bash
  npm install @blocknote/core @blocknote/react
  ```
- Use `useBlockNote()` and `<BlockNoteView />`.
- Enable theme styling through props and Tailwind classes.

#### Testing
- [ ] Load sample content
- [ ] Live update logs

---

### ✅ Phase 2: Replace TextArea in `NoteEditor.jsx`

#### Iteration Goals
- Swap `<textarea>` with `BlockNoteEditor`.

#### Key Tasks
- Convert existing note content:
  - If HTML/plain text → use `htmlToBlocks()`
- Update onChange to emit `blocksToHtml()` and/or JSON.
- Integrate with current state update and save logic.

#### Testing
- [ ] Note loads and updates correctly
- [ ] Theme and layout preserved

---

### ✅ Phase 3: Storage and Persistence

#### Iteration Goals
- Store note content as BlockNote JSON + HTML for future-proofing and legacy access.

#### Key Tasks
- Save both JSON blocks and HTML.
- Update loading logic to prefer JSON, fallback to HTML or plain text.
- Strip HTML for indexing/search.

#### Testing
- [ ] All notes persist correctly
- [ ] No loss of data from old notes

---

### ✅ Phase 4: Theming & Visual Integration

#### Iteration Goals
- Match editor styling with Taskmark’s current UI themes.

#### Key Tasks
- Apply Tailwind classes conditionally based on current theme.
- Ensure light, dark, and pastel themes are visually cohesive.
- Ensure editor embeds in UI without layout shifts.

#### Testing
- [ ] UI is visually consistent
- [ ] Toggle themes and verify

---

### ✅ Phase 5: Metadata & Keyboard Shortcuts

#### Iteration Goals
- Support existing metadata systems (word count, timestamp).
- Ensure shortcut keys like `Alt+T` or `Ctrl+S` work or are re-registered.

#### Key Tasks
- Extract plain text from blocks for analysis.
- Handle global key bindings outside editor.

#### Testing
- [ ] Word count accurate
- [ ] Shortcuts still functional

---

### ✅ Phase 6: Search & Recycle Bin Compatibility

#### Iteration Goals
- Support search and trash preview with block format.

#### Key Tasks
- Strip block content into plain text for search indexing.
- Render trash view using read-only BlockNote or static HTML.

#### Testing
- [ ] Search keywords match block content
- [ ] Deleted notes preview correctly

---

### ⏳ Phase 7: Advanced Blocks (Optional)

#### Iteration Goals
- Introduce task lists, tables, media blocks, etc.

#### Key Tasks
- Install extra extensions.
- Add slash commands for new block types.
- Adjust save logic if needed.

#### Testing
- [ ] Blocks render
- [ ] Data persists and reloads

---

## 💬 User-Facing Strategy

### ✅ What’s Changing
- Notes are now **richer and more expressive** with block-based formatting.
- Slash command (`/`) and toolbar allow users to add formatting, checkboxes, and more.

### ✅ What Stays the Same
- Sidebar, themes, save/load system, PWA behavior — **all remain unchanged**.
- Old notes open and save seamlessly.
- No account or migration required.

### ✅ How to Communicate
- Show a **“What’s New” modal** on first load.
- Add a tooltip:
  > "✨ New block editor! Use `/` for commands or select text to format."

---

## ⚙️ Methods

- **Editor Framework**: BlockNote.js (React-based ProseMirror editor)
- **Storage Format**:
  ```js
  {
    content: {
      json: [BlockNote blocks],
      html: "<h1>...</h1>",
      plain: "Note as plain text"
    }
  }
  ```
- **Styling**: Tailwind + dark/light support
- **Compatibility**: Legacy HTML wrapped in `<p>`, converted on load

---

## 🧱 Blockers & Concerns

| Issue                          | Risk/Impact                                  | Resolution Strategy                            |
|--------------------------------|----------------------------------------------|------------------------------------------------|
| Legacy notes are plain text    | Might break on load                          | Convert using `htmlToBlocks()` fallback        |
| Search indexing with HTML      | HTML tags may pollute keywords               | Strip tags using helper utils                  |
| Shortcuts not triggered        | BlockNote captures all keyboard events       | Forward shortcut handling to parent component  |
| Theme mismatch                 | Poor contrast or style misalignment          | Use `theme` prop + Tailwind conditional classes|
| Storage weight of JSON         | Bigger than plain text                       | Compress or store minimal JSON only            |

---

## ✅ Developer Checklist

- [ ] BlockNote editor renders correctly
- [ ] State management integrated
- [ ] UI theming preserved
- [ ] Save/load logic updated
- [ ] Metadata works (timestamps, word count)
- [ ] Search indexes plain text correctly
- [ ] Deleted notes preview in read-only view
- [ ] All legacy notes are backward compatible

---

## 📌 Final Thoughts

This integration enhances user experience **without changing core workflows**. Users can now write in a structured, expressive way while continuing to rely on the familiar Taskmark layout and controls.

You can phase this rollout gradually, and include fallback to the classic text area if needed.
