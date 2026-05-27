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
          padding: '0 24px',
          marginBottom: '28px',
        }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--text)' }}>
            {title}
          </h2>
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <button onClick={() => scrollBy(-1)} aria-label="Scroll left" className="scroll-arrow left-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>

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

        <button onClick={() => scrollBy(1)} aria-label="Scroll right" className="scroll-arrow right-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .scroll-arrow { display: none !important; }
        }
        .scroll-arrow {
          position: absolute;
          top: 40%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          color: var(--text);
          transition: background 0.2s;
        }
        .scroll-arrow:hover {
          background: #fff;
        }
        .left-arrow {
          left: 0;
          border-left: none;
        }
        .right-arrow {
          right: 0;
          border-right: none;
        }
      `}</style>
    </div>
  )
}
