import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
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

function UserProductDetail() {
    const { slug, productId } = useParams()
    const { state, dispatch } = useApp()
    const [website, setWebsite] = useState(null)
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        loadProductData()
    }, [slug, productId])

    const loadProductData = async () => {
        try {
            setLoading(true)

            // Load website data from localStorage
            const userWebsites = JSON.parse(localStorage.getItem('userWebsites') || '[]')
            const websiteData = userWebsites.find(site => site.slug === slug && site.status === 'published')

            if (!websiteData) {
                dispatch({ type: 'SET_ERROR', payload: 'Website not found' })
                setLoading(false)
                return
            }

            // Load product data from localStorage
            const userProducts = JSON.parse(localStorage.getItem('userProducts') || '[]')
            const productData = userProducts.find(product => 
                (product.id === productId || product.slug === productId) && 
                product.websiteId === websiteData.id && 
                product.status === 'published'
            )

            if (!productData) {
                dispatch({ type: 'SET_ERROR', payload: 'Product not found' })
                setLoading(false)
                return
            }

            setWebsite(websiteData)
            setProduct(productData)
            
            // Set default selected image and variant
            if (productData.images && productData.images.length > 0) {
                setSelectedImage(0)
            }
            if (productData.variants && productData.variants.length > 0) {
                setSelectedVariant(productData.variants[0])
            }
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: 'Product not found' })
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = () => {
        if (!product) return

        const cartItem = {
            id: product.id,
            name: product.name,
            price: selectedVariant?.price || product.price,
            image: product.images[0],
            quantity,
            variant: selectedVariant?.name || null,
            websiteSlug: slug
        }

        dispatch({ type: 'ADD_TO_CART', payload: cartItem })
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
                    <Link to={`/${slug}`} className="text-primary-600 hover:text-primary-700">
                        ← Back to Store
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: website.customizations.colors.background,
                color: website.customizations.colors.text,
                fontFamily: website.customizations.typography.bodyFont
            }}
        >
            {/* Header */}
            <header
                className="border-b shadow-sm"
                style={{
                    backgroundColor: website.customizations.colors.background,
                    borderColor: website.customizations.colors.secondary + '20'
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
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
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link
                        to={`/${slug}`}
                        className="hover:opacity-75 transition-opacity inline-flex items-center"
                        style={{ color: website.customizations.colors.primary }}
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
                                                ? website.customizations.colors.primary
                                                : website.customizations.colors.secondary + '40'
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
                                    color: website.customizations.colors.primary,
                                    fontFamily: website.customizations.typography.headingFont
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
                                <span className="ml-2 text-sm" style={{ color: website.customizations.colors.secondary }}>
                                    ({product.reviews.length} reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <span
                                    className="text-3xl font-bold"
                                    style={{ color: website.customizations.colors.primary }}
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
                            <p className="mb-6 leading-relaxed" style={{ color: website.customizations.colors.text }}>
                                {product.description}
                            </p>

                            {/* Features */}
                            <div className="mb-6">
                                <h3
                                    className="text-lg font-semibold mb-3"
                                    style={{ color: website.customizations.colors.primary }}
                                >
                                    Key Features
                                </h3>
                                <ul className="space-y-2">
                                    {product.features.map((feature, index) => (
                                        <li key={index} className="flex items-center">
                                            <span
                                                className="w-2 h-2 rounded-full mr-3"
                                                style={{ backgroundColor: website.customizations.colors.accent }}
                                            />
                                            <span style={{ color: website.customizations.colors.text }}>
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
                                    style={{ color: website.customizations.colors.primary }}
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
                                                    ? website.customizations.colors.primary
                                                    : website.customizations.colors.secondary + '40',
                                                backgroundColor: selectedVariant?.id === variant.id
                                                    ? website.customizations.colors.primary + '10'
                                                    : 'transparent'
                                            }}
                                        >
                                            <div className="font-medium" style={{ color: website.customizations.colors.text }}>
                                                {variant.name}
                                            </div>
                                            <div className="text-sm" style={{ color: website.customizations.colors.secondary }}>
                                                ${variant.price.toFixed(2)}
                                            </div>
                                            <div className="text-xs" style={{ color: website.customizations.colors.secondary }}>
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
                                style={{ color: website.customizations.colors.primary }}
                            >
                                Quantity
                            </h3>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => updateQuantity(quantity - 1)}
                                    className="p-2 border rounded-md hover:bg-gray-50 transition-colors"
                                    disabled={quantity <= 1}
                                    style={{ borderColor: website.customizations.colors.secondary + '40' }}
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                                <button
                                    onClick={() => updateQuantity(quantity + 1)}
                                    className="p-2 border rounded-md hover:bg-gray-50 transition-colors"
                                    disabled={quantity >= currentInventory}
                                    style={{ borderColor: website.customizations.colors.secondary + '40' }}
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                                <span className="text-sm ml-4" style={{ color: website.customizations.colors.secondary }}>
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
                                style={{
                                    backgroundColor: website.customizations.colors.primary,
                                    color: 'white'
                                }}
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

                        {/* Guarantees */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <Shield className="h-5 w-5" style={{ color: website.customizations.colors.accent }} />
                                <span className="text-sm" style={{ color: website.customizations.colors.text }}>
                                    Quality Guarantee
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Truck className="h-5 w-5" style={{ color: website.customizations.colors.accent }} />
                                <span className="text-sm" style={{ color: website.customizations.colors.text }}>
                                    Free Shipping
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RotateCcw className="h-5 w-5" style={{ color: website.customizations.colors.accent }} />
                                <span className="text-sm" style={{ color: website.customizations.colors.text }}>
                                    30-Day Returns
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mt-16">
                    <div className="bg-white rounded-lg shadow-sm border" style={{ borderColor: website.customizations.colors.secondary + '30' }}>
                        <div className="border-b" style={{ borderColor: website.customizations.colors.secondary + '30' }}>
                            <nav className="flex space-x-8 px-6">
                                <button
                                    className="py-4 px-1 border-b-2 font-medium text-sm"
                                    style={{
                                        borderColor: website.customizations.colors.primary,
                                        color: website.customizations.colors.primary
                                    }}
                                >
                                    Description
                                </button>
                                <button
                                    className="py-4 px-1 border-b-2 border-transparent font-medium text-sm hover:opacity-75"
                                    style={{ color: website.customizations.colors.secondary }}
                                >
                                    Specifications
                                </button>
                                <button
                                    className="py-4 px-1 border-b-2 border-transparent font-medium text-sm hover:opacity-75"
                                    style={{ color: website.customizations.colors.secondary }}
                                >
                                    Reviews ({product.reviews.length})
                                </button>
                            </nav>
                        </div>

                        <div className="p-6">
                            <div className="prose max-w-none">
                                <p style={{ color: website.customizations.colors.text }}>
                                    {product.description}
                                </p>

                                <h4
                                    className="text-lg font-semibold mt-6 mb-3"
                                    style={{ color: website.customizations.colors.primary }}
                                >
                                    Specifications
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex justify-between py-2 border-b" style={{ borderColor: website.customizations.colors.secondary + '20' }}>
                                            <span className="font-medium" style={{ color: website.customizations.colors.text }}>
                                                {key}:
                                            </span>
                                            <span style={{ color: website.customizations.colors.secondary }}>
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProductDetail