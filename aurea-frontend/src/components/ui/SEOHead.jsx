/**
 * SEOHead — Reusable per-route <head> meta tag manager.
 *
 * Wraps `react-helmet-async` to set page title, meta description, OG tags,
 * and Twitter card markup. Every page should use this to ensure proper SEO.
 *
 * @param {string}  title        - Page title (will be suffixed with " — Aurea")
 * @param {string}  description  - Meta description for search engines
 * @param {string}  [ogImage]    - Open Graph image URL (1200×630 recommended)
 * @param {string}  [ogType]     - OG type (default: "website")
 * @param {boolean} [noIndex]    - If true, adds noindex/nofollow robots directive
 * @param {string}  [canonicalUrl] - Canonical URL for duplicate content resolution
 */
import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Aurea'
const DEFAULT_DESCRIPTION =
  'Science-backed skincare for Indian skin. Shop serums, moisturisers, sunscreens, and more. Dermatologist tested formulas.'
const DEFAULT_OG_IMAGE = '/favicon.svg' // Replace with a branded 1200×630 image when available

export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
  canonicalUrl,
}) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Skincare Redefined`

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  )
}
