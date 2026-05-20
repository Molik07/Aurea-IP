import { useState } from 'react'

export default function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '18px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          fontWeight: 500,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'var(--text)',
        }}>
          {title}
        </span>
        <span style={{
          fontSize: '20px',
          lineHeight: 1,
          color: 'var(--text-mid)',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
          display: 'inline-block',
        }}>
          +
        </span>
      </button>
      <div style={{
        maxHeight: open ? '600px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.35s ease',
      }}>
        <div style={{ paddingBottom: '18px', fontSize: '14px', color: 'var(--text-mid)', lineHeight: 1.7 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
