import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.jsx'
import './css/index.css'

// Initialize theme from localStorage if available
const initializeTheme = () => {
  if (localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && 
       window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Run theme initialization
initializeTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
