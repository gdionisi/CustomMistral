/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1a1a1a',
        surface: '#2d2d2d',
        border: '#404040',
        text: {
          primary: '#ffffff',
          secondary: '#e0e0e0'
        }
      }
    },
  },
  plugins: [],
} 