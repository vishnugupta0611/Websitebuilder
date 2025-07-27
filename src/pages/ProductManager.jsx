import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Upload, 
  X, 
  Plus,
  Package,
  DollarSign,
  Tag,
  Image as ImageIcon
} from 'lucide-react'

function ProductManager() {
  const { dispatch } = useApp()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const productId = searchParams.get('id')
  const isEditing = !!productId

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [websites, setWebsites] = useState([])
  const [selectedImages, setSelectedImages] = useState([])

  const [productData, setProductData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    category: '',
    websiteId: '',
    inventory: '',
    sku: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    images: [],
    variants: [],
    seo: {
      title: '',
      description: '',
      keywords: ''
    },
    status: 'draft'
  })

  const [newVariant, setNewVariant] = useState({
    name: '',
    price: '',
    inventory: '',
    sku: ''
  })

  useEffect(() => {
    loadInitialData()
  }, [productId])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      
      // Load user websites from localStorage
      const userWebsites = JSON.parse(localStorage.getItem('userWebsites') || '[]')
      const publishedWebsites = userWebsites.filter(site => site.status === 'published')
      setWebsites(publishedWebsites)

      // Load existing product if editing
      if (isEditing) {
        const userProducts = JSON.parse(localStorage.getItem('userProducts') || '[]')
        const existingProduct = userProducts.find(product => product.id === productId)
        
        if (existingProduct) {
          setProductData(existingProduct)
        } else {
          dispatch({ type: 'SET_ERROR', payload: 'Product not found' })
          navigate('/my-products')
          return
        }
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load product data' })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const newImage = event.target.result
        setProductData(prev => ({
          ...prev,
          images: [...prev.images, newImage]
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setProductData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const addVariant = () => {
    if (newVariant.name && newVariant.price) {
      setProductData(prev => ({
        ...prev,
        variants: [...prev.variants, { ...newVariant, id: Date.now().toString() }]
      }))
      setNewVariant({ name: '', price: '', inventory: '', sku: '' })
    }
  }

  const removeVariant = (variantId) => {
    setProductData(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v.id !== variantId)
    }))
  }

  const handleSave = async (publish = false) => {
    setSaving(true)
    try {
      const saveData = {
        ...productData,
        id: productData.id || `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: publish ? 'published' : 'draft',
        price: parseFloat(productData.price),
        originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
        inventory: parseInt(productData.inventory),
        weight: parseFloat(productData.weight) || null,
        createdAt: productData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Save to localStorage
      const existingProducts = JSON.parse(localStorage.getItem('userProducts') || '[]')
      
      if (isEditing) {
        // Update existing product
        const updatedProducts = existingProducts.map(product => 
          product.id === productData.id ? saveData : product
        )
        localStorage.setItem('userProducts', JSON.stringify(updatedProducts))
      } else {
        // Add new product
        existingProducts.push(saveData)
        localStorage.setItem('userProducts', JSON.stringify(existingProducts))
      }
      
      dispatch({ type: 'SET_ERROR', payload: null })
      dispatch({ type: 'SET_SUCCESS', payload: `Product ${isEditing ? 'updated' : 'created'} successfully!` })
      navigate('/my-products')
    } catch (error) {
      console.error('Error saving product:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save product' })
    } finally {
      setSaving(false)
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
                onClick={() => navigate('/my-products')}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Products
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit Product' : 'Add New Product'}
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
                disabled={!productData.name || !productData.price || !productData.websiteId}
              >
                {isEditing ? 'Update & Publish' : 'Save & Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Basic Information
              </h2>
              
              <div className="space-y-4">
                <Input
                  label="Product Name"
                  value={productData.name}
                  onChange={(e) => {
                    const name = e.target.value
                    const slug = name.toLowerCase()
                      .replace(/[^a-z0-9\s-]/g, '')
                      .replace(/\s+/g, '-')
                      .replace(/-+/g, '-')
                      .trim()
                    setProductData({ ...productData, name, slug })
                  }}
                  placeholder="Enter product name"
                />
                
                <Input
                  label="Product Slug"
                  value={productData.slug}
                  onChange={(e) => setProductData({ ...productData, slug: e.target.value })}
                  placeholder="product-url-slug"
                  helperText="This will be used in the product URL"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  <textarea
                    value={productData.shortDescription}
                    onChange={(e) => setProductData({ ...productData, shortDescription: e.target.value })}
                    placeholder="Brief product description for listings"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Description
                  </label>
                  <textarea
                    value={productData.description}
                    onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                    placeholder="Detailed product description"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Pricing & Inventory
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Price"
                  type="number"
                  step="0.01"
                  value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                  placeholder="0.00"
                />
                
                <Input
                  label="Original Price (Optional)"
                  type="number"
                  step="0.01"
                  value={productData.originalPrice}
                  onChange={(e) => setProductData({ ...productData, originalPrice: e.target.value })}
                  placeholder="0.00"
                  helperText="For showing discounts"
                />
                
                <Input
                  label="Inventory Quantity"
                  type="number"
                  value={productData.inventory}
                  onChange={(e) => setProductData({ ...productData, inventory: e.target.value })}
                  placeholder="0"
                />
                
                <Input
                  label="SKU"
                  value={productData.sku}
                  onChange={(e) => setProductData({ ...productData, sku: e.target.value })}
                  placeholder="PROD-001"
                />
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Product Images
              </h2>
              
              <div className="space-y-4">
                {/* Image Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop images here, or click to select
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('image-upload').click()}
                  >
                    Choose Images
                  </Button>
                </div>

                {/* Image Preview */}
                {productData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {productData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Variants */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Product Variants
              </h2>
              
              {/* Add New Variant */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <Input
                  label="Variant Name"
                  value={newVariant.name}
                  onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                  placeholder="Size - Color"
                />
                <Input
                  label="Price"
                  type="number"
                  step="0.01"
                  value={newVariant.price}
                  onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                  placeholder="0.00"
                />
                <Input
                  label="Inventory"
                  type="number"
                  value={newVariant.inventory}
                  onChange={(e) => setNewVariant({ ...newVariant, inventory: e.target.value })}
                  placeholder="0"
                />
                <div className="flex items-end">
                  <Button onClick={addVariant} size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Variant
                  </Button>
                </div>
              </div>

              {/* Existing Variants */}
              {productData.variants.length > 0 && (
                <div className="space-y-2">
                  {productData.variants.map((variant) => (
                    <div key={variant.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="font-medium text-gray-900">{variant.name}</p>
                          <p className="text-sm text-gray-500">SKU: {variant.sku}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Price</p>
                          <p className="font-medium">${variant.price}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Inventory</p>
                          <p className="font-medium">{variant.inventory} units</p>
                        </div>
                        <div className="flex items-center justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVariant(variant.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Website Selection */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Website</h3>
              <select
                value={productData.websiteId}
                onChange={(e) => setProductData({ ...productData, websiteId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Website</option>
                {websites.map(website => (
                  <option key={website.id} value={website.id}>
                    {website.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category</h3>
              <select
                value={productData.category}
                onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Category</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="electronics">Electronics</option>
                <option value="home">Home & Garden</option>
                <option value="sports">Sports & Outdoors</option>
                <option value="books">Books</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Product Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
              <select
                value={productData.status}
                onChange={(e) => setProductData({ ...productData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO</h3>
              <div className="space-y-4">
                <Input
                  label="SEO Title"
                  value={productData.seo.title}
                  onChange={(e) => setProductData({ 
                    ...productData, 
                    seo: { ...productData.seo, title: e.target.value }
                  })}
                  placeholder="Product SEO title"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={productData.seo.description}
                    onChange={(e) => setProductData({ 
                      ...productData, 
                      seo: { ...productData.seo, description: e.target.value }
                    })}
                    placeholder="SEO description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <Input
                  label="Keywords"
                  value={productData.seo.keywords}
                  onChange={(e) => setProductData({ 
                    ...productData, 
                    seo: { ...productData.seo, keywords: e.target.value }
                  })}
                  placeholder="keyword1, keyword2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductManager