import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import WebsiteHeader from '../components/website/WebsiteHeader'
import { 
  ArrowLeft, 
  Users, 
  Target, 
  Eye, 
  CheckCircle,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import { WebsiteCartProvider, useWebsiteCart } from '../contexts/WebsiteCartContext'
import { CustomerAuthProvider } from '../contexts/CustomerAuthContext'



function UserAboutContent() {
  const { slug } = useParams()
  const { state, dispatch } = useApp()
  const { setWebsiteInfo } = useWebsiteCart()
  const [website, setWebsite] = useState(null)
  const [loading, setLoading] = useState(true)

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
      <WebsiteHeader website={website} slug={slug} currentPage="about" />

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
            About Us
          </h1>
          <p 
            className="text-xl max-w-3xl mx-auto"
            style={{ color: website.customizations.colors.secondary }}
          >
            Learn more about our story, mission, and the team behind {website.name}
          </p>
        </div>

        {/* Company Story */}
        {website.companyStory && (
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border p-8" style={{ borderColor: website.customizations.colors.secondary + '30' }}>
              <div className="flex items-center mb-6">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                  style={{ backgroundColor: website.customizations.colors.primary + '20' }}
                >
                  <Users className="h-6 w-6" style={{ color: website.customizations.colors.primary }} />
                </div>
                <h2 
                  className="text-3xl font-bold"
                  style={{ 
                    color: website.customizations.colors.primary,
                    fontFamily: website.customizations.typography.headingFont
                  }}
                >
                  Our Story
                </h2>
              </div>
              <p 
                className="text-lg leading-relaxed"
                style={{ color: website.customizations.colors.text }}
              >
                {website.companyStory}
              </p>
            </div>
          </section>
        )}

        {/* Why We Created This Business */}
        {website.whyCreated && (
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border p-8" style={{ borderColor: website.customizations.colors.secondary + '30' }}>
              <div className="flex items-center mb-6">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                  style={{ backgroundColor: website.customizations.colors.accent + '20' }}
                >
                  <Target className="h-6 w-6" style={{ color: website.customizations.colors.accent }} />
                </div>
                <h2 
                  className="text-3xl font-bold"
                  style={{ 
                    color: website.customizations.colors.primary,
                    fontFamily: website.customizations.typography.headingFont
                  }}
                >
                  Why We Started
                </h2>
              </div>
              <p 
                className="text-lg leading-relaxed"
                style={{ color: website.customizations.colors.text }}
              >
                {website.whyCreated}
              </p>
            </div>
          </section>
        )}

        {/* Mission & Vision */}
        {(website.mission || website.vision) && (
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mission */}
              {website.mission && (
                <div className="bg-white rounded-lg shadow-sm border p-8" style={{ borderColor: website.customizations.colors.secondary + '30' }}>
                  <div className="flex items-center mb-6">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                      style={{ backgroundColor: website.customizations.colors.primary + '20' }}
                    >
                      <Target className="h-6 w-6" style={{ color: website.customizations.colors.primary }} />
                    </div>
                    <h3 
                      className="text-2xl font-bold"
                      style={{ 
                        color: website.customizations.colors.primary,
                        fontFamily: website.customizations.typography.headingFont
                      }}
                    >
                      Our Mission
                    </h3>
                  </div>
                  <p 
                    className="leading-relaxed"
                    style={{ color: website.customizations.colors.text }}
                  >
                    {website.mission}
                  </p>
                </div>
              )}

              {/* Vision */}
              {website.vision && (
                <div className="bg-white rounded-lg shadow-sm border p-8" style={{ borderColor: website.customizations.colors.secondary + '30' }}>
                  <div className="flex items-center mb-6">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                      style={{ backgroundColor: website.customizations.colors.accent + '20' }}
                    >
                      <Eye className="h-6 w-6" style={{ color: website.customizations.colors.accent }} />
                    </div>
                    <h3 
                      className="text-2xl font-bold"
                      style={{ 
                        color: website.customizations.colors.primary,
                        fontFamily: website.customizations.typography.headingFont
                      }}
                    >
                      Our Vision
                    </h3>
                  </div>
                  <p 
                    className="leading-relaxed"
                    style={{ color: website.customizations.colors.text }}
                  >
                    {website.vision}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Features & Services */}
        {website.features && website.features.length > 0 && website.features[0] && (
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border p-8" style={{ borderColor: website.customizations.colors.secondary + '30' }}>
              <h2 
                className="text-3xl font-bold mb-8 text-center"
                style={{ 
                  color: website.customizations.colors.primary,
                  fontFamily: website.customizations.typography.headingFont
                }}
              >
                What We Offer
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {website.features.filter(feature => feature.trim()).map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                      style={{ backgroundColor: website.customizations.colors.accent }}
                    >
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <p 
                      className="font-medium"
                      style={{ color: website.customizations.colors.text }}
                    >
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Team Information */}
        {website.teamInfo && (
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-sm border p-8" style={{ borderColor: website.customizations.colors.secondary + '30' }}>
              <div className="flex items-center mb-6">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                  style={{ backgroundColor: website.customizations.colors.primary + '20' }}
                >
                  <Users className="h-6 w-6" style={{ color: website.customizations.colors.primary }} />
                </div>
                <h2 
                  className="text-3xl font-bold"
                  style={{ 
                    color: website.customizations.colors.primary,
                    fontFamily: website.customizations.typography.headingFont
                  }}
                >
                  Our Team
                </h2>
              </div>
              <p 
                className="text-lg leading-relaxed"
                style={{ color: website.customizations.colors.text }}
              >
                {website.teamInfo}
              </p>
            </div>
          </section>
        )}

        {/* Contact Information Preview */}
        {website.contactInfo && (
          <section className="mb-16">
            <div 
              className="rounded-lg p-8 text-center"
              style={{ backgroundColor: website.customizations.colors.primary + '10' }}
            >
              <h2 
                className="text-3xl font-bold mb-6"
                style={{ 
                  color: website.customizations.colors.primary,
                  fontFamily: website.customizations.typography.headingFont
                }}
              >
                Get In Touch
              </h2>
              <p 
                className="text-lg mb-8"
                style={{ color: website.customizations.colors.text }}
              >
                Ready to work with us? We'd love to hear from you.
              </p>
              <Link
                to={`/${slug}/contact`}
                className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors"
                style={{ 
                  backgroundColor: website.customizations.colors.primary,
                  color: 'white'
                }}
              >
                Contact Us
              </Link>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer 
        className="py-12 border-t"
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

// Main UserAbout component with cart and customer auth providers
function UserAbout() {
  const { slug } = useParams()
  
  return (
    <CustomerAuthProvider websiteSlug={slug}>
      <WebsiteCartProvider websiteSlug={slug}>
        <UserAboutContent />
      </WebsiteCartProvider>
    </CustomerAuthProvider>
  )
}

export default UserAbout