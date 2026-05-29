const trustItems = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v4h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    label: 'Free Shipping',
    sub: 'On orders above ₹999',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.51" />
      </svg>
    ),
    label: 'Easy Returns',
    sub: '30-day hassle-free returns',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    label: 'Dermatologist Tested',
    sub: 'Clinically proven formulas',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    label: 'Secure Payment',
    sub: '256-bit SSL encryption',
  },
]

export default function TrustBar() {
  return (
    <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
      }}
        className="trust-grid"
      >
        {trustItems.map((item, i) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '32px 16px',
              borderRight: i < trustItems.length - 1 ? '1px solid var(--border)' : 'none',
              gap: '10px',
            }}
            className="trust-item"
          >
            <div style={{ color: 'var(--text)' }}>{item.icon}</div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em' }}>{item.label}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .trust-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .trust-item {
            border-right: none !important;
            border-bottom: 1px solid var(--border);
            padding: 20px 12px !important;
          }
          .trust-item:nth-child(1),
          .trust-item:nth-child(2) {
            border-right: none !important;
          }
          .trust-item:nth-last-child(-n+2) {
            border-bottom: none !important;
          }
        }
        @media (min-width: 769px) {
          .trust-item:nth-child(odd) { border-right: 1px solid var(--border); }
        }
      `}</style>
    </div>
  )
}
