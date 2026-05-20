import { useState } from 'react'

export default function ShadeSelector({ shades = [], selected, onSelect }) {
  const [hovered, setHovered] = useState(null)

  if (!shades.length) return null

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-light)' }}>
          Shade:
        </span>
        <span style={{ fontSize: '13px', color: 'var(--text-mid)' }}>
          {hovered?.name || selected?.name || '—'}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {shades.map((shade) => {
          const isSelected = selected?.name === shade.name
          return (
            <button
              key={shade.name}
              onClick={() => onSelect(shade)}
              onMouseEnter={() => setHovered(shade)}
              onMouseLeave={() => setHovered(null)}
              title={shade.name}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: shade.hex,
                border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                outline: isSelected ? '2px solid var(--bg)' : 'none',
                outlineOffset: '-3px',
                cursor: 'pointer',
                transition: 'transform 0.15s, outline 0.15s',
                transform: isSelected ? 'scale(1.15)' : 'scale(1)',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
