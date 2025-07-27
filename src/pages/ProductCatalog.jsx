import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { ecommerceService } from '../services/ecommerceService'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Filter, Grid, List, Star, ShoppingCart } from 'lucide-react'

function ProductCatalog() {
  const { state, dispatch } = useApp()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    sortBy: 'name'
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const productsData = await ecommerceService.getProducts()
        setProducts(productsData)
        setFilteredProducts(productsData)
        dispatch({ type: 'SET_PRODUCTS', payload: productsData })
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load products' })
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [dispatch])

  useEffect(() => {
    let filtered = [...products]

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(product => 
        product.categories.includes(filters.category)
      )
    }

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number)
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max
        }
        return product.price >= min
      })
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }, [products, filters])

  const handleAddToCart = (product) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url,
        quantity: 1
      }
    })
  }

  const categories = [...new Set(products.flatMap(p => p.categories))]

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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Catalog</h1>
          <p className="text-lg text-gray-600">
            Discover our premium collection of corporate products and accessories.
          </p>
        </div>

        {/* Filters and View Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filter Toggle */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <span className="text-sm text-gray-600">
                {filteredProducts.length} products found
              </span>
            </div>

            {/* Desktop Filters */}
            <div className={`flex flex-col lg:flex-row gap-4 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
              {/* Category Filter */}
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              {/* Price Range Filter */}
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Prices</option>
                <option value="0-50">$0 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="200">$200+</option>
              </select>

              {/* Sort Filter */}
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">No products found matching your criteria.</p>
            <Button onClick={() => setFilters({ category: '', priceRange: '', sortBy: 'name' })}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
          }>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Product Image */}
                <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-w-16 aspect-h-12'}>
                  <img
                    src={product.images[0]?.url}
                    alt={product.images[0]?.alt}
                    className={`object-cover ${viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'}`}
                  />
                </div>

                {/* Product Info */}
                <div className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      <span className="text-sm text-gray-500">{product.sku}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    
                    {/* Categories */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.categories.map(category => (
                        <span
                          key={category}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {category}
                        </span>
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">(4.8)</span>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className={`flex items-center justify-between ${viewMode === 'list' ? 'mt-4' : ''}`}>
                    <div>
                      <span className="text-2xl font-bold text-primary-600">${product.price}</span>
                      {product.variants.length > 1 && (
                        <span className="text-sm text-gray-500 ml-2">
                          {product.variants.length} variants
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        as={Link}
                        to={`/products/${product.id}`}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCatalog