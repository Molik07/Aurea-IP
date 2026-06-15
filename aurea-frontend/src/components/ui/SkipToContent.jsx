/**
 * SkipToContent — Keyboard accessibility skip link.
 *
 * Renders a visually hidden link that becomes visible on focus,
 * allowing keyboard users to skip directly to the main content area.
 * Must be the first focusable element in the DOM.
 */
export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="skip-to-content"
      style={{
        position: 'fixed',
        top: '-100%',
        left: '16px',
        zIndex: 9999,
        padding: '12px 24px',
        backgroundColor: 'var(--accent)',
        color: 'var(--white)',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textDecoration: 'none',
        borderRadius: '0 0 8px 8px',
        transition: 'top 0.2s ease',
      }}
      onFocus={(e) => { e.target.style.top = '0' }}
      onBlur={(e) => { e.target.style.top = '-100%' }}
    >
      Skip to main content
    </a>
  )
}
