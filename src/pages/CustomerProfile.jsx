import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { useAuth } from '../contexts/AuthContext'
import { orderService } from '../services/orderService'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { User, MapPin, CreditCard, Package, Settings, Edit2, Plus } from 'lucide-react'

function CustomerProfile() {
  const { state, dispatch } = useApp()
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [orders, setOrders] = useState([])
  const [successMessage, setSuccessMessage] = useState('')
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    addresses: []
  })

  const [editingAddress, setEditingAddress] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    type: 'billing',
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    isDefault: false
  })

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true)
        
        // Set profile data from authenticated user
        if (user) {
          console.log('Loading user data:', user)
          setProfileData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            company: user.company || '',
            addresses: user.addresses || []
          })
        }
        
        // Load customer orders
        try {
          const ordersResult = await orderService.getOrders()
          if (ordersResult.success) {
            setOrders(ordersResult.data)
          }
        } catch (error) {
          console.log('Orders loading failed:', error.message)
        }
        
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load profile data' })
      } finally {
        setLoading(false)
      }
    }

    loadProfileData()
  }, [dispatch, user])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const result = await updateUser({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        company: profileData.company,
        addresses: profileData.addresses
      })
      
      if (result.success) {
        dispatch({ type: 'SET_ERROR', payload: null })
        setSuccessMessage('Profile updated successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Failed to save profile' })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save profile' })
    } finally {
      setSaving(false)
    }
  }

  const handleAddAddress = async () => {
    const addressId = Date.now().toString()
    const addressToAdd = { ...newAddress, id: addressId }
    
    const updatedAddresses = [...profileData.addresses, addressToAdd]
    
    // If this is set as default, make sure no other address is default
    if (addressToAdd.isDefault) {
      updatedAddresses.forEach(addr => {
        if (addr.id !== addressId) {
          addr.isDefault = false
        }
      })
    }
    
    const updatedProfileData = {
      ...profileData,
      addresses: updatedAddresses
    }
    
    setProfileData(updatedProfileData)
    
    // Save to backend
    try {
      await updateUser({
        addresses: updatedAddresses
      })
    } catch (error) {
      console.error('Failed to save address:', error)
    }
    
    setNewAddress({
      type: 'billing',
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: 'US',
      isDefault: false
    })
    setShowAddressForm(false)
  }

  const handleDeleteAddress = async (addressId) => {
    const updatedAddresses = profileData.addresses.filter(addr => addr.id !== addressId)
    
    setProfileData({
      ...profileData,
      addresses: updatedAddresses
    })
    
    // Save to backend
    try {
      await updateUser({
        addresses: updatedAddresses
      })
    } catch (error) {
      console.error('Failed to delete address:', error)
    }
  }

  const handleSetDefaultAddress = async (addressId) => {
    const updatedAddresses = profileData.addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }))
    
    setProfileData({
      ...profileData,
      addresses: updatedAddresses
    })
    
    // Save to backend
    try {
      await updateUser({
        addresses: updatedAddresses
      })
    } catch (error) {
      console.error('Failed to set default address:', error)
    }
  }

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'paid':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your profile, orders, and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-primary-50 text-primary-700 border-primary-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="h-5 w-5 mr-3" />
                  Profile Information
                </button>
                
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                    activeTab === 'addresses'
                      ? 'bg-primary-50 text-primary-700 border-primary-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MapPin className="h-5 w-5 mr-3" />
                  Addresses
                </button>
                
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-primary-50 text-primary-700 border-primary-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Package className="h-5 w-5 mr-3" />
                  Order History
                </button>
                
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                    activeTab === 'payment'
                      ? 'bg-primary-50 text-primary-700 border-primary-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="h-5 w-5 mr-3" />
                  Payment Methods
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-primary-50 text-primary-700 border-primary-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Account Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Profile Information Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                    <Button
                      onClick={handleSaveProfile}
                      loading={saving}
                      size="sm"
                      disabled={!profileData.firstName || !profileData.lastName || !profileData.email}
                    >
                      Save Changes
                    </Button>
                  </div>
                  
                  {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                      {successMessage}
                    </div>
                  )}
                  
                  {state.ui.error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                      {state.ui.error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="First Name"
                      value={profileData.firstName || ''}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      required
                    />
                    <Input
                      label="Last Name"
                      value={profileData.lastName || ''}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={profileData.email || ''}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      required
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={profileData.phone || ''}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                    <Input
                      label="Company (Optional)"
                      value={profileData.company || ''}
                      onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                      className="md:col-span-2"
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Saved Addresses</h2>
                    <Button size="sm" onClick={() => setShowAddressForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>
                  </div>
                  
                  {/* Add Address Form */}
                  {showAddressForm && (
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                          <select
                            value={newAddress.type}
                            onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="billing">Billing</option>
                            <option value="shipping">Shipping</option>
                          </select>
                        </div>
                        <Input
                          label="Full Name"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        />
                        <Input
                          label="Address"
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                          className="md:col-span-2"
                        />
                        <Input
                          label="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        />
                        <Input
                          label="State"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        />
                        <Input
                          label="ZIP Code"
                          value={newAddress.zip}
                          onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <select
                            value={newAddress.country}
                            onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={newAddress.isDefault}
                              onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Set as default address</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex space-x-3 mt-4">
                        <Button 
                          onClick={handleAddAddress} 
                          size="sm"
                          disabled={!newAddress.name || !newAddress.address || !newAddress.city || !newAddress.state || !newAddress.zip}
                        >
                          Add Address
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowAddressForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {profileData.addresses.length === 0 ? (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No addresses saved yet</p>
                        <p className="text-sm text-gray-400">Add an address to get started</p>
                      </div>
                    ) : (
                      profileData.addresses.map((address) => (
                        <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-medium text-gray-900">{address.name}</h3>
                                {address.isDefault && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                    Default
                                  </span>
                                )}
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                  {address.type}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm">
                                {address.address}<br />
                                {address.city}, {address.state} {address.zip}<br />
                                {address.country}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              {!address.isDefault && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleSetDefaultAddress(address.id)}
                                >
                                  Set Default
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteAddress(address.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Order History</h2>
                    <Link to="/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View All Orders →
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No orders yet</p>
                        <p className="text-sm text-gray-400">Your order history will appear here</p>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4">
                              <h3 className="font-medium text-gray-900">Order #{order.id}</h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 mb-1">
                              Website: <span className="font-medium">{order.websiteName || 'N/A'}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Customer: {order.customerName || 'N/A'} ({order.customerEmail || 'N/A'})
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">
                                {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                              </p>
                              <p className="text-lg font-semibold text-gray-900">
                                ${parseFloat(order.total || 0).toFixed(2)}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" as={Link} to={`/orders`}>
                                View Details
                              </Button>
                              {order.status === 'delivered' && (
                                <Button variant="outline" size="sm">
                                  Reorder
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Payment Methods Tab */}
              {activeTab === 'payment' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
                    <Button size="sm">Add Payment Method</Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-8 w-8 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">•••• •••• •••• 1234</p>
                            <p className="text-sm text-gray-600">Expires 12/25</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            Default
                          </span>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                          <span className="ml-2 text-sm text-gray-700">Email notifications for order updates</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                          <span className="ml-2 text-sm text-gray-700">Marketing emails and promotions</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                          <span className="ml-2 text-sm text-gray-700">SMS notifications</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                          <span className="ml-2 text-sm text-gray-700">Allow data collection for personalization</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                          <span className="ml-2 text-sm text-gray-700">Share data with partners</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <Button variant="danger" size="sm">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerProfile