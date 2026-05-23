import { create } from 'zustand';
import API_BASE_URL from '../lib/api';

const API_BASE = `${API_BASE_URL}/api/auth`;

const useAuth = create((set) => ({
  user: null,
  isLoading: false,  // false by default so buttons are not disabled on page load
  isCheckingAuth: true, // separate flag for initial session check
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('accessToken', data.accessToken);
      set({ user: data.user, isLoading: false });
      return data.user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Returns { warning } if Resend domain not verified (dev mode)
  sendOtp: async (name, email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send verification code');
      set({ isLoading: false });
      return { warning: data.warning, message: data.message };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Passwordless login: Send OTP to existing user
  sendLoginOtp: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/login-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send login code');
      set({ isLoading: false });
      return { warning: data.warning, message: data.message };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Passwordless login: Verify OTP and log in
  verifyLoginOtp: async (email, otp) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/verify-login-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Invalid login code');
      localStorage.setItem('accessToken', data.accessToken);
      set({ user: data.user, isLoading: false });
      return data.user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Resend without needing name again (uses server-stored record)
  resendOtp: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to resend code');
      set({ isLoading: false });
      return { warning: data.warning, message: data.message };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      localStorage.setItem('accessToken', data.accessToken);
      set({ user: data.user, isLoading: false });
      return data.user;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await fetch(`${API_BASE}/logout`, { method: 'POST' });
      localStorage.removeItem('accessToken');
      set({ user: null, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        set({ user: null, isCheckingAuth: false });
        return;
      }

      const response = await fetch(`${API_BASE}/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        set({ user: data.user, isCheckingAuth: false });
      } else {
        localStorage.removeItem('accessToken');
        set({ user: null, isCheckingAuth: false });
      }
    } catch {
      set({ user: null, isCheckingAuth: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export { useAuth };
export default useAuth;
