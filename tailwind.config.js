module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        darkblue: {
          50: '#eaf1fb',
          100: '#c8daf3',
          200: '#a3c1ea',
          300: '#7ea8e1',
          400: '#5e92db',
          500: '#397ad4',
          600: '#2e62a8',
          700: '#23497c',
          800: '#163150',
          900: '#0a1825',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'SF Pro Display',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
