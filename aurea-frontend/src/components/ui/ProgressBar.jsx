export default function ProgressBar({ current, total, label, showPercent = false }) {
  const pct = Math.min(100, Math.round((current / total) * 100))

  return (
    <div>
      {label && (
        <p style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '6px' }}>{label}</p>
      )}
      <div style={{
        height: '3px',
        background: 'var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${pct}%`,
          background: 'var(--accent)',
          transition: 'width 0.4s ease',
        }} />
      </div>
      {showPercent && (
        <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px', textAlign: 'right' }}>{pct}%</p>
      )}
    </div>
  )
}
