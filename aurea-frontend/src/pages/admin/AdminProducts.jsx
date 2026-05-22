import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useProducts from '../../hooks/useProducts'

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', brand: '', category: '', price: '', description: '', images: [] })
  const [editingId, setEditingId] = useState(null)
  const [categoriesList, setCategoriesList] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => setCategoriesList(data))
      .catch(err => console.error('Failed to load categories', err))
  }, [])

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) deleteProduct(id)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (editingId) {
      updateProduct(editingId, { ...form, price: parseInt(form.price) })
    } else {
      const newProduct = { ...form, id: `new-${Date.now()}`, price: parseInt(form.price), discountPrice: null, rating: 5, reviewCount: 0, shadeCount: 0, concerns: [], skinTypes: [], shades: [], ingredients: '', howToUse: '' }
      addProduct(newProduct)
    }
    setForm({ name: '', brand: '', category: '', price: '', description: '', images: [] })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (product) => {
    setForm({
      name: product.name || '',
      brand: product.brand || '',
      category: product.category || '',
      price: product.price || '',
      description: product.description || '',
      images: product.images || (product.image ? [product.image] : [])
    })
    setEditingId(product.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const fieldStyle = { width: '100%', height: '40px', padding: '0 12px', border: '1px solid var(--border)', background: 'var(--bg)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none' }

  const openCloudinaryWidget = () => {
    window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: true,
        maxFiles: 5,
        styles: {
          palette: {
            window: "#f8f7f5",
            windowBorder: "#e8e4df",
            tabIcon: "#1c1b1a",
            menuIcons: "#4a4845",
            textDark: "#1c1b1a",
            textLight: "#ffffff",
            link: "#1c1b1a",
            action: "#1c1b1a",
            inactiveTabIcon: "#8a8782",
            error: "#e53e3e",
            inProgress: "#1c1b1a",
            complete: "#2f855a",
            sourceBg: "#ffffff"
          },
          fonts: {
            default: {
              active: true
            }
          }
        }
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setForm((f) => ({ ...f, images: [...(f.images || []), result.info.secure_url] }))
        }
      }
    ).open()
  }

  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/admin" style={{ fontSize: '13px', color: 'var(--text-light)', textDecoration: 'none' }}>← Dashboard</Link>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 500 }}>Products</h1>
          </div>
          <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', brand: '', category: '', price: '', description: '', images: [] }) }} style={{ height: '40px', padding: '0 20px', background: 'var(--accent)', color: 'var(--white)', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}>
            + Add Product
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSave} style={{ padding: '24px', border: '1px solid var(--border)', marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ gridColumn: '1/-1' }}><p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>{editingId ? 'Edit Product' : 'New Product'}</p></div>
            <div><label style={lbl}>Name</label><input required value={form.name} onChange={set('name')} style={fieldStyle} /></div>
            <div><label style={lbl}>Brand</label><input required value={form.brand} onChange={set('brand')} style={fieldStyle} /></div>
            <div>
              <label style={lbl}>Category</label>
              <select required value={form.category} onChange={set('category')} style={fieldStyle}>
                <option value="" disabled>Select category</option>
                {categoriesList.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Price (₹)</label><input required type="number" value={form.price} onChange={set('price')} style={fieldStyle} /></div>
            <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Description</label><textarea value={form.description} onChange={set('description')} style={{ ...fieldStyle, height: '80px', padding: '10px 12px', resize: 'vertical' }} /></div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={lbl}>Product Images</label>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                {form.images && form.images.map((img, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={img.includes('/upload/') ? img.replace('/upload/', '/upload/w_150,q_auto,f_auto/') : img} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                    <button type="button" onClick={() => setForm(f => ({...f, images: f.images.filter((_, idx) => idx !== i)}))} style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  </div>
                ))}
                <button type="button" onClick={openCloudinaryWidget} style={{ height: '40px', padding: '0 20px', background: 'var(--bg-alt)', border: '1px solid var(--border)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', cursor: 'pointer' }}>
                  {form.images && form.images.length > 0 ? '+ Add More' : 'Upload Images'}
                </button>
              </div>
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ height: '40px', padding: '0 20px', background: 'var(--accent)', color: 'var(--white)', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}>Save</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }} style={{ height: '40px', padding: '0 20px', background: 'transparent', border: '1px solid var(--border)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        )}

        <div style={{ marginBottom: '16px' }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." style={{ height: '40px', padding: '0 14px', border: '1px solid var(--border)', background: 'var(--bg)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', width: '280px' }} />
        </div>

        <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-alt)' }}>
                {['Product', 'Brand', 'Category', 'Price', 'Rating', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-light)', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={td}>{p.name}</td>
                  <td style={td}>{p.brand}</td>
                  <td style={td}>{p.category}</td>
                  <td style={td}>₹{p.discountPrice || p.price}</td>
                  <td style={td}>{'★'.repeat(Math.round(p.rating))} {p.rating}</td>
                  <td style={{ ...td, whiteSpace: 'nowrap' }}>
                    <button onClick={() => handleEdit(p)} style={{ fontSize: '13px', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', marginRight: '12px' }}>Edit</button>
                    <button onClick={() => handleDelete(p.id)} style={{ fontSize: '13px', textDecoration: 'underline', color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '12px' }}>{filtered.length} of {products.length} products</p>
      </div>
    </main>
  )
}

const lbl = { display: 'block', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '5px' }
const td = { padding: '12px 16px', fontSize: '14px', color: 'var(--text-mid)' }
