import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { ArrowLeft, User, Mail, Lock, Building, Phone, ShoppingBag, Heart, Star } from 'lucide-react'
import { useCustomerAuth } from '../contexts/CustomerAuthContext'
import { useApp } from '../contexts/AppContext'
import { websiteService } from '../services/websiteService'

function GetStarted() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { dispatch } = useApp()
  const { login, signup, isAuthenticated, loading: authLoading } = useCustomerAuth()
  const [website, setWebsite] = useState(null)
  const [activeForm, setActiveForm] = useState(null) // null, 'login', 'signup'
  const [loading, setLoading] = useState(false)
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })

  // Load website data
  useEffect(() => {
    loadWebsiteData()
  }, [slug])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(`/${slug}`)
    }
  }, [isAuthenticated, authLoading, slug, navigate])

  const loadWebsiteData = async () => {
    try {
      const result = await websiteService.getWebsiteBySlug(slug)
      if (result.success) {
        setWebsite(result.data)
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Website not found' })
      }
    } catch (error) {
      console.error('Error loading website:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load website' })
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await login(loginData.email, loginData.password)
      
      if (result.success) {
        dispatch({ type: 'SET_SUCCESS', payload: `Welcome back to ${website?.name || 'our store'}!` })
        // Redirect to website homepage
        setTimeout(() => {
          navigate(`/${slug}`)
        }, 1000)
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Login failed. Please try again.' })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Login failed. Please check your connection.' })
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    
    if (signupData.password !== signupData.confirmPassword) {
      dispatch({ type: 'SET_ERROR', payload: 'Passwords do not match!' })
      return
    }

    if (signupData.password.length < 8) {
      dispatch({ type: 'SET_ERROR', payload: 'Password must be at least 8 characters long.' })
      return
    }

    setLoading(true)
    
    try {
      const userData = {
        email: signupData.email,
        password: signupData.password,
        confirmPassword: signupData.confirmPassword,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        phone: signupData.phone
      }
      
      const result = await signup(userData)
      
      if (result.success) {
        dispatch({ type: 'SET_SUCCESS', payload: 'Account created successfully! Please check your email for verification.' })
        // Redirect to OTP verification with website context
        setTimeout(() => {
          navigate(`/${slug}/verify-otp?email=${encodeURIComponent(signupData.email)}`)
        }, 2000)
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Registration failed. Please try again.' })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Registration failed. Please check your connection.' })
    } finally {
      setLoading(false)
    }
  }

  // Show loading while checking auth or loading website
  if (authLoading || !website) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Landing page with two options
  if (!activeForm) {
    return (
      <div 
        className="min-h-screen"
        style={{
          backgroundColor: website.customizations?.colors?.background || '#ffffff',
          backgroundImage: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(255, 255, 255, 1) 50%, rgba(16, 185, 129, 0.05) 100%)'
        }}
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                to={`/${slug}`}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to {website.name}
              </Link>
              <h1 
                className="text-xl font-semibold"
                style={{ color: website.customizations?.colors?.primary || '#1f2937' }}
              >
                Join {website.name}
              </h1>
              <div></div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: website.customizations?.colors?.text || '#1f2937' }}
            >
              Welcome to {website.name}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {website.description || 'Join our community and discover amazing products and services tailored just for you.'}
            </p>
          </div>

          {/* Options Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow">
              <div className="text-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: (website.customizations?.colors?.primary || '#3b82f6') + '20' }}
                >
                  <User 
                    className="h-8 w-8"
                    style={{ color: website.customizations?.colors?.primary || '#3b82f6' }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h3>
                <p className="text-gray-600">
                  Already have an account? Sign in to access your profile and continue shopping.
                </p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <ShoppingBag className="h-4 w-4 mr-3" style={{ color: website.customizations?.colors?.primary || '#3b82f6' }} />
                  Access your orders
                </li>
                <li className="flex items-center text-gray-600">
                  <Heart className="h-4 w-4 mr-3" style={{ color: website.customizations?.colors?.primary || '#3b82f6' }} />
                  View saved items
                </li>
                <li className="flex items-center text-gray-600">
                  <Star className="h-4 w-4 mr-3" style={{ color: website.customizations?.colors?.primary || '#3b82f6' }} />
                  Personalized experience
                </li>
              </ul>

              <Button
                onClick={() => setActiveForm('login')}
                className="w-full py-3 text-lg font-semibold text-white"
                style={{ backgroundColor: website.customizations?.colors?.primary || '#3b82f6' }}
              >
                Sign In
              </Button>
            </div>

            {/* Signup Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow">
              <div className="text-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: (website.customizations?.colors?.accent || '#10b981') + '20' }}
                >
                  <User 
                    className="h-8 w-8"
                    style={{ color: website.customizations?.colors?.accent || '#10b981' }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Join {website.name}
                </h3>
                <p className="text-gray-600">
                  New here? Create your account and unlock exclusive benefits and personalized shopping.
                </p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <div 
                    className="w-2 h-2 rounded-full mr-3"
                    style={{ backgroundColor: website.customizations?.colors?.accent || '#10b981' }}
                  ></div>
                  Free account creation
                </li>
                <li className="flex items-center text-gray-600">
                  <div 
                    className="w-2 h-2 rounded-full mr-3"
                    style={{ backgroundColor: website.customizations?.colors?.accent || '#10b981' }}
                  ></div>
                  Exclusive member benefits
                </li>
                <li className="flex items-center text-gray-600">
                  <div 
                    className="w-2 h-2 rounded-full mr-3"
                    style={{ backgroundColor: website.customizations?.colors?.accent || '#10b981' }}
                  ></div>
                  Personalized recommendations
                </li>
              </ul>

              <Button
                onClick={() => setActiveForm('signup')}
                className="w-full py-3 text-lg font-semibold text-white"
                style={{ backgroundColor: website.customizations?.colors?.accent || '#10b981' }}
              >
                Create Account
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-16">
            <p className="text-gray-500 mb-8">Join our growing community of satisfied customers</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-gray-400 font-medium">4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400 font-medium">1000+ Orders</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400 font-medium">Happy Customers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Login Form
  if (activeForm === 'login') {
    return (
      <div 
        className="min-h-screen"
        style={{
          backgroundColor: website.customizations?.colors?.background || '#ffffff',
          backgroundImage: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(255, 255, 255, 1) 100%)'
        }}
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => setActiveForm(null)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
              <h1 
                className="text-xl font-semibold"
                style={{ color: website.customizations?.colors?.primary || '#1f2937' }}
              >
                Sign In to {website.name}
              </h1>
              <div></div>
            </div>
          </div>
        </header>

        {/* Login Form */}
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: (website.customizations?.colors?.primary || '#3b82f6') + '20' }}
              >
                <User 
                  className="h-8 w-8"
                  style={{ color: website.customizations?.colors?.primary || '#3b82f6' }}
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your {website.name} account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                placeholder="your@company.com"
                required
                icon={<Mail className="h-5 w-5 text-gray-400" />}
              />

              <Input
                label="Password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Enter your password"
                required
                icon={<Lock className="h-5 w-5 text-gray-400" />}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a 
                  href="#" 
                  className="text-sm hover:opacity-75"
                  style={{ color: website.customizations?.colors?.primary || '#3b82f6' }}
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full text-white py-3 text-lg font-semibold"
                style={{ backgroundColor: website.customizations?.colors?.primary || '#3b82f6' }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => setActiveForm('signup')}
                  className="font-medium hover:opacity-75"
                  style={{ color: website.customizations?.colors?.primary || '#3b82f6' }}
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Signup Form
  if (activeForm === 'signup') {
    return (
      <div 
        className="min-h-screen"
        style={{
          backgroundColor: website.customizations?.colors?.background || '#ffffff',
          backgroundImage: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(255, 255, 255, 1) 100%)'
        }}
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => setActiveForm(null)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
              <h1 
                className="text-xl font-semibold"
                style={{ color: website.customizations?.colors?.accent || '#10b981' }}
              >
                Join {website.name}
              </h1>
              <div></div>
            </div>
          </div>
        </header>

        {/* Signup Form */}
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: (website.customizations?.colors?.accent || '#10b981') + '20' }}
              >
                <User 
                  className="h-8 w-8"
                  style={{ color: website.customizations?.colors?.accent || '#10b981' }}
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Join {website.name}</h2>
              <p className="text-gray-600">Create your account and start shopping</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  value={signupData.firstName}
                  onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                  placeholder="John"
                  required
                />
                <Input
                  label="Last Name"
                  type="text"
                  value={signupData.lastName}
                  onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                  placeholder="Doe"
                  required
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                placeholder="your@company.com"
                required
                icon={<Mail className="h-5 w-5 text-gray-400" />}
              />



              <Input
                label="Phone Number"
                type="tel"
                value={signupData.phone}
                onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                icon={<Phone className="h-5 w-5 text-gray-400" />}
              />

              <Input
                label="Password"
                type="password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                placeholder="Create a strong password"
                required
                icon={<Lock className="h-5 w-5 text-gray-400" />}
              />

              <Input
                label="Confirm Password"
                type="password"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                required
                icon={<Lock className="h-5 w-5 text-gray-400" />}
              />

              <div className="flex items-center">
                <input
                  type="checkbox"
                  required
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <a 
                    href="#" 
                    className="hover:opacity-75"
                    style={{ color: website.customizations?.colors?.accent || '#10b981' }}
                  >
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a 
                    href="#" 
                    className="hover:opacity-75"
                    style={{ color: website.customizations?.colors?.accent || '#10b981' }}
                  >
                    Privacy Policy
                  </a>
                </span>
              </div>

              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full text-white py-3 text-lg font-semibold"
                style={{ backgroundColor: website.customizations?.colors?.accent || '#10b981' }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => setActiveForm('login')}
                  className="font-medium hover:opacity-75"
                  style={{ color: website.customizations?.colors?.accent || '#10b981' }}
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default GetStarted