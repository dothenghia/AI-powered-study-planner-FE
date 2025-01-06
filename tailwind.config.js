/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'
import scrollbar from 'tailwindcss-scrollbar'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1677ff',
          hover: '#4096ff',
          background: '#e6f4ff',
          'background-hover': '#bae0ff',
        },
      },
    },
  },
  plugins: [
    forms,
    scrollbar,
  ],
}
