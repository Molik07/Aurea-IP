import { useState } from 'react'
import { Link } from 'react-router-dom'
import StarRating from './StarRating'
import useWishlist from '../../hooks/useWishlist'

function optimizeImage(url) {
  if (typeof url === 'string' && url.includes('cloudinary.com') && url.includes('/upload/')) {
    return url.replace('/upload/', '/upload/w_600,q_auto,f_auto/')
  }
  return url
}

export default function ProductCard({ product }) {
  const { toggleItem, isWishlisted } = useWishlist()
  const [hovered, setHovered] = useState(false)
  const wishlisted = isWishlisted(product.id)

  const discounted = product.discountPrice !== null && product.discountPrice !== undefined

  return (
    <Link
      to={`/products/${product.id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', background: '#e8e4df' }}>
        {product.images && product.images.length > 0 ? (
          <>
            <img src={optimizeImage(product.images[0])} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.4s ease', opacity: hovered && product.images.length > 1 ? 0 : 1 }} />
            {product.images[1] && (
              <img src={optimizeImage(product.images[1])} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.4s ease', opacity: hovered ? 1 : 0 }} />
            )}
          </>
        ) : (
          <>
            <div style={{ position: 'absolute', inset: 0, background: '#e8e4df', transition: 'opacity 0.4s ease', opacity: hovered ? 0 : 1 }} />
            <div style={{ position: 'absolute', inset: 0, background: '#ddd9d3', transition: 'opacity 0.4s ease', opacity: hovered ? 1 : 0 }} />
          </>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleItem(product.id)
          }}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(255,255,255,0.92)',
            border: 'none',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 2,
            borderRadius: '50%',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          }}
          aria-label="Add to wishlist"
        >
          <HeartIcon filled={wishlisted} />
        </button>

        {/* Discount badge */}
        {discounted && (
          <span style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'var(--accent)',
            color: 'var(--white)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            padding: '3px 8px',
            textTransform: 'uppercase',
            zIndex: 2,
          }}>
            Sale
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ paddingTop: '12px' }}>
        <p style={{ fontSize: '11px', color: 'var(--text-light)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>
          {product.brand}
        </p>
        <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', lineHeight: 1.4, marginBottom: '6px' }}>
          {product.name}
        </p>
        <StarRating rating={product.rating} count={product.reviewCount} size="small" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          {discounted ? (
            <>
              <span style={{ fontSize: '15px', fontWeight: 600 }}>₹{product.discountPrice}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-light)', textDecoration: 'line-through' }}>₹{product.price}</span>
            </>
          ) : (
            <span style={{ fontSize: '15px', fontWeight: 600 }}>₹{product.price}</span>
          )}
        </div>
        {product.shadeCount > 0 && (
          <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px' }}>
            {product.shadeCount} shade{product.shadeCount > 1 ? 's' : ''}
          </p>
        )}
      </div>
    </Link>
  )
}

function HeartIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}
