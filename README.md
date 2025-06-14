# Taskmark

A modern, keyboard-driven note-taking application built with React. Taskmark combines the simplicity of plain text with powerful features like tags, search, and a recycle bin.

## Features

### Note Management
- Create, edit, and delete notes
- Automatic saving
- Word and line count statistics
- Last updated timestamp tracking
- Deleted notes can be recovered from the recycle bin

### Organizing with Tags
- Add tags to your notes
- Tags are automatically converted to lowercase
- Use tags to categorize and filter your notes
- Press `Alt + T` to quickly add tags

### Searching
- Use `Alt + S` or click the search icon to open search
- Search through titles, content, tags, and dates
- Results update in real-time as you type
- Use arrow keys to navigate through search results
- Press Enter to select a note
- Press Esc to close search
- Search results show note title, preview, tags, and last updated time

### Recycle Bin
- Access deleted notes from the recycle bin
- Restore or permanently delete notes
- Press Esc to close the recycle bin modal
- Undo deletion with a notification toast

### Themes
- Click the theme toggle button to cycle through available themes:
  - Pastel (default)
  - Light
  - Dark
- Theme preference is saved in your browser
- Automatic meta theme color updates

### Keyboard Shortcuts
| Shortcut | Action |
|----------|---------|
| `Alt + N` | Create new note |
| `Alt + S` | Open search |
| `Alt + T` | Add tag |
| `Alt + Delete` | Delete current note |
| `Esc` | Close search/recycle bin |
| `Enter` | Select note from search |

### Responsive Design
- Works on desktop and mobile devices
- Collapsible sidebar on mobile
- Touch-friendly interface
- Responsive layout adapts to screen size

## Technical Features
- Built with React and modern JavaScript
- Custom hooks for theme management and keyboard shortcuts
- Context-based state management
- Local storage persistence
- Modular component architecture
- Clean and maintainable codebase

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
