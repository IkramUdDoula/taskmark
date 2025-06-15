# Taskmark Documentation

## Project Structure 

```
taskmark/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── NoteEditor.jsx  # Note editing component
│   │   ├── NotesSidebar.jsx # Sidebar component
│   │   ├── SearchBar.jsx   # Search component
│   │   └── PWAUpdatePrompt.jsx # PWA update prompt component
│   ├── hooks/             # Custom React hooks
│   │   ├── useTheme.js    # Theme management hook
│   │   ├── useKeyboardShortcuts.js # Keyboard shortcuts hook
│   │   └── useNoteManagement.js # Note management hook
│   ├── App.jsx            # Main application component
│   ├── NotesContext.jsx   # Notes state management
│   ├── RecycleBinModal.jsx # Recycle bin modal component
│   ├── Notification.jsx   # Notification component
│   └── index.css          # Global styles and theme definitions
├── public/
│   └── offline.html       # Offline fallback page for PWA
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

## Progressive Web App (PWA) Implementation

Taskmark is built as a Progressive Web App (PWA) to provide an enhanced, app-like experience to users. This includes offline capabilities, installability, and seamless updates.

### Workbox Configuration

The PWA functionality is primarily managed through Workbox, configured via `vite.config.js` using `vite-plugin-pwa`.

Key configurations include:
- `globPatterns`: Defines which files are precached (JS, CSS, HTML, images).
- `runtimeCaching`: Specifies caching strategies for external resources like Google Fonts (`CacheFirst`) and API calls (`NetworkFirst`).
- `cleanupOutdatedCaches`: Ensures older service worker caches are removed.
- `navigationPreload`: Enables navigation preloading for faster page loads.
- `navigateFallback`: Sets `/offline.html` as the fallback page for navigation requests when offline.
- `navigateFallbackAllowlist`: Allows fallback for all routes except internal Workbox routes (`/\/__`).
- `navigateFallbackDenylist`: Excludes specific file types (images) from navigation fallback.

### Service Worker (`src/sw.js`)

The service worker handles caching and offline strategies. It uses `workbox.precacheAndRoute` to precache essential assets and `workbox.registerRoute` for runtime caching strategies.

### PWA Update Prompt (`src/components/PWAUpdatePrompt.jsx`)

This component leverages `virtual:pwa-register` to manage service worker lifecycle events, including:
- **Update Notification**: Prompts the user when new content is available and allows them to refresh the app.
- **Offline Ready**: Logs when the app is ready for offline use.
- **Install Prompt**: Detects the `beforeinstallprompt` event and presents a custom UI for installing the PWA to the user's home screen.
- **Installation Confirmation**: Logs when the PWA has been successfully installed.

### Offline Page (`public/offline.html`)

A custom `offline.html` page is served when the user is offline and attempts to navigate to a page not available in the cache. It provides a user-friendly message and an option to reload when back online.

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
- Markdown support
- Note sharing 