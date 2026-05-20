import { useState } from 'react'
import { Link } from 'react-router-dom'
import { mockProducts } from '../data/mockProducts'
import ProductCard from '../components/ui/ProductCard'
import ProgressBar from '../components/ui/ProgressBar'

const questions = [
  {
    id: 1,
    question: "What's your skin type?",
    options: ['Oily', 'Dry', 'Combination', 'Normal'],
  },
  {
    id: 2,
    question: "What's your primary skin concern?",
    options: ['Acne & Breakouts', 'Dark Spots & Dullness', 'Fine Lines & Aging', 'Dehydration'],
  },
  {
    id: 3,
    question: "How sensitive is your skin?",
    options: ['Not sensitive at all', 'Slightly sensitive', 'Quite sensitive', 'Very sensitive'],
  },
  {
    id: 4,
    question: "What's your current routine like?",
    options: ['Minimal (1–2 steps)', 'Moderate (3–4 steps)', 'Extensive (5+ steps)', 'No routine yet'],
  },
  {
    id: 5,
    question: "What's your age range?",
    options: ['Under 25', '25–34', '35–44', '45+'],
  },
]

export default function SkinQuiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)

  const current = questions[step]
  const selected = answers[current?.id]

  const handleSelect = (opt) => {
    setAnswers((prev) => ({ ...prev, [current.id]: opt }))
  }

  const handleNext = () => {
    if (step < questions.length - 1) setStep(step + 1)
    else setDone(true)
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const recommended = mockProducts.filter((p) => p.concerns.includes('Brightening') || p.concerns.includes('Hydration')).slice(0, 3)

  if (done) {
    return (
      <main style={{ backgroundColor: 'var(--bg)', minHeight: '80vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '12px' }}>Your Results</p>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '12px' }}>Your Personalised Routine</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: '40px' }}>
            Based on your answers, we've curated a routine designed to address your skin's unique needs.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '36px' }} className="quiz-results-grid">
            {recommended.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', height: '44px', padding: '0 28px', background: 'var(--accent)', color: 'var(--white)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Shop Your Routine
            </Link>
            <button onClick={() => { setStep(0); setAnswers({}); setDone(false) }} style={{ height: '44px', padding: '0 24px', background: 'transparent', border: '1px solid var(--border)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', color: 'var(--text-mid)' }}>
              Retake Quiz
            </button>
          </div>
        </div>
        <style>{`@media (max-width: 768px) { .quiz-results-grid { grid-template-columns: 1fr !important; } }`}</style>
      </main>
    )
  }

  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '80vh' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '64px 24px' }}>
        {/* Progress */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-light)' }}>Question {step + 1} of {questions.length}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>{Math.round(((step) / questions.length) * 100)}% complete</span>
          </div>
          <ProgressBar current={step} total={questions.length} />
        </div>

        {/* Question */}
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '30px', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '32px', lineHeight: 1.3 }}>
          {current.question}
        </h1>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '36px' }}>
          {current.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              style={{
                padding: '16px 20px',
                border: `1px solid ${selected === opt ? 'var(--accent)' : 'var(--border)'}`,
                background: selected === opt ? 'var(--accent)' : 'transparent',
                color: selected === opt ? 'var(--white)' : 'var(--text)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '15px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={handleBack}
            disabled={step === 0}
            style={{ height: '44px', padding: '0 24px', border: '1px solid var(--border)', background: 'transparent', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: step === 0 ? 'not-allowed' : 'pointer', opacity: step === 0 ? 0.4 : 1 }}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!selected}
            style={{ height: '44px', padding: '0 28px', background: selected ? 'var(--accent)' : 'var(--border)', color: 'var(--white)', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: selected ? 'pointer' : 'not-allowed', transition: 'background 0.15s' }}
          >
            {step === questions.length - 1 ? 'See Results' : 'Next'}
          </button>
        </div>
      </div>
    </main>
  )
}
