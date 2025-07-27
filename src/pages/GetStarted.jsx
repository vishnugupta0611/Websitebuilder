import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { ArrowLeft, User, Mail, Lock, Building, Phone } from 'lucide-react'

function GetStarted() {
  const { slug } = useParams()
  const [activeForm, setActiveForm] = useState(null) // null, 'login', 'signup'
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
    company: '',
    phone: ''
  })

  const handleLogin = (e) => {
    e.preventDefault()
    console.log('Login Data:', loginData)
    console.log('Website Slug:', slug)
    // Here you would typically send data to your backend
    alert('Login data logged to console!')
  }

  const handleSignup = (e) => {
    e.preventDefault()
    if (signupData.password !== signupData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    console.log('Signup Data:', signupData)
    console.log('Website Slug:', slug)
    // Here you would typically send data to your backend
    alert('Signup data logged to console!')
  }

  // Landing page with two options
  if (!activeForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                to={`/${slug}`}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Website
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Get Started</h1>
              <div></div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Welcome to Our Platform
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of professionals who trust our corporate portal for their business needs.
              Choose how you'd like to get started.
            </p>
          </div>

          {/* Options Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Professional Login
                </h3>
                <p className="text-gray-600">
                  Already have an account? Sign in to access your dashboard and manage your business.
                </p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Access your dashboard
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Manage your projects
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  View analytics & reports
                </li>
              </ul>

              <Button
                onClick={() => setActiveForm('login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
              >
                Login to Corporate Portal
              </Button>
            </div>

            {/* Signup Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Sign Up with Corporate Portal
                </h3>
                <p className="text-gray-600">
                  New to our platform? Create your account and start building your business presence.
                </p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Free account setup
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Professional tools & features
                </li>
                <li className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  24/7 customer support
                </li>
              </ul>

              <Button
                onClick={() => setActiveForm('signup')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
              >
                Create New Account
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-16">
            <p className="text-gray-500 mb-8">Trusted by 10,000+ businesses worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400">COMPANY</div>
              <div className="text-2xl font-bold text-gray-400">BRAND</div>
              <div className="text-2xl font-bold text-gray-400">CORP</div>
              <div className="text-2xl font-bold text-gray-400">BUSINESS</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Login Form
  if (activeForm === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
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
              <h1 className="text-xl font-semibold text-gray-900">Professional Login</h1>
              <div></div>
            </div>
          </div>
        </header>

        {/* Login Form */}
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your corporate account</p>
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
                <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => setActiveForm('signup')}
                  className="text-blue-600 hover:text-blue-500 font-medium"
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
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
              <h1 className="text-xl font-semibold text-gray-900">Create Account</h1>
              <div></div>
            </div>
          </div>
        </header>

        {/* Signup Form */}
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Our Platform</h2>
              <p className="text-gray-600">Create your corporate account</p>
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
                label="Company Name"
                type="text"
                value={signupData.company}
                onChange={(e) => setSignupData({ ...signupData, company: e.target.value })}
                placeholder="Your Company Inc."
                required
                icon={<Building className="h-5 w-5 text-gray-400" />}
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
                  <a href="#" className="text-green-600 hover:text-green-500">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-green-600 hover:text-green-500">Privacy Policy</a>
                </span>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => setActiveForm('login')}
                  className="text-green-600 hover:text-green-500 font-medium"
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