# Taskmark Documentation

## Project Structure

```
taskmark/
├── src/
│   ├── components/         # Reusable UI components
│   ├── App.jsx            # Main application component
│   ├── NotesContext.jsx   # Notes state management
│   ├── RecycleBinModal.jsx # Recycle bin modal component
│   ├── Notification.jsx   # Notification component
│   └── index.css          # Global styles and theme definitions
```

## Core Components

### App.jsx
The main application component that handles:
- Theme management
- Keyboard shortcuts
- Layout structure
- Modal states (search, recycle bin)
- Mobile responsiveness

Key features:
- Theme cycling between pastel, light, and dark modes
- Keyboard shortcuts for common actions
- Responsive layout with mobile sidebar
- Search functionality
- Recycle bin management

### NotesContext.jsx
State management for notes using React Context API.

Key functions:
- `addOrUpdateNote`: Creates or updates a note
- `removeNote`: Moves a note to recycle bin
- `restoreNote`: Restores a note from recycle bin
- `permanentlyDeleteNote`: Permanently removes a note
- `undoDelete`: Restores the last deleted note

### RecycleBinModal.jsx
Modal component for managing deleted notes.

Features:
- Lists all deleted notes with deletion timestamps
- Restore functionality
- Permanent deletion option
- Keyboard support (Esc to close)
- Responsive design

### Notification.jsx
Toast-style notification component for user feedback.

Features:
- Auto-dismissing notifications
- Undo functionality
- Customizable duration
- Clean animations

## Keyboard Shortcuts

| Shortcut | Action |
|----------|---------|
| `Alt + N` | Create new note |
| `Alt + S` | Open search |
| `Alt + Delete` | Delete current note |
| `Esc` | Close search/recycle bin |
| `Enter` | Select note from search |

## Theme System

The application uses CSS variables for theming with three built-in themes:

### Pastel Theme (Default)
```css
--bg-primary: #1A3636;
--bg-secondary: #40534C;
--bg-tertiary: #2E4B4B;
--text-primary: #D6BD98;
--text-secondary: #a9997c;
--accent: #D6BD98;
```

### Light Theme
```css
--bg-primary: #ffffff;
--bg-secondary: #f5f5f5;
--bg-tertiary: #f9f9f9;
--text-primary: #1a1a1a;
--text-secondary: #555555;
--accent: #0066cc;
```

### Dark Theme
```css
--bg-primary: #121212;
--bg-secondary: #1e1e1e;
--bg-tertiary: #252525;
--text-primary: #e0e0e0;
--text-secondary: #a0a0a0;
--accent: #bb86fc;
```

## State Management

The application uses React Context for state management with the following key states:

### Notes State
- `notes`: Array of active notes
- `deletedNotes`: Array of notes in recycle bin
- `lastDeletedNote`: Reference to the most recently deleted note
- `loading`: Loading state for initial data fetch

### UI State
- `theme`: Current theme selection
- `isMobileSidebarOpen`: Mobile sidebar visibility
- `isSearchOpen`: Search modal visibility
- `isRecycleBinOpen`: Recycle bin modal visibility
- `searchQuery`: Current search input

## Event Handling

### Keyboard Events
- Global keyboard event listener in App.jsx
- Handles shortcuts for note creation, deletion, and search
- Modal closing with Escape key
- Search result navigation

### Click Events
- Note selection
- Theme toggling
- Modal opening/closing
- Note restoration/deletion

## Styling

The application uses:
- Tailwind CSS for utility classes
- CSS variables for theming
- Custom CSS for specific components
- Responsive design patterns
- Font: Fira Code (monospace)

## Best Practices

1. **Component Organization**
   - Reusable components in `components/` directory
   - Main application logic in `App.jsx`
   - State management in `NotesContext.jsx`

2. **State Management**
   - Use Context API for global state
   - Local state for component-specific data
   - Proper state updates with immutable patterns

3. **Performance**
   - Memoization where appropriate
   - Efficient event handling
   - Optimized re-renders

4. **Accessibility**
   - Keyboard navigation support
   - ARIA labels where needed
   - Semantic HTML structure

5. **Code Style**
   - Consistent naming conventions
   - Component-based architecture
   - Clear separation of concerns

## Future Improvements

1. **Features**
   - Note categories/folders
   - Rich text editing
   - Note sharing
   - Export/import functionality

2. **Technical**
   - Unit testing
   - E2E testing
   - Performance optimization
   - Offline support

3. **UI/UX**
   - More theme options
   - Customizable shortcuts
   - Enhanced mobile experience
   - Better accessibility 