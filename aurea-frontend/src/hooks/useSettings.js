import { create } from 'zustand'

const API_URL = 'http://localhost:5000/api/settings'

// Helper to safely extract user's legacy homepage picture from browser cache
const getLegacyHeroImage = () => {
  try {
    const localData = localStorage.getItem('aurea-site-settings')
    if (localData) {
      const parsed = JSON.parse(localData)
      if (parsed?.state?.settings?.heroImage) {
        return parsed.state.settings.heroImage
      }
    }
  } catch (e) {}
  return null
}

const defaultUnsplash = 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80'
const initialHeroImage = getLegacyHeroImage() || defaultUnsplash

const useSettings = create((set, get) => ({
  settings: {
    heroImage: initialHeroImage,
  },
  isInitialized: false,

  initSettings: async () => {
    if (get().isInitialized) return
    try {
      const legacyHeroImage = getLegacyHeroImage()

      const res = await fetch(API_URL)
      if (res.ok) {
        let data = await res.json()

        // If the user has a custom picture saved locally (e.g. from Cloudinary), commit it back to the Redis store permanently
        if (legacyHeroImage && legacyHeroImage !== defaultUnsplash) {
          if (data.heroImage !== legacyHeroImage) {
            console.log('Restoring legacy user homepage picture to backend database...')
            await fetch(API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ heroImage: legacyHeroImage }),
            })
            data.heroImage = legacyHeroImage
          }
        }

        set({ settings: data, isInitialized: true })
      } else {
        set({ isInitialized: true })
      }
    } catch (error) {
      console.error('Failed to fetch site settings from DB:', error)
      set({ isInitialized: true })
    }
  },

  updateSettings: async (newSettings) => {
    // Optimistic update for premium real-time admin responsiveness
    set((state) => ({ settings: { ...state.settings, ...newSettings } }))
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      })
    } catch (error) {
      console.error('Failed to update site settings in DB:', error)
    }
  },
}))

export default useSettings
