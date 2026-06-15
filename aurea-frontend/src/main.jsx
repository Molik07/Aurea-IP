/**
 * Application entry point.
 *
 * Wraps the root component with:
 * - React.StrictMode for development warnings
 * - BrowserRouter for client-side routing
 * - HelmetProvider for per-route <head> management (SEO)
 * - Lenis smooth scroll initialization (side effect import)
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './lenis.js'
import './styles/globals.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)
