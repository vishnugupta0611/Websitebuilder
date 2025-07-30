import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCustomerAuth } from '../contexts/CustomerAuthContext'
import { websiteService } from '../services/websiteService'
import { orderService } from '../services/orderService'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import {
    Package,
    Calendar,
    DollarSign,
    Truck,
    CheckCircle,
    Clock,
    ArrowLeft,
    Eye
} from 'lucide-react'

function CustomerOrders() {
    const { slug } = useParams()
    const { user, logout } = useCustomerAuth()
    const [website, setWebsite] = useState(null)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)

    useEffect(() => {
        loadData()
    }, [slug, user])

    const loadData = async () => {
        try {
            setLoading(true)
            
            // Load website data
            const websiteResult = await websiteService.getWebsiteBySlug(slug)
            if (websiteResult.success) {
                setWebsite(websiteResult.data)
            }

            // Load customer orders (mock data for now)
            // In real implementation, this would call an API
            const mockOrders = [
                {
                    id: 'ORD-001',
                    date: '2024-01-15',
                    status: 'delivered',
                    total: 299.99,
                    items: [
                        { name: 'Premium Product', quantity: 2, price: 149.99 }
                    ]
                },
                {
                    id: 'ORD-002',
                    date: '2024-01-20',
                    status: 'shipped',
                    total: 89.99,
                    items: [
                        { name: 'Standard Product', quantity: 1, price: 89.99 }
                    ]
                },
                {
                    id: 'ORD-003',
                    date: '2024-01-25',
                    status: 'processing',
                    total: 199.99,
                    items: [
                        { name: 'Special Product', quantity: 1, price: 199.99 }
                    ]
                }
            ]
            setOrders(mockOrders)
        } catch (error) {
            console.error('Error loading orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered':
                return <CheckCircle className="h-5 w-5 text-green-500" />
            case 'shipped':
                return <Truck className="h-5 w-5 text-blue-500" />
            case 'processing':
                return <Clock className="h-5 w-5 text-yellow-500" />
            default:
                return <Package className="h-5 w-5 text-gray-500" />
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'delivered':
                return 'Delivered'
            case 'shipped':
                return 'Shipped'
            case 'processing':
                return 'Processing'
            default:
                return 'Unknown'
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return '#10b981'
            case 'shipped':
                return '#3b82f6'
            case 'processing':
                return '#f59e0b'
            default:
                return '#6b7280'
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (!website) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Website not found</h2>
                    <Link to="/" className="text-blue-600 hover:text-blue-800">
                        Go to Homepage
                    </Link>
                </div>
            </div>
        )
    }

    // Use website theme colors
    const colors = {
        primary: website.customizations?.colors?.primary || '#2563eb',
        secondary: website.customizations?.colors?.secondary || '#64748b',
        accent: website.customizations?.colors?.accent || '#10b981',
        background: website.customizations?.colors?.background || '#ffffff',
        text: website.customizations?.colors?.text || '#1f2937'
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

                        <div className="flex items-center space-x-4">
                            <span className="text-sm" style={{ color: colors.text }}>
                                {user?.name}
                            </span>
                            <Button
                                variant="outline"
                                onClick={logout}
                                style={{
                                    borderColor: colors.secondary + '40',
                                    color: colors.text
                                }}
                            >
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

                {/* Orders Header */}
                <div className="mb-8">
                    <h1
                        className="text-3xl font-bold mb-2"
                        style={{
                            color: colors.primary,
                            fontFamily: website.customizations?.typography?.headingFont || 'Inter, system-ui, sans-serif'
                        }}
                    >
                        My Orders
                    </h1>
                    <p className="text-base" style={{ color: colors.secondary }}>
                        Track your orders and view order history
                    </p>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div
                        className="text-center py-12 bg-white rounded-lg border"
                        style={{
                            backgroundColor: colors.background,
                            borderColor: colors.secondary + '20'
                        }}
                    >
                        <Package className="h-12 w-12 mx-auto mb-4" style={{ color: colors.secondary }} />
                        <h3 className="text-lg font-medium mb-2" style={{ color: colors.text }}>
                            No orders yet
                        </h3>
                        <p className="text-sm mb-4" style={{ color: colors.secondary }}>
                            Start shopping to see your orders here
                        </p>
                        <Link
                            to={`/${slug}`}
                            className="inline-flex items-center px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                            style={{
                                backgroundColor: colors.primary,
                                color: 'white'
                            }}
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
                                style={{
                                    backgroundColor: colors.background,
                                    borderColor: colors.secondary + '20'
                                }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div>
                                            <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                                                Order #{order.id}
                                            </h3>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-4 w-4" style={{ color: colors.secondary }} />
                                                    <span className="text-sm" style={{ color: colors.secondary }}>
                                                        {new Date(order.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    {getStatusIcon(order.status)}
                                                    <span 
                                                        className="text-sm font-medium"
                                                        style={{ color: getStatusColor(order.status) }}
                                                    >
                                                        {getStatusText(order.status)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="flex items-center space-x-1 mb-2">
                                            <DollarSign className="h-4 w-4" style={{ color: colors.secondary }} />
                                            <span className="text-lg font-semibold" style={{ color: colors.text }}>
                                                ${order.total.toFixed(2)}
                                            </span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                                            style={{
                                                borderColor: colors.primary,
                                                color: colors.primary
                                            }}
                                        >
                                            <Eye className="mr-1 h-4 w-4" />
                                            {selectedOrder === order.id ? 'Hide' : 'View'} Details
                                        </Button>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="border-t pt-4" style={{ borderColor: colors.secondary + '20' }}>
                                    <h4 className="text-sm font-medium mb-2" style={{ color: colors.text }}>
                                        Items ({order.items.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center">
                                                <span className="text-sm" style={{ color: colors.text }}>
                                                    {item.name} × {item.quantity}
                                                </span>
                                                <span className="text-sm font-medium" style={{ color: colors.text }}>
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Details (Expandable) */}
                                {selectedOrder === order.id && (
                                    <div className="border-t pt-4 mt-4" style={{ borderColor: colors.secondary + '20' }}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h5 className="text-sm font-medium mb-2" style={{ color: colors.text }}>
                                                    Order Status
                                                </h5>
                                                <div className="flex items-center space-x-2">
                                                    {getStatusIcon(order.status)}
                                                    <span style={{ color: getStatusColor(order.status) }}>
                                                        {getStatusText(order.status)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-medium mb-2" style={{ color: colors.text }}>
                                                    Order Total
                                                </h5>
                                                <p className="text-lg font-semibold" style={{ color: colors.text }}>
                                                    ${order.total.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to={`/${slug}/profile`}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        style={{
                            borderColor: colors.secondary + '20',
                            backgroundColor: colors.background
                        }}
                    >
                        <h3 className="font-semibold mb-2" style={{ color: colors.primary }}>
                            My Profile
                        </h3>
                        <p className="text-sm" style={{ color: colors.secondary }}>
                            Update your account information
                        </p>
                    </Link>

                    <Link
                        to={`/${slug}/saved-items`}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        style={{
                            borderColor: colors.secondary + '20',
                            backgroundColor: colors.background
                        }}
                    >
                        <h3 className="font-semibold mb-2" style={{ color: colors.primary }}>
                            Saved Items
                        </h3>
                        <p className="text-sm" style={{ color: colors.secondary }}>
                            View products you've saved for later
                        </p>
                    </Link>

                    <Link
                        to={`/${slug}`}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        style={{
                            borderColor: colors.secondary + '20',
                            backgroundColor: colors.background
                        }}
                    >
                        <h3 className="font-semibold mb-2" style={{ color: colors.primary }}>
                            Continue Shopping
                        </h3>
                        <p className="text-sm" style={{ color: colors.secondary }}>
                            Browse more products in our store
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default CustomerOrders