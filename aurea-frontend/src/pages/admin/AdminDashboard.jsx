import { Link } from 'react-router-dom'

const stats = [
  { label: 'Total Revenue', value: '₹2,45,000', sub: '+18% this month' },
  { label: 'Total Orders', value: '342', sub: '28 this week' },
  { label: 'Top Product', value: 'Vitamin C Serum', sub: '214 units sold' },
]

const recentOrders = [
  { id: '#AUR-1115', customer: 'Aditi Verma', date: '2026-05-03', total: 449, status: 'Processing' },
  { id: '#AUR-1114', customer: 'Nisha Agarwal', date: '2026-05-03', total: 2799, status: 'Processing' },
  { id: '#AUR-1113', customer: 'Meera Joshi', date: '2026-05-02', total: 1498, status: 'Shipped' },
  { id: '#AUR-1112', customer: 'Divya Rao', date: '2026-05-01', total: 999, status: 'Shipped' },
  { id: '#AUR-1111', customer: 'Priya Sharma', date: '2026-04-30', total: 3299, status: 'Delivered' },
]

const weekData = [40, 65, 52, 80, 95, 72, 88]
const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const maxVal = Math.max(...weekData)
const STATUS_COLOR = { Processing: '#f59e0b', Shipped: '#3b82f6', Delivered: '#22c55e' }

export default function AdminDashboard() {
  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 500 }}>Admin Dashboard</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/admin/products" style={navLink}>Products</Link>
            <Link to="/admin/orders" style={navLink}>Orders</Link>
            <Link to="/admin/settings" style={navLink}>Settings</Link>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '36px' }} className="stat-grid">
          {stats.map((s) => (
            <div key={s.label} style={{ padding: '24px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}>
              <p style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '8px' }}>{s.label}</p>
              <p style={{ fontSize: '26px', fontWeight: 600, marginBottom: '4px', fontFamily: 'Playfair Display, serif' }}>{s.value}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-mid)' }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div style={{ padding: '24px', border: '1px solid var(--border)', marginBottom: '36px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '20px' }}>Revenue — Last 7 Days</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '120px' }}>
            {weekData.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', height: `${(v / maxVal) * 100}%`, backgroundColor: 'var(--accent)', transition: 'height 0.3s', minHeight: '4px' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>{weekLabels[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div style={{ border: '1px solid var(--border)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Recent Orders</p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-alt)' }}>
                {['Order', 'Customer', 'Date', 'Total', 'Status'].map((h) => (
                  <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-light)', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={td}>{o.id}</td>
                  <td style={td}>{o.customer}</td>
                  <td style={td}>{o.date}</td>
                  <td style={td}>₹{o.total.toLocaleString('en-IN')}</td>
                  <td style={td}><span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '100px', background: STATUS_COLOR[o.status] + '20', color: STATUS_COLOR[o.status], fontWeight: 500 }}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .stat-grid { grid-template-columns: 1fr !important; } }`}</style>
    </main>
  )
}

const navLink = {
  display: 'inline-flex', alignItems: 'center', height: '36px', padding: '0 16px',
  border: '1px solid var(--border)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px',
  letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', color: 'var(--text)',
}

const td = { padding: '12px 20px', fontSize: '14px', color: 'var(--text-mid)' }
