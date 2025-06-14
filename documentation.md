# Taskmark Documentation

## Project Structure

```
taskmark/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── NoteEditor.jsx  # Note editing component
│   │   ├── NotesSidebar.jsx # Sidebar component
│   │   └── SearchBar.jsx   # Search component
│   ├── hooks/             # Custom React hooks
│   │   ├── useTheme.js    # Theme management hook
│   │   ├── useKeyboardShortcuts.js # Keyboard shortcuts hook
│   │   └── useNoteManagement.js # Note management hook
│   ├── App.jsx            # Main application component
│   ├── NotesContext.jsx   # Notes state management
│   ├── RecycleBinModal.jsx # Recycle bin modal component
│   ├── Notification.jsx   # Notification component
│   └── index.css          # Global styles and theme definitions
```

## Core Components

### App.jsx
The main application component that orchestrates the entire application.

Key features:
- Theme management
- Keyboard shortcuts
- Layout structure
- Modal states (search, recycle bin)
- Mobile responsiveness

### NotesContext.jsx
State management for notes using React Context API.

Key functions:
- `addOrUpdateNote`: Creates or updates a note
- `removeNote`: Moves a note to recycle bin
- `restoreNote`: Restores a note from recycle bin
- `permanentlyDeleteNote`: Permanently removes a note
- `undoDelete`: Restores the last deleted note

### NoteEditor.jsx
Component for editing individual notes.

Features:
- Title and content editing
- Block-based text editing
- Tag management
- Word and line count statistics
- Last updated timestamp
- Keyboard shortcuts support
- Auto-save functionality

### NotesSidebar.jsx
Component for displaying and managing the list of notes.

Features:
- List of all notes
- Note selection
- Search functionality
- Mobile responsiveness
- Note creation button
- Last updated time display

### SearchBar.jsx
Component for searching through notes.

Features:
- Real-time search
- Search through titles, content, tags, and dates
- Keyboard navigation
- Search suggestions with preview
- Last updated time display
- Tag display in results

### RecycleBinModal.jsx
Modal component for managing deleted notes.

Features:
- Lists all deleted notes
- Restore functionality
- Permanent deletion option
- Keyboard support (Esc to close)
- Responsive design
- Deletion timestamp display

### Notification.jsx
Toast-style notification component for user feedback.

Features:
- Auto-dismissing notifications
- Undo functionality
- Customizable duration
- Clean animations
- Theme-aware styling

## Custom Hooks

### useTheme
Manages application theming.

Features:
- Theme cycling (Pastel, Light, Dark)
- Theme persistence in localStorage
- Meta theme color updates
- Theme-aware styling

### useKeyboardShortcuts
Manages keyboard shortcuts throughout the application.

Shortcuts:
- `Alt + N`: Create new note
- `Alt + S`: Open search
- `Alt + T`: Add tag
- `Alt + Delete`: Delete current note
- `Esc`: Close search/recycle bin
- `Enter`: Select note from search

### useNoteManagement
Manages note-related state and operations.

Features:
- Note creation
- Note updates
- Note deletion
- Note selection
- Note sorting
- Search functionality

## Theme System

The application uses CSS variables for theming, with three built-in themes:
- Pastel (default)
- Light
- Dark

Each theme defines:
- Background colors
- Text colors
- Border colors
- Accent colors
- Hover states

## State Management

The application uses React Context for state management:
- Notes state (active and deleted notes)
- Theme state
- UI state (modals, search, etc.)

## Data Persistence

Notes are persisted in:
- localStorage for active notes
- localStorage for deleted notes
- localStorage for theme preference

## Performance Considerations

- Memoized components and callbacks
- Efficient state updates
- Lazy loading of components
- Optimized re-renders
- Debounced search
- Efficient DOM updates

## Accessibility

- Keyboard navigation
- ARIA labels
- Semantic HTML
- Focus management
- Screen reader support
- Color contrast compliance

## Future Improvements

Potential areas for enhancement:
- Rich text editing
- Note categories
- Export/Import functionality
- Cloud sync
- Collaborative editing
- Unit testing
- Performance optimization
- Offline support
- Markdown support
- Note sharing 