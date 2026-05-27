import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockProducts } from '../data/mockProducts'

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`

const useProducts = create(
  persist(
    (set, get) => ({
      products: mockProducts, // Start with rich mock data immediately to avoid UI loading flashes
  isInitialized: false,

  initProducts: async () => {
    if (get().isInitialized) return
    try {
      // 1. Recover any user-added Cloudinary images from localStorage legacy store
      const localData = localStorage.getItem('aurea-products-storage')
      let localProducts = []
      if (localData) {
        try {
          const parsed = JSON.parse(localData)
          if (parsed?.state?.products) {
            localProducts = parsed.state.products
          }
        } catch (e) {}
      }

      const res = await fetch(`${API_URL}?all=true`)
      if (res.ok) {
        let dbProducts = await res.json()

        // Filter local products that have Cloudinary images
        const cloudinaryProducts = Array.isArray(localProducts) ? localProducts.filter(p => p.images && p.images.some(img => typeof img === 'string' && img.includes('cloudinary.com'))) : []
        
        if (cloudinaryProducts.length > 0) {
          let updatedAny = false
          for (const lp of cloudinaryProducts) {
            // Find target product in DB by name
            const targetDb = dbProducts.find(dp => dp.name.trim().toLowerCase() === lp.name.trim().toLowerCase())
            if (targetDb) {
              // Only update if DB product does not already have these images
              const hasSameImages = targetDb.images && targetDb.images.join(',') === lp.images.join(',')
              if (!hasSameImages) {
                await fetch(`${API_URL}/${targetDb.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...targetDb, images: lp.images, description: lp.description || targetDb.description }),
                })
                updatedAny = true
              }
            } else {
              // Or create if completely new product added by user
              await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...lp, id: undefined }),
              })
              updatedAny = true
            }
          }
          if (updatedAny) {
            const res2 = await fetch(`${API_URL}?all=true`)
            dbProducts = await res2.json()
          }
        }

        set({ products: dbProducts, isInitialized: true })
      } else {
        set({ isInitialized: true })
      }
    } catch (error) {
      console.error('Failed to fetch products from DB:', error)
      set({ isInitialized: true })
    }
  },

  addProduct: async (product) => {
    // Optimistic update for premium snappy UI feel
    set((state) => ({ products: [product, ...state.products] }))
    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(product),
      })
      if (res.ok) {
        const realProduct = await res.json()
        // Replace temporary client-side ID with genuine MongoDB ObjectId doc
        set((state) => ({
          products: state.products.map((p) => p.id === product.id ? realProduct : p),
        }))
      }
    } catch (error) {
      console.error('Failed to create product in DB:', error)
    }
  },

  updateProduct: async (id, updatedProduct) => {
    // Optimistic update
    set((state) => ({
      products: state.products.map((p) => p.id === id ? { ...p, ...updatedProduct } : p),
    }))
    try {
      const token = localStorage.getItem('accessToken')
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(updatedProduct),
      })
    } catch (error) {
      console.error('Failed to update product in DB:', error)
    }
  },

  deleteProduct: async (id) => {
    // Optimistic delete
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }))
    try {
      const token = localStorage.getItem('accessToken')
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
      })
    } catch (error) {
      console.error('Failed to delete product in DB:', error)
    }
  },
}),
    {
      name: 'aurea-products-storage', // localStorage key
      partialize: (state) => ({ products: state.products }), // only persist products
    }
  )
)

export default useProducts
