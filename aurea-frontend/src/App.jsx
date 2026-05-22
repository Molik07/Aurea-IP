import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import useCart from './hooks/useCart'
import useWishlist from './hooks/useWishlist'
import useProducts from './hooks/useProducts'
import useSettings from './hooks/useSettings'
import { useAuth } from './hooks/useAuth'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import AnnouncementBar from './components/layout/AnnouncementBar'
import CartDrawer from './components/layout/CartDrawer'
import Home from './pages/Home'
import ProductListing from './pages/ProductListing'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import Account from './pages/Account'
import Auth from './pages/Auth'
import SkinQuiz from './pages/SkinQuiz'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminSettings from './pages/admin/AdminSettings'
import AdminCategories from './pages/admin/AdminCategories'

function ProtectedRoute({ children }) {
  const { user, isCheckingAuth } = useAuth();
  const location = useLocation();

  if (isCheckingAuth) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)', fontFamily: 'DM Sans, sans-serif', color: 'var(--text-mid)' }}>Loading...</div>;

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const { user, isCheckingAuth } = useAuth();
  const location = useLocation();

  if (isCheckingAuth) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)', fontFamily: 'DM Sans, sans-serif', color: 'var(--text-mid)' }}>Loading...</div>;

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const initCart = useCart((state) => state.initCart)
  const initWishlist = useWishlist((state) => state.initWishlist)
  const initProducts = useProducts((state) => state.initProducts)
  const initSettings = useSettings((state) => state.initSettings)
  const checkAuth = useAuth((state) => state.checkAuth)

  useEffect(() => {
    checkAuth()
    initCart()
    initWishlist()
    initProducts()
    initSettings()
  }, [checkAuth, initCart, initWishlist, initProducts, initSettings])

  return (
    <>
      <ScrollToTop />
      <AnnouncementBar />
      <Header />
      <CartDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/account" element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        } />
        <Route path="/quiz" element={<SkinQuiz />} />
        <Route path="/admin" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />
        <Route path="/admin/products" element={
          <AdminRoute><AdminProducts /></AdminRoute>
        } />
        <Route path="/admin/categories" element={
          <AdminRoute><AdminCategories /></AdminRoute>
        } />
        <Route path="/admin/orders" element={
          <AdminRoute><AdminOrders /></AdminRoute>
        } />
        <Route path="/admin/settings" element={
          <AdminRoute><AdminSettings /></AdminRoute>
        } />
      </Routes>
      <Footer />
    </>
  )
}
