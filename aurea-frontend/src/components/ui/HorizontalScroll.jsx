import { useRef, useState } from 'react'

export default function HorizontalScroll({ children, title }) {
  const ref = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - ref.current.offsetLeft)
    setScrollLeft(ref.current.scrollLeft)
    ref.current.style.cursor = 'grabbing'
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - ref.current.offsetLeft
    const walk = (x - startX) * 1.2
    ref.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (ref.current) ref.current.style.cursor = 'grab'
  }

  const scrollBy = (dir) => {
    ref.current.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  return (
    <div style={{ position: 'relative' }}>
      {title && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
        }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 500, letterSpacing: '-0.02em' }}>
            {title}
          </h2>
          <div style={{ display: 'flex', gap: '8px' }} className="scroll-arrows">
            <button onClick={() => scrollBy(-1)} aria-label="Scroll left" style={{ width: '40px', height: '40px', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button onClick={() => scrollBy(1)} aria-label="Scroll right" style={{ width: '40px', height: '40px', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>
      )}

      <div
        ref={ref}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'scroll',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: 'grab',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingBottom: '4px',
          userSelect: 'none',
        }}
      >
        {children}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .scroll-arrows { display: none !important; }
        }
      `}</style>
    </div>
  )
}
