import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { ecommerceService } from '../services/ecommerceService'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Minus, Plus } from 'lucide-react'

function ProductDetail() {
  const { id } = useParams()
  const { dispatch } = useApp()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const productData = await ecommerceService.getProductById(id)
        setProduct(productData)
        if (productData?.variants?.length > 0) {
          setSelectedVariant(productData.variants[0])
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load product' })
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id, dispatch])

  const handleAddToCart = () => {
    if (!product) return

    const cartItem = {
      id: product.id,
      name: product.name,
      price: selectedVariant?.price || product.price,
      image: product.images[0]?.url,
      quantity,
      variant: selectedVariant?.name || null,
      sku: product.sku
    }

    dispatch({ type: 'ADD_TO_CART', payload: cartItem })
  }

  const updateQuantity = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to="/products" className="text-primary-600 hover:text-primary-700">
            ← Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const currentPrice = selectedVariant?.price || product.price
  const currentInventory = selectedVariant?.inventory || product.inventory.available

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            to="/products" 
            className="text-primary-600 hover:text-primary-700 inline-flex items-center"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="aspect-w-1 aspect-h-1 mb-4">
              <img
                src={product.images[selectedImage]?.url}
                alt={product.images[selectedImage]?.alt}
                className="w-full h-96 object-cover rounded-lg shadow-sm"
              />
            </div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index 
                        ? 'border-primary-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-sm text-gray-500 mb-4">SKU: {product.sku}</p>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">(4.8) • 127 reviews</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-primary-600">
                  ${currentPrice.toFixed(2)}
                </span>
                {selectedVariant && selectedVariant.price !== product.price && (
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.categories.map(category => (
                  <span
                    key={category}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Options</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedVariant?.id === variant.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{variant.name}</div>
                      <div className="text-sm text-gray-600">${variant.price.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">
                        {variant.inventory > 0 ? `${variant.inventory} in stock` : 'Out of stock'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(quantity - 1)}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                <button
                  onClick={() => updateQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={quantity >= currentInventory}
                >
                  <Plus className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-500 ml-4">
                  {currentInventory} available
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 mb-6">
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={currentInventory === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {currentInventory > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              <div className="flex space-x-3">
                <Button variant="outline" size="lg" className="flex-1">
                  <Heart className="mr-2 h-5 w-5" />
                  Save for Later
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Availability:</span>
                <span className={`font-medium ${
                  currentInventory > 10 
                    ? 'text-green-600' 
                    : currentInventory > 0 
                    ? 'text-yellow-600' 
                    : 'text-red-600'
                }`}>
                  {currentInventory > 10 
                    ? 'In Stock' 
                    : currentInventory > 0 
                    ? `Only ${currentInventory} left` 
                    : 'Out of Stock'
                  }
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-gray-900">Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Returns:</span>
                <span className="text-gray-900">30-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button className="py-4 px-1 border-b-2 border-primary-500 font-medium text-sm text-primary-600">
                  Description
                </button>
                <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                  Specifications
                </button>
                <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                  Reviews (127)
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  This premium product is designed with attention to detail and crafted from high-quality materials. 
                  Perfect for professional use, it combines functionality with elegant design to meet the needs of 
                  modern business professionals.
                </p>
                <ul className="mt-4 space-y-2">
                  <li>Premium materials and construction</li>
                  <li>Professional design suitable for corporate environments</li>
                  <li>Durable and long-lasting</li>
                  <li>Backed by our quality guarantee</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail