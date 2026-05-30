import { useState, useRef } from 'react'
import { uploadFile } from '../api'

export default function FileUpload({ onUploaded, accept = 'image/*', label = 'Загрузить файл', preview = true }) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const inputRef = useRef()

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadFile(file)
      const url = (import.meta.env.VITE_API_URL || 'http://localhost:8081/api').replace('/api', '') + res.data.url
      if (preview) setPreviewUrl(url)
      onUploaded(url)
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const isImage = accept.includes('image')
  const isAudio = accept.includes('audio')

  return (
    <div>
      <div onClick={() => inputRef.current.click()}
        style={{
          border: '2px dashed #2e2c28', borderRadius: 10, padding: '20px',
          cursor: 'pointer', textAlign: 'center', transition: 'border-color 0.2s',
          background: '#1a1916'
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#e8c547'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#2e2c28'}>
        {uploading ? (
          <p style={{ color: '#8a8680', fontSize: 14 }}>Загрузка...</p>
        ) : previewUrl && isImage ? (
          <img src={previewUrl} style={{ maxHeight: 120, borderRadius: 8, objectFit: 'cover' }} />
        ) : previewUrl && isAudio ? (
          <audio src={previewUrl} controls style={{ width: '100%' }} />
        ) : (
          <div>
            <p style={{ fontSize: 28, marginBottom: 8 }}>{isAudio ? '🎵' : '🖼️'}</p>
            <p style={{ color: '#8a8680', fontSize: 13 }}>{label}</p>
            <p style={{ color: '#4a4846', fontSize: 11, marginTop: 4 }}>Нажмите для выбора</p>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} style={{ display: 'none' }} />
    </div>
  )
}