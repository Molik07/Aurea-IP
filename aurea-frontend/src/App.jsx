import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import useCart from './hooks/useCart'
import useWishlist from './hooks/useWishlist'
import useProducts from './hooks/useProducts'
import useSettings from './hooks/useSettings'
import useAuth from './hooks/useAuth'
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
        <Route path="/account" element={<Account />} />
        <Route path="/quiz" element={<SkinQuiz />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
      <Footer />
    </>
  )
}
