import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const STATUS_COLOR = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#22c55e',
  cancelled: '#ef4444',
}

const Icons = {
  Revenue: ({ width=24, height=24 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  ),
  Orders: ({ width=24, height=24 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  Customers: ({ width=24, height=24 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Products: ({ width=24, height=24 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  Categories: ({ width=24, height=24 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h6v6H4z" />
      <path d="M14 4h6v6h-6z" />
      <path d="M4 14h6v6H4z" />
      <path d="M14 14h6v6h-6z" />
    </svg>
  ),
  Settings: ({ width=24, height=24 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  ArrowLeft: ({ width=24, height=24 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

function StatCard({ label, value, sub, icon }) {
  return (
    <div style={{
      padding: '24px',
      background: 'rgba(255,255,255,0.72)',
      backdropFilter: 'blur(16px)',
      borderRadius: '16px',
      border: '1px solid rgba(176,138,110,0.15)',
      boxShadow: '0 4px 20px rgba(90,60,40,0.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-light)', margin: 0 }}>{label}</p>
        <span style={{ color: 'var(--text-mid)' }}>{icon}</span>
      </div>
      <p style={{ fontSize: '30px', fontWeight: 600, fontFamily: 'Playfair Display, serif', margin: '0 0 4px', color: 'var(--text)' }}>{value}</p>
      <p style={{ fontSize: '12px', color: 'var(--text-mid)', margin: 0 }}>{sub}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const fmt = (paise) => '₹' + (paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })
  const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '6px' }}>✦ Aurea Admin</p>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 500, margin: 0 }}>Dashboard</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-mid)', marginTop: '4px' }}>Welcome back, {user?.name || 'Admin'}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { to: '/admin/products', label: 'Products', icon: <Icons.Products width={16} height={16} /> },
              { to: '/admin/categories', label: 'Categories', icon: <Icons.Categories width={16} height={16} /> },
              { to: '/admin/orders', label: 'Orders', icon: <Icons.Orders width={16} height={16} /> },
              { to: '/admin/settings', label: 'Settings', icon: <Icons.Settings width={16} height={16} /> },
              { to: '/', label: 'Storefront', icon: <Icons.ArrowLeft width={16} height={16} /> },
            ].map(({ to, label, icon }) => (
              <Link key={to} to={to} style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px', height: '38px', padding: '0 16px',
                border: '1px solid var(--border)', borderRadius: '8px',
                fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
                textDecoration: 'none', color: 'var(--text)',
                background: 'white', transition: 'all 0.2s',
              }}>
                <span style={{ display: 'flex', color: 'var(--text-mid)' }}>{icon}</span>
                {label}
              </Link>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-light)' }}>Loading dashboard...</div>
        ) : stats ? (
          <>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <StatCard label="Total Revenue" value={fmt(stats.totalRevenue)} sub="All time sales" icon={<Icons.Revenue />} />
              <StatCard label="Total Orders" value={stats.totalOrders.toLocaleString()} sub="Placed so far" icon={<Icons.Orders />} />
              <StatCard label="Customers" value={stats.totalUsers.toLocaleString()} sub="Registered accounts" icon={<Icons.Customers />} />
              <StatCard label="Products" value={stats.totalProducts.toLocaleString()} sub="Active listings" icon={<Icons.Products />} />
            </div>

            {/* Recent Orders */}
            <div style={{
              background: 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(16px)',
              borderRadius: '16px',
              border: '1px solid rgba(176,138,110,0.15)',
              boxShadow: '0 4px 20px rgba(90,60,40,0.06)',
              overflow: 'hidden',
            }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>Recent Orders</p>
                <Link to="/admin/orders" style={{ fontSize: '12px', color: 'var(--text-mid)', textDecoration: 'none' }}>View all →</Link>
              </div>
              {stats.recentOrders.length === 0 ? (
                <p style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)', fontSize: '14px' }}>No orders yet</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '560px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'rgba(250,248,245,0.8)' }}>
                        {['Customer', 'Date', 'Total', 'Status'].map((h) => (
                          <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-light)', fontWeight: 500 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((o) => (
                        <tr key={o.id} style={{ borderTop: '1px solid var(--border)' }}>
                          <td style={td}>{o.customer}</td>
                          <td style={td}>{fmtDate(o.date)}</td>
                          <td style={td}>{fmt(o.totalPaise)}</td>
                          <td style={td}>
                            <span style={{
                              fontSize: '12px', padding: '3px 10px', borderRadius: '100px',
                              background: (STATUS_COLOR[o.status] || '#888') + '20',
                              color: STATUS_COLOR[o.status] || '#888', fontWeight: 500,
                              textTransform: 'capitalize',
                            }}>{o.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px', color: '#ef4444' }}>Failed to load dashboard data</div>
        )}
      </div>
    </main>
  )
}

const td = { padding: '14px 20px', fontSize: '14px', color: 'var(--text-mid)' }
