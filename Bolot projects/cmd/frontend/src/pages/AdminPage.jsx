import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, getHolidays, deleteHoliday, getHolidaySongs, getHolidayDances, deleteSong, deleteDance } from '../api'

export default function AdminPage() {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('admin_token'))
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const handleLogin = async () => {
    if (!password) return
    setLoginLoading(true)
    setLoginError('')
    try {
      const res = await login(password)
      localStorage.setItem('admin_token', res.data.token)
      setToken(res.data.token)
    } catch (e) {
      setLoginError(e.response?.data?.error || 'Ошибка входа')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setToken(null)
  }

  if (!token) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f0e0a' }}>
        <div style={{ background: '#1a1916', border: '1px solid #2e2c28', borderRadius: 16, padding: '48px 40px', width: 360 }}>
          <p style={{ color: '#e8c547', fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 12 }}>Вход</p>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 32, fontFamily: 'Playfair Display, serif' }}>Панель администратора</h1>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ marginBottom: 12 }}
          />
          {loginError && <p style={{ color: '#c54545', fontSize: 13, marginBottom: 12 }}>{loginError}</p>}
          <button
            onClick={handleLogin}
            disabled={loginLoading}
            style={{ background: loginLoading ? '#8a8680' : '#e8c547', color: '#0f0e0a', width: '100%', padding: '12px', borderRadius: 8, fontWeight: 600, fontSize: 15 }}
          >
            {loginLoading ? 'Вход...' : 'Войти'}
          </button>
          <button onClick={() => navigate('/')} style={{ background: 'transparent', color: '#8a8680', width: '100%', padding: '10px', marginTop: 8, fontSize: 13 }}>
            ← На сайт
          </button>
        </div>
      </div>
    )
  }

  return <AdminPanel onLogout={handleLogout} />
}

function AdminPanel({ onLogout }) {
  const navigate = useNavigate()
  const [holidays, setHolidays] = useState([])
  const [selected, setSelected] = useState(null)
  const [songs, setSongs] = useState([])
  const [dances, setDances] = useState([])
  const [tab, setTab] = useState('songs')

  const fetchHolidays = () => getHolidays().then(res => setHolidays(res.data.Holidays || []))
  useEffect(() => { fetchHolidays() }, [])

  const selectHoliday = (h) => {
    setSelected(h)
    setTab('songs')
    getHolidaySongs(h.id).then(res => setSongs(res.data.songs || []))
    getHolidayDances(h.id).then(res => setDances(res.data.dances || []))
  }

  const handleDeleteHoliday = async (id) => {
    if (!confirm('Удалить праздник и все его данные?')) return
    await deleteHoliday(id)
    if (selected?.id === id) setSelected(null)
    fetchHolidays()
  }

  const handleDeleteSong = async (id) => {
    if (!confirm('Удалить песню?')) return
    await deleteSong(id)
    getHolidaySongs(selected.id).then(res => setSongs(res.data.songs || []))
  }

  const handleDeleteDance = async (id) => {
    if (!confirm('Удалить танец?')) return
    await deleteDance(id)
    getHolidayDances(selected.id).then(res => setDances(res.data.dances || []))
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, borderBottom: '1px solid #2e2c28', paddingBottom: 24 }}>
        <div>
          <p style={{ color: '#e8c547', fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 }}>Управление</p>
          <h1 style={{ fontSize: 36, fontWeight: 900 }}>Панель администратора</h1>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/')} style={{ background: 'transparent', border: '1px solid #2e2c28', color: '#8a8680', padding: '10px 20px', borderRadius: 8 }}>← На сайт</button>
          <button onClick={onLogout} style={{ background: 'transparent', border: '1px solid #c54545', color: '#c54545', padding: '10px 20px', borderRadius: 8 }}>Выйти</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 32 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18 }}>Праздники ({holidays.length})</h2>
            <button onClick={() => navigate('/')} style={{ background: '#e8c547', color: '#0f0e0a', padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>+ Добавить</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {holidays.map(h => (
              <div key={h.id} onClick={() => selectHoliday(h)}
                style={{ background: selected?.id === h.id ? '#242320' : '#1a1916', border: `1px solid ${selected?.id === h.id ? '#e8c547' : '#2e2c28'}`, borderRadius: 10, padding: '12px 16px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 500, marginBottom: 2 }}>{h.title}</p>
                    <p style={{ color: '#8a8680', fontSize: 12 }}>📅 {h.date?.split('T')[0]}</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); handleDeleteHoliday(h.id) }}
                    style={{ background: 'transparent', color: '#c54545', fontSize: 13, padding: '4px 8px', borderRadius: 6, border: '1px solid #c54545' }}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {!selected ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: '#8a8680', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 40 }}>👈</p>
              <p>Выберите праздник слева</p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <h2 style={{ fontSize: 22 }}>{selected.title}</h2>
                <button onClick={() => navigate(`/holidays/${selected.id}`)} style={{ background: 'transparent', color: '#e8c547', border: '1px solid #e8c547', padding: '6px 14px', borderRadius: 8, fontSize: 13 }}>Открыть →</button>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {['songs', 'dances'].map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? '#e8c547' : 'transparent', color: tab === t ? '#0f0e0a' : '#8a8680', border: '1px solid #2e2c28', padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: tab === t ? 600 : 400 }}>
                    {t === 'songs' ? `🎵 Песни (${songs.length})` : `💃 Танцы (${dances.length})`}
                  </button>
                ))}
              </div>
              {tab === 'songs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {songs.length === 0 ? <p style={{ color: '#8a8680' }}>Нет песен</p> : songs.map(s => (
                    <AdminRow key={s.id} title={s.title} onView={() => navigate(`/songs/${s.id}`)} onDelete={() => handleDeleteSong(s.id)} />
                  ))}
                </div>
              )}
              {tab === 'dances' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {dances.length === 0 ? <p style={{ color: '#8a8680' }}>Нет танцев</p> : dances.map(d => (
                    <AdminRow key={d.id} title={d.title} onView={() => navigate(`/dances/${d.id}`)} onDelete={() => handleDeleteDance(d.id)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AdminRow({ title, onView, onDelete }) {
  return (
    <div style={{ background: '#1a1916', border: '1px solid #2e2c28', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ flex: 1, fontWeight: 500 }}>{title}</span>
      <button onClick={onView} style={{ background: 'transparent', color: '#e8c547', border: '1px solid #e8c547', padding: '5px 14px', borderRadius: 7, fontSize: 13 }}>Открыть</button>
      <button onClick={onDelete} style={{ background: 'transparent', color: '#c54545', border: '1px solid #c54545', padding: '5px 14px', borderRadius: 7, fontSize: 13 }}>Удалить</button>
    </div>
  )
}