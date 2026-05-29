import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  const col = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  }

  const linkStyle = {
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    color: 'rgba(255,255,255,0.65)',
    textDecoration: 'none',
    transition: 'color 0.2s',
    cursor: 'pointer',
  }

  return (
    <footer style={{ backgroundColor: 'var(--accent)', color: 'var(--white)' }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '48px 24px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '40px',
        }}
        className="footer-grid"
      >
        {/* Brand */}
        <div style={col}>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', letterSpacing: '0.12em', fontWeight: 600 }}>
            AUREA
          </span>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginTop: '4px' }}>
            Skincare rooted in science. Rituals inspired by nature. Every product crafted for your skin.
          </p>
        </div>

        {/* Shop */}
        <div style={col}>
          <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Shop</span>
          {[
            { label: 'All Products', path: '/products' },
            { label: 'Bestsellers', path: '/products?sort=bestseller' },
            { label: 'New Arrivals', path: '/products?sort=new' },
            { label: 'Bundles & Kits', path: '/products?category=bundle' },
            { label: 'Skin Quiz', path: '/quiz' },
          ].map((l) => (
            <Link key={l.label} to={l.path} style={linkStyle}
              onMouseEnter={(e) => (e.target.style.color = '#fff')}
              onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.65)')}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Help */}
        <div style={col}>
          <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Help</span>
          {['Contact Us', 'Shipping Policy', 'Returns & Exchanges', 'FAQ', 'Track Order'].map((label) => (
            <span key={label} style={linkStyle}
              onMouseEnter={(e) => (e.target.style.color = '#fff')}
              onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.65)')}>
              {label}
            </span>
          ))}
        </div>

        {/* Newsletter */}
        <div style={col}>
          <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Stay in the glow</span>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
            New arrivals, skincare tips, and exclusive offers — directly to you.
          </p>
          {subscribed ? (
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>You're in! ✨</p>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'var(--white)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '10px 14px',
                  background: 'var(--white)',
                  color: 'var(--accent)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px 24px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
          © 2026 Aurea. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Privacy Policy', 'Terms of Use'].map((l) => (
            <span key={l} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; padding: 32px 20px 24px !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </footer>
  )
}
