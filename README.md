# TaskMark

TaskMark is a productivity web application designed to help users record, organize, and manage meeting notes and checklists efficiently. Built with React and styled using Tailwind CSS, TaskMark offers an intuitive interface and smart features to streamline your workflow.

## Features <Current and Upcoming>

### 1. Meeting Notes Recorder
- **Create, edit, and delete meeting notes**: Quickly jot down important points from your meetings.
- **Organize notes**: Keep your notes structured and accessible for future reference.

### 2. AI-Powered Checklist
- **Smart checklist suggestions**: Get AI-generated checklist items based on your meeting notes to ensure you never miss an action item.
- **Interactive tasks**: Mark tasks as complete or remove them as needed.

### 3. Context Management
- **Notes context**: Uses React Context API to manage notes and checklist data seamlessly across components.

### 4. Modern UI
- **Responsive design**: Looks great on both desktop and mobile devices.
- **Tailwind CSS**: Clean, modern, and customizable styling.

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
│   ├── MeetingRecorder.jsx  # Meeting notes recorder UI
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

*TaskMark — Organize your meetings, never lose track of action items!*
