import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useWebsiteCart } from '../../contexts/WebsiteCartContext'

function WebsiteCartIcon({ website, slug }) {
  const { cart } = useWebsiteCart()
  
  // Calculate total items with proper data structure handling
  const totalItems = cart.items.reduce((total, item) => {
    return total + (item.quantity || 0)
  }, 0)
  
  return (
    <Link
      to={`/${slug}/cart`}
      className="relative p-2 hover:opacity-75 transition-opacity mr-4"
      style={{ color: website.customizations.colors.primary }}
      title={`Cart (${totalItems} items)`}
    >
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span
          className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          style={{ backgroundColor: website.customizations.colors.accent }}
        >
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  )
}

export default WebsiteCartIcon