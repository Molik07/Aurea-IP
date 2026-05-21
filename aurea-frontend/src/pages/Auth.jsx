import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../lib/firebase';
import useAuth from '../hooks/useAuth';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phoneNumber: '' });
  const [otp, setOtp] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const { login, register, isAuthenticated, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/account';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (isLogin) {
      await login(formData.email, formData.password);
    } else {
      // Register Flow
      if (formData.phoneNumber) {
        // Send OTP first
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        try {
          // Add country code if missing (naive assumption for Indian numbers here)
          const formattedPhone = formData.phoneNumber.startsWith('+') ? formData.phoneNumber : `+91${formData.phoneNumber}`;
          const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
          setConfirmationResult(result);
          setShowOTPInput(true);
        } catch (err) {
          console.error('Error sending OTP:', err);
        }
      } else {
        // Simple Register without Phone
        await register(formData);
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!confirmationResult) return;
    try {
      const result = await confirmationResult.confirm(otp);
      const firebaseIdToken = await result.user.getIdToken();
      // Register with backend using verified phone and token
      await register({ ...formData, firebaseIdToken });
    } catch (err) {
      console.error('Invalid OTP', err);
    }
  };

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)', padding: '40px 20px', position: 'relative' }}>
      {/* Decorative blurred blobs */}
      <div style={{ position: 'absolute', top: '10%', left: '20%', width: '300px', height: '300px', background: 'var(--accent)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1, zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: '400px', height: '400px', background: '#d4af37', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.05, zIndex: 0 }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: '440px', background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', padding: '40px', border: '1px solid rgba(255, 255, 255, 0.4)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)', position: 'relative', zIndex: 1 }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', letterSpacing: '0.02em' }}>
            {showOTPInput ? 'Verify Your Number' : isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
        </div>

        {error && (
          <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {showOTPInput ? (
            <motion.form 
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOTP}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <p style={{ fontSize: '14px', color: 'var(--text-mid)', textAlign: 'center' }}>We've sent a 6-digit code to {formData.phoneNumber}</p>
              <div>
                <label style={{ display: 'block', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', color: 'var(--text-mid)' }}>OTP Code</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="000000" required style={{ width: '100%', height: '48px', padding: '0 16px', fontSize: '15px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.8)', outline: 'none', transition: 'border 0.2s', letterSpacing: '0.2em', textAlign: 'center' }} />
              </div>
              <button type="submit" disabled={isLoading} className="btn" style={{ width: '100%', height: '48px', marginTop: '8px' }}>
                {isLoading ? 'Verifying...' : 'Verify & Register'}
              </button>
              <button type="button" onClick={() => setShowOTPInput(false)} style={{ background: 'none', border: 'none', fontSize: '13px', color: 'var(--text-mid)', textDecoration: 'underline', cursor: 'pointer', marginTop: '12px' }}>Back</button>
            </motion.form>
          ) : (
            <motion.form 
              key="auth"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              {!isLogin && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', color: 'var(--text-mid)' }}>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', height: '48px', padding: '0 16px', fontSize: '15px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.8)', outline: 'none', transition: 'border 0.2s' }} />
                </div>
              )}
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', color: 'var(--text-mid)' }}>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', height: '48px', padding: '0 16px', fontSize: '15px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.8)', outline: 'none' }} />
              </div>

              {!isLogin && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', color: 'var(--text-mid)' }}>Phone Number (Optional)</label>
                  <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="e.g. +919876543210" style={{ width: '100%', height: '48px', padding: '0 16px', fontSize: '15px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.8)', outline: 'none' }} />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px', color: 'var(--text-mid)' }}>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', height: '48px', padding: '0 16px', fontSize: '15px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.8)', outline: 'none' }} />
              </div>

              <div id="recaptcha-container"></div>

              <button type="submit" disabled={isLoading} className="btn" style={{ width: '100%', height: '48px', marginTop: '8px' }}>
                {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-mid)', marginTop: '8px' }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button type="button" onClick={() => { setIsLogin(!isLogin); clearError(); }} style={{ background: 'none', border: 'none', color: 'var(--text)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                  {isLogin ? 'Register' : 'Sign In'}
                </button>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
