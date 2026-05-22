import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useProducts from '../hooks/useProducts'
import ProductCard from '../components/ui/ProductCard'
import useWishlist from '../hooks/useWishlist'
import ProgressBar from '../components/ui/ProgressBar'
import useAuth from '../hooks/useAuth'

const TABS = ['Overview', 'Orders', 'Addresses', 'Wishlist', 'Loyalty Points']

const mockOrders = []

const mockAddresses = []

const STATUS_COLOR = { Processing: '#f59e0b', Shipped: '#3b82f6', Delivered: '#22c55e' }

export default function Account() {
  const [activeTab, setActiveTab] = useState('Overview')
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isLoading } = useAuth()
  const isAuthenticated = !!user;
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

  // ProtectedRoute handles auth checks before this component renders.

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
            {user?.role === 'admin' && (
              <div className="admin-btn-wrapper">
                <Link to="/admin" className="admin-btn-inner">
                  Admin Portal
                </Link>
              </div>
            )}
            <button 
              onClick={async () => {
                const { logout } = useAuth.getState();
                await logout();
                navigate('/auth');
              }} 
              style={{...tabStyle(false), color: '#e53e3e', marginTop: '24px'}}
            >
              Log Out
            </button>
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
                <p style={{ fontSize: '20px', fontFamily: 'Playfair Display, serif', marginBottom: '24px' }}>Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                  <InfoCard title="Loyalty Points" value="0 pts" sub="Bronze Tier" />
                  <InfoCard title="Total Orders" value={mockOrders.length} sub="Since joining" />
                </div>
                {mockOrders.length > 0 ? (
                  <>
                    <p style={{ fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '12px' }}>Last Order</p>
                    <OrderRow order={mockOrders[0]} />
                  </>
                ) : (
                  <p style={{ fontSize: '14px', color: 'var(--text-mid)', fontStyle: 'italic' }}>You haven't placed any orders yet.</p>
                )}
              </div>
            )}

            {activeTab === 'Orders' && (
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', marginBottom: '20px' }}>Your Orders</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {mockOrders.length > 0 ? (
                    mockOrders.map((o) => <OrderRow key={o.id} order={o} />)
                  ) : (
                    <p style={{ fontSize: '14px', color: 'var(--text-mid)', fontStyle: 'italic' }}>You haven't placed any orders yet. <Link to="/products" style={{ textDecoration: 'underline' }}>Start shopping</Link></p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Addresses' && (
              <div>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', marginBottom: '20px' }}>Saved Addresses</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {addresses.map((a) => (
                    <div key={a.id} style={{ padding: '20px', border: '1px solid var(--border)' }}>
                      <p style={{ fontWeight: 600, marginBottom: '4px' }}>{user?.name || a.name}</p>
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
                <p style={{ fontSize: '36px', fontWeight: 600, marginBottom: '4px' }}>0</p>
                <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '28px' }}>Bronze Tier · 500 pts to Silver</p>
                <ProgressBar current={0} total={500} label="Progress to Silver" showPercent />
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

        .admin-btn-wrapper {
          position: relative;
          display: inline-block;
          width: max-content;
          margin-top: 12px;
          margin-bottom: 8px;
          border-radius: 6px;
          overflow: hidden;
          padding: 1px; /* border thickness */
        }

        .admin-btn-wrapper::before,
        .admin-btn-wrapper::after {
          content: '';
          position: absolute;
          top: -100%;
          left: -100%;
          width: 300%;
          height: 300%;
          background: conic-gradient(from 0deg, transparent 75%, rgba(0,0,0,0.85) 100%);
          animation: admin-spin 3s linear infinite;
          z-index: 0;
        }

        .admin-btn-wrapper::after {
          filter: blur(4px); /* The glow effect */
        }

        .admin-btn-inner {
          position: relative;
          z-index: 1;
          display: block;
          padding: 10px 14px;
          font-size: 14px;
          color: var(--text);
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          background: var(--bg);
          border-radius: 5px; /* slightly less than wrapper to fit inside */
          transition: background 0.2s;
        }

        .admin-btn-inner:hover {
          background: #fdfaf7; /* very slight highlight on hover to feel clickable */
        }

        @keyframes admin-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
