/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-100': '#1a1a1a',
        'dark-200': '#121212',
      },
    },
  },
  plugins: [],
}
