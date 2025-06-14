# Taskmark

A modern, minimalist note-taking application built with React and Vite. Taskmark combines simplicity with powerful features to help you organize your thoughts and tasks efficiently.

## Features

- 📝 **Clean, Minimalist Interface**: Focus on your content with a distraction-free writing experience
- 🌓 **Multiple Themes**: Choose between Pastel, Light, and Dark themes
- 🔍 **Powerful Search**:
  - Search through titles, content, tags, and dates
  - Real-time search suggestions with preview
  - Shows both creation and update times
  - Keyboard navigation (↑↓ arrows) in search results
- 🏷️ **Tag System**: Organize notes with custom tags
- 📱 **Responsive Design**: Works seamlessly on both desktop and mobile devices
- ⚡ **Keyboard Shortcuts**:
  - `Alt + N`: Create new note
  - `Alt + Delete`: Delete current note
  - `Alt + S`: Open search
  - `Esc`: Close search/recycle bin
- 🗑️ **Recycle Bin**: Safely delete notes with the ability to restore them
- 🔄 **Auto-save**: Changes are saved automatically
- 📱 **PWA Support**: Install as a Progressive Web App for offline access

## Tech Stack

- React 18
- Vite
- TailwindCSS
- CSS Variables for theming
- PWA Support (vite-plugin-pwa)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/taskmark.git
cd taskmark
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Usage

### Creating Notes
- Click the "+" button in the header or use `Alt + N` to create a new note
- Each note starts with an empty text block
- Add a title to your note (optional)

### Managing Notes
- Use the sidebar to navigate between notes
- Notes are automatically sorted by creation date (newest first)
- Delete notes using the trash icon or `Alt + Delete`
- Deleted notes can be recovered from the recycle bin

### Organizing with Tags
- Add tags to your notes
- Tags are automatically converted to lowercase
- Use tags to categorize and filter your notes

### Searching
- Use `Alt + S` or click the search icon to open search
- Search through titles, content, tags, and dates
- Results update in real-time as you type
- Use arrow keys to navigate through search results
- Press Enter to select a note
- Press Esc to close search

### Recycle Bin
- Access deleted notes from the recycle bin
- Restore or permanently delete notes
- Press Esc to close the recycle bin modal

### Themes
- Click the theme toggle button to cycle through available themes
- Theme preference is saved in your browser

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
