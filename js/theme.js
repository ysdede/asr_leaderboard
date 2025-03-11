// Theme detection and management
function detectTheme() {
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
    console.log("Theme detection: System preference - DARK theme applied");
    return 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    console.log("Theme detection: System preference - LIGHT theme applied");
    return 'light';
  }
}

// Run on page load
const initialTheme = detectTheme(); 