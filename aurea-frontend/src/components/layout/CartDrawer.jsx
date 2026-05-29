import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import useCart from '../../hooks/useCart'
import ProgressBar from '../ui/ProgressBar'

const FREE_SHIPPING_THRESHOLD = 999

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, getTotal } = useCart()
  const total = getTotal()
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total)

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 300,
              backgroundColor: 'rgba(0,0,0,0.45)',
            }}
          />
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100dvh',
              width: 'min(420px, 100vw)',
              zIndex: 301,
              backgroundColor: 'var(--bg)',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid var(--border)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px' }}>
                Your Cart {items.length > 0 && `(${items.length})`}
              </span>
              <button onClick={closeCart} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: 'var(--text)' }}>×</button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 0' }}>
                  <p style={{ fontSize: '16px', color: 'var(--text-mid)', marginBottom: '20px' }}>Your cart is empty.</p>
                  <Link
                    to="/products"
                    onClick={closeCart}
                    style={{
                      display: 'inline-block',
                      padding: '12px 24px',
                      background: 'var(--accent)',
                      color: 'var(--white)',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '12px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div style={{ paddingTop: '16px' }}>
                  {/* Free shipping bar */}
                  {remaining > 0 ? (
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{ fontSize: '13px', color: 'var(--text-mid)', marginBottom: '8px' }}>
                        Add <strong>₹{remaining}</strong> more for free shipping
                      </p>
                      <ProgressBar current={total} total={FREE_SHIPPING_THRESHOLD} />
                    </div>
                  ) : (
                    <div style={{ marginBottom: '16px', padding: '10px 14px', background: '#e8f5e9', borderLeft: '3px solid #4caf50' }}>
                      <p style={{ fontSize: '13px', color: '#2e7d32' }}>🎉 You qualify for free shipping!</p>
                    </div>
                  )}

                  {/* Items */}
                  {items.map((item) => (
                    <CartItem key={item.key} item={item} updateQuantity={updateQuantity} removeItem={removeItem} />
                  ))}

                  {/* Upsell slot */}
                  <div style={{ margin: '20px 0', padding: '16px', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '12px' }}>You might also like</p>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '56px', height: '56px', flexShrink: 0, background: '#e8e4df' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', fontWeight: 500 }}>Niacinamide 10% Serum</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>₹449</p>
                      </div>
                      <button style={{
                        padding: '8px 14px',
                        background: 'var(--accent)',
                        color: 'var(--white)',
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '11px',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        border: 'none',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}>Add</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-mid)' }}>Subtotal</span>
                  <span style={{ fontSize: '16px', fontWeight: 600 }}>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '14px 24px',
                    background: 'var(--accent)',
                    color: 'var(--white)',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '13px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function CartItem({ item, updateQuantity, removeItem }) {
  return (
    <div style={{
      display: 'flex',
      gap: '14px',
      padding: '16px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      {/* IMAGE SLOT */}
      <div style={{ width: '72px', height: '72px', flexShrink: 0, background: '#e8e4df', overflow: 'hidden' }}>
        {item.image && (
          <img src={item.image.includes('cloudinary.com') ? item.image.replace('/upload/', '/upload/w_150,q_auto,f_auto/') : item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 500, marginBottom: '2px' }}>{item.name}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>{item.brand}</p>
            {item.shade && <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>Shade: {item.shade.name}</p>}
          </div>
          <button onClick={() => removeItem(item.key)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', fontSize: '18px', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', gap: '0' }}>
            <button onClick={() => updateQuantity(item.key, item.quantity - 1)} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>−</button>
            <span style={{ width: '28px', textAlign: 'center', fontSize: '13px' }}>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.key, item.quantity + 1)} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>+</button>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  )
}
