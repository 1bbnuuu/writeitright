import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from '@/App'
import SelectLevel from '@/pages/SelectLevel'
import LevelOne from '@/pages/LevelOne'
import About from '@/pages/About'
import '@/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/select-level" element={<SelectLevel />} />
        <Route path="/level-one" element={<LevelOne />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)