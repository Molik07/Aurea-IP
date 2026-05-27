import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function AdminCategories() {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`)
      if (res.ok) setCategories(await res.json())
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ name, description })
      })
      if (res.ok) {
        setName('')
        setDescription('')
        fetchCategories()
      } else {
        alert('Failed to add category')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      })
      if (res.ok) fetchCategories()
    } catch (e) {
      console.error(e)
    }
  }

  const fieldStyle = { width: '100%', height: '40px', padding: '0 12px', border: '1px solid var(--border)', background: 'var(--bg)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none' }

  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <Link to="/admin" style={{ fontSize: '12px', color: 'var(--text-light)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>← Dashboard</Link>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', margin: '8px 0 0' }}>Categories</h1>
          </div>
        </div>

        <form onSubmit={handleAdd} style={{ padding: '24px', border: '1px solid var(--border)', marginBottom: '32px', display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '6px' }}>Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} style={fieldStyle} placeholder="e.g. Cleanser" />
          </div>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '6px' }}>Description</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} style={fieldStyle} placeholder="Optional description..." />
          </div>
          <button type="submit" style={{ height: '40px', padding: '0 24px', background: 'var(--accent)', color: 'var(--white)', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer' }}>Add</button>
        </form>

        <div style={{ border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-alt)' }}>
                {['Name', 'Description', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-light)', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: 600 }}>{c.name}</td>
                  <td style={{ padding: '14px 20px', fontSize: '14px', color: 'var(--text-mid)' }}>{c.description || '-'}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <button onClick={() => handleDelete(c._id)} style={{ color: '#ef4444', background: 'none', border: 'none', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
