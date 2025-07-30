import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { websiteService } from '../services/websiteService'
import { productService } from '../services/productService'
import Button from './ui/Button'

function NotFound() {
  const { slug, productId } = useParams()
  const navigate = useNavigate()
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateSuggestions()
  }, [slug, productId])

  const generateSuggestions = async () => {
    try {
      setLoading(true)
      const suggestions = []

      // If we have a slug and productId, try to find alternatives
      if (slug && productId) {
        // Check if the website exists but product doesn't
        const websiteResult = await websiteService.getWebsiteBySlug(slug)
        if (websiteResult.success) {
          // Website exists, get its products
          const productsResult = await productService.getProductsByWebsiteSlug(slug)
          if (productsResult.success && productsResult.data.length > 0) {
            suggestions.push({
              type: 'website_products',
              website: websiteResult.data,
              products: productsResult.data.slice(0, 3)
            })
          }
        } else {
          // Website doesn't exist, try to find similar websites
          // For now, we'll suggest going to the main portal
          suggestions.push({
            type: 'main_portal',
            message: `Website "${slug}" not found. Try the main portal instead.`
          })
        }
      }

      // If productId looks invalid (not a number), suggest format
      if (productId && isNaN(productId)) {
        suggestions.push({
          type: 'invalid_product_id',
          message: `Product ID "${productId}" is invalid. Product IDs should be numbers (e.g., 1, 2, 3).`
        })
      }

      setSuggestions(suggestions)
    } catch (error) {
      console.error('Error generating suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-2xl mx-auto p-8">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-6">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          
          {/* Current URL Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-yellow-800 mb-2">Current URL:</h3>
            <code className="text-sm text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
              {window.location.pathname}
            </code>
            
            {slug && productId && (
              <div className="mt-3 text-sm text-yellow-700">
                <p><strong>Website:</strong> {slug}</p>
                <p><strong>Product ID:</strong> {productId}</p>
                {isNaN(productId) && (
                  <p className="text-red-600 mt-2">
                    ⚠️ Product ID should be a number, not "{productId}"
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Loading suggestions */}
        {loading && (
          <div className="mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Looking for suggestions...</p>
          </div>
        )}

        {/* Suggestions */}
        {!loading && suggestions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Suggestions</h2>
            
            {suggestions.map((suggestion, index) => (
              <div key={index} className="mb-6">
                {suggestion.type === 'website_products' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-3">
                      Found website "{suggestion.website.name}"
                    </h3>
                    <p className="text-green-700 mb-4">
                      The website exists, but the product you're looking for might not. 
                      Here are some available products:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {suggestion.products.map(product => (
                        <div key={product.id} className="bg-white border border-green-200 rounded-lg p-3">
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">${product.price}</p>
                          <Link
                            to={`/${suggestion.website.slug}/products/${product.id}`}
                            className="text-sm text-green-600 hover:text-green-700 font-medium"
                          >
                            View Product →
                          </Link>
                        </div>
                      ))}
                    </div>
                    <Link
                      to={`/${suggestion.website.slug}`}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Visit {suggestion.website.name}
                    </Link>
                  </div>
                )}

                {suggestion.type === 'main_portal' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">
                      Website Not Found
                    </h3>
                    <p className="text-blue-700 mb-4">{suggestion.message}</p>
                    <Link
                      to="/"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Go to Main Portal
                    </Link>
                  </div>
                )}

                {suggestion.type === 'invalid_product_id' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-800 mb-3">
                      Invalid Product ID Format
                    </h3>
                    <p className="text-red-700 mb-4">{suggestion.message}</p>
                    <div className="text-sm text-red-600 bg-red-100 p-3 rounded">
                      <p><strong>Expected format:</strong> /website-slug/products/123</p>
                      <p><strong>Your URL:</strong> /{slug}/products/{productId}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Default actions */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </Button>
            
            <Button as={Link} to="/" className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </Button>
          </div>

          {/* Help text */}
          <div className="text-sm text-gray-500 mt-6">
            <p>Need help? The correct URL format for products is:</p>
            <code className="bg-gray-100 px-2 py-1 rounded text-gray-700">
              /website-slug/products/product-id
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound