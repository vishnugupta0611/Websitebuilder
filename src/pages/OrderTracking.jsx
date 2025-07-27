import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { ecommerceService } from '../services/ecommerceService'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Calendar,
  ArrowLeft,
  Download,
  RefreshCw
} from 'lucide-react'

function OrderTracking() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const { dispatch } = useApp()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const showSuccess = searchParams.get('success') === 'true'

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true)
        if (id) {
          const orderData = await ecommerceService.getOrderById(id)
          setOrder(orderData)
        } else {
          // Load all orders for the customer
          const orders = await ecommerceService.getOrders('customer-1')
          dispatch({ type: 'SET_ORDERS', payload: orders })
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load order information' })
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [id, dispatch])

  const refreshOrder = async () => {
    if (!id) return
    
    setRefreshing(true)
    try {
      const orderData = await ecommerceService.getOrderById(id)
      setOrder(orderData)
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh order' })
    } finally {
      setRefreshing(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'created':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />
      case 'delivered':
        return <Package className="h-5 w-5 text-green-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'paid':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
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

  // Order Success Page
  if (showSuccess && order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-lg font-semibold text-gray-900">#{order.id}</p>
          </div>
          
          <div className="space-y-3">
            <Button className="w-full" onClick={() => window.location.href = `/orders/${order.id}`}>
              Track Your Order
            </Button>
            <Button variant="outline" className="w-full" as={Link} to="/products">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Single Order Tracking
  if (id && order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/profile" 
              className="text-primary-600 hover:text-primary-700 inline-flex items-center mb-4"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Account
            </Link>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
                <p className="text-gray-600 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshOrder}
                  loading={refreshing}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Timeline */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Timeline</h2>
                
                <div className="space-y-6">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(event.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 capitalize">
                            {event.status.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.note}</p>
                        {event.trackingNumber && (
                          <p className="text-sm text-primary-600 mt-1">
                            Tracking: {event.trackingNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ${item.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">{order.shipping.name}</p>
                  <p>{order.shipping.address}</p>
                  <p>{order.shipping.city}, {order.shipping.state} {order.shipping.zip}</p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>
                <div className="text-sm text-gray-600">
                  <p className="flex justify-between">
                    <span>Method:</span>
                    <span className="capitalize">{order.payment.method.replace('_', ' ')}</span>
                  </p>
                  {order.payment.last4 && (
                    <p className="flex justify-between mt-1">
                      <span>Card:</span>
                      <span>•••• {order.payment.last4}</span>
                    </p>
                  )}
                  <p className="flex justify-between mt-1">
                    <span>Status:</span>
                    <span className="capitalize text-green-600">{order.payment.status}</span>
                  </p>
                </div>
              </div>

              {/* Order Total */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Total</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${order.totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>${order.totals.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>${order.totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-primary-600">${order.totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                
                {order.status === 'delivered' && (
                  <Button variant="outline" className="w-full">
                    Reorder Items
                  </Button>
                )}
                
                {['pending', 'paid'].includes(order.status) && (
                  <Button variant="outline" className="w-full">
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Order not found
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
        <p className="text-gray-600 mb-6">
          The order you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <div className="space-x-4">
          <Button as={Link} to="/profile">
            View All Orders
          </Button>
          <Button variant="outline" as={Link} to="/products">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OrderTracking