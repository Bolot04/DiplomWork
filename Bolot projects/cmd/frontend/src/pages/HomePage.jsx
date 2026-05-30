import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHolidays, deleteHoliday } from '../api'
import FileUpload from '../components/FileUpload'
import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api' })

export default function HomePage() {
  const [holidays, setHolidays] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', month: '', day: '', image_url: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const isAdmin = !!localStorage.getItem('admin_token')

  const fetchHolidays = () => getHolidays().then(res => setHolidays(res.data.Holidays || []))
  useEffect(() => { fetchHolidays() }, [])

  const handleSubmit = async () => {
    if (!form.title || !form.month || !form.day) { setError('Заполните обязательные поля'); return }
    setLoading(true)
    try {
      const date = `2000-${String(form.month).padStart(2, '0')}-${String(form.day).padStart(2, '0')}`
      const { month, day, ...data } = form
      await api.post('/holidays/', { ...data, date })
      setForm({ title: '', description: '', month: '', day: '', image_url: '' })
      setShowForm(false)
      fetchHolidays()
    } catch (e) {
      setError(e.response?.data?.error || 'Ошибка')
    } finally { setLoading(false) }
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!confirm('Удалить праздник?')) return
    await deleteHoliday(id)
    fetchHolidays()
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
      {error && (
        <div style={{ position: 'fixed', top: 24, right: 24, background: '#c54545', color: '#f0ede6', padding: '12px 20px', borderRadius: 10, zIndex: 1000, fontSize: 14 }}>
          {error} <button onClick={() => setError('')} style={{ background: 'none', color: '#f0ede6', marginLeft: 12, fontSize: 16 }}>✕</button>
        </div>
      )}

      <div style={{ marginBottom: 48, borderBottom: '1px solid #2e2c28', paddingBottom: 32 }}>
        <p style={{ color: '#e8c547', fontWeight: 500, letterSpacing: 4, fontSize: 12, textTransform: 'uppercase', marginBottom: 12 }}>Культурная платформа</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1 }}>
            Праздники<br /><span style={{ color: '#e8c547' }}>& Традиции</span>
          </h1>
          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              style={{ background: showForm ? '#2e2c28' : '#e8c547', color: showForm ? '#f0ede6' : '#0f0e0a', padding: '12px 24px', borderRadius: 8, fontWeight: 500, fontSize: 14 }}
            >
              {showForm ? '✕ Отмена' : '+ Добавить праздник'}
            </button>
          )}
        </div>
      </div>

      {isAdmin && showForm && (
        <div style={{ background: '#1a1916', border: '1px solid #2e2c28', borderRadius: 12, padding: 24, marginBottom: 40 }}>
          <h3 style={{ marginBottom: 20, fontSize: 20 }}>Новый праздник</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input placeholder="Название *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <div style={{ display: 'flex', gap: 12 }}>
              <select value={form.month} onChange={e => setForm({ ...form, month: e.target.value })}>
                <option value="">Месяц *</option>
                {['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'].map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
              <select value={form.day} onChange={e => setForm({ ...form, day: e.target.value })}>
                <option value="">День *</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <FileUpload label="Загрузить картинку праздника" accept="image/*"
                onUploaded={url => setForm({ ...form, image_url: url })} />
            </div>
            <textarea placeholder="Описание" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={{ gridColumn: 'span 2', resize: 'vertical' }} />
          </div>
          <button onClick={handleSubmit} disabled={loading} style={{ marginTop: 16, background: loading ? '#8a8680' : '#e8c547', color: '#0f0e0a', padding: '10px 24px', borderRadius: 8, fontWeight: 600 }}>
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      )}

      {holidays.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#8a8680' }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>🎉</p>
          <p style={{ fontSize: 18 }}>Пока нет праздников</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {holidays.map(h => (
            <HolidayCard key={h.id} holiday={h} onClick={() => navigate(`/holidays/${h.id}`)} onDelete={handleDelete} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  )
}

function HolidayCard({ holiday, onClick, onDelete, isAdmin }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: '#1a1916', borderRadius: 12, overflow: 'hidden', border: `1px solid ${hovered ? '#e8c547' : '#2e2c28'}`, cursor: 'pointer', transition: 'all 0.25s', transform: hovered ? 'translateY(-4px)' : 'none', boxShadow: hovered ? '0 12px 40px rgba(232,197,71,0.15)' : 'none', position: 'relative' }}>
      <div style={{ height: 180, background: '#242320', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {holiday.image_url
          ? <img src={holiday.image_url} alt={holiday.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
          : <span style={{ fontSize: 48 }}>🎊</span>}
      </div>
      <div style={{ padding: '16px 20px 20px' }}>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>{holiday.title}</h2>
        {holiday.description && <p style={{ color: '#8a8680', fontSize: 14, lineHeight: 1.6, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{holiday.description}</p>}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#e8c547', fontSize: 13 }}>📅 {holiday.date?.split('T')[0]}</span>
          {isAdmin && (
            <button onClick={e => onDelete(e, holiday.id)} style={{ background: 'transparent', color: '#c54545', fontSize: 13, padding: '4px 8px', borderRadius: 6, border: '1px solid #c54545' }}>
              Удалить
            </button>
          )}
        </div>
      </div>
    </div>
  )
}