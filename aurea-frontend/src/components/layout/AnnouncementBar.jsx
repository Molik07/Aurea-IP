import { useState, useEffect } from 'react'

const messages = [
  'Free shipping on orders above ₹999',
  'Use code GLOW20 for 20% off your first order',
  'New arrivals just dropped — Shop Now',
  'Dermatologist tested. Clinically proven.',
]

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrent((c) => (c + 1) % messages.length)
        setFade(true)
      }, 300)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      style={{
        backgroundColor: 'var(--accent)',
        color: 'var(--white)',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '12px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          transition: 'opacity 0.3s ease',
          opacity: fade ? 1 : 0,
        }}
      >
        {messages[current]}
      </p>
    </div>
  )
}
