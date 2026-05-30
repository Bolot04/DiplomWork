import { useState, useEffect } from 'react'

export default function ErrorAlert({ error, onClose }) {
  const [visible, setVisible] = useState(!!error)

  useEffect(() => {
    setVisible(!!error)
    if (error) {
      const timer = setTimeout(() => {
        setVisible(false)
        onClose?.()
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [error, onClose])

  if (!visible || !error) return null

  return (
    <div style={{
      position: 'fixed',
      top: 24,
      right: 24,
      background: '#c54545',
      color: '#f0ede6',
      padding: '16px 24px',
      borderRadius: 12,
      border: '1px solid #e87d47',
      boxShadow: '0 8px 32px rgba(197, 69, 69, 0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      maxWidth: 500,
      animation: 'slideIn 0.3s ease-out',
      zIndex: 1000,
      fontFamily: 'DM Sans, sans-serif',
      fontSize: 14,
      lineHeight: 1.5
    }}>
      <span style={{ fontSize: 24 }}>⚠️</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>Ошибка</div>
        <div style={{ fontSize: 13, opacity: 0.9 }}>{error}</div>
      </div>
      <button
        onClick={() => {
          setVisible(false)
          onClose?.()
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#f0ede6',
          cursor: 'pointer',
          fontSize: 24,
          padding: 0,
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={e => e.target.style.opacity = '0.7'}
        onMouseLeave={e => e.target.style.opacity = '1'}
      >
        ✕
      </button>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(400px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
