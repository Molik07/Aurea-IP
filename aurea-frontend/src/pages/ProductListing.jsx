import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import useProducts from '../hooks/useProducts'
import ProductCard from '../components/ui/ProductCard'

const CATEGORIES = ['Cleanser', 'Moisturizer', 'Serum', 'Sunscreen', 'Toner', 'Mask']
const SKIN_TYPES = ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal']
const CONCERNS = ['Acne', 'Hydration', 'Brightening', 'Anti-Aging', 'SPF']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

export default function ProductListing() {
  const [searchParams] = useSearchParams()
  const [categories, setCategories] = useState(() => {
    const c = searchParams.get('category')
    return c ? [c] : []
  })
  const [skinTypes, setSkinTypes] = useState([])
  const [concerns, setConcerns] = useState(() => {
    const c = searchParams.get('concern')
    return c ? [c] : []
  })
  const { products } = useProducts()
  const [sort, setSort] = useState('newest')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '')

  const toggle = (arr, setArr, val) => {
    setArr((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val])
  }

  const filtered = useMemo(() => {
    let list = [...products]
    if (searchQuery) {
      list = list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    if (categories.length) list = list.filter((p) => categories.includes(p.category))
    if (skinTypes.length) list = list.filter((p) => p.skinTypes.some((s) => skinTypes.includes(s)))
    if (concerns.length) list = list.filter((p) => p.concerns.some((c) => concerns.includes(c)))
    if (sort === 'price-asc') list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price))
    if (sort === 'price-desc') list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price))
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    return list
  }, [categories, skinTypes, concerns, sort, searchQuery, products])

  const clearAll = () => {
    setCategories([])
    setSkinTypes([])
    setConcerns([])
    setSearchQuery('')
  }

  const hasFilters = categories.length || skinTypes.length || concerns.length || searchQuery.length > 0

  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '32px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '36px', fontWeight: 500, letterSpacing: '-0.02em' }}>
            All Products
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', gap: '40px', paddingTop: '32px' }} className="plp-layout">

          {/* Sidebar (desktop) */}
          <aside style={{ width: '220px', flexShrink: 0 }} className="plp-sidebar">
            <FilterPanel
              categories={categories} setCategories={setCategories}
              skinTypes={skinTypes} setSkinTypes={setSkinTypes}
              concerns={concerns} setConcerns={setConcerns}
              toggle={toggle} clearAll={clearAll} hasFilters={hasFilters}
            />
          </aside>

          {/* Main */}
          <div style={{ flex: 1 }}>
            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="filter-btn-mobile"
                  style={{ display: 'none', alignItems: 'center', gap: '6px', height: '36px', padding: '0 14px', border: '1px solid var(--border)', background: 'none', fontSize: '13px', cursor: 'pointer' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="12" y1="18" x2="12" y2="18" /></svg>
                  Filters {hasFilters ? `(${+!!categories.length + +!!skinTypes.length + +!!concerns.length})` : ''}
                </button>
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder="Search products..." 
                  style={{ height: '36px', padding: '0 14px', border: '1px solid var(--border)', background: 'var(--bg)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', width: '100%', maxWidth: '280px' }} 
                />
                <p style={{ fontSize: '14px', color: 'var(--text-light)', display: 'none' }} className="desktop-count">Showing {filtered.length} products</p>
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{ height: '36px', padding: '0 12px', border: '1px solid var(--border)', background: 'var(--bg)', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', cursor: 'pointer', outline: 'none' }}
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-mid)' }}>
                <p style={{ fontSize: '16px', marginBottom: '12px' }}>No products match your filters.</p>
                <button onClick={clearAll} style={{ fontSize: '13px', color: 'var(--text)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Clear all filters</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="product-grid">
                {filtered.map((p, i) => (
                  <>
                    {i === 6 && (
                      <div key="ad" style={{ gridColumn: '1 / -1' }}>
                        {/* AD SLOT */}
                        <div className="ad-slot">AD SLOT</div>
                      </div>
                    )}
                    <ProductCard key={p.id} product={p} />
                  </>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div onClick={() => setDrawerOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '300px', maxWidth: '90vw', backgroundColor: 'var(--bg)', padding: '24px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px' }}>Filters</span>
              <button onClick={() => setDrawerOpen(false)} style={{ fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            </div>
            <FilterPanel
              categories={categories} setCategories={setCategories}
              skinTypes={skinTypes} setSkinTypes={setSkinTypes}
              concerns={concerns} setConcerns={setConcerns}
              toggle={toggle} clearAll={clearAll} hasFilters={hasFilters}
            />
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .desktop-count { display: block !important; }
        }
        @media (max-width: 768px) {
          .plp-sidebar { display: none !important; }
          .filter-btn-mobile { display: flex !important; }
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .plp-layout { gap: 0 !important; }
        }
      `}</style>
    </main>
  )
}

function FilterSection({ title, items, selected, onToggle }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <p style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '12px' }}>
        {title}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item) => (
          <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => onToggle(item)}
              style={{ accentColor: 'var(--accent)', width: '14px', height: '14px' }}
            />
            {item}
          </label>
        ))}
      </div>
    </div>
  )
}

function FilterPanel({ categories, setCategories, skinTypes, setSkinTypes, concerns, setConcerns, toggle, clearAll, hasFilters }) {
  return (
    <div>
      {hasFilters && (
        <button onClick={clearAll} style={{ fontSize: '12px', color: 'var(--text-mid)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>
          Clear all
        </button>
      )}
      <FilterSection title="Category" items={CATEGORIES} selected={categories} onToggle={(v) => toggle(categories, setCategories, v)} />
      <FilterSection title="Skin Type" items={SKIN_TYPES} selected={skinTypes} onToggle={(v) => toggle(skinTypes, setSkinTypes, v)} />
      <FilterSection title="Concern" items={CONCERNS} selected={concerns} onToggle={(v) => toggle(concerns, setConcerns, v)} />
    </div>
  )
}
