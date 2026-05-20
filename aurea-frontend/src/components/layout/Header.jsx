import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useCart from '../../hooks/useCart'

const navLinks = [
  { label: 'Shop', path: '/products' },
  { label: 'Bestsellers', path: '/products?sort=bestseller' },
  { label: 'New Arrivals', path: '/products?sort=new' },
  { label: 'Quiz', path: '/quiz' },
  { label: 'About', path: '/about' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { openCart, getItemCount } = useCart()
  const count = getItemCount()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const headerStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: 'var(--bg)',
    borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
    transition: 'border-color 0.3s ease',
  }

  const innerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
  }

  return (
    <>
      <header style={headerStyle}>
        <div style={innerStyle}>
          {/* Mobile: hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
            className="mobile-hamburger"
            aria-label="Open menu"
          >
            <HamburgerIcon />
          </button>

          {/* Logo */}
          <Link
            to="/"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '22px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: 'var(--text)',
              textDecoration: 'none',
            }}
          >
            AUREA
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', gap: '32px' }} className="desktop-nav">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.path}
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '13px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--text)',
                  textDecoration: 'none',
                  opacity: 0.85,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.opacity = 1)}
                onMouseLeave={(e) => (e.target.style.opacity = 0.85)}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button aria-label="Search" onClick={() => navigate('/products')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
              <SearchIcon />
            </button>
            <button aria-label="Wishlist" onClick={() => navigate('/account?tab=Wishlist')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
              <HeartIcon />
            </button>
            <button aria-label="Account" onClick={() => navigate('/account')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
              <AccountIcon />
            </button>
            <button
              aria-label={`Cart (${count} items)`}
              onClick={openCart}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', position: 'relative' }}
            >
              <CartIcon />
              {count > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-8px',
                  background: 'var(--accent)',
                  color: 'var(--white)',
                  borderRadius: '100px',
                  fontSize: '10px',
                  fontWeight: 600,
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            backgroundColor: 'var(--bg)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', letterSpacing: '0.12em' }}>AUREA</span>
            <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}>×</button>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.path}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '28px',
                  color: 'var(--text)',
                  textDecoration: 'none',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function AccountIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}
