import { Link } from 'react-router-dom'
import useSettings from '../../hooks/useSettings'

export default function AdminSettings() {
  const { settings, updateSettings } = useSettings()

  const openCloudinaryWidget = (field) => {
    window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxFiles: 1,
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
          fonts: { default: { active: true } }
        }
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          updateSettings({ [field]: result.info.secure_url })
        }
      }
    ).open()
  }

  const removeImage = (field) => {
    updateSettings({ [field]: '' })
  }

  return (
    <main style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/admin" style={{ fontSize: '13px', color: 'var(--text-light)', textDecoration: 'none' }}>← Dashboard</Link>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 500 }}>Site Settings</h1>
          </div>
        </div>

        <div style={{ padding: '24px', border: '1px solid var(--border)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontFamily: 'Playfair Display, serif', marginBottom: '16px' }}>Homepage Images</h2>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Hero Image */}
            <div style={{ padding: '16px', border: '1px solid var(--border)', background: 'var(--bg-alt)' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Hero Section Image</p>
              <p style={{ fontSize: '13px', color: 'var(--text-mid)', marginBottom: '16px' }}>This is the large image displayed at the very top of the homepage next to the main text.</p>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ width: '120px', height: '150px', background: '#e8e4df', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', position: 'relative' }}>
                  {settings.heroImage ? (
                    <>
                      <img src={settings.heroImage.includes('/upload/') ? settings.heroImage.replace('/upload/', '/upload/w_200,q_auto,f_auto/') : settings.heroImage} alt="Hero preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button onClick={() => removeImage('heroImage')} style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '12px' }}>×</button>
                    </>
                  ) : (
                    <span style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Empty</span>
                  )}
                </div>
                <div>
                  <button onClick={() => openCloudinaryWidget('heroImage')} style={{ height: '40px', padding: '0 20px', background: 'var(--accent)', color: 'var(--white)', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer' }}>
                    {settings.heroImage ? 'Change Image' : 'Upload Image'}
                  </button>
                  <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '8px' }}>Recommended size: 800x1000px</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
