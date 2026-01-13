import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './globals.css'
import '@/shared/i18n' // 初始化 i18n

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
