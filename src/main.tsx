import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { preloadMascots } from './components/Mascot'
import './styles.css'

// Kiosk hardening: no context menus or pinch zoom.
document.addEventListener('contextmenu', (event) => event.preventDefault())
document.addEventListener('gesturestart', (event) => event.preventDefault())

preloadMascots()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
