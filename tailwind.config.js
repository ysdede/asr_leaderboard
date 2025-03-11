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
        // Hugging Face color palette
        'hf-blue': '#0ea5e9',
        'hf-pink': '#ec4899',
        'hf-purple': '#8b5cf6',
        'hf-yellow': '#fbbf24',
        'hf-orange': '#f97316',
        
        // Dark mode colors
        'gray-950': '#111827',
        'gray-900': '#1a202c',
        'gray-800': '#1f2937',
        'gray-700': '#374151',
        'gray-600': '#4b5563',
        
        // Light mode colors
        'gray-50': '#f9fafb',
        'gray-100': '#f3f4f6',
        'gray-200': '#e5e7eb',
        'gray-300': '#d1d5db',
        
        // Legacy colors for backward compatibility
        'dark-100': '#1a1a1a',
        'dark-200': '#121212',
      },
      fontFamily: {
        'sans': ['Source Sans Pro', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        'mono': ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'hf': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'hf-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'hf-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'hf': '0.375rem',
      },
    },
  },
  plugins: [],
}
