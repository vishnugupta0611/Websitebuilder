import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Home from './pages/Home'
import ContentEditor from './pages/ContentEditor'
import MyWebsites from './pages/MyWebsites'
import WebsiteBuilder from './pages/WebsiteBuilder'
import MyProducts from './pages/MyProducts'
import ProductManager from './pages/ProductManager'
import UserWebsite from './pages/UserWebsite'
import UserAbout from './pages/UserAbout'
import UserContact from './pages/UserContact'
import UserBlogs from './pages/UserBlogs'
import UserBlogDetail from './pages/UserBlogDetail'
import UserProductDetail from './pages/UserProductDetail'
import GetStarted from './pages/GetStarted'
import WebsiteCartPage from './pages/WebsiteCartPage'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Search from './pages/Search'
import CustomerProfile from './pages/CustomerProfile'
import OrdersDashboard from './pages/OrdersDashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyOTP from './pages/VerifyOTP'

// Import test data utility for development
import './utils/testData'

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Authentication Routes - WITHOUT Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            
            {/* Corporate Portal Routes - WITH Layout and Protection */}
            <Route path="/" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
            <Route path="/content-editor" element={<ProtectedRoute><Layout><ContentEditor /></Layout></ProtectedRoute>} />
            <Route path="/my-websites" element={<ProtectedRoute><Layout><MyWebsites /></Layout></ProtectedRoute>} />
            <Route path="/website-builder" element={<ProtectedRoute><Layout><WebsiteBuilder /></Layout></ProtectedRoute>} />
            <Route path="/my-products" element={<ProtectedRoute><Layout><MyProducts /></Layout></ProtectedRoute>} />
            <Route path="/product-manager" element={<ProtectedRoute><Layout><ProductManager /></Layout></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Layout><Cart /></Layout></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Layout><Checkout /></Layout></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Layout><Search /></Layout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Layout><CustomerProfile /></Layout></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Layout><OrdersDashboard /></Layout></ProtectedRoute>} />
            
            {/* User Website Routes - WITHOUT Layout (Independent websites) */}
            <Route path="/:slug" element={<UserWebsite />} />
            <Route path="/:slug/about" element={<UserAbout />} />
            <Route path="/:slug/contact" element={<UserContact />} />
            <Route path="/:slug/blogs" element={<UserBlogs />} />
            <Route path="/:slug/blogs/:blogSlug" element={<UserBlogDetail />} />
            <Route path="/:slug/products/:productId" element={<UserProductDetail />} />
            <Route path="/:slug/getstarted" element={<GetStarted />} />
            <Route path="/:slug/cart" element={<WebsiteCartPage />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  )
}

export default App