/**
 * Header — Primary site navigation.
 *
 * Features:
 * - Sticky header with subtle border on scroll
 * - Responsive: desktop nav (centered links) / mobile (hamburger + slide-in menu)
 * - Active route highlighting on nav links
 * - Cart badge with item count
 * - Mobile menu with animated slide-in, focus trap, and body scroll lock
 * - ARIA attributes for accessibility (aria-expanded, aria-label)
 *
 * Breakpoints:
 * - ≥901px: Desktop layout (logo left, nav center, icons right)
 * - ≤900px: Mobile layout (hamburger + centered logo + cart only)
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useCart from '../../hooks/useCart'

const navLinks = [
  { label: 'Shop', path: '/products' },
  { label: 'Bestsellers', path: '/products?sort=bestseller' },
  { label: 'New Arrivals', path: '/products?sort=new' },
  { label: 'Quiz', path: '/quiz' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { openCart, getItemCount } = useCart()
  const count = getItemCount()
  const navigate = useNavigate()
  const location = useLocation()
  const menuRef = useRef(null)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Focus the close button when mobile menu opens (focus trap start)
  useEffect(() => {
    if (menuOpen && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [menuOpen])

  // Close menu on Escape key
  useEffect(() => {
    if (!menuOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  /**
   * Check if a nav link matches the current route.
   * Handles query-param based links like /products?sort=bestseller.
   */
  const isActive = useCallback((path) => {
    if (path === '/products' && location.pathname === '/products' && !location.search) return true
    if (path.includes('?')) {
      return location.pathname + location.search === path
    }
    return location.pathname === path
  }, [location])

  return (
    <>
      <header
        role="banner"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'var(--bg)',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'border-color 0.3s ease',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '60px',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px',
        }}>
          {/* Left: Hamburger (mobile) & Logo */}
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <button
              onClick={() => setMenuOpen(true)}
              className="icon-btn mobile-hamburger"
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <HamburgerIcon />
            </button>
            <Link
              to="/"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '22px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: 'var(--text)',
                textDecoration: 'none',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
              }}
              className="header-logo"
              aria-label="Aurea — Home"
            >
              AUREA
            </Link>
          </div>

          {/* Desktop nav */}
          <nav
            style={{ display: 'flex', gap: 'clamp(16px, 3vw, 32px)', flex: 1, justifyContent: 'center', alignItems: 'center' }}
            className="desktop-nav"
            aria-label="Main navigation"
          >
            {navLinks.map((l) => {
              const active = isActive(l.path)
              return (
                <Link
                  key={l.label}
                  to={l.path}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '13px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--text)',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    opacity: active ? 1 : 0.7,
                    fontWeight: active ? 600 : 400,
                    transition: 'opacity 0.2s, font-weight 0.2s',
                    borderBottom: active ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                    paddingBottom: '2px',
                  }}
                  onMouseEnter={(e) => { if (!active) e.target.style.opacity = 1 }}
                  onMouseLeave={(e) => { if (!active) e.target.style.opacity = 0.7 }}
                >
                  {l.label}
                </Link>
              )
            })}
          </nav>

          {/* Right: Icons — always visible, equal sizing */}
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
            <button
              aria-label="Search products"
              onClick={() => navigate('/products')}
              className="icon-btn"
            >
              <SearchIcon />
            </button>
            <button
              aria-label="View wishlist"
              onClick={() => navigate('/account?tab=Wishlist')}
              className="icon-btn desktop-icon"
            >
              <HeartIcon />
            </button>
            <button
              aria-label="View account"
              onClick={() => navigate('/account')}
              className="icon-btn desktop-icon"
            >
              <AccountIcon />
            </button>
            <button
              aria-label={`Open cart, ${count} item${count !== 1 ? 's' : ''}`}
              onClick={openCart}
              className="icon-btn"
              style={{ position: 'relative' }}
            >
              <CartIcon />
              {count > 0 && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: 'var(--accent)',
                    color: 'var(--white)',
                    borderRadius: '100px',
                    fontSize: '10px',
                    fontWeight: 600,
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay — animated slide-in */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMenu}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 199,
                backgroundColor: 'rgba(0,0,0,0.35)',
              }}
              aria-hidden="true"
            />

            {/* Slide-in panel */}
            <motion.div
              key="menu-panel"
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              ref={menuRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: 'min(320px, 85vw)',
                zIndex: 200,
                backgroundColor: 'var(--bg)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Menu header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 16px',
                height: '60px',
                borderBottom: '1px solid var(--border)',
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', letterSpacing: '0.12em' }}>AUREA</span>
                <button
                  ref={closeButtonRef}
                  onClick={closeMenu}
                  className="icon-btn"
                  aria-label="Close navigation menu"
                  style={{ fontSize: '24px', lineHeight: 1 }}
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Nav links */}
              <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }} aria-label="Mobile navigation">
                {navLinks.map((l) => {
                  const active = isActive(l.path)
                  return (
                    <Link
                      key={l.label}
                      to={l.path}
                      onClick={closeMenu}
                      aria-current={active ? 'page' : undefined}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '26px',
                        color: 'var(--text)',
                        textDecoration: 'none',
                        padding: '14px 24px',
                        borderBottom: '1px solid var(--border)',
                        letterSpacing: '-0.01em',
                        fontWeight: active ? 600 : 400,
                        backgroundColor: active ? 'var(--bg-alt)' : 'transparent',
                      }}
                    >
                      {l.label}
                    </Link>
                  )
                })}
              </nav>

              {/* Account shortcuts at bottom */}
              <div style={{
                borderTop: '1px solid var(--border)',
                padding: '16px 24px',
                display: 'flex',
                gap: '24px',
                flexShrink: 0,
              }}>
                <button
                  onClick={() => { navigate('/account?tab=Wishlist'); closeMenu() }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'var(--text)' }}
                >
                  <HeartIcon size={20} /> Wishlist
                </button>
                <button
                  onClick={() => { navigate('/account'); closeMenu() }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'var(--text)' }}
                >
                  <AccountIcon size={20} /> Account
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        /* Desktop: logo left-aligned, nav centered */
        @media (min-width: 901px) {
          .header-logo {
            position: static !important;
            transform: none !important;
          }
          .desktop-nav {
            display: flex !important;
          }
          .mobile-hamburger {
            display: none !important;
          }
          .desktop-icon {
            display: flex !important;
          }
        }
        /* Mobile & Tablet (iPad Portrait): hamburger + centred logo + cart only */
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-hamburger { display: flex !important; }
          .desktop-icon { display: none !important; }
        }
      `}</style>
    </>
  )
}

/* ─── Icon Components ──────────────────────────────────────────────────────── */

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function AccountIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function HeartIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}
