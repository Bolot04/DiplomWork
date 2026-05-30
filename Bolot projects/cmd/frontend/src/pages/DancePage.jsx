import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDance } from '../api'

export default function DancePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [dance, setDance] = useState(null)

  useEffect(() => { getDance(id).then(res => setDance(res.data.dance)) }, [id])

  if (!dance) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#8a8680' }}>Загрузка...</div>

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'transparent', color: '#8a8680', padding: '8px 0', marginBottom: 32, fontSize: 14 }}>
        ← Назад
      </button>
      <div style={{ background: '#1a1916', borderRadius: 16, padding: '40px', border: '1px solid #2e2c28' }}>
        <p style={{ color: '#e8c547', fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 12 }}>💃 Танец</p>
        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 32 }}>{dance.title}</h1>
        {dance.video_url && (
          <div style={{ marginBottom: 32, borderRadius: 10, overflow: 'hidden' }}>
            <video src={dance.video_url} controls style={{ width: '100%', borderRadius: 10 }} />
          </div>
        )}
        {dance.description && (
          <div>
            <h3 style={{ fontSize: 16, color: '#8a8680', marginBottom: 16, letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'DM Sans' }}>Описание</h3>
            <p style={{ lineHeight: 1.8, color: '#f0ede6', fontSize: 15 }}>{dance.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}