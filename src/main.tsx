import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Suppress COOP-related console errors for Firebase Auth popups
const originalError = console.error;
console.error = (...args) => {
  const errorMessage = args[0]?.toString() || '';
  
  // Filter out COOP errors that are cosmetic and don't affect functionality
  if (errorMessage.includes('Cross-Origin-Opener-Policy') && 
      errorMessage.includes('window.closed')) {
    return; // Don't log COOP errors
  }
  
  // Log all other errors normally
  originalError(...args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
