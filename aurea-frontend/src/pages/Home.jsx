/**
 * Home — Landing page for the Aurea skincare e-commerce site.
 *
 * Sections (top to bottom):
 * 1. Hero — Headline, tagline, CTA buttons, hero image
 * 2. YouTube brand video banner (click-to-load for performance)
 * 3. Bestsellers — Horizontal scrolling product carousel
 * 4. Shop by Concern — Grid of skin concern categories
 * 5. New Arrivals — Horizontal scrolling product carousel
 * 6. Digital Ad Carousel — Auto-rotating promotional slides
 * 7. Bundles & Kits — Grid of product bundles with pricing
 * 8. Trust Bar — Shipping, returns, testing, payment guarantees
 *
 * Performance optimizations:
 * - YouTube iframe loads only on user click (saves ~1.5s render-blocking)
 * - Below-fold images use loading="lazy"
 * - Cloudinary images use width/quality/format transforms
 * - Explicit image dimensions prevent CLS (Cumulative Layout Shift)
 */
import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bestsellerNames, newArrivalNames } from '../data/mockProducts'
import useProducts from '../hooks/useProducts'
import useSettings from '../hooks/useSettings'
import HorizontalScroll from '../components/ui/HorizontalScroll'
import ProductCard from '../components/ui/ProductCard'
import TrustBar from '../components/ui/TrustBar'
import SEOHead from '../components/ui/SEOHead'

const concerns = [
  { label: 'Acne', icon: '✦', path: '/products?concern=Acne' },
  { label: 'Hydration', icon: '◇', path: '/products?concern=Hydration' },
  { label: 'Brightening', icon: '✧', path: '/products?concern=Brightening' },
  { label: 'Anti-Aging', icon: '◈', path: '/products?concern=Anti-Aging' },
  { label: 'SPF', icon: '☀', path: '/products?concern=SPF' },
]

const adSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=80',
    tagline: 'SUMMER RADIANCE REEL',
    title: 'Flat 20% Off on SPF Serums',
    desc: 'Protect and glow with our invisible, weightless physical sunscreen formulas. Use code GLOW20 at checkout.',
    cta: 'Explore SPF',
    path: '/products?concern=SPF',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&auto=format&fit=crop&q=80',
    tagline: 'DERMATOLOGICAL EXCELLENCE',
    title: 'The Ceramide Barrier Repair',
    desc: 'Instantly soothe redness and strengthen your outer lipid barrier with 5 essential skin-identical ceramides.',
    cta: 'Shop Hydration',
    path: '/products?concern=Hydration',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&auto=format&fit=crop&q=80',
    tagline: 'COMPLIMENTARY GIFT',
    title: 'Pure Obsidian Face Roller',
    desc: 'Receive a complimentary premium hand-sculpted face roller on all pre-paid orders above ₹1,999.',
    cta: 'Claim Offer',
    path: '/products',
  },
]

