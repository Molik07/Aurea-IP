/**
 * Checkout — Order checkout page.
 *
 * Features: contact info, delivery address, shipping method selection,
 * order summary, and place order. Includes client-side validation
 * for PIN code (6 digits) and phone number formats.
 * Marked noindex for SEO.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import useCart from '../hooks/useCart'
import SEOHead from '../components/ui/SEOHead'

const SHIPPING_THRESHOLD = 999

export default function Checkout() {
  const { items, getTotal, clearCart } = useCart()
  const subtotal = getTotal()
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 149
  const total = subtotal + shipping
  const [form, setForm] = useState({ email: '', phone: '', firstName: '', lastName: '', address1: '', address2: '', city: '', state: '', pin: '', shippingMethod: 'standard' })
  const [placed, setPlaced] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setPlaced(true)
    clearCart()
  }

  const fieldStyle = {
    width: '100%', height: '48px', padding: '0 12px', border: '1px solid var(--border)',
    background: 'var(--bg)', fontFamily: 'DM Sans, sans-serif', fontSize: '16px', outline: 'none',
  }

  const labelStyle = { display: 'block', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '6px' }

  if (placed) {
    return (
      <main style={{ backgroundColor: 'var(--bg)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', marginBottom: '12px' }}>Order Placed!</p>
          <p style={{ fontSize: '15px', color: 'var(--text-mid)', marginBottom: '28px' }}>Thank you. You will receive a confirmation email shortly.</p>
          <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', height: '44px', padding: '0 28px', background: 'var(--accent)', color: 'var(--white)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
            Continue Shopping
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      <SEOHead title="Checkout" noIndex />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }} className="checkout-outer">
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 500, marginBottom: '32px' }}>Checkout</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '60% 1fr', gap: '48px' }} className="checkout-grid">
          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <section>
              <h2 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>Contact</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label htmlFor="checkout-email" style={labelStyle}>Email</label><input id="checkout-email" type="email" required value={form.email} onChange={set('email')} style={fieldStyle} placeholder="you@email.com" autoComplete="email" /></div>
                <div><label htmlFor="checkout-phone" style={labelStyle}>Phone</label><input id="checkout-phone" type="tel" required value={form.phone} onChange={set('phone')} style={fieldStyle} placeholder="+91 00000 00000" pattern="\+?91?\s?\d{5}\s?\d{5}" title="Enter a valid Indian phone number" autoComplete="tel" /></div>
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>Delivery Address</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div><label htmlFor="checkout-first-name" style={labelStyle}>First Name</label><input id="checkout-first-name" required value={form.firstName} onChange={set('firstName')} style={fieldStyle} autoComplete="given-name" /></div>
                  <div><label htmlFor="checkout-last-name" style={labelStyle}>Last Name</label><input id="checkout-last-name" required value={form.lastName} onChange={set('lastName')} style={fieldStyle} autoComplete="family-name" /></div>
                </div>
                <div><label htmlFor="checkout-address1" style={labelStyle}>Address Line 1</label><input id="checkout-address1" required value={form.address1} onChange={set('address1')} style={fieldStyle} autoComplete="address-line1" /></div>
                <div><label htmlFor="checkout-address2" style={labelStyle}>Address Line 2 (optional)</label><input id="checkout-address2" value={form.address2} onChange={set('address2')} style={fieldStyle} autoComplete="address-line2" /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }} className="checkout-city-row">
                  <div><label htmlFor="checkout-city" style={labelStyle}>City</label><input id="checkout-city" required value={form.city} onChange={set('city')} style={fieldStyle} autoComplete="address-level2" /></div>
                  <div><label htmlFor="checkout-state" style={labelStyle}>State</label><input id="checkout-state" required value={form.state} onChange={set('state')} style={fieldStyle} autoComplete="address-level1" /></div>
                  <div><label htmlFor="checkout-pin" style={labelStyle}>PIN Code</label><input id="checkout-pin" required value={form.pin} onChange={set('pin')} style={fieldStyle} maxLength={6} pattern="\d{6}" title="Enter a 6-digit PIN code" inputMode="numeric" autoComplete="postal-code" /></div>
                </div>
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>Shipping Method</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[{ val: 'standard', label: 'Standard Shipping', sub: '5–7 business days', price: subtotal >= SHIPPING_THRESHOLD ? 'Free' : '₹0' },
                  { val: 'express', label: 'Express Shipping', sub: '2–3 business days', price: '₹149' }
                ].map((opt) => (
                  <label key={opt.val} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', border: `1px solid ${form.shippingMethod === opt.val ? 'var(--accent)' : 'var(--border)'}`, cursor: 'pointer', transition: 'border-color 0.15s' }}>
                    <input type="radio" name="shipping" value={opt.val} checked={form.shippingMethod === opt.val} onChange={set('shippingMethod')} style={{ accentColor: 'var(--accent)' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: 500 }}>{opt.label}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>{opt.sub}</p>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{opt.price}</span>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>Payment</h2>
              <div style={{ padding: '24px', border: '1px dashed var(--border)', textAlign: 'center', color: 'var(--text-mid)', fontSize: '14px' }}>
                Payment handled by Razorpay — integration pending
              </div>
            </section>

            <button type="submit" style={{ height: '48px', background: 'var(--accent)', color: 'var(--white)', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
              Place Order
            </button>
          </form>

          {/* Order summary */}
          <div style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>Order Summary</h2>
            {items.length === 0 ? (
              <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>Your cart is empty.</p>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '20px' }}>
                  {items.map((item) => (
                    <div key={item.key} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                      {/* IMAGE SLOT */}
                      <div style={{ width: '52px', height: '52px', flexShrink: 0, background: '#e8e4df', overflow: 'hidden' }}>
                        {item.image && (
                          <img src={item.image.includes('cloudinary.com') ? item.image.replace('/upload/', '/upload/w_100,q_auto,f_auto/') : item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', fontWeight: 500 }}>{item.name}</p>
                        {item.shade && <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>{item.shade.name}</p>}
                        <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>Qty: {item.quantity}</p>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '4px' }}>
                  <Row label="Subtotal" value={`₹${subtotal.toLocaleString('en-IN')}`} />
                  <Row label="Shipping" value={shipping === 0 ? 'Free' : `₹${shipping}`} />
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                    <Row label="Total" value={`₹${total.toLocaleString('en-IN')}`} bold />
                  </div>
                </div>
                {/* AD SLOT */}
                <div className="ad-slot" style={{ marginTop: '20px' }}>AD SLOT</div>
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
          .checkout-outer { padding: 16px !important; }
          .checkout-outer h1 { margin-bottom: 20px !important; }
          .checkout-city-row { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .checkout-city-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}

function Row({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '14px', color: bold ? 'var(--text)' : 'var(--text-mid)', fontWeight: bold ? 600 : 400 }}>{label}</span>
      <span style={{ fontSize: '14px', fontWeight: bold ? 600 : 400 }}>{value}</span>
    </div>
  )
}
