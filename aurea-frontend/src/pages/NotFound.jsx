/**
 * NotFound — Styled 404 error page.
 *
 * Displayed when the user navigates to a non-existent route.
 * Uses brand styling with CTAs to guide users back to the home page
 * or product listing. Includes noindex directive to prevent
 * search engines from indexing error pages.
 */
import { Link } from 'react-router-dom'
import SEOHead from '../components/ui/SEOHead'

export default function NotFound() {
  return (
    <main
      id="main-content"
      style={{
        backgroundColor: 'var(--bg)',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
      }}
    >
      <SEOHead title="Page Not Found" noIndex />

      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        {/* Decorative 404 number */}
        <p
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(72px, 15vw, 120px)',
            fontWeight: 600,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: 'var(--border)',
            marginBottom: '8px',
            userSelect: 'none',
          }}
        >
          404
        </p>

        <h1
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(22px, 5vw, 32px)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            marginBottom: '12px',
            color: 'var(--text)',
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: 'var(--text-mid)',
            lineHeight: 1.7,
            marginBottom: '32px',
          }}
        >
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/"
            style={{
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
              transition: 'opacity 0.2s',
            }}
          >
            Go Home
          </Link>
          <Link
            to="/products"
            style={{
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
              transition: 'opacity 0.2s',
            }}
          >
            Browse Products
          </Link>
        </div>
      </div>
    </main>
  )
}
