import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { websiteService } from '../services/websiteService'
import { homepageTemplates, getTemplateById, getDefaultTemplateContent } from '../utils/templates'
import { 
  Save, 
  Eye, 
  Palette, 
  Type, 
  Layout, 
  Globe,
  Settings,
  ArrowLeft,
  Check,
  X,
  Plus,
  Image as ImageIcon,
  ShoppingBag,
  BookOpen,
  Users,
  Mail
} from 'lucide-react'

function WebsiteBuilder() {
  const { dispatch } = useApp()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const websiteId = searchParams.get('id')
  const isEditing = !!websiteId

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [slugAvailable, setSlugAvailable] = useState(null)
  const [checkingSlug, setCheckingSlug] = useState(false)

  const [websiteData, setWebsiteData] = useState({
    name: '',
    slug: '',
    description: '',
    category: 'business',
    template: {
      id: '',
      name: '',
      metadata: {}
    },
    templateContent: {},
    theme: 'modern',
    aboutContent: {
      companyStory: '',
      whyCreated: '',
      mission: '',
      vision: '',
      features: [''],
      teamInfo: '',
      contactInfo: {
        email: '',
        phone: '',
        address: ''
      }
    },
    customizations: {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#059669',
        text: '#1f2937',
        background: '#ffffff'
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter'
      },
      layout: {
        style: 'modern',
        headerStyle: 'centered'
      }
    },
    seo: {
      title: '',
      description: '',
      keywords: ''
    },
    status: 'draft'
  })

  const themes = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and contemporary design',
      colors: { primary: '#3b82f6', secondary: '#64748b' },
      preview: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Modern'
    },
    {
      id: 'corporate',
      name: 'Corporate',
      description: 'Professional business theme',
      colors: { primary: '#1f2937', secondary: '#6b7280' },
      preview: 'https://via.placeholder.com/300x200/1f2937/ffffff?text=Corporate'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Artistic and vibrant design',
      colors: { primary: '#7c3aed', secondary: '#a855f7' },
      preview: 'https://via.placeholder.com/300x200/7c3aed/ffffff?text=Creative'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and elegant layout',
      colors: { primary: '#000000', secondary: '#6b7280' },
      preview: 'https://via.placeholder.com/300x200/000000/ffffff?text=Minimal'
    }
  ]

  useEffect(() => {
    if (isEditing) {
      loadWebsiteData()
    }
  }, [websiteId])

  const loadWebsiteData = async () => {
    setLoading(true)
    try {
      // Load existing website data from API
      const websitesResult = await websiteService.getWebsites()
      if (!websitesResult.success) {
        throw new Error(websitesResult.error)
      }
      
      const existingWebsite = websitesResult.data.find(site => site.id.toString() === websiteId)
      
      if (!existingWebsite) {
        dispatch({ type: 'SET_ERROR', payload: 'Website not found' })
        navigate('/my-websites')
        return
      }

      // Map API data to frontend format
      const mappedWebsite = {
        ...existingWebsite,
        template: {
          id: existingWebsite.template_id || '',
          name: existingWebsite.template_name || '',
          metadata: existingWebsite.template_metadata || {}
        },
        templateContent: {
          heroTitle: existingWebsite.heroTitle || '',
          heroDescription: existingWebsite.heroDescription || '',
          heroImage: existingWebsite.heroImage || '',
          heroButtonText: existingWebsite.heroButtonText || '',
          productSectionTitle: existingWebsite.productSectionTitle || '',
          blogSectionTitle: existingWebsite.blogSectionTitle || '',
          services: existingWebsite.services || [''],
          contentBlocks: existingWebsite.contentBlocks || []
        },
        aboutContent: {
          companyStory: existingWebsite.companyStory || '',
          whyCreated: existingWebsite.whyCreated || '',
          mission: existingWebsite.mission || '',
          vision: existingWebsite.vision || '',
          features: existingWebsite.features || [''],
          teamInfo: existingWebsite.teamInfo || '',
          contactInfo: existingWebsite.contactInfo || { email: '', phone: '', address: '' }
        },
        seo: {
          title: existingWebsite.seoTitle || '',
          description: existingWebsite.seoDescription || '',
          keywords: existingWebsite.seoKeywords || ''
        }
      }

      setWebsiteData(mappedWebsite)
      setCurrentStep(1) // Start from step 1 for editing
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load website data' })
    } finally {
      setLoading(false)
    }
  }

  const checkSlugAvailability = async (slug) => {
    if (!slug || slug.length < 3) {
      setSlugAvailable(null)
      return
    }

    setCheckingSlug(true)
    try {
      // Mock slug availability check
      await new Promise(resolve => setTimeout(resolve, 500))
      const unavailableSlug = ['admin', 'api', 'www', 'mail', 'ftp', 'test']
      setSlugAvailable(!unavailableSlug.includes(slug.toLowerCase()))
    } catch (error) {
      setSlugAvailable(null)
    } finally {
      setCheckingSlug(false)
    }
  }

  const handleSlugChange = (value) => {
    const cleanSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-')
    setWebsiteData({ ...websiteData, slug: cleanSlug })
    checkSlugAvailability(cleanSlug)
  }

  const handleSave = async (publish = false) => {
    setSaving(true)
    try {
      // Map frontend data to API format
      const saveData = {
        name: websiteData.name,
        slug: websiteData.slug,
        description: websiteData.description,
        category: websiteData.category,
        logoUrl: websiteData.logoUrl || '',
        
        // Template information
        template_id: websiteData.template.id,
        template_name: websiteData.template.name,
        template_metadata: websiteData.template.metadata,
        
        // Template content
        heroTitle: websiteData.templateContent.heroTitle || '',
        heroDescription: websiteData.templateContent.heroDescription || '',
        heroImage: websiteData.templateContent.heroImage || '',
        heroButtonText: websiteData.templateContent.heroButtonText || '',
        productSectionTitle: websiteData.templateContent.productSectionTitle || '',
        blogSectionTitle: websiteData.templateContent.blogSectionTitle || '',
        services: websiteData.templateContent.services || [],
        contentBlocks: websiteData.templateContent.contentBlocks || [],
        
        // Theme and customizations
        theme: websiteData.customizations,
        customizations: websiteData.customizations,
        
        // About content
        companyStory: websiteData.aboutContent.companyStory || '',
        whyCreated: websiteData.aboutContent.whyCreated || '',
        mission: websiteData.aboutContent.mission || '',
        vision: websiteData.aboutContent.vision || '',
        features: websiteData.aboutContent.features || [],
        teamInfo: websiteData.aboutContent.teamInfo || [],
        contactInfo: websiteData.aboutContent.contactInfo || {},
        
        // SEO
        seoTitle: websiteData.seo.title || '',
        seoDescription: websiteData.seo.description || '',
        seoKeywords: websiteData.seo.keywords || '',
        
        status: publish ? 'published' : 'draft'
      }

      let result
      if (isEditing) {
        result = await websiteService.updateWebsite(websiteId, saveData)
      } else {
        result = await websiteService.createWebsite(saveData)
      }
      
      if (!result.success) {
        throw new Error(result.error)
      }
      
      dispatch({ type: 'SET_ERROR', payload: null })
      
      if (publish) {
        navigate(`/${websiteData.slug}`)
      } else {
        navigate('/my-websites')
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save website' })
    } finally {
      setSaving(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/my-websites')}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit Website' : 'Create New Website'}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave(false)}
                loading={saving}
              >
                <Save className="h-4 w-4 mr-1" />
                Save Draft
              </Button>
              
              <Button
                size="sm"
                onClick={() => handleSave(true)}
                loading={saving}
                disabled={!websiteData.name || !websiteData.slug || slugAvailable === false}
              >
                {isEditing ? 'Update & Publish' : 'Create & Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step ? <Check className="h-4 w-4" /> : step}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {step === 1 ? 'Basic Info' : step === 2 ? 'Template' : step === 3 ? 'Content' : step === 4 ? 'About Page' : step === 5 ? 'Theme' : 'Customize'}
                </span>
                {step < 6 && <div className="w-12 h-px bg-gray-300 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="space-y-6">
                <Input
                  label="Website Name"
                  value={websiteData.name}
                  onChange={(e) => setWebsiteData({ ...websiteData, name: e.target.value })}
                  placeholder="My Awesome Store"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={websiteData.logoUrl || ''}
                    onChange={(e) => setWebsiteData({ ...websiteData, logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Add a logo to make your website more professional. If no logo is provided, your website name will be displayed.
                  </p>
                  {websiteData.logoUrl && (
                    <div className="mt-2">
                      <img 
                        src={websiteData.logoUrl} 
                        alt="Logo preview" 
                        className="h-12 w-auto border border-gray-200 rounded"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website URL
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">yoursite.com/</span>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={websiteData.slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        placeholder="my-awesome-store"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      {checkingSlug && (
                        <div className="absolute right-3 top-2.5">
                          <LoadingSpinner size="sm" />
                        </div>
                      )}
                      {slugAvailable === true && (
                        <Check className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                      )}
                      {slugAvailable === false && (
                        <X className="absolute right-3 top-2.5 h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                  {slugAvailable === false && (
                    <p className="mt-1 text-sm text-red-600">This URL is not available</p>
                  )}
                  {slugAvailable === true && (
                    <p className="mt-1 text-sm text-green-600">This URL is available</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={websiteData.description}
                    onChange={(e) => setWebsiteData({ ...websiteData, description: e.target.value })}
                    placeholder="Brief description of your website"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={websiteData.category}
                    onChange={(e) => setWebsiteData({ ...websiteData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="business">Business</option>
                    <option value="fashion">Fashion</option>
                    <option value="technology">Technology</option>
                    <option value="food">Food & Beverage</option>
                    <option value="health">Health & Wellness</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Template Selection */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Homepage Template</h2>
              <p className="text-gray-600 mb-8">Select a template that best fits your website's purpose and style.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {homepageTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      websiteData.template.id === template.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setWebsiteData({ 
                        ...websiteData, 
                        template: {
                          id: template.id,
                          name: template.name,
                          metadata: template.metadata
                        },
                        templateContent: getDefaultTemplateContent(template.id)
                      })
                    }}
                  >
                    <img
                      src={template.preview}
                      alt={template.name}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                    <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                    
                    {/* Template Features */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        template.category === 'ecommerce' ? 'bg-blue-100 text-blue-800' :
                        template.category === 'business' ? 'bg-green-100 text-green-800' :
                        template.category === 'blog' ? 'bg-purple-100 text-purple-800' :
                        template.category === 'portfolio' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {template.category}
                      </span>
                      {template.metadata.showProducts && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Products
                        </span>
                      )}
                      {template.metadata.showBlogs && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          Blogs
                        </span>
                      )}
                    </div>

                    {/* Template Sections */}
                    <div className="text-xs text-gray-500">
                      Sections: {template.sections.join(', ')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Template Info */}
              {websiteData.template.id && (
                <div className="mt-8 p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <h4 className="font-semibold text-primary-900 mb-2">
                    Selected: {websiteData.template.name}
                  </h4>
                  <p className="text-sm text-primary-700">
                    {getTemplateById(websiteData.template.id)?.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Template Content */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Customize {websiteData.template.name || 'Template'} Content
              </h2>
              <p className="text-gray-600 mb-8">
                Fill in the content for your homepage template.
              </p>

              <div className="space-y-6">
                {/* Hero Section Content */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Layout className="h-5 w-5 mr-2" />
                    Hero Section
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Hero Title"
                      value={websiteData.templateContent.heroTitle || ''}
                      onChange={(e) => setWebsiteData({
                        ...websiteData,
                        templateContent: {
                          ...websiteData.templateContent,
                          heroTitle: e.target.value
                        }
                      })}
                      placeholder="Welcome to Our Store"
                    />
                    
                    <Input
                      label="Hero Button Text"
                      value={websiteData.templateContent.heroButtonText || ''}
                      onChange={(e) => setWebsiteData({
                        ...websiteData,
                        templateContent: {
                          ...websiteData.templateContent,
                          heroButtonText: e.target.value
                        }
                      })}
                      placeholder="Get Started"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hero Description
                    </label>
                    <textarea
                      value={websiteData.templateContent.heroDescription || ''}
                      onChange={(e) => setWebsiteData({
                        ...websiteData,
                        templateContent: {
                          ...websiteData.templateContent,
                          heroDescription: e.target.value
                        }
                      })}
                      placeholder="Describe your business and what makes it special"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="mt-4">
                    <Input
                      label="Hero Image URL"
                      value={websiteData.templateContent.heroImage || ''}
                      onChange={(e) => setWebsiteData({
                        ...websiteData,
                        templateContent: {
                          ...websiteData.templateContent,
                          heroImage: e.target.value
                        }
                      })}
                      placeholder="https://example.com/hero-image.jpg"
                    />
                  </div>
                </div>

                {/* Products Section (if template supports it) */}
                {websiteData.template.metadata.showProducts && (
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Products Section
                    </h3>
                    
                    <Input
                      label="Products Section Title"
                      value={websiteData.templateContent.productSectionTitle || ''}
                      onChange={(e) => setWebsiteData({
                        ...websiteData,
                        templateContent: {
                          ...websiteData.templateContent,
                          productSectionTitle: e.target.value
                        }
                      })}
                      placeholder="Featured Products"
                    />
                    
                    <p className="text-sm text-blue-700 mt-2">
                      This template will show {websiteData.template.metadata.productsCount} products from your store.
                    </p>
                  </div>
                )}

                {/* Blog Section (if template supports it) */}
                {websiteData.template.metadata.showBlogs && (
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Type className="h-5 w-5 mr-2" />
                      Blog Section
                    </h3>
                    
                    <Input
                      label="Blog Section Title"
                      value={websiteData.templateContent.blogSectionTitle || ''}
                      onChange={(e) => setWebsiteData({
                        ...websiteData,
                        templateContent: {
                          ...websiteData.templateContent,
                          blogSectionTitle: e.target.value
                        }
                      })}
                      placeholder="Latest Posts"
                    />
                    
                    <p className="text-sm text-purple-700 mt-2">
                      This template will show {websiteData.template.metadata.blogsCount} recent blog posts.
                    </p>
                  </div>
                )}

                {/* Services Section (for business templates) */}
                {(websiteData.template.id === 'text-image-split' || websiteData.template.id === 'business-professional' || websiteData.template.id === 'hero-products' || websiteData.template.id === 'hero-blogs' || websiteData.template.id === 'full-width-hero' || websiteData.template.id === 'centered-content') && (
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>
                    
                    <div className="space-y-2">
                      {(websiteData.templateContent.services || ['']).map((service, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={service}
                            onChange={(e) => {
                              const newServices = [...(websiteData.templateContent.services || [''])]
                              newServices[index] = e.target.value
                              setWebsiteData({
                                ...websiteData,
                                templateContent: {
                                  ...websiteData.templateContent,
                                  services: newServices
                                }
                              })
                            }}
                            placeholder={`Service ${index + 1}`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          {(websiteData.templateContent.services || ['']).length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newServices = (websiteData.templateContent.services || ['']).filter((_, i) => i !== index)
                                setWebsiteData({
                                  ...websiteData,
                                  templateContent: {
                                    ...websiteData.templateContent,
                                    services: newServices
                                  }
                                })
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setWebsiteData({
                            ...websiteData,
                            templateContent: {
                              ...websiteData.templateContent,
                              services: [...(websiteData.templateContent.services || ['']), '']
                            }
                          })
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Service
                      </Button>
                    </div>
                  </div>
                )}

                {/* Content Blocks (for minimal template) */}
                {websiteData.template.id === 'minimal-clean' && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Blocks</h3>
                    
                    <div className="space-y-4">
                      {(websiteData.templateContent.contentBlocks || [{ title: '', description: '' }]).map((block, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Block Title"
                              value={block.title}
                              onChange={(e) => {
                                const newBlocks = [...(websiteData.templateContent.contentBlocks || [])]
                                newBlocks[index] = { ...newBlocks[index], title: e.target.value }
                                setWebsiteData({
                                  ...websiteData,
                                  templateContent: {
                                    ...websiteData.templateContent,
                                    contentBlocks: newBlocks
                                  }
                                })
                              }}
                              placeholder="Quality"
                            />
                            
                            <div className="flex items-end">
                              {(websiteData.templateContent.contentBlocks || []).length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newBlocks = (websiteData.templateContent.contentBlocks || []).filter((_, i) => i !== index)
                                    setWebsiteData({
                                      ...websiteData,
                                      templateContent: {
                                        ...websiteData.templateContent,
                                        contentBlocks: newBlocks
                                      }
                                    })
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              value={block.description}
                              onChange={(e) => {
                                const newBlocks = [...(websiteData.templateContent.contentBlocks || [])]
                                newBlocks[index] = { ...newBlocks[index], description: e.target.value }
                                setWebsiteData({
                                  ...websiteData,
                                  templateContent: {
                                    ...websiteData.templateContent,
                                    contentBlocks: newBlocks
                                  }
                                })
                              }}
                              placeholder="We deliver exceptional quality in everything we do"
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setWebsiteData({
                            ...websiteData,
                            templateContent: {
                              ...websiteData.templateContent,
                              contentBlocks: [...(websiteData.templateContent.contentBlocks || []), { title: '', description: '' }]
                            }
                          })
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Content Block
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: About Page Content */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About Page Content</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Story
                  </label>
                  <textarea
                    value={websiteData.aboutContent.companyStory}
                    onChange={(e) => setWebsiteData({ 
                      ...websiteData, 
                      aboutContent: { ...websiteData.aboutContent, companyStory: e.target.value }
                    })}
                    placeholder="Tell your company's story - how it started, your journey..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Why Did You Create This Business?
                  </label>
                  <textarea
                    value={websiteData.aboutContent.whyCreated}
                    onChange={(e) => setWebsiteData({ 
                      ...websiteData, 
                      aboutContent: { ...websiteData.aboutContent, whyCreated: e.target.value }
                    })}
                    placeholder="What motivated you to start this business? What problem are you solving?"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mission Statement
                    </label>
                    <textarea
                      value={websiteData.aboutContent.mission}
                      onChange={(e) => setWebsiteData({ 
                        ...websiteData, 
                        aboutContent: { ...websiteData.aboutContent, mission: e.target.value }
                      })}
                      placeholder="What is your company's mission?"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vision Statement
                    </label>
                    <textarea
                      value={websiteData.aboutContent.vision}
                      onChange={(e) => setWebsiteData({ 
                        ...websiteData, 
                        aboutContent: { ...websiteData.aboutContent, vision: e.target.value }
                      })}
                      placeholder="What is your long-term vision?"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Features & Services
                  </label>
                  <div className="space-y-2">
                    {websiteData.aboutContent.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...websiteData.aboutContent.features]
                            newFeatures[index] = e.target.value
                            setWebsiteData({ 
                              ...websiteData, 
                              aboutContent: { ...websiteData.aboutContent, features: newFeatures }
                            })
                          }}
                          placeholder={`Feature ${index + 1}`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {websiteData.aboutContent.features.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newFeatures = websiteData.aboutContent.features.filter((_, i) => i !== index)
                              setWebsiteData({ 
                                ...websiteData, 
                                aboutContent: { ...websiteData.aboutContent, features: newFeatures }
                              })
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setWebsiteData({ 
                          ...websiteData, 
                          aboutContent: { 
                            ...websiteData.aboutContent, 
                            features: [...websiteData.aboutContent.features, '']
                          }
                        })
                      }}
                    >
                      Add Feature
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Information
                  </label>
                  <textarea
                    value={websiteData.aboutContent.teamInfo}
                    onChange={(e) => setWebsiteData({ 
                      ...websiteData, 
                      aboutContent: { ...websiteData.aboutContent, teamInfo: e.target.value }
                    })}
                    placeholder="Tell about your team, founders, key members..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      value={websiteData.aboutContent.contactInfo.email}
                      onChange={(e) => setWebsiteData({ 
                        ...websiteData, 
                        aboutContent: { 
                          ...websiteData.aboutContent, 
                          contactInfo: { ...websiteData.aboutContent.contactInfo, email: e.target.value }
                        }
                      })}
                      placeholder="contact@company.com"
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={websiteData.aboutContent.contactInfo.phone}
                      onChange={(e) => setWebsiteData({ 
                        ...websiteData, 
                        aboutContent: { 
                          ...websiteData.aboutContent, 
                          contactInfo: { ...websiteData.aboutContent.contactInfo, phone: e.target.value }
                        }
                      })}
                      placeholder="+1 (555) 123-4567"
                    />
                    <Input
                      label="Address"
                      value={websiteData.aboutContent.contactInfo.address}
                      onChange={(e) => setWebsiteData({ 
                        ...websiteData, 
                        aboutContent: { 
                          ...websiteData.aboutContent, 
                          contactInfo: { ...websiteData.aboutContent.contactInfo, address: e.target.value }
                        }
                      })}
                      placeholder="123 Business St, City"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Theme Selection */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Theme</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      websiteData.theme === theme.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setWebsiteData({ 
                      ...websiteData, 
                      theme: theme.id,
                      customizations: {
                        ...websiteData.customizations,
                        colors: {
                          ...websiteData.customizations.colors,
                          primary: theme.colors.primary,
                          secondary: theme.colors.secondary
                        }
                      }
                    })}
                  >
                    <img
                      src={theme.preview}
                      alt={theme.name}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                    <h3 className="font-semibold text-gray-900 mb-1">{theme.name}</h3>
                    <p className="text-sm text-gray-600">{theme.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: SEO Settings */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">SEO Settings</h2>
              
              <div className="space-y-6">
                <Input
                  label="Page Title"
                  value={websiteData.seo.title}
                  onChange={(e) => setWebsiteData({ 
                    ...websiteData, 
                    seo: { ...websiteData.seo, title: e.target.value }
                  })}
                  placeholder="Your Website - Best Products Online"
                  helperText="This will appear in search results and browser tabs"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={websiteData.seo.description}
                    onChange={(e) => setWebsiteData({ 
                      ...websiteData, 
                      seo: { ...websiteData.seo, description: e.target.value }
                    })}
                    placeholder="Brief description for search engines"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Recommended: 150-160 characters
                  </p>
                </div>
                
                <Input
                  label="Keywords"
                  value={websiteData.seo.keywords}
                  onChange={(e) => setWebsiteData({ 
                    ...websiteData, 
                    seo: { ...websiteData.seo, keywords: e.target.value }
                  })}
                  placeholder="keyword1, keyword2, keyword3"
                  helperText="Separate keywords with commas"
                />
              </div>
            </div>
          )}

          {/* Step 5: Customization */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customize Design</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Color Customization */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Colors
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(websiteData.customizations.colors).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => setWebsiteData({
                            ...websiteData,
                            customizations: {
                              ...websiteData.customizations,
                              colors: {
                                ...websiteData.customizations.colors,
                                [key]: e.target.value
                              }
                            }
                          })}
                          className="w-12 h-10 rounded-md border border-gray-300"
                        />
                        <label className="text-sm font-medium text-gray-700 capitalize">
                          {key}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Type className="h-5 w-5 mr-2" />
                    Typography
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Heading Font
                      </label>
                      <select
                        value={websiteData.customizations.typography.headingFont}
                        onChange={(e) => setWebsiteData({
                          ...websiteData,
                          customizations: {
                            ...websiteData.customizations,
                            typography: {
                              ...websiteData.customizations.typography,
                              headingFont: e.target.value
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Poppins">Poppins</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Body Font
                      </label>
                      <select
                        value={websiteData.customizations.typography.bodyFont}
                        onChange={(e) => setWebsiteData({
                          ...websiteData,
                          customizations: {
                            ...websiteData.customizations,
                            typography: {
                              ...websiteData.customizations.typography,
                              bodyFont: e.target.value
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Poppins">Poppins</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                <div 
                  className="border border-gray-200 rounded-lg p-6"
                  style={{
                    backgroundColor: websiteData.customizations.colors.background,
                    color: websiteData.customizations.colors.text,
                    fontFamily: websiteData.customizations.typography.bodyFont
                  }}
                >
                  <h1 
                    style={{ 
                      color: websiteData.customizations.colors.primary,
                      fontFamily: websiteData.customizations.typography.headingFont
                    }}
                    className="text-2xl font-bold mb-2"
                  >
                    {websiteData.name || 'Your Website Name'}
                  </h1>
                  <p className="mb-4">{websiteData.description || 'Your website description will appear here.'}</p>
                  <button
                    style={{ backgroundColor: websiteData.customizations.colors.primary }}
                    className="px-4 py-2 text-white rounded-lg"
                  >
                    Sample Button
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < 6 ? (
              <Button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && (!websiteData.name || !websiteData.slug || slugAvailable === false)) ||
                  (currentStep === 2 && !websiteData.template.id) ||
                  (currentStep === 5 && !websiteData.theme)
                }
              >
                Next
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleSave(false)}
                  loading={saving}
                >
                  Save Draft
                </Button>
                <Button
                  onClick={() => handleSave(true)}
                  loading={saving}
                >
                  {isEditing ? 'Update & Publish' : 'Create & Publish'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebsiteBuilder