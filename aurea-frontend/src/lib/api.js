/**
 * Single source of truth for the API base URL.
 *
 * In development, VITE_API_BASE_URL is not set, so we fall back to an empty
 * string — all fetch calls become relative paths (/api/...) which are
 * intercepted by the Vite dev proxy (vite.config.js).
 *
 * In production (Vercel), VITE_API_BASE_URL is set to the Railway backend URL
 * (e.g. https://backend-production-xxxx.up.railway.app) and fetch calls
 * become absolute cross-origin requests.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export default API_BASE_URL;
