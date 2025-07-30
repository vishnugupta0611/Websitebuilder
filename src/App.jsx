import React from 'react'
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import { AuthProvider } from './contexts/AuthContext'
import { WebsiteCartProvider } from './contexts/WebsiteCartContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Home from './pages/Home'
import ContentEditor from './pages/ContentEditor'
import MyWebsites from './pages/MyWebsites'
import WebsiteBuilder from './pages/WebsiteBuilder'
import MyProducts from './pages/MyProducts'
import ProductManager from './pages/ProductManager'
import BlogManager from './pages/BlogManager'
import UserWebsite from './pages/UserWebsite'
import UserAbout from './pages/UserAbout'
import UserContact from './pages/UserContact'
import UserBlogs from './pages/UserBlogs'
import UserBlogDetail from './pages/UserBlogDetail'
import UserProductDetail from './pages/UserProductDetail'
import GetStarted from './pages/GetStarted'
import WebsiteCartPage from './pages/WebsiteCartPage'
import { CustomerAuthProvider } from './contexts/CustomerAuthContext'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Search from './pages/Search'
import CustomerProfile from './pages/CustomerProfile'
import OrdersDashboard from './pages/OrdersDashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyOTP from './pages/VerifyOTP'
import ApiTest from './pages/ApiTest'
import NotFound from './components/NotFound'

// Import test data utility for development
import './utils/testData'
import CustomerOrders from './pages/CustomerOrders'
import SavedItems from './pages/SavedItems'

// Customer Auth Wrapper Component
function CustomerAuthWrapper({ children }) {
  const { slug } = useParams()
  
  return (
    <CustomerAuthProvider websiteSlug={slug}>
      {children}
    </CustomerAuthProvider>
  )
}

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
            <Route path="/blog-manager" element={<ProtectedRoute><Layout><BlogManager /></Layout></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Layout><Cart /></Layout></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Layout><Checkout /></Layout></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Layout><Search /></Layout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Layout><CustomerProfile /></Layout></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Layout><OrdersDashboard /></Layout></ProtectedRoute>} />
            <Route path="/api-test" element={<ProtectedRoute><Layout><ApiTest /></Layout></ProtectedRoute>} />
            
            {/* User Website Routes - WITHOUT Layout (Independent websites with Customer Auth) */}
            <Route path="/:slug" element={
              <CustomerAuthWrapper>
                <UserWebsite />
              </CustomerAuthWrapper>
            } />
            <Route path="/:slug/about" element={
              <CustomerAuthWrapper>
                <UserAbout />
              </CustomerAuthWrapper>
            } />
            <Route path="/:slug/contact" element={
              <CustomerAuthWrapper>
                <UserContact />
              </CustomerAuthWrapper>
            } />
            <Route path="/:slug/blogs" element={
              <CustomerAuthWrapper>
                <UserBlogs />
              </CustomerAuthWrapper>
            } />
            <Route path="/:slug/blogs/:blogSlug" element={
              <CustomerAuthWrapper>
                <UserBlogDetail />
              </CustomerAuthWrapper>
            } />
            <Route path="/:slug/products/:productId" element={
              <CustomerAuthWrapper>
                <UserProductDetail />
              </CustomerAuthWrapper>
            } />
            <Route path="/:slug/getstarted" element={
              <CustomerAuthWrapper>
                <GetStarted />
              </CustomerAuthWrapper>
            } />
            <Route path="/:slug/cart" element={
              <CustomerAuthWrapper>
                <WebsiteCartPage />
              </CustomerAuthWrapper>
            } />
            <Route path="/:slug/verify-otp" element={
              <CustomerAuthWrapper>
                <VerifyOTP />
              </CustomerAuthWrapper>
            } />
            <Route path="/:slug/profile" element={
              <CustomerAuthWrapper>
               <CustomerProfile/>
              </CustomerAuthWrapper>
            } />
            <Route path="/:slug/orders" element={
              <CustomerAuthWrapper>
               <CustomerOrders/>
              </CustomerAuthWrapper>
            } />
            <Route path="/:slug/saved-items" element={
              <CustomerAuthWrapper>
                <WebsiteCartProvider>
               <SavedItems/>
               </WebsiteCartProvider>
              </CustomerAuthWrapper>
            } />
            {/* Catch-all route for 404 errors */}
            <Route path="*" element={<NotFound />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  )
}

export default App