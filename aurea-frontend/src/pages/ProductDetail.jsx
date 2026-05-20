import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { mockReviews } from '../data/mockReviews'
import useProducts from '../hooks/useProducts'
import Accordion from '../components/ui/Accordion'
import ShadeSelector from '../components/ui/ShadeSelector'
import StarRating from '../components/ui/StarRating'
import HorizontalScroll from '../components/ui/HorizontalScroll'
import ProductCard from '../components/ui/ProductCard'
import useCart from '../hooks/useCart'
import useWishlist from '../hooks/useWishlist'

export default function ProductDetail() {
  const { id } = useParams()
  const { products } = useProducts()
  const product = products.find((p) => p.id === id) || products[0]
  const reviews = mockReviews.filter((r) => r.productId === product.id)
  const related = products.filter((p) => p.id !== product.id && p.concerns.some((c) => product.concerns.includes(c))).slice(0, 6)
  const [selectedThumb, setSelectedThumb] = useState(0)
  const [selectedShade, setSelectedShade] = useState(product.shades[0] || null)
  const [qty, setQty] = useState(1)
  const { addItem, openCart } = useCart()
  const { toggleItem, isWishlisted } = useWishlist()
  const wishlisted = isWishlisted(product.id)
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : product.rating
  const discounted = product.discountPrice != null

  return (
    <main style={{ backgroundColor: 'var(--bg)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '55% 1fr', gap: '48px', marginBottom: '64px' }} className="pdp-grid">
          {/* Gallery */}
          <div>
            {product.images && product.images.length > 0 ? (
              <>
                <div style={{ aspectRatio: '3/4', background: '#e8e4df', marginBottom: '12px' }}>
                  <img 
                    src={product.images[selectedThumb] ? (product.images[selectedThumb].includes('/upload/') ? product.images[selectedThumb].replace('/upload/', '/upload/w_1000,q_auto,f_auto/') : product.images[selectedThumb]) : ''} 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                {product.images.length > 1 && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {product.images.map((img, i) => (
                      <button key={i} onClick={() => setSelectedThumb(i)} style={{ flex: 1, aspectRatio: '1', background: '#e8e4df', border: selectedThumb === i ? '1px solid var(--accent)' : '1px solid transparent', cursor: 'pointer', padding: 0 }}>
                        <img src={img.includes('/upload/') ? img.replace('/upload/', '/upload/w_200,q_auto,f_auto/') : img} alt={`${product.name} thumbnail`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ aspectRatio: '3/4', background: '#e8e4df', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#bbb', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Image Slot</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[0,1,2,3].map((i) => (
                    <button key={i} onClick={() => setSelectedThumb(i)} style={{ flex: 1, aspectRatio: '1', background: '#e8e4df', border: selectedThumb === i ? '1px solid var(--accent)' : '1px solid transparent', cursor: 'pointer', padding: 0 }}>
                      <span style={{ fontSize: '10px', color: '#bbb' }}>IMG</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Info */}
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '8px' }}>{product.brand}</p>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: '12px' }}>{product.name}</h1>
            <div style={{ marginBottom: '16px' }}><StarRating rating={parseFloat(avgRating)} count={reviews.length || product.reviewCount} /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              {discounted ? (
                <>
                  <span style={{ fontSize: '22px', fontWeight: 600 }}>₹{product.discountPrice}</span>
                  <span style={{ fontSize: '16px', color: 'var(--text-light)', textDecoration: 'line-through' }}>₹{product.price}</span>
                  <span style={{ fontSize: '12px', background: 'var(--accent)', color: 'var(--white)', padding: '2px 8px' }}>{Math.round((1 - product.discountPrice / product.price) * 100)}% OFF</span>
                </>
              ) : <span style={{ fontSize: '22px', fontWeight: 600 }}>₹{product.price}</span>}
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: '24px' }}>{product.description}</p>
            {product.shades.length > 0 && <div style={{ marginBottom: '20px' }}><ShadeSelector shades={product.shades} selected={selectedShade} onSelect={setSelectedShade} /></div>}

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <span style={{ fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-light)' }}>Qty</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)' }}>
                <button onClick={() => setQty(q => Math.max(1, q-1))} style={{ width: '36px', height: '36px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>−</button>
                <span style={{ width: '36px', textAlign: 'center', fontSize: '14px' }}>{qty}</span>
                <button onClick={() => setQty(q => q+1)} style={{ width: '36px', height: '36px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>+</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <button onClick={() => { addItem(product, selectedShade, qty); openCart() }} style={{ height: '48px', background: 'var(--accent)', color: 'var(--white)', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>Add to Cart</button>
              <button onClick={() => toggleItem(product.id)} style={{ height: '44px', background: 'transparent', color: 'var(--accent)', border: '1px solid var(--border)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                {wishlisted ? '♥ Wishlisted' : '♡ Add to Wishlist'}
              </button>
            </div>
            <Accordion title="Ingredients"><p>{product.ingredients}</p></Accordion>
            <Accordion title="How to Use"><p>{product.howToUse}</p></Accordion>
          </div>
        </div>

        {/* Reviews */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '48px', marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 500 }}>Reviews</h2>
            <span style={{ fontSize: '14px', color: 'var(--text-light)' }}>{avgRating} / 5 · {reviews.length || product.reviewCount} reviews</span>
          </div>
          {reviews.length === 0 && <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>No reviews yet.</p>}
          {reviews.map((r) => (
            <div key={r.id} style={{ padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{r.author}</span>
                  {r.verified && <span style={{ fontSize: '11px', color: 'var(--text-light)', border: '1px solid var(--border)', padding: '1px 6px', borderRadius: '100px' }}>Verified</span>}
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>{new Date(r.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <StarRating rating={r.rating} size="small" />
              <p style={{ fontSize: '14px', fontWeight: 500, marginTop: '8px', marginBottom: '4px' }}>{r.title}</p>
              <p style={{ fontSize: '14px', color: 'var(--text-mid)', lineHeight: 1.6 }}>{r.body}</p>
            </div>
          ))}
        </div>

        {related.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '48px' }}>
            <HorizontalScroll title="You May Also Like">
              {related.map((p) => (
                <div key={p.id} style={{ scrollSnapAlign: 'start', flexShrink: 0 }}><ProductCard product={p} /></div>
              ))}
            </HorizontalScroll>
          </div>
        )}
      </div>
      <style>{`@media (max-width: 768px) { .pdp-grid { grid-template-columns: 1fr !important; } }`}</style>
    </main>
  )
}
