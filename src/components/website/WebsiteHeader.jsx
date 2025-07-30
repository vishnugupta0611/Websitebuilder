import React from 'react'
import { Link } from 'react-router-dom'
import { useCustomerAuth } from '../../contexts/CustomerAuthContext'
import { useWebsiteCart } from '../../contexts/WebsiteCartContext'
import Button from '../ui/Button'
import { ShoppingCart } from 'lucide-react'

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

function WebsiteHeader({ website, slug, currentPage = 'home' }) {
  const { isAuthenticated, user, logout } = useCustomerAuth()

  return (
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
              className={`hover:opacity-75 transition-opacity ${currentPage === 'home' ? 'font-semibold' : ''}`}
              style={{ 
                color: currentPage === 'home' 
                  ? website.customizations.colors.primary 
                  : website.customizations.colors.text 
              }}
            >
              Home
            </Link>
            <Link
              to={`/${slug}/about`}
              className={`hover:opacity-75 transition-opacity ${currentPage === 'about' ? 'font-semibold' : ''}`}
              style={{ 
                color: currentPage === 'about' 
                  ? website.customizations.colors.primary 
                  : website.customizations.colors.text 
              }}
            >
              About
            </Link>
            <Link
              to={`/${slug}/blogs`}
              className={`hover:opacity-75 transition-opacity ${currentPage === 'blogs' ? 'font-semibold' : ''}`}
              style={{ 
                color: currentPage === 'blogs' 
                  ? website.customizations.colors.primary 
                  : website.customizations.colors.text 
              }}
            >
              Blogs
            </Link>
            <Link
              to={`/${slug}/contact`}
              className={`hover:opacity-75 transition-opacity ${currentPage === 'contact' ? 'font-semibold' : ''}`}
              style={{ 
                color: currentPage === 'contact' 
                  ? website.customizations.colors.primary 
                  : website.customizations.colors.text 
              }}
            >
              Contact
            </Link>
          </nav>

          {/* Cart and Authentication */}
          <div className="flex items-center space-x-4">
            <WebsiteCartIcon website={website} slug={slug} />
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span 
                  className="text-sm font-medium"
                  style={{ color: website.customizations.colors.text }}
                >
                  Welcome, {user?.firstName || user?.email}
                </span>
                <div className="relative group">
                  <button
                    className="flex items-center space-x-1 px-3 py-2 rounded-md hover:opacity-75 transition-opacity"
                    style={{ 
                      backgroundColor: website.customizations.colors.secondary + '20',
                      color: website.customizations.colors.text
                    }}
                  >
                    <span className="text-sm">Account</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link
                        to={`/${slug}/profile`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Profile
                      </Link>
                      <Link
                        to={`/${slug}/orders`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Orders
                      </Link>
                      <Link
                        to={`/${slug}/saved-items`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Saved Items
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default WebsiteHeader