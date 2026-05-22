import { create } from 'zustand'
import useAuth from './useAuth'

const getUserId = () => {
  const user = useAuth.getState().user;
  if (user && user.id) return user.id;

  let id = localStorage.getItem('aurea-guest-id')
  if (!id) {
    id = 'guest_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('aurea-guest-id', id)
  }
  return id
}

const syncWishlist = async (items) => {
  try {
    await fetch('http://localhost:5000/api/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': getUserId()
      },
      body: JSON.stringify({ items })
    })
  } catch (error) {
    console.error('Failed to sync wishlist:', error)
  }
}

const useWishlist = create((set, get) => ({
  items: [],
  isInitialized: false,

  initWishlist: async (force = false) => {
    if (get().isInitialized && !force) return
    try {
      const res = await fetch('http://localhost:5000/api/wishlist', {
        headers: { 'x-user-id': getUserId() }
      })
      if (res.ok) {
        const data = await res.json()
        set({ items: data.items || [], isInitialized: true })
      } else {
        set({ isInitialized: true })
      }
    } catch (error) {
      console.error('Failed to init wishlist:', error)
      set({ isInitialized: true })
    }
  },

  toggleItem: (productId) => {
    const items = get().items
    let newItems
    if (items.includes(productId)) {
      newItems = items.filter((id) => id !== productId)
    } else {
      newItems = [...items, productId]
    }
    set({ items: newItems })
    syncWishlist(newItems)
  },

  isWishlisted: (productId) => get().items.includes(productId),

  clearWishlist: () => {
    set({ items: [] })
    syncWishlist([])
  },
}))

// Auto-sync when auth state changes (login or logout)
useAuth.subscribe((state, prevState) => {
  if (state.user?.id !== prevState.user?.id) {
    useWishlist.getState().initWishlist(true);
  }
});

export default useWishlist