const bundles = [
  { name: 'Morning Glow Kit', desc: 'Cleanser · Vitamin C · SPF 50+', price: '₹2,299', original: '₹2,899', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80' },
  { name: 'Night Repair Set', desc: 'Toner · Retinol Cream · Ceramide Serum', price: '₹2,999', original: '₹3,697', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80' },
  { name: 'SPF Essentials', desc: 'Cleanser · Niacinamide · Invisible SPF', price: '₹1,799', original: '₹2,247', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80' },
]

export default function Home() {
  const { products } = useProducts()
  const { settings } = useSettings()
  
  const bestsellers = useMemo(() => {
    const list = bestsellerNames.map((name) => products.find((p) => p.name === name)).filter(Boolean)
    return list.length > 0 ? list : products.slice(0, 6)
  }, [products])

  const newArrivals = useMemo(() => {
    const list = newArrivalNames.map((name) => products.find((p) => p.name === name)).filter(Boolean)
    return list.length > 0 ? list : (products.slice(6, 12).length > 0 ? products.slice(6, 12) : products.slice(0, 6))
  }, [products])

  const videoStart = 45 // Start playback from the high-energy middle section

  const [currentAdSlide, setCurrentAdSlide] = useState(0)
  const [videoLoaded, setVideoLoaded] = useState(false) // Click-to-load YouTube

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdSlide((prev) => (prev + 1) % adSlides.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  return (
    <main id="main-content">
      <SEOHead
        title="Science-Backed Skincare"
        description="Aurea — Science-backed skincare for Indian skin. Shop serums, moisturisers, sunscreens, and more. Dermatologist tested formulas loved by thousands."
      />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--bg)' }} className="section-pad">
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'center',
            minHeight: '480px',
          }}
          className="hero-grid"
        >
          <div>
            <p style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '14px' }}>
              Science-Backed Skincare
            </p>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              color: 'var(--text)',
              marginBottom: '16px',
            }}>
              Radiance,<br />Redefined.
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text-mid)', lineHeight: 1.7, maxWidth: '400px', marginBottom: '28px' }}>
              Formulated by dermatologists. Loved by thousands. Skincare that actually works for Indian skin.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/products" style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '48px',
                padding: '0 28px',
                backgroundColor: 'var(--accent)',
                color: 'var(--white)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}>
                Shop Now
              </Link>
              <Link to="/quiz" style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '48px',
                padding: '0 28px',
                backgroundColor: 'transparent',
                color: 'var(--accent)',
                border: '1px solid var(--accent)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}>
                Take the Quiz
              </Link>
            </div>
          </div>

          {/* Hero image */}
          <div style={{
            aspectRatio: '4 / 5',
            background: '#e8e4df',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
            className="hero-image"
          >
            {settings.heroImage ? (
              <img
                src={settings.heroImage.includes('/upload/') ? settings.heroImage.replace('/upload/', '/upload/w_1000,q_auto,f_auto/') : settings.heroImage}
                alt="Aurea skincare collection — science-backed formulas for radiant skin"
                width="1000"
                height="1250"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ fontSize: '11px', letterSpacing: '0.08em', color: '#bbb', textTransform: 'uppercase' }}>Image Slot</span>
            )}
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) {
            .hero-grid {
              grid-template-columns: 1fr !important;
              gap: 32px !important;
              min-height: unset !important;
              padding: 0 16px !important;
            }
            .hero-image {
              display: flex !important;
              aspect-ratio: 3 / 2 !important;
              width: 100%;
            }
          }
        `}</style>
      </section>

      {/* ── YouTube Banner (click-to-load for performance) ──────────────── */}
      <div className="yt-banner" style={{ position: 'relative', width: '100%', overflow: 'hidden', backgroundColor: '#111' }}>
        {videoLoaded ? (
          <div style={{ opacity: 0, animation: 'fadeIn 0.6s ease forwards' }}>
            <iframe
              src={`https://www.youtube.com/embed/4KtHgUEKBts?autoplay=1&mute=1&loop=1&playlist=4KtHgUEKBts&controls=0&showinfo=0&rel=0&modestbranding=1&start=${videoStart}&playsinline=1&disablekb=1&fs=0&iv_load_policy=3`}
              allow="autoplay; fullscreen"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '177.78vh',
                minWidth: '100%',
                height: '56.25vw',
                minHeight: '100%',
                border: 'none',
                pointerEvents: 'none',
              }}
              title="Aurea brand video — skincare rituals and product showcase"
              loading="lazy"
            />
          </div>
        ) : (
          /* Click-to-load poster — avoids YouTube's render-blocking scripts on initial load */
          <button
            onClick={() => setVideoLoaded(true)}
            aria-label="Play brand video"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              color: 'rgba(255,255,255,0.7)',
              zIndex: 11,
            }}
          >
            {/* Play button triangle */}
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <polygon points="8,5 20,12 8,19" />
              </svg>
            </div>
            <span style={{ fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
              Watch Our Story
            </span>
          </button>
        )}
        <style>{`
          @keyframes fadeIn { to { opacity: 1; } }
          .yt-banner { height: 416px; }
          @media (max-width: 900px) { .yt-banner { height: 280px; } }
          @media (max-width: 768px) { .yt-banner { height: 220px; } }
        `}</style>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.2)',
          zIndex: 10,
          pointerEvents: 'none',
        }} />
      </div>

      {/* ── Bestsellers ────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--bg-alt)', paddingTop: '48px', paddingBottom: '48px' }}>
        <HorizontalScroll title="Bestsellers">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </HorizontalScroll>
      </section>

      {/* ── Shop by Concern ────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--bg)' }} className="section-pad">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }} className="concern-container">
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '28px', textAlign: 'center' }}>
            Shop by Concern
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '12px',
            }}
            className="concern-grid"
          >
            {concerns.map((c) => (
              <Link
                key={c.label}
                to={c.path}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '20px 12px',
                  border: '1px solid var(--border)',
                  transition: 'background 0.2s, border-color 0.2s',
                  backgroundColor: 'var(--bg)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-alt)'
                  e.currentTarget.style.borderColor = 'var(--text-light)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg)'
                  e.currentTarget.style.borderColor = 'var(--border)'
                }}
              >
                <span style={{ fontSize: '26px', lineHeight: 1 }} aria-hidden="true">{c.icon}</span>
                <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', textAlign: 'center' }}>{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) {
            .concern-grid { grid-template-columns: repeat(3, 1fr) !important; }
            .concern-container { padding: 0 16px !important; }
          }
          @media (max-width: 480px) {
            .concern-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
        `}</style>
      </section>

      {/* ── New Arrivals ───────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--bg-alt)', paddingTop: '48px', paddingBottom: '48px' }}>
        <HorizontalScroll title="New Arrivals">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </HorizontalScroll>
      </section>

      {/* ── Digital Carousel Ad Slot ───────────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--bg)' }} className="section-pad">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }} className="ad-container">
          <div style={{
            position: 'relative',
            width: '100%',
            minHeight: '240px',
            borderRadius: '2px',
            overflow: 'hidden',
            backgroundColor: '#111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          }} className="ad-billboard">
            {/* Crossfading slides */}
            {adSlides.map((slide, idx) => {
              const isActive = idx === currentAdSlide
              return (
                <div
                  key={slide.id}
                  aria-hidden={!isActive}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    pointerEvents: isActive ? 'auto' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 24px',
                    backgroundColor: '#111',
                    color: '#fff',
                  }}
                >
                  <span style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 600 }}>
                    {slide.tagline}
                  </span>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(20px, 4vw, 36px)', fontWeight: 500, marginBottom: '12px', lineHeight: 1.2, maxWidth: '800px' }}>
                    {slide.title}
                  </h3>
                  <p className="ad-desc" style={{ fontSize: '14px', color: '#ccc', lineHeight: 1.6, marginBottom: '22px', maxWidth: '600px' }}>
                    {slide.desc}
                  </p>
                  <div>
                    <Link to={slide.path} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '44px',
                      padding: '0 28px',
                      backgroundColor: 'var(--white)',
                      color: '#111',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      transition: 'background 0.2s, transform 0.2s',
                    }}>
                      {slide.cta} →
                    </Link>
                  </div>
                </div>
              )
            })}

            {/* Slide indicators */}
            <div style={{ position: 'absolute', bottom: '16px', display: 'flex', gap: '8px', zIndex: 10 }}>
              {adSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentAdSlide(idx)}
                  style={{
                    width: '32px',
                    height: '3px',
                    padding: 0,
                    border: 'none',
                    backgroundColor: idx === currentAdSlide ? 'var(--white)' : 'rgba(255,255,255,0.25)',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                  }}
                  aria-label={`Go to promotional slide ${idx + 1}: ${adSlides[idx].title}`}
                />
              ))}
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) {
            .ad-container { padding: 0 16px !important; }
            .ad-billboard { min-height: 200px !important; }
            .ad-desc { display: none !important; }
          }
        `}</style>
      </section>

      {/* ── Bundles & Kits ─────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--bg-alt)' }} className="section-pad">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }} className="bundles-container">
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '28px' }} className="bundles-title">
            Bundles &amp; Kits
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="bundles-grid">
            {bundles.map((b) => (
              <div key={b.name} style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg)', overflow: 'hidden' }}>
                {/* Bundle image */}
                <div style={{ aspectRatio: '4 / 3', background: '#e8e4df', overflow: 'hidden' }}>
                  {b.image ? (
                    <img
                      src={b.image}
                      alt={`${b.name} — ${b.desc}`}
                      width="600"
                      height="450"
                      loading="lazy"
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#bbb', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Image Slot</span>
                    </div>
                  )}
                </div>
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '17px', marginBottom: '4px' }}>{b.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '10px' }}>{b.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>{b.price}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-light)', textDecoration: 'line-through' }}>{b.original}</span>
                  </div>
                  <Link to="/products" style={{
                    display: 'block',
                    textAlign: 'center',
                    height: '44px',
                    lineHeight: '44px',
                    backgroundColor: 'var(--accent)',
                    color: 'var(--white)',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '12px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                  }}>
                    Shop Kit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) {
            .bundles-grid { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
            .bundles-container { padding: 0 16px !important; }
            .bundles-title { font-size: 24px !important; margin-bottom: 20px !important; }
          }
          @media (max-width: 600px) {
            .bundles-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ── Trust Bar ──────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--bg)' }}>
        <TrustBar />
      </section>
    </main>
  )
}
