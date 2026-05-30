import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getHoliday, getHolidaySongs, getHolidayDances, deleteSong, deleteDance } from '../api'
import FileUpload from '../components/FileUpload'
import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api' })

export default function HolidayPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [holiday, setHoliday] = useState(null)
  const [songs, setSongs] = useState([])
  const [dances, setDances] = useState([])
  const [songForm, setSongForm] = useState({ title: '', lyrics: '', audio_url: '' })
  const [danceForm, setDanceForm] = useState({ title: '', description: '', video_url: '' })
  const [showSongForm, setShowSongForm] = useState(false)
  const [showDanceForm, setShowDanceForm] = useState(false)
  const isAdmin = !!localStorage.getItem('admin_token')

  const fetchAll = () => {
    getHoliday(id).then(res => setHoliday(res.data.holiday))
    getHolidaySongs(id).then(res => setSongs(res.data.songs || []))
    getHolidayDances(id).then(res => setDances(res.data.dances || []))
  }
  useEffect(() => { fetchAll() }, [id])

  const addSong = async () => {
    if (!songForm.title) return
    await api.post('/songs/', { ...songForm, video_url: songForm.audio_url, holiday_id: parseInt(id) })
    setSongForm({ title: '', lyrics: '', audio_url: '' })
    setShowSongForm(false)
    getHolidaySongs(id).then(res => setSongs(res.data.songs || []))
  }

  const addDance = async () => {
    if (!danceForm.title) return
    await api.post('/dances/', { ...danceForm, holiday_id: parseInt(id) })
    setDanceForm({ title: '', description: '', video_url: '' })
    setShowDanceForm(false)
    getHolidayDances(id).then(res => setDances(res.data.dances || []))
  }

  const handleDeleteSong = async (e, songId) => {
    e.stopPropagation()
    if (!confirm('Удалить песню?')) return
    await deleteSong(songId)
    getHolidaySongs(id).then(res => setSongs(res.data.songs || []))
  }

  const handleDeleteDance = async (e, danceId) => {
    e.stopPropagation()
    if (!confirm('Удалить танец?')) return
    await deleteDance(danceId)
    getHolidayDances(id).then(res => setDances(res.data.dances || []))
  }

  if (!holiday) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#8a8680' }}>Загрузка...</div>

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
      <button onClick={() => navigate('/')} style={{ background: 'transparent', color: '#8a8680', padding: '8px 0', marginBottom: 32, fontSize: 14 }}>← Все праздники</button>

      <div style={{ background: '#1a1916', borderRadius: 16, overflow: 'hidden', marginBottom: 48, border: '1px solid #2e2c28' }}>
        {holiday.image_url && (
          <div style={{ height: 300, overflow: 'hidden' }}>
            <img src={holiday.image_url} alt={holiday.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.parentElement.style.display = 'none' }} />
          </div>
        )}
        <div style={{ padding: '32px 40px' }}>
          <p style={{ color: '#e8c547', fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 12 }}>📅 {holiday.date?.split('T')[0]}</p>
          <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 16 }}>{holiday.title}</h1>
          {holiday.description && <p style={{ color: '#8a8680', fontSize: 16, lineHeight: 1.8 }}>{holiday.description}</p>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {/* Songs */}
        <Section title="🎵 Песни" count={songs.length} onAdd={isAdmin ? () => setShowSongForm(!showSongForm) : null} showForm={showSongForm} isAdmin={isAdmin}>
          {isAdmin && showSongForm && (
            <div style={{ background: '#242320', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <input placeholder="Название *" value={songForm.title} onChange={e => setSongForm({ ...songForm, title: e.target.value })} style={{ marginBottom: 8 }} />
              <div style={{ marginBottom: 8 }}>
                <FileUpload label="Загрузить аудио" accept="audio/*,video/*"
                  onUploaded={url => setSongForm({ ...songForm, audio_url: url })} />
              </div>
              <textarea placeholder="Текст песни" value={songForm.lyrics} onChange={e => setSongForm({ ...songForm, lyrics: e.target.value })} rows={3} style={{ marginBottom: 12, resize: 'vertical' }} />
              <button onClick={addSong} style={{ background: '#e8c547', color: '#0f0e0a', padding: '8px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13 }}>Сохранить</button>
            </div>
          )}
          {songs.length === 0 ? <Empty text="Нет песен" /> : songs.map(s => (
            <ItemCard key={s.id} title={s.title} onClick={() => navigate(`/songs/${s.id}`)} icon="🎵"
              onDelete={isAdmin ? e => handleDeleteSong(e, s.id) : null} isAdmin={isAdmin} />
          ))}
        </Section>

        {/* Dances */}
        <Section title="💃 Танцы" count={dances.length} onAdd={isAdmin ? () => setShowDanceForm(!showDanceForm) : null} showForm={showDanceForm} isAdmin={isAdmin}>
          {isAdmin && showDanceForm && (
            <div style={{ background: '#242320', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <input placeholder="Название *" value={danceForm.title} onChange={e => setDanceForm({ ...danceForm, title: e.target.value })} style={{ marginBottom: 8 }} />
              <div style={{ marginBottom: 8 }}>
                <FileUpload label="Загрузить видео" accept="video/*"
                  onUploaded={url => setDanceForm({ ...danceForm, video_url: url })} />
              </div>
              <textarea placeholder="Описание" value={danceForm.description} onChange={e => setDanceForm({ ...danceForm, description: e.target.value })} rows={3} style={{ marginBottom: 12, resize: 'vertical' }} />
              <button onClick={addDance} style={{ background: '#e8c547', color: '#0f0e0a', padding: '8px 20px', borderRadius: 8, fontWeight: 600, fontSize: 13 }}>Сохранить</button>
            </div>
          )}
          {dances.length === 0 ? <Empty text="Нет танцев" /> : dances.map(d => (
            <ItemCard key={d.id} title={d.title} onClick={() => navigate(`/dances/${d.id}`)} icon="💃"
              onDelete={isAdmin ? e => handleDeleteDance(e, d.id) : null} isAdmin={isAdmin} />
          ))}
        </Section>
      </div>
    </div>
  )
}

function Section({ title, count, onAdd, showForm, isAdmin, children }) {
  return (
    <div style={{ background: '#1a1916', borderRadius: 12, padding: 24, border: '1px solid #2e2c28' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 22 }}>{title} <span style={{ color: '#8a8680', fontSize: 16, fontFamily: 'DM Sans' }}>({count})</span></h2>
        {isAdmin && onAdd && (
          <button onClick={onAdd} style={{ background: showForm ? '#2e2c28' : 'transparent', border: '1px solid #2e2c28', color: '#e8c547', padding: '6px 14px', borderRadius: 8, fontSize: 13 }}>
            {showForm ? '✕' : '+ Добавить'}
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

function ItemCard({ title, onClick, icon, onDelete, isAdmin }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 8, background: hovered ? '#242320' : 'transparent', border: `1px solid ${hovered ? '#e8c547' : '#2e2c28'}`, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ fontWeight: 500, flex: 1 }}>{title}</span>
      {isAdmin && onDelete && (
        <button onClick={onDelete} style={{ background: 'transparent', color: '#c54545', fontSize: 12, padding: '3px 8px', borderRadius: 5, border: '1px solid #c54545' }}>✕</button>
      )}
    </div>
  )
}

function Empty({ text }) {
  return <p style={{ color: '#8a8680', textAlign: 'center', padding: '32px 0', fontSize: 14 }}>{text}</p>
}