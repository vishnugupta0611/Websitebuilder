import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { 
  Plus, 
  Globe, 
  Edit, 
  Eye, 
  Settings, 
  BarChart3, 
  ShoppingBag,
  ExternalLink,
  Calendar,
  Users
} from 'lucide-react'

function MyWebsites() {
  const { state, dispatch } = useApp()
  const [websites, setWebsites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserWebsites = async () => {
      try {
        setLoading(true)
        // Load websites from localStorage
        const userWebsites = JSON.parse(localStorage.getItem('userWebsites') || '[]')
        
        // Add mock stats for existing websites
        const websitesWithStats = userWebsites.map(website => ({
          ...website,
          productsCount: Math.floor(Math.random() * 20) + 5,
          visitorsCount: Math.floor(Math.random() * 2000) + 500,
          ordersCount: Math.floor(Math.random() * 50) + 10,
          customizations: {
            ...website.customizations,
            logo: `https://via.placeholder.com/100x40/${website.customizations.colors.primary.replace('#', '')}/ffffff?text=${website.name.split(' ')[0]}`
          }
        }))
        
        setWebsites(websitesWithStats)
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load websites' })
      } finally {
        setLoading(false)
      }
    }

    loadUserWebsites()
  }, [dispatch])

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Websites</h1>
              <p className="text-gray-600">Manage your custom websites and online stores</p>
            </div>
            <Button as={Link} to="/website-builder" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create New Website
            </Button>
          </div>
        </div>

        {/* Websites Grid */}
        {websites.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No websites yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first website to start selling products and sharing content
            </p>
            <Button as={Link} to="/website-builder" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Website
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {websites.map((website) => (
              <div key={website.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Website Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={website.customizations.logo}
                        alt={`${website.name} logo`}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{website.name}</h3>
                        <p className="text-sm text-gray-500">/{website.slug}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(website.status)}`}>
                      {website.status.charAt(0).toUpperCase() + website.status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{website.description}</p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <ShoppingBag className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-lg font-semibold text-gray-900">{website.productsCount}</span>
                      </div>
                      <p className="text-xs text-gray-500">Products</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-lg font-semibold text-gray-900">{website.visitorsCount}</span>
                      </div>
                      <p className="text-xs text-gray-500">Visitors</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <BarChart3 className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-lg font-semibold text-gray-900">{website.ordersCount}</span>
                      </div>
                      <p className="text-xs text-gray-500">Orders</p>
                    </div>
                  </div>
                </div>

                {/* Website Actions */}
                <div className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">
                      Updated {new Date(website.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    {website.status === 'published' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        as="a"
                        href={`/${website.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      as={Link}
                      to={`/website-builder?id=${website.id}`}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      as={Link}
                      to={`/my-products?website=${website.id}`}
                    >
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      Products
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {websites.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="flex items-center justify-center p-4"
                as={Link}
                to="/content-editor"
              >
                <Edit className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Content Editor</div>
                  <div className="text-sm text-gray-500">Create and edit pages</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center justify-center p-4"
                as={Link}
                to="/my-products"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Product Manager</div>
                  <div className="text-sm text-gray-500">Add and manage products</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center justify-center p-4"
                as={Link}
                to="/orders"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Analytics</div>
                  <div className="text-sm text-gray-500">View performance</div>
                </div>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyWebsites