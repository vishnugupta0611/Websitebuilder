import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { WebsiteCartProvider, useWebsiteCart } from '../contexts/WebsiteCartContext'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { websiteService } from '../services/websiteService'
import { productService } from '../services/productService'
import {
    ArrowLeft,
    Star,
    ShoppingCart,
    Heart,
    Share2,
    Minus,
    Plus,
    Shield,
    Truck,
    RotateCcw
} from 'lucide-react'

function UserProductDetailContent() {
    const { slug, productId } = useParams()
    const { dispatch } = useApp()
    const { addToCart, setWebsiteInfo } = useWebsiteCart()
    const [website, setWebsite] = useState(null)
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [addingToCart, setAddingToCart] = useState(false)
    const [activeTab, setActiveTab] = useState('description')
    const [savedForLater, setSavedForLater] = useState(false)

    useEffect(() => {
        loadProductData()
    }, [slug, productId])

    const loadProductData = async () => {
        try {
            setLoading(true)

            // Validate product ID format
            if (!productId || isNaN(productId)) {
                console.error('Invalid product ID:', productId)
                dispatch({ type: 'SET_ERROR', payload: `Invalid product ID: "${productId}". Product ID must be a number.` })
                setLoading(false)
                return
            }

            // Load website data from API
            console.log('Loading website with slug:', slug)
            const websiteResult = await websiteService.getWebsiteBySlug(slug)
            
            if (!websiteResult.success) {
                console.error('Website not found:', slug, websiteResult.error)
                dispatch({ type: 'SET_ERROR', payload: `Website "${slug}" not found. Please check the URL.` })
                setLoading(false)
                return
            }

            const websiteData = websiteResult.data

            // Only show published websites
            if (websiteData.status !== 'published') {
                console.error('Website not published:', websiteData.status)
                dispatch({ type: 'SET_ERROR', payload: `Website "${slug}" is not available.` })
                setLoading(false)
                return
            }

            // Load product data from API using public endpoint
            console.log('Loading product with ID:', productId)
            const productResult = await productService.getPublicProduct(productId)
            
            if (!productResult.success) {
                console.error('Product not found:', productId, productResult.error)
                dispatch({ type: 'SET_ERROR', payload: `Product with ID "${productId}" not found.` })
                setLoading(false)
                return
            }

            const productData = productResult.data

            // Check if product belongs to this website and is active
            if (productData.website !== websiteData.id) {
                console.error('Product does not belong to this website:', {
                    productWebsite: productData.website,
                    currentWebsite: websiteData.id
                })
                dispatch({ type: 'SET_ERROR', payload: `Product "${productId}" does not belong to website "${slug}".` })
                setLoading(false)
                return
            }

            if (productData.status !== 'active') {
                console.error('Product is not active:', productData.status)
                dispatch({ type: 'SET_ERROR', payload: `Product "${productId}" is not available.` })
                setLoading(false)
                return
            }

            // Add mock data for missing fields and ensure proper defaults
            const enhancedProduct = {
                ...productData,
                rating: 4.5, // Mock rating
                reviews: [
                    {
                        id: 1,
                        customerName: "Sarah Johnson",
                        rating: 5,
                        comment: "Excellent product! Exactly as described and arrived quickly. Highly recommend!",
                        createdAt: "2024-01-15T10:30:00Z"
                    },
                    {
                        id: 2,
                        customerName: "Mike Chen",
                        rating: 4,
                        comment: "Good quality and value for money. The product works well and meets my expectations.",
                        createdAt: "2024-01-10T14:20:00Z"
                    },
                    {
                        id: 3,
                        customerName: "Emily Davis",
                        rating: 5,
                        comment: "Amazing! This product exceeded my expectations. Great customer service too.",
                        createdAt: "2024-01-08T09:15:00Z"
                    }
                ], // Mock reviews
                images: productData.images && productData.images.length > 0 
                    ? productData.images 
                    : ['https://via.placeholder.com/600x600/e5e7eb/9ca3af?text=Product+Image'],
                features: productData.description ? productData.description.split('.').filter(f => f.trim()).slice(0, 5) : [
                    'High quality materials',
                    'Professional design',
                    'Excellent performance',
                    'Great value for money',
                    'Customer satisfaction guaranteed'
                ],
                specifications: {
                    'Weight': productData.weight ? `${productData.weight} kg` : 'N/A',
                    'Dimensions': productData.length && productData.width && productData.height 
                        ? `${productData.length} x ${productData.width} x ${productData.height} cm` 
                        : 'N/A',
                    'SKU': productData.sku || 'N/A',
                    'Category': productData.category || 'General'
                },
                variants: productData.variants || [],
                totalInventory: productData.inventory || 0,
                price: parseFloat(productData.price) || 0,
                originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null
            }

            setWebsite(websiteData)
            setProduct(enhancedProduct)
            
            // Set website info in cart context
            setWebsiteInfo({
                id: websiteData.id,
                slug: websiteData.slug,
                name: websiteData.name
            })
            
            // Set default selected image and variant
            if (enhancedProduct.images && enhancedProduct.images.length > 0) {
                setSelectedImage(0)
            }
            if (enhancedProduct.variants && enhancedProduct.variants.length > 0) {
                setSelectedVariant(enhancedProduct.variants[0])
            }

            // Check if product is saved for later
            const savedItems = JSON.parse(localStorage.getItem('savedForLater') || '[]')
            const isSaved = savedItems.some(item => item.id === enhancedProduct.id && item.websiteSlug === slug)
            setSavedForLater(isSaved)
        } catch (error) {
            console.error('Error loading product data:', error)
            let errorMessage = 'Failed to load product'
            
            if (error.message.includes('404')) {
                errorMessage = 'Product or website not found'
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage = 'Network error. Please check your connection and try again.'
            } else if (error.message) {
                errorMessage = error.message
            }
            
            dispatch({ type: 'SET_ERROR', payload: errorMessage })
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = async () => {
        if (!product) return

        setAddingToCart(true)
        try {
            const productToAdd = {
                id: product.id,
                name: product.name,
                price: selectedVariant?.price || product.price,
                images: product.images,
                sku: product.sku,
                variant: selectedVariant?.name || null
            }

            const result = await addToCart(productToAdd, quantity)
            if (result.success) {
                // Show success message or redirect to cart
                console.log('Product added to cart successfully')
                dispatch({ type: 'SET_SUCCESS', payload: 'Product added to cart successfully!' })
            } else {
                console.error('Failed to add product to cart:', result.error)
                dispatch({ type: 'SET_ERROR', payload: result.error || 'Failed to add product to cart' })
            }
        } catch (error) {
            console.error('Error adding product to cart:', error)
            dispatch({ type: 'SET_ERROR', payload: 'Error adding product to cart' })
        } finally {
            setAddingToCart(false)
        }
    }

    const handleSaveForLater = () => {
        setSavedForLater(!savedForLater)
        const message = !savedForLater ? 'Product saved for later!' : 'Product removed from saved items'
        dispatch({ type: 'SET_SUCCESS', payload: message })
        
        // Store in localStorage for persistence
        const savedItems = JSON.parse(localStorage.getItem('savedForLater') || '[]')
        if (!savedForLater) {
            const productToSave = {
                id: product.id,
                name: product.name,
                price: selectedVariant?.price || product.price,
                images: product.images,
                websiteSlug: slug,
                savedAt: new Date().toISOString()
            }
            savedItems.push(productToSave)
        } else {
            const index = savedItems.findIndex(item => item.id === product.id && item.websiteSlug === slug)
            if (index > -1) {
                savedItems.splice(index, 1)
            }
        }
        localStorage.setItem('savedForLater', JSON.stringify(savedItems))
    }

    const handleShare = async () => {
        const shareData = {
            title: product.name,
            text: `Check out this product: ${product.name}`,
            url: window.location.href
        }

        try {
            if (navigator.share) {
                await navigator.share(shareData)
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(window.location.href)
                dispatch({ type: 'SET_SUCCESS', payload: 'Product link copied to clipboard!' })
            }
        } catch (error) {
            console.error('Error sharing:', error)
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href)
                dispatch({ type: 'SET_SUCCESS', payload: 'Product link copied to clipboard!' })
            } catch (clipboardError) {
                dispatch({ type: 'SET_ERROR', payload: 'Unable to share or copy link' })
            }
        }
    }

    const updateQuantity = (newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= (selectedVariant?.inventory || product.totalInventory)) {
            setQuantity(newQuantity)
        }
    }

    const currentPrice = selectedVariant?.price || product?.price || 0
    const currentInventory = selectedVariant?.inventory || product?.totalInventory || 0

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (!product || !website) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
                        <p className="text-gray-600 mb-4">
                            The product you're looking for doesn't exist or may have been removed.
                        </p>
                        
                        {/* Debug info for development */}
                        {process.env.NODE_ENV === 'development' && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
                                <h3 className="font-semibold text-yellow-800 mb-2">Debug Info:</h3>
                                <ul className="text-sm text-yellow-700 space-y-1">
                                    <li><strong>Website slug:</strong> {slug}</li>
                                    <li><strong>Product ID:</strong> {productId}</li>
                                    <li><strong>Current URL:</strong> {window.location.href}</li>
                                </ul>
                                <div className="mt-3 text-xs text-yellow-600">
                                    <p><strong>Expected format:</strong> /website-slug/products/123</p>
                                    <p><strong>Example:</strong> /test-backend-website/products/1</p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="space-y-3">
                        <Link 
                            to={`/${slug}`} 
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Store
                        </Link>
                        
                        <div>
                            <Link 
                                to="/" 
                                className="text-gray-500 hover:text-gray-700 text-sm"
                            >
                                Go to Homepage
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Ensure proper default colors for better contrast
    const defaultColors = {
        primary: '#2563eb',
        secondary: '#64748b', 
        accent: '#10b981',
        background: '#ffffff',
        text: '#1f2937'
    }

    const colors = {
        primary: website.customizations?.colors?.primary || defaultColors.primary,
        secondary: website.customizations?.colors?.secondary || defaultColors.secondary,
        accent: website.customizations?.colors?.accent || defaultColors.accent,
        background: website.customizations?.colors?.background || defaultColors.background,
        text: website.customizations?.colors?.text || defaultColors.text
    }

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: colors.background,
                color: colors.text,
                fontFamily: website.customizations?.typography?.bodyFont || 'Inter, system-ui, sans-serif'
            }}
        >
            {/* Header */}
            <header
                className="border-b shadow-sm"
                style={{
                    backgroundColor: colors.background,
                    borderColor: colors.secondary + '20'
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link
                            to={`/${slug}`}
                            className="flex items-center hover:opacity-75 transition-opacity"
                            style={{ color: colors.primary }}
                        >
                            <h1
                                className="text-2xl font-bold"
                                style={{ fontFamily: website.customizations?.typography?.headingFont || 'Inter, system-ui, sans-serif' }}
                            >
                                {website.name}
                            </h1>
                        </Link>

                        <Button
                            as={Link}
                            to={`/${slug}/getstarted`}
                            style={{
                                backgroundColor: colors.primary,
                                color: 'white'
                            }}
                            className="hover:opacity-90 transition-opacity"
                        >
                            Get Started
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link
                        to={`/${slug}`}
                        className="hover:opacity-75 transition-opacity inline-flex items-center"
                        style={{ color: colors.primary }}
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back to Store
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div>
                        {/* Main Image */}
                        <div className="aspect-w-1 aspect-h-1 mb-4">
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
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
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index
                                            ? 'border-primary-500'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        style={{
                                            borderColor: selectedImage === index
                                                ? colors.primary
                                                : colors.secondary + '40'
                                        }}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
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
                            <h1
                                className="text-3xl font-bold mb-2"
                                style={{
                                    color: colors.primary,
                                    fontFamily: website.customizations?.typography?.headingFont || 'Inter, system-ui, sans-serif'
                                }}
                            >
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <span className="ml-2 text-sm font-medium" style={{ color: colors.text }}>
                                    ({product.reviews.length} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <span
                                    className="text-3xl font-bold"
                                    style={{ color: colors.primary }}
                                >
                                    ${currentPrice.toFixed(2)}
                                </span>
                                {product.originalPrice && product.originalPrice > currentPrice && (
                                    <span className="ml-2 text-lg text-gray-500 line-through">
                                        ${product.originalPrice.toFixed(2)}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="mb-6 leading-relaxed text-base font-medium" style={{ color: colors.text }}>
                                {product.description || 'This is a high-quality product designed to meet your needs with excellent craftsmanship and attention to detail.'}
                            </p>

                            {/* Features */}
                            <div className="mb-6">
                                <h3
                                    className="text-lg font-semibold mb-4"
                                    style={{ color: colors.primary }}
                                >
                                    Key Features
                                </h3>
                                <ul className="space-y-3">
                                    {product.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <span
                                                className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                                                style={{ backgroundColor: colors.primary }}
                                            />
                                            <span 
                                                className="text-base font-medium"
                                                style={{ color: colors.text }}
                                            >
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Variants */}
                        {product.variants.length > 0 && (
                            <div className="mb-6">
                                <h3
                                    className="text-lg font-semibold mb-3"
                                    style={{ color: colors.primary }}
                                >
                                    Options
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`p-3 border rounded-lg text-left transition-colors ${selectedVariant?.id === variant.id
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            style={{
                                                borderColor: selectedVariant?.id === variant.id
                                                    ? colors.primary
                                                    : colors.secondary + '40',
                                                backgroundColor: selectedVariant?.id === variant.id
                                                    ? colors.primary + '10'
                                                    : 'transparent',
                                                color: colors.text
                                            }}
                                        >
                                            <div className="font-semibold text-base" style={{ color: colors.text }}>
                                                {variant.name}
                                            </div>
                                            <div className="text-sm font-medium" style={{ color: colors.primary }}>
                                                ${variant.price.toFixed(2)}
                                            </div>
                                            <div 
                                                className="text-xs font-medium" 
                                                style={{ color: variant.inventory > 0 ? '#10b981' : '#ef4444' }}
                                            >
                                                {variant.inventory > 0 ? `${variant.inventory} in stock` : 'Out of stock'}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-6">
                            <h3
                                className="text-lg font-semibold mb-3"
                                style={{ color: colors.primary }}
                            >
                                Quantity
                            </h3>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => updateQuantity(quantity - 1)}
                                    className="p-2 border rounded-md hover:opacity-75 transition-colors"
                                    disabled={quantity <= 1}
                                    style={{ 
                                        borderColor: colors.primary,
                                        color: colors.primary,
                                        backgroundColor: 'transparent'
                                    }}
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span 
                                    className="w-12 text-center font-medium text-lg"
                                    style={{ color: colors.text }}
                                >
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => updateQuantity(quantity + 1)}
                                    className="p-2 border rounded-md hover:opacity-75 transition-colors"
                                    disabled={quantity >= currentInventory}
                                    style={{ 
                                        borderColor: colors.primary,
                                        color: colors.primary,
                                        backgroundColor: 'transparent'
                                    }}
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                                <span className="text-sm ml-4 font-medium" style={{ color: colors.text }}>
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
                                disabled={currentInventory === 0 || addingToCart}
                                loading={addingToCart}
                                style={{
                                    backgroundColor: colors.primary,
                                    color: 'white'
                                }}
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                {addingToCart ? 'Adding...' : currentInventory > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </Button>

                            <div className="flex space-x-3">
                                <Button 
                                    variant="outline" 
                                    size="lg" 
                                    className="flex-1"
                                    onClick={handleSaveForLater}
                                    style={{
                                        borderColor: savedForLater ? colors.primary : colors.primary,
                                        color: savedForLater ? 'white' : colors.primary,
                                        backgroundColor: savedForLater ? colors.primary : 'transparent'
                                    }}
                                >
                                    <Heart className={`mr-2 h-5 w-5 ${savedForLater ? 'fill-current' : ''}`} />
                                    {savedForLater ? 'Saved' : 'Save for Later'}
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="lg" 
                                    className="flex-1"
                                    onClick={handleShare}
                                    style={{
                                        borderColor: colors.primary,
                                        color: colors.primary,
                                        backgroundColor: 'transparent'
                                    }}
                                >
                                    <Share2 className="mr-2 h-5 w-5" />
                                    Share
                                </Button>
                            </div>
                        </div>

                        {/* Guarantees */}
                        <div 
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg"
                            style={{ 
                                backgroundColor: colors.secondary + '10',
                                border: `1px solid ${colors.secondary}20`
                            }}
                        >
                            <div className="flex items-center space-x-2">
                                <Shield className="h-5 w-5" style={{ color: colors.primary }} />
                                <span className="text-sm font-medium" style={{ color: colors.text }}>
                                    Quality Guarantee
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Truck className="h-5 w-5" style={{ color: colors.primary }} />
                                <span className="text-sm font-medium" style={{ color: colors.text }}>
                                    Free Shipping
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RotateCcw className="h-5 w-5" style={{ color: colors.primary }} />
                                <span className="text-sm font-medium" style={{ color: colors.text }}>
                                    30-Day Returns
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mt-16">
                    <div 
                        className="rounded-lg shadow-sm border" 
                        style={{ 
                            backgroundColor: colors.background,
                            borderColor: colors.secondary + '30' 
                        }}
                    >
                        <div className="border-b" style={{ borderColor: colors.secondary + '30' }}>
                            <nav className="flex space-x-8 px-6">
                                <button
                                    className="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
                                    onClick={() => setActiveTab('description')}
                                    style={{
                                        borderColor: activeTab === 'description' ? colors.primary : 'transparent',
                                        color: activeTab === 'description' ? colors.primary : colors.secondary
                                    }}
                                >
                                    Description
                                </button>
                                <button
                                    className="py-4 px-1 border-b-2 font-medium text-sm hover:opacity-75 transition-colors"
                                    onClick={() => setActiveTab('specifications')}
                                    style={{
                                        borderColor: activeTab === 'specifications' ? colors.primary : 'transparent',
                                        color: activeTab === 'specifications' ? colors.primary : colors.secondary
                                    }}
                                >
                                    Specifications
                                </button>
                                <button
                                    className="py-4 px-1 border-b-2 font-medium text-sm hover:opacity-75 transition-colors"
                                    onClick={() => setActiveTab('reviews')}
                                    style={{
                                        borderColor: activeTab === 'reviews' ? colors.primary : 'transparent',
                                        color: activeTab === 'reviews' ? colors.primary : colors.secondary
                                    }}
                                >
                                    Reviews ({product.reviews.length})
                                </button>
                            </nav>
                        </div>

                        <div className="p-6">
                            {activeTab === 'description' && (
                                <div className="prose max-w-none">
                                    <p 
                                        style={{ color: colors.text }} 
                                        className="text-base leading-relaxed mb-6"
                                    >
                                        {product.description || 'This is a high-quality product designed to meet your needs. It features excellent craftsmanship and attention to detail.'}
                                    </p>
                                    
                                    <h4
                                        className="text-lg font-semibold mb-4"
                                        style={{ color: colors.primary }}
                                    >
                                        Key Features
                                    </h4>
                                    <ul className="space-y-3">
                                        {product.features.map((feature, index) => (
                                            <li key={index} className="flex items-start">
                                                <span
                                                    className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                                                    style={{ backgroundColor: colors.primary }}
                                                />
                                                <span 
                                                    style={{ color: colors.text }} 
                                                    className="text-base font-medium"
                                                >
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {activeTab === 'specifications' && (
                                <div>
                                    <h4
                                        className="text-lg font-semibold mb-4"
                                        style={{ color: colors.primary }}
                                    >
                                        Product Specifications
                                    </h4>
                                    <div className="space-y-4">
                                        {Object.entries(product.specifications).map(([key, value]) => (
                                            <div 
                                                key={key} 
                                                className="flex justify-between items-center py-3 px-4 rounded-lg" 
                                                style={{ 
                                                    backgroundColor: colors.secondary + '05',
                                                    border: `1px solid ${colors.secondary}20`
                                                }}
                                            >
                                                <span className="font-semibold text-base" style={{ color: colors.text }}>
                                                    {key}
                                                </span>
                                                <span 
                                                    style={{ color: colors.primary }} 
                                                    className="text-base font-medium"
                                                >
                                                    {value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {product.variants && product.variants.length > 0 && (
                                        <div className="mt-8">
                                            <h5
                                                className="text-base font-semibold mb-3"
                                                style={{ color: colors.primary }}
                                            >
                                                Available Variants
                                            </h5>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {product.variants.map((variant) => (
                                                    <div 
                                                        key={variant.id} 
                                                        className="p-4 border rounded-lg" 
                                                        style={{ 
                                                            borderColor: colors.secondary + '30',
                                                            backgroundColor: colors.secondary + '05'
                                                        }}
                                                    >
                                                        <div className="font-semibold text-base mb-2" style={{ color: colors.text }}>
                                                            {variant.name}
                                                        </div>
                                                        <div className="text-sm font-medium mb-1" style={{ color: colors.primary }}>
                                                            Price: ${variant.price.toFixed(2)}
                                                        </div>
                                                        <div 
                                                            className="text-sm font-medium" 
                                                            style={{ color: variant.inventory > 0 ? '#10b981' : '#ef4444' }}
                                                        >
                                                            {variant.inventory > 0 ? `${variant.inventory} in stock` : 'Out of stock'}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h4
                                            className="text-lg font-semibold"
                                            style={{ color: colors.primary }}
                                        >
                                            Customer Reviews
                                        </h4>
                                        <div className="flex items-center">
                                            <div className="flex items-center mr-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm font-medium" style={{ color: colors.text }}>
                                                {product.rating.toFixed(1)} out of 5
                                            </span>
                                        </div>
                                    </div>

                                    {product.reviews.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="mb-4">
                                                <Star className="h-12 w-12 mx-auto" style={{ color: colors.secondary + '40' }} />
                                            </div>
                                            <h5 className="text-lg font-medium mb-2" style={{ color: colors.text }}>
                                                No reviews yet
                                            </h5>
                                            <p className="text-sm" style={{ color: colors.secondary }}>
                                                Be the first to review this product!
                                            </p>
                                            <Button
                                                className="mt-4"
                                                style={{
                                                    backgroundColor: colors.primary,
                                                    color: 'white'
                                                }}
                                                onClick={() => {
                                                    dispatch({ type: 'SET_SUCCESS', payload: 'Review feature coming soon!' })
                                                }}
                                            >
                                                Write a Review
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {product.reviews.map((review, index) => (
                                                <div 
                                                    key={index} 
                                                    className="p-4 rounded-lg border-l-4" 
                                                    style={{ 
                                                        backgroundColor: colors.secondary + '05',
                                                        borderLeftColor: colors.primary,
                                                        border: `1px solid ${colors.secondary}20`
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center">
                                                            <div className="flex items-center mr-3">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="font-semibold text-base" style={{ color: colors.text }}>
                                                                {review.customerName}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-medium" style={{ color: colors.secondary }}>
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-base leading-relaxed" style={{ color: colors.text }}>
                                                        {review.comment}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function UserProductDetail() {
    const { slug } = useParams()
    
    return (
        <WebsiteCartProvider websiteSlug={slug}>
            <UserProductDetailContent />
        </WebsiteCartProvider>
    )
}

export default UserProductDetail