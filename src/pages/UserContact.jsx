import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Send,
  ShoppingCart,
  Clock,
  MessageCircle
} from 'lucide-react'
import { WebsiteCartProvider, useWebsiteCart } from '../contexts/WebsiteCartContext'

// Cart Icon Component
function WebsiteCartIcon({ website, slug }) {
  const { cart } = useWebsiteCart()

  return (
    <Link
      to={`/${slug}/cart`}
      className="relative p-2 hover:opacity-75 transition-opacity mr-4"
      style={{ color: website.customizations.colors.primary }}
    >
      <ShoppingCart className="h-6 w-6" />
      {cart.items.length > 0 && (
        <span
          className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
          style={{ backgroundColor: website.customizations.colors.accent }}
        >
          {cart.items.reduce((total, item) => total + item.quantity, 0)}
        </span>
      )}
    </Link>
  )
}

function UserContactContent() {
  const { slug } = useParams()
  const { state, dispatch } = useApp()
  const { setWebsiteInfo } = useWebsiteCart()
  const [website, setWebsite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [messageSent, setMessageSent] = useState(false)

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  useEffect(() => {
    loadWebsiteData()
  }, [slug])

  const loadWebsiteData = async () => {
    try {
      setLoading(true)

      // Load website data from API
      const { websiteService } = await import('../services/websiteService')
      const result = await websiteService.getWebsiteBySlug(slug)

      if (!result.success) {
        dispatch({ type: 'SET_ERROR', payload: 'Website not found' })
        setLoading(false)
        return
      }

      const websiteData = result.data

      // Only show published websites
      if (websiteData.status !== 'published') {
        dispatch({ type: 'SET_ERROR', payload: 'Website not found' })
        setLoading(false)
        return
      }

      setWebsite(websiteData)

      // Set website info in cart context
      setWebsiteInfo({
        slug: websiteData.slug,
        id: websiteData.id,
        name: websiteData.name
      })
    } catch (error) {
      console.error('Error loading website:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load website' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)

    try {
      // Simulate sending message
      await new Promise(resolve => setTimeout(resolve, 1000))

      // In a real app, you would send this to your backend
      console.log('Contact form submitted:', {
        website: website.name,
        ...contactForm,
        timestamp: new Date().toISOString()
      })

      setMessageSent(true)
      setContactForm({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send message' })
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!website) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Website not found</h2>
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: website.customizations.colors.background,
        color: website.customizations.colors.text,
        fontFamily: website.customizations.typography.bodyFont
      }}
    >
      {/* Header */}
      <header
        className="border-b shadow-sm"
        style={{
          backgroundColor: website.customizations.colors.background,
          borderColor: website.customizations.colors.secondary + '20'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to={`/${slug}`}
              className="flex items-center hover:opacity-75 transition-opacity"
              style={{ color: website.customizations.colors.primary }}
            >
              <h1
                className="text-2xl font-bold"
                style={{ fontFamily: website.customizations.typography.headingFont }}
              >
                {website.name}
              </h1>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to={`/${slug}`}
                className="hover:opacity-75 transition-opacity"
                style={{ color: website.customizations.colors.text }}
              >
                Home
              </Link>
              <Link
                to={`/${slug}/about`}
                className="hover:opacity-75 transition-opacity"
                style={{ color: website.customizations.colors.text }}
              >
                About
              </Link>
              <Link
                to={`/${slug}/blogs`}
                className="hover:opacity-75 transition-opacity"
                style={{ color: website.customizations.colors.text }}
              >
                Blogs
              </Link>
              <Link
                to={`/${slug}/contact`}
                className="hover:opacity-75 transition-opacity font-semibold"
                style={{ color: website.customizations.colors.primary }}
              >
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <WebsiteCartIcon website={website} slug={slug} />
              <Button
                as={Link}
                to={`/${slug}/getstarted`}
                style={{
                  backgroundColor: website.customizations.colors.primary,
                  color: 'white'
                }}
                className="hover:opacity-90 transition-opacity"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to={`/${slug}`}
            className="hover:opacity-75 transition-opacity inline-flex items-center"
            style={{ color: website.customizations.colors.primary }}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              color: website.customizations.colors.primary,
              fontFamily: website.customizations.typography.headingFont
            }}
          >
            Contact Us
          </h1>
          <p
            className="text-xl max-w-3xl mx-auto"
            style={{ color: website.customizations.colors.secondary }}
          >
            Get in touch with us. We'd love to hear from you and answer any questions you may have.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2
              className="text-3xl font-bold mb-8"
              style={{
                color: website.customizations.colors.primary,
                fontFamily: website.customizations.typography.headingFont
              }}
            >
              Get In Touch
            </h2>

            <div className="space-y-6">
              {/* Email */}
              {website.contactInfo?.email && (
                <div className="flex items-start space-x-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: website.customizations.colors.primary + '20' }}
                  >
                    <Mail className="h-6 w-6" style={{ color: website.customizations.colors.primary }} />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold mb-1"
                      style={{ color: website.customizations.colors.text }}
                    >
                      Email Address
                    </h3>
                    <p style={{ color: website.customizations.colors.secondary }}>
                      Send us an email anytime
                    </p>
                    <a
                      href={`mailto:${website.contactInfo.email}`}
                      className="font-medium hover:opacity-75 transition-opacity"
                      style={{ color: website.customizations.colors.primary }}
                    >
                      {website.contactInfo.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Phone */}
              {website.contactInfo?.phone && (
                <div className="flex items-start space-x-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: website.customizations.colors.accent + '20' }}
                  >
                    <Phone className="h-6 w-6" style={{ color: website.customizations.colors.accent }} />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold mb-1"
                      style={{ color: website.customizations.colors.text }}
                    >
                      Phone Number
                    </h3>
                    <p style={{ color: website.customizations.colors.secondary }}>
                      Call us during business hours
                    </p>
                    <a
                      href={`tel:${website.contactInfo.phone}`}
                      className="font-medium hover:opacity-75 transition-opacity"
                      style={{ color: website.customizations.colors.primary }}
                    >
                      {website.contactInfo.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Address */}
              {website.contactInfo?.address && (
                <div className="flex items-start space-x-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: website.customizations.colors.secondary + '20' }}
                  >
                    <MapPin className="h-6 w-6" style={{ color: website.customizations.colors.secondary }} />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold mb-1"
                      style={{ color: website.customizations.colors.text }}
                    >
                      Office Address
                    </h3>
                    <p style={{ color: website.customizations.colors.secondary }}>
                      Visit us at our office
                    </p>
                    <p
                      className="font-medium"
                      style={{ color: website.customizations.colors.text }}
                    >
                      {website.contactInfo.address}
                    </p>
                  </div>
                </div>
              )}

              {/* Business Hours */}
              <div className="flex items-start space-x-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: website.customizations.colors.primary + '20' }}
                >
                  <Clock className="h-6 w-6" style={{ color: website.customizations.colors.primary }} />
                </div>
                <div>
                  <h3
                    className="text-lg font-semibold mb-1"
                    style={{ color: website.customizations.colors.text }}
                  >
                    Business Hours
                  </h3>
                  <div style={{ color: website.customizations.colors.secondary }}>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border p-8" style={{ borderColor: website.customizations.colors.secondary + '30' }}>
              <div className="flex items-center mb-6">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                  style={{ backgroundColor: website.customizations.colors.primary + '20' }}
                >
                  <MessageCircle className="h-6 w-6" style={{ color: website.customizations.colors.primary }} />
                </div>
                <h2
                  className="text-2xl font-bold"
                  style={{
                    color: website.customizations.colors.primary,
                    fontFamily: website.customizations.typography.headingFont
                  }}
                >
                  Send us a Message
                </h2>
              </div>

              {messageSent ? (
                <div
                  className="text-center py-8"
                  style={{ color: website.customizations.colors.accent }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: website.customizations.colors.accent + '20' }}
                  >
                    <Send className="h-8 w-8" style={{ color: website.customizations.colors.accent }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                  <p style={{ color: website.customizations.colors.text }}>
                    Thank you for your message. We'll get back to you soon.
                  </p>
                  <Button
                    onClick={() => setMessageSent(false)}
                    className="mt-4"
                    style={{
                      backgroundColor: website.customizations.colors.primary,
                      color: 'white'
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <Input
                    label="Subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      rows={6}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button
                    type="submit"
                    loading={sending}
                    className="w-full"
                    style={{
                      backgroundColor: website.customizations.colors.primary,
                      color: 'white'
                    }}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="py-12 border-t mt-16"
        style={{
          backgroundColor: website.customizations.colors.secondary + '10',
          borderColor: website.customizations.colors.secondary + '30'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p style={{ color: website.customizations.colors.secondary }}>
            © 2024 {website.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

// Main UserContact component with cart provider
function UserContact() {
  const { slug } = useParams()

  return (
    <WebsiteCartProvider websiteSlug={slug}>
      <UserContactContent />
    </WebsiteCartProvider>
  )
}

export default UserContact