import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCustomerAuth } from '../contexts/CustomerAuthContext'
import { websiteService } from '../services/websiteService'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import {
    User,
    Mail,
    Phone,
    MapPin,
    Edit3,
    ArrowLeft,
    Save,
    X
} from 'lucide-react'

function CustomerProfileSubsite() {
    const { slug } = useParams()
    const { user, updateProfile, logout } = useCustomerAuth()
    const [website, setWebsite] = useState(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    })

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

            // Set form data from user
            if (user) {
                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    address: user.address || ''
                })
            }
        } catch (error) {
            console.error('Error loading profile data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const result = await updateProfile(formData)
            if (result.success) {
                setEditing(false)
            }
        } catch (error) {
            console.error('Error updating profile:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        // Reset form data
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            })
        }
        setEditing(false)
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

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

                {/* Profile Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1
                                className="text-3xl font-bold mb-2"
                                style={{
                                    color: colors.primary,
                                    fontFamily: website.customizations?.typography?.headingFont || 'Inter, system-ui, sans-serif'
                                }}
                            >
                                My Profile
                            </h1>
                            <p className="text-base" style={{ color: colors.secondary }}>
                                Manage your account information and preferences
                            </p>
                        </div>
                        
                        {!editing && (
                            <Button
                                onClick={() => setEditing(true)}
                                style={{
                                    backgroundColor: colors.primary,
                                    color: 'white'
                                }}
                            >
                                <Edit3 className="mr-2 h-4 w-4" />
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </div>

                {/* Profile Content */}
                <div
                    className="bg-white rounded-lg shadow-sm border p-6"
                    style={{
                        backgroundColor: colors.background,
                        borderColor: colors.secondary + '20'
                    }}
                >
                    {editing ? (
                        /* Edit Mode */
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2
                                    className="text-xl font-semibold"
                                    style={{ color: colors.primary }}
                                >
                                    Edit Profile Information
                                </h2>
                                <div className="flex space-x-3">
                                    <Button
                                        variant="outline"
                                        onClick={handleCancel}
                                        style={{
                                            borderColor: colors.secondary + '40',
                                            color: colors.text
                                        }}
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        loading={saving}
                                        style={{
                                            backgroundColor: colors.primary,
                                            color: 'white'
                                        }}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        style={{ color: colors.text }}
                                    >
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                                        style={{
                                            borderColor: colors.secondary + '40',
                                            focusRingColor: colors.primary
                                        }}
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        style={{ color: colors.text }}
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled
                                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 cursor-not-allowed"
                                        style={{
                                            borderColor: colors.secondary + '40',
                                            backgroundColor: colors.secondary + '10'
                                        }}
                                    />
                                    <p className="text-xs mt-1" style={{ color: colors.secondary }}>
                                        Email cannot be changed
                                    </p>
                                </div>

                                <div>
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        style={{ color: colors.text }}
                                    >
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                                        style={{
                                            borderColor: colors.secondary + '40',
                                            focusRingColor: colors.primary
                                        }}
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        style={{ color: colors.text }}
                                    >
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                                        style={{
                                            borderColor: colors.secondary + '40',
                                            focusRingColor: colors.primary
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* View Mode */
                        <div className="space-y-6">
                            <h2
                                className="text-xl font-semibold mb-6"
                                style={{ color: colors.primary }}
                            >
                                Profile Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="p-2 rounded-lg"
                                        style={{ backgroundColor: colors.primary + '10' }}
                                    >
                                        <User className="h-5 w-5" style={{ color: colors.primary }} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.secondary }}>
                                            Full Name
                                        </p>
                                        <p className="text-base font-semibold" style={{ color: colors.text }}>
                                            {user?.name || 'Not provided'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div
                                        className="p-2 rounded-lg"
                                        style={{ backgroundColor: colors.primary + '10' }}
                                    >
                                        <Mail className="h-5 w-5" style={{ color: colors.primary }} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.secondary }}>
                                            Email Address
                                        </p>
                                        <p className="text-base font-semibold" style={{ color: colors.text }}>
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div
                                        className="p-2 rounded-lg"
                                        style={{ backgroundColor: colors.primary + '10' }}
                                    >
                                        <Phone className="h-5 w-5" style={{ color: colors.primary }} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.secondary }}>
                                            Phone Number
                                        </p>
                                        <p className="text-base font-semibold" style={{ color: colors.text }}>
                                            {user?.phone || 'Not provided'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div
                                        className="p-2 rounded-lg"
                                        style={{ backgroundColor: colors.primary + '10' }}
                                    >
                                        <MapPin className="h-5 w-5" style={{ color: colors.primary }} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: colors.secondary }}>
                                            Address
                                        </p>
                                        <p className="text-base font-semibold" style={{ color: colors.text }}>
                                            {user?.address || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to={`/${slug}/orders`}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        style={{
                            borderColor: colors.secondary + '20',
                            backgroundColor: colors.background
                        }}
                    >
                        <h3 className="font-semibold mb-2" style={{ color: colors.primary }}>
                            My Orders
                        </h3>
                        <p className="text-sm" style={{ color: colors.secondary }}>
                            View your order history and track current orders
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
                        to={`/${slug}/cart`}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        style={{
                            borderColor: colors.secondary + '20',
                            backgroundColor: colors.background
                        }}
                    >
                        <h3 className="font-semibold mb-2" style={{ color: colors.primary }}>
                            Shopping Cart
                        </h3>
                        <p className="text-sm" style={{ color: colors.secondary }}>
                            Review items in your cart and checkout
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default CustomerProfileSubsite