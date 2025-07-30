import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWebsiteCart } from '../../contexts/WebsiteCartContext'
import Button from '../ui/Button'
import Input from '../ui/Input'
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

function WebsiteCart({ website }) {
  const { cart, updateQuantity, removeFromCart, checkout, setWebsiteInfo } = useWebsiteCart()

  // Helper function to get product image URL - same as ProductCard component
  const getProductImageUrl = (item) => {
    // Use the same logic as ProductCard: product.images?.[0] first, then fallback
    const imageUrl = item.images?.[0] || item.product_image || item.image
    
    if (!imageUrl) {
      // Create a simple gray placeholder since via.placeholder.com is not accessible
      const svgPlaceholder = `data:image/svg+xml;base64,${btoa(`
        <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="200" fill="#f3f4f6"/>
          <text x="150" y="105" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle">Product Image</text>
        </svg>
      `)}`
      return svgPlaceholder
    }

    // If it's a relative URL, make it absolute (assuming it's from the backend)
    if (imageUrl.startsWith('/')) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
      return baseUrl.replace('/api', '') + imageUrl
    }

    return imageUrl
  }

  // All useState hooks must be called before any conditional returns
  const [showCheckout, setShowCheckout] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  })
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  // Set website info when component mounts
  useEffect(() => {
    if (website) {
      console.log('WebsiteCart: Setting website info:', {
        slug: website.slug,
        id: website.id,
        name: website.name
      })
      setWebsiteInfo({
        slug: website.slug,
        id: website.id,
        name: website.name
      })
    }
  }, [website, setWebsiteInfo])

  // Debug logging
  console.log('WebsiteCart rendered:', {
    website: website?.name,
    websiteSlug: website?.slug,
    cartItems: cart?.items?.length || 0,
    cartTotal: cart?.total || 0,
    cartLoading: cart?.loading,
    cartWebsiteSlug: cart?.websiteSlug,
    cartWebsiteName: cart?.websiteName
  })

  // Debug cart items and their images
  if (cart?.items?.length > 0) {
    console.log('=== CART ITEMS DEBUG ===')
    cart.items.forEach((item, index) => {
      console.log(`Item ${index + 1}:`, {
        name: item.product_name || item.name,
        product_image: item.product_image,
        images: item.images,
        images_first: item.images?.[0],
        final_image_url: getProductImageUrl(item),
        fallback_used: !item.product_image && !item.images?.[0],
        full_item: item
      })
    })
    console.log('=== END DEBUG ===')
  }

  // Show loading state while cart is loading
  if (cart.loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                to={`/${website.slug}`}
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
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your cart...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleCheckout = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || 
        !customerInfo.address || !customerInfo.city || !customerInfo.zipCode) {
      alert('Please fill in all required fields.')
      return
    }

    // Validate cart has items
    if (!cart.items || cart.items.length === 0) {
      alert('Your cart is empty.')
      return
    }

    try {
      setCheckoutLoading(true)
      console.log('Starting checkout with customer info:', customerInfo)
      console.log('Cart items:', cart.items)
      
      const order = await checkout(customerInfo)
      console.log('Order placed successfully:', order)
      
      setOrderPlaced(true)
      setShowCheckout(false)

      // Reset form
      setCustomerInfo({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: ''
      })
    } catch (error) {
      console.error('Checkout error details:', error)
      
      // Show more specific error message
      let errorMessage = 'Error placing order. Please try again.'
      if (error.message) {
        errorMessage = `Error: ${error.message}`
      }
      
      alert(errorMessage)
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                to={`/${website.slug}`}
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
            </div>
          </div>
        </header>

        {/* Order Success */}
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your order. We'll process it shortly and send you a confirmation email.
            </p>
            <Button
              as={Link}
              to={`/${website.slug}`}
              style={{
                backgroundColor: website.customizations.colors.primary,
                color: 'white'
              }}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                to={`/${website.slug}`}
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
              <button
                onClick={() => setShowCheckout(false)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Cart
              </button>
            </div>
          </div>
        </header>

        {/* Checkout Form */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Information</h2>

              <form onSubmit={handleCheckout} className="space-y-4">
                <Input
                  label="Full Name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  required
                  icon={<User className="h-5 w-5 text-gray-400" />}
                />

                <Input
                  label="Email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  required
                  icon={<Mail className="h-5 w-5 text-gray-400" />}
                />

                <Input
                  label="Phone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  required
                  icon={<Phone className="h-5 w-5 text-gray-400" />}
                />

                <Input
                  label="Address"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  required
                  icon={<MapPin className="h-5 w-5 text-gray-400" />}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    value={customerInfo.city}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                    required
                  />
                  <Input
                    label="ZIP Code"
                    value={customerInfo.zipCode}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, zipCode: e.target.value })}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={checkoutLoading}
                  style={{
                    backgroundColor: website.customizations.colors.primary,
                    color: 'white'
                  }}
                >
                  {checkoutLoading ? 'Placing Order...' : `Place Order ($${cart.total.toFixed(2)})`}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.product_id || item.id} className="flex items-center space-x-4">
                    <img
                      src={getProductImageUrl(item)}
                      alt={item.product_name || item.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        console.log('Image failed to load:', e.target.src)
                        const svgPlaceholder = `data:image/svg+xml;base64,${btoa(`
                          <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
                            <rect width="64" height="64" fill="#f3f4f6"/>
                            <text x="32" y="36" font-family="Arial, sans-serif" font-size="10" fill="#9ca3af" text-anchor="middle">Product</text>
                          </svg>
                        `)}`
                        e.target.src = svgPlaceholder
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product_name || item.name}</h3>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      ${(parseFloat(item.product_price || item.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span style={{ color: website.customizations.colors.primary }}>
                    ${cart.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to={`/${website.slug}`}
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

            <Link
              to={`/${website.slug}`}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </header>

      {/* Cart Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {(!cart.items || cart.items.length === 0) ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <Button
              as={Link}
              to={`/${website.slug}`}
              style={{
                backgroundColor: website.customizations.colors.primary,
                color: 'white'
              }}
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div key={item.product_id || item.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={getProductImageUrl(item)}
                      alt={item.product_name || item.name}
                      className="w-20 h-20 object-cover rounded"
                      onError={(e) => {
                        console.log('Image failed to load:', e.target.src)
                        const svgPlaceholder = `data:image/svg+xml;base64,${btoa(`
                          <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
                            <rect width="80" height="80" fill="#f3f4f6"/>
                            <text x="40" y="45" font-family="Arial, sans-serif" font-size="12" fill="#9ca3af" text-anchor="middle">Product</text>
                          </svg>
                        `)}`
                        e.target.src = svgPlaceholder
                      }}
                    />

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{item.product_name || item.name}</h3>
                      <p className="text-gray-600">${parseFloat(item.product_price || item.price || 0).toFixed(2)} each</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product_id || item.id, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id || item.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ${(parseFloat(item.product_price || item.price || 0) * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.product_id || item.id)}
                        className="text-red-600 hover:text-red-700 mt-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6 h-fit">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span style={{ color: website.customizations.colors.primary }}>
                    ${cart.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => {
                  console.log('Debug - Cart state:', cart)
                  console.log('Debug - Website:', website)
                  setShowCheckout(true)
                }}
                className="w-full"
                style={{
                  backgroundColor: website.customizations.colors.primary,
                  color: 'white'
                }}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WebsiteCart;