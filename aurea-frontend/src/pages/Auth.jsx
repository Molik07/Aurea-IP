/**
 * Auth — Authentication page (login and registration).
 *
 * Multi-step flow:
 * - Login: email + password, or passwordless OTP
 * - Register: name + email → OTP verification → set password
 *
 * Uses glassmorphism card design with Framer Motion transitions.
 * Marked noindex for SEO.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import SEOHead from '../components/ui/SEOHead';

// ─── OTP Input Component ───────────────────────────────────────────────────────
function OtpInput({ value, onChange, disabled }) {
  const inputsRef = useRef([]);
  const digits = value.split('');

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (digits[idx]) {
        const next = [...digits];
        next[idx] = '';
        onChange(next.join(''));
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
        const next = [...digits];
        next[idx - 1] = '';
        onChange(next.join(''));
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleChange = (e, idx) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) return;
    // Handle paste into a single box
    if (raw.length > 1) {
      const pasted = raw.slice(0, 6).split('');
      const next = Array(6).fill('');
      pasted.forEach((ch, i) => { next[i] = ch; });
      onChange(next.join(''));
      const focusIdx = Math.min(pasted.length, 5);
      inputsRef.current[focusIdx]?.focus();
      return;
    }
    const next = [...digits];
    next[idx] = raw[0];
    onChange(next.join(''));
    if (idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill('');
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    onChange(next.join(''));
    const focusIdx = Math.min(pasted.length, 5);
    inputsRef.current[focusIdx]?.focus();
  };

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
      {Array.from({ length: 6 }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[idx] || ''}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          disabled={disabled}
          aria-label={`OTP digit ${idx + 1}`}
          style={{
            width: '48px',
            height: '56px',
            textAlign: 'center',
            fontSize: '22px',
            fontWeight: 700,
            fontFamily: 'DM Sans, sans-serif',
            letterSpacing: '0.05em',
            border: digits[idx] ? '2px solid var(--accent, #b08a6e)' : '1.5px solid var(--border, #e5ddd5)',
            borderRadius: '10px',
            background: digits[idx] ? 'rgba(176, 138, 110, 0.06)' : 'rgba(255,255,255,0.7)',
            outline: 'none',
            transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
            caretColor: 'var(--accent, #b08a6e)',
            cursor: disabled ? 'not-allowed' : 'text',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--accent, #b08a6e)';
            e.target.style.boxShadow = '0 0 0 3px rgba(176, 138, 110, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = digits[idx] ? 'var(--accent, #b08a6e)' : 'var(--border, #e5ddd5)';
            e.target.style.boxShadow = 'none';
          }}
        />
      ))}
    </div>
  );
}

// ─── Resend Countdown ──────────────────────────────────────────────────────────
function ResendCountdown({ onResend, isLoading }) {
  const [seconds, setSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    setSeconds(60);
    setCanResend(false);
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleResend = async () => {
    setSeconds(60);
    setCanResend(false);
    await onResend();
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '4px' }}>
      {canResend ? (
        <button
          type="button"
          onClick={handleResend}
          disabled={isLoading}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent, #b08a6e)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            textDecoration: 'underline',
            padding: 0,
          }}
        >
          Resend code
        </button>
      ) : (
        <p style={{ fontSize: '13px', color: 'var(--text-mid, #8a7e76)', margin: 0 }}>
          Resend code in{' '}
          <span style={{ fontWeight: 600, color: 'var(--text, #1a1a1a)', fontVariantNumeric: 'tabular-nums' }}>
            {seconds}s
          </span>
        </p>
      )}
    </div>
  );
}

// ─── EyeIcon ──────────────────────────────────────────────────────────────────
function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// ─── Shared input style factory ────────────────────────────────────────────────
const inputBase = {
  width: '100%',
  height: '50px',
  padding: '0 16px',
  fontSize: '15px',
  border: '1.5px solid var(--border, #e5ddd5)',
  borderRadius: '10px',
  background: 'rgba(255,255,255,0.75)',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  fontFamily: 'DM Sans, sans-serif',
  color: 'var(--text, #1a1a1a)',
  boxSizing: 'border-box',
};

const labelBase = {
  display: 'block',
  fontSize: '11.5px',
  letterSpacing: '0.09em',
  textTransform: 'uppercase',
  marginBottom: '8px',
  color: 'var(--text-mid, #8a7e76)',
  fontWeight: 600,
};

// ─── Main Auth Page ────────────────────────────────────────────────────────────
export default function Auth() {
  // step: 'login' | 'register-info' | 'register-otp' | 'register-password'
  const [step, setStep] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', otp: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [devWarning, setDevWarning] = useState(false); // true when Resend can't deliver

  const { login, register, sendOtp, resendOtp, sendLoginOtp, verifyLoginOtp, user, error, clearError, isLoading } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/account';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) clearError();
  };

  const focusStyle = (e) => {
    e.target.style.borderColor = 'var(--accent, #b08a6e)';
    e.target.style.boxShadow = '0 0 0 3px rgba(176, 138, 110, 0.15)';
  };
  const blurStyle = (e) => {
    e.target.style.borderColor = 'var(--border, #e5ddd5)';
    e.target.style.boxShadow = 'none';
  };

  // ── Step handlers ────────────────────────────────────────────────────────────

  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();
    await login(formData.email, formData.password);
  };

  const handleSendLoginOtp = async () => {
    if (!formData.email) {
      useAuth.setState({ error: 'Please enter your email first to sign in with a code' });
      return;
    }
    clearError();
    try {
      const result = await sendLoginOtp(formData.email);
      if (result?.warning === 'dev_mock_email') setDevWarning(true);
      setStep('login-otp');
    } catch {
      // error handled in store
    }
  };

  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault();
    clearError();
    if (formData.otp.length < 6) {
      useAuth.setState({ error: 'Please enter the complete 6-digit code' });
      return;
    }
    await verifyLoginOtp(formData.email, formData.otp);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    clearError();
    try {
      const result = await sendOtp(formData.name, formData.email);
      // Only advance to OTP step if send succeeded (no throw)
      if (result?.warning === 'dev_mock_email') setDevWarning(true);
      setStep('register-otp');
    } catch {
      // error is already set in store by sendOtp — stay on register-info
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    clearError();
    if (formData.otp.length < 6) {
      useAuth.setState({ error: 'Please enter the complete 6-digit code' });
      return;
    }
    setStep('register-password');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    clearError();
    await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      otp: formData.otp,
    });
  };

  const handleResend = async () => {
    clearError();
    try {
      const result = await resendOtp(formData.email);
      if (result?.warning === 'dev_mock_email') setDevWarning(true);
    } catch {
      // error shown in banner
    }
  };

  const switchToLogin = () => {
    setStep('login');
    setFormData({ name: '', email: '', password: '', otp: '' });
    setDevWarning(false);
    clearError();
  };

  const switchToRegister = () => {
    setStep('register-info');
    setFormData({ name: '', email: '', password: '', otp: '' });
    setDevWarning(false);
    clearError();
  };

  // ── Step metadata ────────────────────────────────────────────────────────────
  const stepMeta = {
    'login': {
      title: 'Welcome Back',
      subtitle: 'Sign in to your Aurea account',
    },
    'login-otp': {
      title: 'Check Your Email',
      subtitle: `We sent a login code to ${formData.email}`,
    },
    'register-info': {
      title: 'Create Account',
      subtitle: 'Join Aurea for an exclusive experience',
    },
    'register-otp': {
      title: 'Check Your Email',
      subtitle: `We sent a 6-digit code to ${formData.email}`,
    },
    'register-password': {
      title: 'Set Your Password',
      subtitle: 'Choose a secure password for your account',
    },
  };

  const currentMeta = stepMeta[step];
  const isLogin = step === 'login' || step === 'login-otp';

  // ── Variants ─────────────────────────────────────────────────────────────────
  const cardVariants = {
    initial: { opacity: 0, y: 24, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -16, scale: 0.98, transition: { duration: 0.2 } },
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg, #faf8f5)',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* SEO */}
      <SEOHead title="Sign In" noIndex />

      {/* Decorative ambient glows */}
      <div style={{ position: 'absolute', top: '-5%', left: '15%', width: '480px', height: '480px', background: 'radial-gradient(circle, rgba(176,138,110,0.12) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '10%', width: '560px', height: '560px', background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(176,138,110,0.06) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1 }}>
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '20px',
            padding: '48px 44px',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0 8px 40px rgba(90, 60, 40, 0.08), 0 1px 0 rgba(255,255,255,0.9) inset',
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '11px',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'var(--text-light, #b0a49a)',
              marginBottom: '10px',
            }}>
              ✦ Aurea ✦
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                <h1 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '27px',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                  margin: '0 0 8px',
                  color: 'var(--text, #1a1a1a)',
                }}>
                  {currentMeta.title}
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-mid, #8a7e76)', margin: 0, lineHeight: 1.5 }}>
                  {currentMeta.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress dots for register flow */}
          {!isLogin && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '7px', marginBottom: '28px' }}>
              {['register-info', 'register-otp', 'register-password'].map((s, i) => {
                const stepOrder = ['register-info', 'register-otp', 'register-password'];
                const currentIdx = stepOrder.indexOf(step);
                const active = i <= currentIdx;
                return (
                  <div key={s} style={{
                    width: active ? '24px' : '7px',
                    height: '7px',
                    borderRadius: '999px',
                    background: active ? 'var(--accent, #b08a6e)' : 'var(--border, #e5ddd5)',
                    transition: 'all 0.3s ease',
                  }} />
                );
              })}
            </div>
          )}

          {/* Dev domain restriction warning */}
          <AnimatePresence>
            {devWarning && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                style={{
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                  border: '1px solid #f59e0b',
                  borderRadius: '10px',
                  color: '#92400e',
                  fontSize: '13px',
                  lineHeight: 1.5,
                }}
              >
                <strong>📧 Dev mode:</strong> Email couldn't be delivered — check your{' '}
                <strong>backend terminal</strong> for the OTP code printed there.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                  border: '1px solid #fca5a5',
                  borderRadius: '10px',
                  color: '#991b1b',
                  fontSize: '13px',
                  marginBottom: '20px',
                  lineHeight: 1.5,
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Forms ───────────────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">

            {/* LOGIN */}
            {step === 'login' && (
              <motion.form
                key="login"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                onSubmit={handleLogin}
                style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
              >
                <div>
                  <label style={labelBase}>Email Address</label>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    placeholder="your@email.com"
                    style={inputBase}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ ...labelBase, marginBottom: 0 }}>Password</label>
                    <button
                      type="button"
                      style={{ fontSize: '12px', color: 'var(--text-mid, #8a7e76)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', padding: 0 }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      style={{ ...inputBase, paddingRight: '48px' }}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      style={{
                        position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mid, #8a7e76)',
                        padding: '2px', lineHeight: 0,
                      }}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  id="login-submit"
                  style={submitBtnStyle(isLoading)}
                >
                  {isLoading ? <Spinner /> : 'Sign In'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-mid, #8a7e76)' }}>or</span>
                </div>

                <button
                  type="button"
                  onClick={handleSendLoginOtp}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    height: '50px',
                    background: 'transparent',
                    color: 'var(--text, #1a1a1a)',
                    border: '1.5px solid var(--border, #e5ddd5)',
                    borderRadius: '10px',
                    fontSize: '14.5px',
                    fontWeight: 600,
                    fontFamily: 'DM Sans, sans-serif',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: isLoading ? 0.6 : 1,
                  }}
                  onMouseOver={(e) => { if (!isLoading) e.target.style.borderColor = 'var(--text-light, #b0a49a)'; }}
                  onMouseOut={(e) => e.target.style.borderColor = 'var(--border, #e5ddd5)'}
                >
                  Sign in without password
                </button>
              </motion.form>
            )}

            {/* LOGIN STEP 2 — OTP */}
            {step === 'login-otp' && (
              <motion.form
                key="login-otp"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                onSubmit={handleVerifyLoginOtp}
                style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
              >
                <div>
                  <label style={{ ...labelBase, textAlign: 'center', display: 'block', marginBottom: '16px' }}>
                    Enter Login Code
                  </label>
                  <OtpInput
                    value={formData.otp}
                    onChange={(val) => {
                      setFormData((prev) => ({ ...prev, otp: val }));
                      if (error) clearError();
                    }}
                    disabled={isLoading}
                  />
                </div>

                <ResendCountdown onResend={() => sendLoginOtp(formData.email)} isLoading={isLoading} />

                <button
                  type="submit"
                  disabled={isLoading || formData.otp.length < 6}
                  id="verify-login-otp-btn"
                  style={submitBtnStyle(isLoading || formData.otp.length < 6)}
                >
                  {isLoading ? <Spinner /> : 'Sign In →'}
                </button>

                <button
                  type="button"
                  onClick={() => { setStep('login'); setFormData((p) => ({ ...p, otp: '' })); clearError(); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-mid, #8a7e76)', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'DM Sans, sans-serif', marginTop: '-8px' }}
                >
                  ← Back to password login
                </button>
              </motion.form>
            )}

            {/* REGISTER STEP 1 — Name + Email */}
            {step === 'register-info' && (
              <motion.form
                key="register-info"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                onSubmit={handleSendOtp}
                style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
              >
                <div>
                  <label style={labelBase}>Full Name</label>
                  <input
                    id="register-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    placeholder="Your full name"
                    style={inputBase}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </div>

                <div>
                  <label style={labelBase}>Email Address</label>
                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    placeholder="your@email.com"
                    style={inputBase}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  id="send-otp-btn"
                  style={submitBtnStyle(isLoading)}
                >
                  {isLoading ? <Spinner /> : 'Send Verification Code →'}
                </button>
              </motion.form>
            )}

            {/* REGISTER STEP 2 — OTP */}
            {step === 'register-otp' && (
              <motion.form
                key="register-otp"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                onSubmit={handleVerifyOtp}
                style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
              >
                <div>
                  <label style={{ ...labelBase, textAlign: 'center', display: 'block', marginBottom: '16px' }}>
                    Enter Verification Code
                  </label>
                  <OtpInput
                    value={formData.otp}
                    onChange={(val) => {
                      setFormData((prev) => ({ ...prev, otp: val }));
                      if (error) clearError();
                    }}
                    disabled={isLoading}
                  />
                </div>

                <ResendCountdown onResend={handleResend} isLoading={isLoading} />

                <button
                  type="submit"
                  disabled={isLoading || formData.otp.length < 6}
                  id="verify-otp-btn"
                  style={submitBtnStyle(isLoading || formData.otp.length < 6)}
                >
                  {isLoading ? <Spinner /> : 'Verify Code →'}
                </button>

                <button
                  type="button"
                  onClick={() => { setStep('register-info'); setFormData((p) => ({ ...p, otp: '' })); clearError(); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-mid, #8a7e76)', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'DM Sans, sans-serif', marginTop: '-8px' }}
                >
                  ← Change email address
                </button>
              </motion.form>
            )}

            {/* REGISTER STEP 3 — Password */}
            {step === 'register-password' && (
              <motion.form
                key="register-password"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                onSubmit={handleRegister}
                style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
              >
                <div>
                  <label style={labelBase}>Create Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
                      style={{ ...inputBase, paddingRight: '48px' }}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      style={{
                        position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mid, #8a7e76)',
                        padding: '2px', lineHeight: 0,
                      }}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                  {/* Password strength hint */}
                  {formData.password.length > 0 && (
                    <div style={{ marginTop: '8px', display: 'flex', gap: '4px' }}>
                      {[1, 2, 3].map((level) => {
                        const strength = formData.password.length >= 10 ? 3 : formData.password.length >= 6 ? 2 : 1;
                        return (
                          <div key={level} style={{
                            flex: 1, height: '3px', borderRadius: '999px',
                            background: level <= strength
                              ? strength === 3 ? '#22c55e' : strength === 2 ? '#f59e0b' : '#ef4444'
                              : 'var(--border, #e5ddd5)',
                            transition: 'background 0.3s',
                          }} />
                        );
                      })}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || formData.password.length < 6}
                  id="create-account-btn"
                  style={submitBtnStyle(isLoading || formData.password.length < 6)}
                >
                  {isLoading ? <Spinner /> : '✦ Create My Account'}
                </button>
              </motion.form>
            )}

          </AnimatePresence>

          {/* Toggle login/register */}
          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-mid, #8a7e76)', marginTop: '28px' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={isLogin ? switchToRegister : switchToLogin}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text, #1a1a1a)',
                fontWeight: 700,
                textDecoration: 'underline',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
              }}
            >
              {isLogin ? 'Register' : 'Sign In'}
            </button>
          </p>

          {/* Trust signals */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border, #e5ddd5)', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {['Free shipping', 'Secure checkout', 'Easy returns'].map((t) => (
              <span key={t} style={{ fontSize: '11px', color: 'var(--text-light, #b0a49a)', letterSpacing: '0.04em' }}>
                ✦ {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function submitBtnStyle(disabled) {
  return {
    width: '100%',
    height: '50px',
    background: disabled
      ? 'var(--border, #e5ddd5)'
      : 'linear-gradient(135deg, #b08a6e 0%, #c9a082 100%)',
    color: disabled ? 'var(--text-mid, #8a7e76)' : '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14.5px',
    fontWeight: 600,
    fontFamily: 'DM Sans, sans-serif',
    letterSpacing: '0.03em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 0.2s, transform 0.1s, box-shadow 0.2s',
    boxShadow: disabled ? 'none' : '0 4px 14px rgba(176, 138, 110, 0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };
}

function Spinner() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.25" />
      <path d="M21 12a9 9 0 00-9-9" />
    </svg>
  );
}
