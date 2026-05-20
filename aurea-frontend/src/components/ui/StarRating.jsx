export default function StarRating({ rating, count, size = 'default' }) {
  const starSize = size === 'small' ? 12 : 14

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const fill = Math.min(1, Math.max(0, rating - (n - 1)))
          return <Star key={n} fill={fill} size={starSize} />
        })}
      </div>
      {count !== undefined && (
        <span style={{ fontSize: size === 'small' ? '11px' : '13px', color: 'var(--text-light)' }}>
          ({count})
        </span>
      )}
    </div>
  )
}

function Star({ fill, size }) {
  const id = `star-grad-${Math.random().toString(36).slice(2)}`
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor="#1a1a1a" />
          <stop offset={`${fill * 100}%`} stopColor="#1a1a1a" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill={`url(#${id})`}
        stroke="#1a1a1a"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}
