# TaskMark

TaskMark is a productivity web application designed to help users organize and manage notes and checklists efficiently. Built with React and styled using Tailwind CSS, TaskMark offers an intuitive interface and smart features to streamline your workflow.

## Features

### Note Management
- 📝 Rich text editing with markdown support
- 📱 Responsive design for desktop and mobile
- 🔍 Full-text search across all notes
- 📅 Automatic timestamps for creation and updates
- 🗑️ Easy note deletion and management
- 📦 Import/Export notes as JSON

### User Experience
- 🌓 Multiple themes (Pastel, Light, Dark)
- ⌨️ Keyboard shortcuts for power users
- 📱 Progressive Web App (PWA) support
- 💾 Offline-first functionality
- 🔄 Real-time auto-save
- 📊 Word count and statistics

## Getting Started

### Prerequisites
- Node.js (v16 or above recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/taskmark.git
   cd taskmark
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open your browser and go to `http://localhost:5173` (or the port shown in your terminal).

## Project Structure
```
taskmark/
│
├── src/
│   ├── App.jsx              # Main application component
│   ├── AIChecklist.jsx      # AI-powered checklist component
│   ├── NotesContext.jsx     # Context provider for notes and checklist
│   ├── index.css            # Global styles (Tailwind CSS)
│   └── main.jsx             # Entry point
│
├── public/
│   └── index.html           # HTML template
│
├── package.json             # Project metadata and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── vite.config.js           # Vite configuration
```

## Scripts
- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm run preview` — Preview the production build

## Customization
You can easily extend TaskMark by adding new features or integrating additional AI capabilities. The modular structure and use of React Context make it easy to manage and scale the app.

## License
This project is licensed under the MIT License.

---

*TaskMark — Organize your notes, never lose track of your tasks!*
