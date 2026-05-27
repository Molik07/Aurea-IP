import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings`

const useSettings = create(
  persist(
    (set, get) => ({
      settings: {
        heroImage: '',
      },
      isInitialized: false,

      initSettings: async () => {
        if (get().isInitialized) return
        try {
          const res = await fetch(API_URL)
          if (res.ok) {
            const data = await res.json()
            // Server data always wins over local cache
            set({ settings: data, isInitialized: true })
          } else {
            // Server unavailable — keep whatever we have in localStorage
            set({ isInitialized: true })
          }
        } catch (error) {
          console.error('Failed to fetch site settings from DB:', error)
          // Network error — keep localStorage data so the image still shows
          set({ isInitialized: true })
        }
      },

      updateSettings: async (newSettings) => {
        // Optimistic update so the UI responds immediately
        set((state) => ({ settings: { ...state.settings, ...newSettings } }))
        try {
          const token = localStorage.getItem('accessToken')
          await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(newSettings),
          })
        } catch (error) {
          console.error('Failed to update site settings in DB:', error)
        }
      },
    }),
    {
      name: 'aurea-site-settings', // localStorage key
      partialize: (state) => ({ settings: state.settings }), // only persist settings, not isInitialized
    }
  )
)

export default useSettings
