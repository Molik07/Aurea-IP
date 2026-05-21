import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useProducts from '../hooks/useProducts'
import ProductCard from '../components/ui/ProductCard'
import useWishlist from '../hooks/useWishlist'
import ProgressBar from '../components/ui/ProgressBar'
import useAuth from '../hooks/useAuth'

const TABS = ['Overview', 'Orders', 'Addresses', 'Wishlist', 'Loyalty Points']

const mockOrders = [
  { id: '#AUR-1042', date: '2026-04-28', items: 3, total: 2799, status: 'Delivered' },
  { id: '#AUR-0987', date: '2026-04-10', items: 1, total: 999, status: 'Delivered' },
  { id: '#AUR-1101', date: '2026-05-01', items: 2, total: 1498, status: 'Shipped' },
  { id: '#AUR-1115', date: '2026-05-03', items: 1, total: 449, status: 'Processing' },
]

const mockAddresses = [
  { id: 1, name: 'Priya Sharma', line1: '14B, Lotus Apartments', line2: 'Linking Road', city: 'Mumbai', state: 'Maharashtra', pin: '400050', phone: '+91 98765 43210' },
  { id: 2, name: 'Priya Sharma', line1: '22, Green Park', line2: '', city: 'New Delhi', state: 'Delhi', pin: '110016', phone: '+91 98765 43210' },
]

const STATUS_COLOR = { Processing: '#f59e0b', Shipped: '#3b82f6', Delivered: '#22c55e' }

export default function Account() {
  const [activeTab, setActiveTab] = useState('Overview')
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading } = useAuth()
  const { items: wishlistIds } = useWishlist()
  const { products } = useProducts()
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id))
  const [addresses, setAddresses] = useState(mockAddresses)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tabParam = params.get('tab')
    if (tabParam && TABS.includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [location])

  const sidebarStyle = { display: 'flex', flexDirection: 'column', gap: '2px', width: '200px', flexShrink: 0 }
  const tabStyle = (active) => ({
    display: 'block', padding: '10px 14px', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer',
    textAlign: 'left', color: active ? 'var(--text)' : 'var(--text-mid)', fontWeight: active ? 600 : 400,
    fontFamily: 'DM Sans, sans-serif', borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent', transition: 'all 0.15s',
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth', { state: { from: location }, replace: true })
    }
  }, [isLoading, isAuthenticated, navigate, location])

  if (isLoading || !isAuthenticated) {
    return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>
  }

  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 500, marginBottom: '40px' }}>My Account</h1>
        <div style={{ display: 'flex', gap: '40px' }} className="account-layout">
          {/* Sidebar */}
          <nav style={sidebarStyle} className="account-sidebar">
            {TABS.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)} style={tabStyle(activeTab === t)}>{t}</button>
            ))}
          </nav>

          {/* Mobile tabs */}
          <div className="account-tabs-mobile" style={{ display: 'none', overflowX: 'auto', gap: '0', borderBottom: '1px solid var(--border)', width: '100%', marginBottom: '24px' }}>
            {TABS.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ whiteSpace: 'nowrap', padding: '10px 16px', fontSize: '13px', background: 'none', border: 'none', borderBottom: activeTab === t ? '2px solid var(--accent)' : '2px solid transparent', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: activeTab === t ? 600 : 400 }}>{t}</button>
            ))}
          </div>

          {/* Panel */}
          <div style={{ flex: 1 }}>
            {activeTab === 'Overview' && (
              <div>
                <p style={{ fontSize: '20px', fontFamily: 'Playfair Display, serif', marginBottom: '24px' }}>Welcome back, Priya 👋</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                  <InfoCard title="Loyalty Points" value="1,250 pts" sub="Gold Tier" />
                  <InfoCard title="Total Orders" value={mockOrders.length} sub="Since joining" />
                </div>
                <p style={{ fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '12px' }}>Last Order</p>
                <OrderRow order={mockOrders[2]} />
              </div>
            )}

            {activeTab === 'Orders' && (
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', marginBottom: '20px' }}>Your Orders</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {mockOrders.map((o) => <OrderRow key={o.id} order={o} />)}
                </div>
              </div>
            )}

            {activeTab === 'Addresses' && (
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', marginBottom: '20px' }}>Saved Addresses</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {addresses.map((a) => (
                    <div key={a.id} style={{ padding: '20px', border: '1px solid var(--border)' }}>
                      <p style={{ fontWeight: 600, marginBottom: '4px' }}>{a.name}</p>
                      <p style={{ fontSize: '14px', color: 'var(--text-mid)', lineHeight: 1.6 }}>{a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} – {a.pin}</p>
                      <p style={{ fontSize: '14px', color: 'var(--text-mid)' }}>{a.phone}</p>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                        <button style={{ fontSize: '13px', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => setAddresses((prev) => prev.filter((x) => x.id !== a.id))} style={{ fontSize: '13px', textDecoration: 'underline', color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                      </div>
                    </div>
                  ))}
                  <button style={{ height: '44px', padding: '0 24px', border: '1px solid var(--accent)', background: 'transparent', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>+ Add New Address</button>
                </div>
              </div>
            )}

            {activeTab === 'Wishlist' && (
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', marginBottom: '20px' }}>Wishlist</h2>
                {wishlistProducts.length === 0 ? (
                  <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>Your wishlist is empty. <Link to="/products" style={{ textDecoration: 'underline' }}>Browse products</Link></p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="wishlist-grid">
                    {wishlistProducts.map((p) => <ProductCard key={p.id} product={p} />)}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Loyalty Points' && (
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', marginBottom: '8px' }}>Loyalty Points</h2>
                <p style={{ fontSize: '36px', fontWeight: 600, marginBottom: '4px' }}>1,250</p>
                <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '28px' }}>Gold Tier · 750 pts to Platinum</p>
                <ProgressBar current={1250} total={2000} label="Progress to Platinum" showPercent />
                <div style={{ marginTop: '28px', padding: '20px', border: '1px solid var(--border)' }}>
                  <p style={{ fontWeight: 600, marginBottom: '12px' }}>How to earn points</p>
                  {['Every ₹100 spent = 10 points', 'Write a review = 50 points', 'Refer a friend = 200 points', 'Birthday bonus = 100 points'].map((t) => (
                    <p key={t} style={{ fontSize: '14px', color: 'var(--text-mid)', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>✦ {t}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .account-sidebar { display: none !important; }
          .account-tabs-mobile { display: flex !important; }
          .account-layout { flex-direction: column; gap: 0 !important; }
          .wishlist-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </main>
  )
}

function InfoCard({ title, value, sub }) {
  return (
    <div style={{ padding: '20px', border: '1px solid var(--border)' }}>
      <p style={{ fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '6px' }}>{title}</p>
      <p style={{ fontSize: '26px', fontWeight: 600, marginBottom: '2px' }}>{value}</p>
      <p style={{ fontSize: '12px', color: 'var(--text-mid)' }}>{sub}</p>
    </div>
  )
}

function OrderRow({ order }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '8px' }}>
      <div>
        <p style={{ fontWeight: 500, marginBottom: '2px' }}>{order.id}</p>
        <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {order.items} item{order.items > 1 ? 's' : ''}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '15px', fontWeight: 500 }}>₹{order.total.toLocaleString('en-IN')}</span>
        <span style={{ fontSize: '12px', fontWeight: 500, padding: '3px 10px', borderRadius: '100px', background: STATUS_COLOR[order.status] + '20', color: STATUS_COLOR[order.status] }}>{order.status}</span>
      </div>
    </div>
  )
}
