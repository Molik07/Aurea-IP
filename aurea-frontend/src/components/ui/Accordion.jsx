/**
 * Accordion — Expandable/collapsible content section.
 *
 * Used primarily on product detail pages for Ingredients and How to Use sections.
 * Implements WAI-ARIA accordion pattern with:
 * - aria-expanded on the trigger button
 * - aria-controls linking button to content panel
 * - role="region" on the content panel
 * - Unique IDs generated from title prop
 *
 * @param {string}  title       - Accordion header text
 * @param {ReactNode} children  - Content to show/hide
 * @param {boolean} [defaultOpen=false] - Initial open state
 */
import { useState } from 'react'

export default function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  // Generate a stable ID from the title for ARIA linking
  const panelId = `accordion-panel-${title.toLowerCase().replace(/\s+/g, '-')}`
  const headerId = `accordion-header-${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        id={headerId}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={panelId}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '18px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          fontWeight: 500,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'var(--text)',
        }}>
          {title}
        </span>
        <span
          aria-hidden="true"
          style={{
            fontSize: '20px',
            lineHeight: 1,
            color: 'var(--text-mid)',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            display: 'inline-block',
          }}
        >
          +
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        hidden={!open}
        style={{
          maxHeight: open ? '600px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.35s ease',
        }}
      >
        <div style={{ paddingBottom: '18px', fontSize: '14px', color: 'var(--text-mid)', lineHeight: 1.7 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
