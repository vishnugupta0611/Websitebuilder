import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { WebsiteCartProvider, useWebsiteCart } from '../contexts/WebsiteCartContext'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import TemplateRenderer from '../components/templates/TemplateRenderer'
import { websiteService } from '../services/websiteService'
import { productService } from '../services/productService'
import { blogService } from '../services/blogService'
import {
  ShoppingCart,
  Star,
  Search,
  Filter,
  Grid,
  List,
  Heart,
  Share2,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

// Cart Icon Component
function WebsiteCartIcon({ website, slug }) {
  const { cart } = useWebsiteCart()
  
  return (
    <Link
      to={`/${slug}/cart`}
      className="relative p-2 hover:opacity-75 transition-opacity"
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

function UserWebsiteContent() {
  const { slug } = useParams()
  const { state, dispatch } = useApp()
  const { setWebsiteInfo, addToCart } = useWebsiteCart()
  const [website, setWebsite] = useState(null)
  const [products, setProducts] = useState([])
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWebsiteData()
  }, [slug])

  const loadWebsiteData = async () => {
    try {
      setLoading(true)

      // Load website data from API
      const websiteResult = await websiteService.getWebsiteBySlug(slug)
      
      if (!websiteResult.success) {
        dispatch({ type: 'SET_ERROR', payload: 'Website not found' })
        setLoading(false)
        return
      }

      let websiteData = websiteResult.data

      console.log('🔍 Raw website data from API:', websiteData)

      // Transform backend data to frontend format
      if (websiteData) {
        // Ensure templateContent exists and has proper structure
        if (!websiteData.templateContent) {
          websiteData.templateContent = {}
        }
        
        // Ensure template object exists with proper structure
        if (!websiteData.template) {
          websiteData.template = {
            id: websiteData.template_id || 'default',
            name: websiteData.template_name || 'Default Template',
            metadata: websiteData.template_metadata || {}
          }
        }
        
        // Ensure customizations exist with proper structure - handle both object and string formats
        if (!websiteData.customizations || typeof websiteData.customizations === 'string') {
          try {
            // If customizations is a string, try to parse it
            const parsedCustomizations = typeof websiteData.customizations === 'string' 
              ? JSON.parse(websiteData.customizations) 
              : websiteData.customizations
            
            websiteData.customizations = {
              colors: {
                primary: parsedCustomizations?.colors?.primary || '#3B82F6',
                secondary: parsedCustomizations?.colors?.secondary || '#6B7280',
                accent: parsedCustomizations?.colors?.accent || '#F59E0B',
                background: parsedCustomizations?.colors?.background || '#FFFFFF',
                text: parsedCustomizations?.colors?.text || '#1F2937'
              },
              typography: {
                headingFont: parsedCustomizations?.typography?.headingFont || 'Inter, sans-serif',
                bodyFont: parsedCustomizations?.typography?.bodyFont || 'Inter, sans-serif'
              }
            }
          } catch (e) {
            // Fallback to default if parsing fails
            websiteData.customizations = {
              colors: {
                primary: '#3B82F6',
                secondary: '#6B7280',
                accent: '#F59E0B',
                background: '#FFFFFF',
                text: '#1F2937'
              },
              typography: {
                headingFont: 'Inter, sans-serif',
                bodyFont: 'Inter, sans-serif'
              }
            }
          }
        }
        
        // Ensure aboutContent exists
        if (!websiteData.aboutContent) {
          websiteData.aboutContent = {
            companyStory: websiteData.companyStory || '',
            whyCreated: websiteData.whyCreated || '',
            mission: websiteData.mission || '',
            vision: websiteData.vision || '',
            features: websiteData.features || [],
            teamInfo: websiteData.teamInfo || [],
            contactInfo: websiteData.contactInfo || {}
          }
        }
        
        // CRITICAL: Map backend fields to templateContent - ensure hero image is properly mapped
        const heroImageSources = [
          websiteData.heroImage,           // Primary source from backend
          websiteData.hero_image,          // Snake case variant
          websiteData.heroImageUrl,        // URL variant
          websiteData.hero_image_url,      // Snake case URL variant
          websiteData.templateContent?.heroImage  // Existing templateContent
        ]
        
        const heroImage = heroImageSources.find(source => {
          return source && 
                 typeof source === 'string' && 
                 source.trim() !== '' && 
                 (source.startsWith('http') || source.startsWith('data:'))
        })
        
        if (heroImage) {
          websiteData.templateContent.heroImage = heroImage
          console.log('✅ Successfully mapped hero image to templateContent:', heroImage)
        } else {
          console.log('⚠️ No valid hero image found in any source')
          console.log('Available sources:', heroImageSources)
        }
        
        // Map other hero fields to templateContent
        if (websiteData.heroTitle) {
          websiteData.templateContent.heroTitle = websiteData.heroTitle
        }
        if (websiteData.heroDescription) {
          websiteData.templateContent.heroDescription = websiteData.heroDescription
        }
        if (websiteData.heroButtonText) {
          websiteData.templateContent.heroButtonText = websiteData.heroButtonText
        }
        if (websiteData.productSectionTitle) {
          websiteData.templateContent.productSectionTitle = websiteData.productSectionTitle
        }
        if (websiteData.blogSectionTitle) {
          websiteData.templateContent.blogSectionTitle = websiteData.blogSectionTitle
        }
        
        console.log('✅ Final processed website data:')
        console.log('- Direct heroImage:', websiteData.heroImage)
        console.log('- templateContent.heroImage:', websiteData.templateContent.heroImage)
        console.log('- template:', websiteData.template)
        console.log('- customizations:', websiteData.customizations)
        console.log('- Full templateContent:', websiteData.templateContent)
      }

      // Only show published websites
      if (websiteData.status !== 'published') {
        dispatch({ type: 'SET_ERROR', payload: 'Website is not published yet' })
        setLoading(false)
        return
      }

      // Load products for this website from API
      const productsResult = await productService.getProductsByWebsiteSlug(slug)
      const websiteProducts = productsResult.success ? productsResult.data : []

      // Load blogs for this website from API
      const blogsResult = await blogService.getBlogsByWebsiteSlug(slug)
      const websiteBlogs = blogsResult.success ? blogsResult.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []

      console.log('=== WEBSITE DATA FROM API ===')
      console.log('Full website data:', JSON.stringify(websiteData, null, 2))
      console.log('Template content:', websiteData.templateContent)
      console.log('Hero image from templateContent:', websiteData.templateContent?.heroImage)
      console.log('Hero image direct:', websiteData.heroImage)
      console.log('All keys in websiteData:', Object.keys(websiteData))
      
      // Check all possible hero image fields
      const possibleHeroFields = [
        'heroImage', 'hero_image', 'heroImageUrl', 'hero_image_url',
        'templateContent.heroImage', 'template_content.heroImage'
      ]
      
      possibleHeroFields.forEach(field => {
        const value = field.includes('.') 
          ? field.split('.').reduce((obj, key) => obj?.[key], websiteData)
          : websiteData[field]
        if (value) {
          console.log(`Found hero image in field "${field}":`, value)
        }
      })
      
      console.log('=== END WEBSITE DATA ===')
      console.log('Products found:', websiteProducts)
      console.log('Blogs found:', websiteBlogs)

      setWebsite(websiteData)
      setProducts(websiteProducts)
      setBlogs(websiteBlogs)
    } catch (error) {
      console.error('Error loading website:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Website not found' })
    } finally {
      setLoading(false)
    }
  }

  // Set website info in cart context when website loads
  useEffect(() => {
    console.log('=== WEBSITE INFO EFFECT ===')
    console.log('Website:', website)
    console.log('Website slug:', website?.slug)
    console.log('Website id:', website?.id)
    console.log('Website name:', website?.name)
    
    if (website) {
      const websiteInfo = {
        slug: website.slug,
        id: website.id,
        name: website.name
      }
      console.log('Calling setWebsiteInfo with:', websiteInfo)
      setWebsiteInfo(websiteInfo)
    } else {
      console.log('Website not loaded yet, skipping setWebsiteInfo')
    }
    console.log('=== END WEBSITE INFO EFFECT ===')
  }, [website?.id, website?.slug, website?.name, setWebsiteInfo])

  const handleAddToCart = (product) => {
    // Debug: Log the product structure
    console.log('=== PRODUCT STRUCTURE IN handleAddToCart ===')
    console.log('Product:', product)
    console.log('Product keys:', Object.keys(product))
    console.log('Product images:', product.images)
    console.log('Product image:', product.image)
    console.log('=== END PRODUCT STRUCTURE ===')
    
    // Ensure product has images array for cart compatibility
    const productWithImages = {
      ...product,
      images: product.images || (product.image ? [product.image] : [])
    }
    
    console.log('=== FIXED PRODUCT FOR CART ===')
    console.log('Fixed product images:', productWithImages.images)
    console.log('=== END FIXED PRODUCT ===')
    
    addToCart(productWithImages, 1)
    // Show success message or notification
    console.log('Added to cart:', productWithImages)
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
          <p className="text-gray-600 mb-6">The website you're looking for doesn't exist.</p>
          <Button as={Link} to="/">
            Go Home
          </Button>
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
      {/* Custom Header for User Website */}
      <header
        className="border-b shadow-sm"
        style={{
          backgroundColor: website.customizations.colors.background,
          borderColor: website.customizations.colors.secondary + '20'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Website Logo/Name */}
            <div className="flex items-center">
              <h1
                className="text-2xl font-bold"
                style={{
                  color: website.customizations.colors.primary,
                  fontFamily: website.customizations.typography.headingFont
                }}
              >
                {website.name}
              </h1>
            </div>

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
                className="hover:opacity-75 transition-opacity"
                style={{ color: website.customizations.colors.text }}
              >
                Contact
              </Link>
            </nav>

            {/* Cart and Get Started */}
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

      {/* Template-based Content */}
      <TemplateRenderer
        website={website}
        products={products}
        blogs={blogs}
        onAddToCart={handleAddToCart}
      />

      {/* Footer */}
      <footer
        className="py-12 border-t"
        style={{
          backgroundColor: website.customizations.colors.secondary + '10',
          borderColor: website.customizations.colors.secondary + '30'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Website Info */}
            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{
                  color: website.customizations.colors.primary,
                  fontFamily: website.customizations.typography.headingFont
                }}
              >
                {website.name}
              </h3>
              <p style={{ color: website.customizations.colors.text }}>
                {website.description}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: website.customizations.colors.primary }}
              >
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to={`/${slug}`}
                    className="hover:opacity-75 transition-opacity"
                    style={{ color: website.customizations.colors.text }}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${slug}/about`}
                    className="hover:opacity-75 transition-opacity"
                    style={{ color: website.customizations.colors.text }}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${slug}/blogs`}
                    className="hover:opacity-75 transition-opacity"
                    style={{ color: website.customizations.colors.text }}
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${slug}/contact`}
                    className="hover:opacity-75 transition-opacity"
                    style={{ color: website.customizations.colors.text }}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: website.customizations.colors.primary }}
              >
                Contact
              </h3>
              <div className="space-y-2">
                {website.aboutContent?.contactInfo?.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" style={{ color: website.customizations.colors.secondary }} />
                    <span style={{ color: website.customizations.colors.text }}>
                      {website.aboutContent.contactInfo.email}
                    </span>
                  </div>
                )}
                {website.aboutContent?.contactInfo?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" style={{ color: website.customizations.colors.secondary }} />
                    <span style={{ color: website.customizations.colors.text }}>
                      {website.aboutContent.contactInfo.phone}
                    </span>
                  </div>
                )}
                {website.aboutContent?.contactInfo?.address && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" style={{ color: website.customizations.colors.secondary }} />
                    <span style={{ color: website.customizations.colors.text }}>
                      {website.aboutContent.contactInfo.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center" style={{ borderColor: website.customizations.colors.secondary + '30' }}>
            <p style={{ color: website.customizations.colors.secondary }}>
              © 2024 {website.name}. All rights reserved. Powered by Corporate Portal.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Main UserWebsite component with cart provider
function UserWebsite() {
  const { slug } = useParams()
  
  return (
    <WebsiteCartProvider websiteSlug={slug}>
      <UserWebsiteContent />
    </WebsiteCartProvider>
  )
}

export default UserWebsite