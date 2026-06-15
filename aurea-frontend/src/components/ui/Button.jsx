/**
 * Button — Reusable button component with variant support.
 *
 * Variants:
 * - primary: Solid dark background (CTAs, submit buttons)
 * - secondary: Outlined with accent border (alternative actions)
 * - ghost: Light border for tertiary actions
 *
 * Sizes:
 * - default: 44px height (meets 44×44 touch target requirement)
 * - small: 36px height (inline actions)
 * - full: Full width with default height
 *
 * Includes focus-visible ring for keyboard navigation and
 * subtle scale transform on active press for tactile feedback.
 *
 * @param {'primary'|'secondary'|'ghost'} [variant='primary']
 * @param {'default'|'small'|'full'} [size='default']
 * @param {ReactNode} children
 * @param {Function}  [onClick]
 * @param {boolean}   [disabled]
 * @param {string}    [className]
 * @param {string}    [type='button']
 */
export default function Button({ variant = 'primary', size = 'default', children, onClick, disabled, className = '', type = 'button' }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: size === 'small' ? '36px' : '44px',
    padding: size === 'small' ? '0 16px' : '0 24px',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: size === 'small' ? '12px' : '13px',
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'opacity 0.2s, background 0.2s, transform 0.1s',
    width: size === 'full' ? '100%' : 'auto',
    border: 'none',
    textDecoration: 'none',
  }

  const variants = {
    primary: {
      backgroundColor: 'var(--accent)',
      color: 'var(--white)',
      border: '1px solid var(--accent)',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: 'var(--accent)',
      border: '1px solid var(--accent)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-mid)',
      border: '1px solid var(--border)',
    },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.opacity = '0.8' }}
      onMouseLeave={(e) => { if (!disabled) { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)' } }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)' }}
      onMouseUp={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(1)' }}
    >
      {children}
    </button>
  )
}
