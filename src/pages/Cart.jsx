import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { ecommerceService } from '../services/ecommerceService'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'

function Cart() {
  const { state, dispatch } = useApp()
  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponMessage, setCouponMessage] = useState('')

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: itemId })
    } else {
      dispatch({ 
        type: 'UPDATE_CART_QUANTITY', 
        payload: { id: itemId, quantity: newQuantity } 
      })
    }
  }

  const removeItem = (itemId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId })
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return

    setCouponLoading(true)
    setCouponMessage('')

    try {
      const result = await ecommerceService.validateCoupon(couponCode)
      
      if (result.valid) {
        dispatch({ 
          type: 'APPLY_DISCOUNT', 
          payload: { 
            code: couponCode, 
            discount: result.discount, 
            type: result.type 
          } 
        })
        setCouponMessage(`Coupon applied! ${result.discount}${result.type === 'percentage' ? '%' : '$'} discount`)
        setCouponCode('')
      } else {
        setCouponMessage(result.message || 'Invalid coupon code')
      }
    } catch (error) {
      setCouponMessage('Failed to validate coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  const calculateDiscountAmount = () => {
    return state.cart.discounts.reduce((total, discount) => {
      if (discount.type === 'percentage') {
        return total + (state.cart.total * discount.discount / 100)
      }
      return total + discount.discount
    }, 0)
  }

  const discountAmount = calculateDiscountAmount()
  const finalTotal = Math.max(0, state.cart.total - discountAmount)

  if (state.cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <Button as={Link} to="/products" size="lg">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
          <Link 
            to="/products" 
            className="text-primary-600 hover:text-primary-700 inline-flex items-center"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Cart Items ({state.cart.items.length})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {state.cart.items.map((item) => (
                  <div key={item.id} className="p-6 flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">SKU: {item.sku || 'N/A'}</p>
                      <p className="text-lg font-semibold text-primary-600 mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1"
                  />
                  <Button
                    onClick={applyCoupon}
                    loading={couponLoading}
                    disabled={!couponCode.trim()}
                    size="sm"
                  >
                    Apply
                  </Button>
                </div>
                {couponMessage && (
                  <p className={`mt-2 text-sm ${
                    couponMessage.includes('applied') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {couponMessage}
                  </p>
                )}
              </div>

              {/* Applied Discounts */}
              {state.cart.discounts.length > 0 && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800 mb-2">Applied Discounts</h3>
                  {state.cart.discounts.map((discount, index) => (
                    <div key={index} className="flex justify-between text-sm text-green-700">
                      <span>{discount.code}</span>
                      <span>
                        -{discount.discount}{discount.type === 'percentage' ? '%' : '$'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${state.cart.total.toFixed(2)}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary-600">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Button 
                as={Link} 
                to="/checkout" 
                size="lg" 
                className="w-full"
              >
                Proceed to Checkout
              </Button>

              {/* Security Notice */}
              <p className="text-xs text-gray-500 text-center mt-4">
                🔒 Secure checkout with SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart