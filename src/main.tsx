import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const twiceDate = new Date("2026-05-30T20:00:00");

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App targetDate={twiceDate} />
  </StrictMode>,
)
