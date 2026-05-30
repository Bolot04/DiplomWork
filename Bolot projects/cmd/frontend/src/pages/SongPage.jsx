import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSong } from '../api'

export default function SongPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [song, setSong] = useState(null)

  useEffect(() => { getSong(id).then(res => setSong(res.data.song)) }, [id])

  if (!song) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#8a8680' }}>Загрузка...</div>

  const isAudio = song.video_url && (song.video_url.includes('.mp3') || song.video_url.includes('.wav') || song.video_url.includes('.ogg'))

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'transparent', color: '#8a8680', padding: '8px 0', marginBottom: 32, fontSize: 14 }}>← Назад</button>
      <div style={{ background: '#1a1916', borderRadius: 16, padding: '40px', border: '1px solid #2e2c28' }}>
        <p style={{ color: '#e8c547', fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 12 }}>🎵 Песня</p>
        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 32 }}>{song.title}</h1>
        {song.video_url && (
          <div style={{ marginBottom: 32, borderRadius: 10, overflow: 'hidden', background: '#242320', padding: isAudio ? 16 : 0 }}>
            {isAudio
              ? <audio src={song.video_url} controls style={{ width: '100%' }} />
              : <video src={song.video_url} controls style={{ width: '100%', borderRadius: 10 }} />}
          </div>
        )}
        {song.lyrics && (
          <div>
            <h3 style={{ fontSize: 16, color: '#8a8680', marginBottom: 16, letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'DM Sans' }}>Текст</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'DM Sans', lineHeight: 2, color: '#f0ede6', fontSize: 15 }}>{song.lyrics}</pre>
          </div>
        )}
      </div>
    </div>
  )
}