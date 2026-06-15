import { create } from 'zustand'

const getGuestId = () => {
  let id = localStorage.getItem('aurea-guest-id')
  if (!id) {
    id = 'guest_' + crypto.randomUUID()
    localStorage.setItem('aurea-guest-id', id)
  }
  return id
}

const syncCart = async (items) => {
  try {
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': getGuestId()
      },
      body: JSON.stringify({ items })
    })
  } catch (error) {
    console.error('Failed to sync cart:', error)
  }
}

const useCart = create((set, get) => ({
  items: [],
  isOpen: false,
  isInitialized: false,

  initCart: async () => {
    if (get().isInitialized) return
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cart`, {
        headers: { 'x-user-id': getGuestId() }
      })
      if (res.ok) {
        const data = await res.json()
        set({ items: data.items || [], isInitialized: true })
      } else {
        set({ isInitialized: true })
      }
    } catch (error) {
      console.error('Failed to init cart:', error)
      set({ isInitialized: true })
    }
  },

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

  addItem: (product, shade = null, quantity = 1) => {
    const items = get().items
    const key = `${product.id}-${shade?.name || 'none'}`
    const existing = items.find((i) => i.key === key)
    let newItems
    if (existing) {
      newItems = items.map((i) =>
        i.key === key ? { ...i, quantity: i.quantity + quantity } : i
      )
    } else {
      newItems = [
        ...items,
        {
          key,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          price: product.discountPrice || product.price,
          image: product.images && product.images.length > 0 ? product.images[0] : null,
          shade,
          quantity,
        },
      ]
    }
    set({ items: newItems })
    syncCart(newItems)
  },

  removeItem: (key) => {
    const newItems = get().items.filter((i) => i.key !== key)
    set({ items: newItems })
    syncCart(newItems)
  },

  updateQuantity: (key, quantity) => {
    let newItems
    if (quantity < 1) {
      newItems = get().items.filter((i) => i.key !== key)
    } else {
      newItems = get().items.map((i) => (i.key === key ? { ...i, quantity } : i))
    }
    set({ items: newItems })
    syncCart(newItems)
  },

  clearCart: () => {
    set({ items: [] })
    syncCart([])
  },

  getTotal: () =>
    get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  getItemCount: () =>
    get().items.reduce((sum, i) => sum + i.quantity, 0),
}))

export default useCart
