import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import HolidayPage from './pages/HolidayPage'
import SongPage from './pages/SongPage'
import DancePage from './pages/DancePage'
import AdminPage from './pages/AdminPage'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/holidays/:id" element={<HolidayPage />} />
        <Route path="/songs/:id" element={<SongPage />} />
        <Route path="/dances/:id" element={<DancePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App