import { useState } from 'react'
import { Link } from 'react-router-dom'

const initialOrders = [
  { id: '#AUR-1115', customer: 'Aditi Verma', email: 'aditi@email.com', date: '2026-05-03', items: 1, total: 449, status: 'Processing' },
  { id: '#AUR-1114', customer: 'Nisha Agarwal', email: 'nisha@email.com', date: '2026-05-03', items: 2, total: 2799, status: 'Processing' },
  { id: '#AUR-1113', customer: 'Meera Joshi', email: 'meera@email.com', date: '2026-05-02', items: 3, total: 1498, status: 'Shipped' },
  { id: '#AUR-1112', customer: 'Divya Rao', email: 'divya@email.com', date: '2026-05-01', items: 1, total: 999, status: 'Shipped' },
  { id: '#AUR-1111', customer: 'Priya Sharma', email: 'priya@email.com', date: '2026-04-30', items: 4, total: 3299, status: 'Delivered' },
  { id: '#AUR-1110', customer: 'Kavya Tiwari', email: 'kavya@email.com', date: '2026-04-29', items: 2, total: 1748, status: 'Delivered' },
  { id: '#AUR-1109', customer: 'Shreya Patel', email: 'shreya@email.com', date: '2026-04-28', items: 1, total: 799, status: 'Delivered' },
]

const ALL_STATUSES = ['Processing', 'Shipped', 'Delivered']
const STATUS_COLOR = { Processing: '#f59e0b', Shipped: '#3b82f6', Delivered: '#22c55e' }

export default function AdminOrders() {
  const [orders, setOrders] = useState(initialOrders)
  const [filter, setFilter] = useState('All')

  const displayed = filter === 'All' ? orders : orders.filter((o) => o.status === filter)

  const updateStatus = (id, newStatus) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o))
  }

  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <Link to="/admin" style={{ fontSize: '13px', color: 'var(--text-light)', textDecoration: 'none' }}>← Dashboard</Link>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 500 }}>Orders</h1>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '20px', gap: '0' }}>
          {['All', ...ALL_STATUSES].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontFamily: 'DM Sans, sans-serif', fontWeight: filter === f ? 600 : 400,
                color: filter === f ? 'var(--text)' : 'var(--text-light)',
                borderBottom: filter === f ? '2px solid var(--accent)' : '2px solid transparent',
                marginBottom: '-1px', transition: 'all 0.15s',
              }}
            >
              {f}
              <span style={{ marginLeft: '6px', fontSize: '11px', color: 'var(--text-light)' }}>
                ({f === 'All' ? orders.length : orders.filter((o) => o.status === f).length})
              </span>
            </button>
          ))}
        </div>

        <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-alt)' }}>
                {['Order', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Update'].map((h) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-light)', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map((o) => (
                <tr key={o.id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={td}><span style={{ fontWeight: 500 }}>{o.id}</span></td>
                  <td style={td}>
                    <p style={{ fontSize: '14px' }}>{o.customer}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>{o.email}</p>
                  </td>
                  <td style={td}>{o.date}</td>
                  <td style={td}>{o.items}</td>
                  <td style={td}>₹{o.total.toLocaleString('en-IN')}</td>
                  <td style={td}>
                    <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '100px', background: STATUS_COLOR[o.status] + '20', color: STATUS_COLOR[o.status], fontWeight: 500 }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={td}>
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      style={{ height: '32px', padding: '0 8px', border: '1px solid var(--border)', background: 'var(--bg)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', cursor: 'pointer', outline: 'none' }}
                    >
                      {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayed.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-light)', fontSize: '14px' }}>No orders with this status.</div>
          )}
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '12px' }}>Showing {displayed.length} orders</p>
      </div>
    </main>
  )
}

const td = { padding: '12px 16px', fontSize: '14px', color: 'var(--text-mid)', verticalAlign: 'top' }
