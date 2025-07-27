import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { ecommerceService } from '../services/ecommerceService'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { CreditCard, Lock, CheckCircle } from 'lucide-react'

function Checkout() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [processing, setProcessing] = useState(false)
  
  const [formData, setFormData] = useState({
    // Customer Info
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    
    // Billing Address
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: 'US',
    
    // Shipping Address
    sameAsbilling: true,
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: 'US',
    
    // Payment
    paymentMethod: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })

  const [errors, setErrors] = useState({})

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}
    
    if (step === 1) {
      if (!formData.email) newErrors.email = 'Email is required'
      if (!formData.firstName) newErrors.firstName = 'First name is required'
      if (!formData.lastName) newErrors.lastName = 'Last name is required'
    }
    
    if (step === 2) {
      if (!formData.billingAddress) newErrors.billingAddress = 'Address is required'
      if (!formData.billingCity) newErrors.billingCity = 'City is required'
      if (!formData.billingState) newErrors.billingState = 'State is required'
      if (!formData.billingZip) newErrors.billingZip = 'ZIP code is required'
      
      if (!formData.sameAsbilling) {
        if (!formData.shippingAddress) newErrors.shippingAddress = 'Shipping address is required'
        if (!formData.shippingCity) newErrors.shippingCity = 'Shipping city is required'
        if (!formData.shippingState) newErrors.shippingState = 'Shipping state is required'
        if (!formData.shippingZip) newErrors.shippingZip = 'Shipping ZIP is required'
      }
    }
    
    if (step === 3) {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required'
      if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required'
      if (!formData.cvv) newErrors.cvv = 'CVV is required'
      if (!formData.cardName) newErrors.cardName = 'Cardholder name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  const calculateTotals = () => {
    const subtotal = state.cart.total
    const discountAmount = state.cart.discounts.reduce((total, discount) => {
      if (discount.type === 'percentage') {
        return total + (subtotal * discount.discount / 100)
      }
      return total + discount.discount
    }, 0)
    const discountedSubtotal = subtotal - discountAmount
    const tax = discountedSubtotal * 0.08 // 8% tax
    const shipping = discountedSubtotal > 50 ? 0 : 9.99
    const total = discountedSubtotal + tax + shipping
    
    return { subtotal, discountAmount, tax, shipping, total }
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return
    
    setProcessing(true)
    
    try {
      // Process payment
      const paymentResult = await ecommerceService.processPayment({
        amount: totals.total,
        method: formData.paymentMethod,
        card: {
          number: formData.cardNumber,
          expiry: formData.expiryDate,
          cvv: formData.cvv,
          name: formData.cardName
        }
      })
      
      if (paymentResult.success) {
        // Create order
        const orderData = {
          customerId: 'customer-1', // In real app, get from auth
          items: state.cart.items,
          billing: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: formData.billingAddress,
            city: formData.billingCity,
            state: formData.billingState,
            zip: formData.billingZip,
            country: formData.billingCountry
          },
          shipping: formData.sameAsBinding ? {
            name: `${formData.firstName} ${formData.lastName}`,
            address: formData.billingAddress,
            city: formData.billingCity,
            state: formData.billingState,
            zip: formData.billingZip,
            country: formData.billingCountry
          } : {
            name: `${formData.firstName} ${formData.lastName}`,
            address: formData.shippingAddress,
            city: formData.shippingCity,
            state: formData.shippingState,
            zip: formData.shippingZip,
            country: formData.shippingCountry
          },
          payment: {
            method: formData.paymentMethod,
            transactionId: paymentResult.transactionId,
            status: 'completed'
          },
          totals
        }
        
        const order = await ecommerceService.createOrder(orderData)
        
        // Clear cart
        dispatch({ type: 'CLEAR_CART' })
        
        // Redirect to success page
        navigate(`/orders/${order.id}?success=true`)
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Payment failed. Please try again.' })
    } finally {
      setProcessing(false)
    }
  }

  const totals = calculateTotals()

  if (state.cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <Button onClick={() => navigate('/products')}>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {step === 1 ? 'Contact' : step === 2 ? 'Shipping' : 'Payment'}
                </span>
                {step < 3 && <div className="w-12 h-px bg-gray-300 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Step 1: Contact Information */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      error={errors.email}
                      className="md:col-span-2"
                    />
                    <Input
                      label="First Name"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      error={errors.firstName}
                    />
                    <Input
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      error={errors.lastName}
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      error={errors.phone}
                      className="md:col-span-2"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Information */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
                  
                  {/* Billing Address */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Address"
                        value={formData.billingAddress}
                        onChange={(e) => updateFormData('billingAddress', e.target.value)}
                        error={errors.billingAddress}
                        className="md:col-span-2"
                      />
                      <Input
                        label="City"
                        value={formData.billingCity}
                        onChange={(e) => updateFormData('billingCity', e.target.value)}
                        error={errors.billingCity}
                      />
                      <Input
                        label="State"
                        value={formData.billingState}
                        onChange={(e) => updateFormData('billingState', e.target.value)}
                        error={errors.billingState}
                      />
                      <Input
                        label="ZIP Code"
                        value={formData.billingZip}
                        onChange={(e) => updateFormData('billingZip', e.target.value)}
                        error={errors.billingZip}
                      />
                    </div>
                  </div>

                  {/* Same as Billing Checkbox */}
                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.sameAsBinding}
                        onChange={(e) => updateFormData('sameAsBinding', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Shipping address is the same as billing address
                      </span>
                    </label>
                  </div>

                  {/* Shipping Address */}
                  {!formData.sameAsBinding && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Address"
                          value={formData.shippingAddress}
                          onChange={(e) => updateFormData('shippingAddress', e.target.value)}
                          error={errors.shippingAddress}
                          className="md:col-span-2"
                        />
                        <Input
                          label="City"
                          value={formData.shippingCity}
                          onChange={(e) => updateFormData('shippingCity', e.target.value)}
                          error={errors.shippingCity}
                        />
                        <Input
                          label="State"
                          value={formData.shippingState}
                          onChange={(e) => updateFormData('shippingState', e.target.value)}
                          error={errors.shippingState}
                        />
                        <Input
                          label="ZIP Code"
                          value={formData.shippingZip}
                          onChange={(e) => updateFormData('shippingZip', e.target.value)}
                          error={errors.shippingZip}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Payment Information */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Payment Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Card Number"
                      value={formData.cardNumber}
                      onChange={(e) => updateFormData('cardNumber', e.target.value)}
                      error={errors.cardNumber}
                      placeholder="1234 5678 9012 3456"
                      className="md:col-span-2"
                    />
                    <Input
                      label="Expiry Date"
                      value={formData.expiryDate}
                      onChange={(e) => updateFormData('expiryDate', e.target.value)}
                      error={errors.expiryDate}
                      placeholder="MM/YY"
                    />
                    <Input
                      label="CVV"
                      value={formData.cvv}
                      onChange={(e) => updateFormData('cvv', e.target.value)}
                      error={errors.cvv}
                      placeholder="123"
                    />
                    <Input
                      label="Cardholder Name"
                      value={formData.cardName}
                      onChange={(e) => updateFormData('cardName', e.target.value)}
                      error={errors.cardName}
                      className="md:col-span-2"
                    />
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center text-sm text-gray-600">
                      <Lock className="h-4 w-4 mr-2" />
                      Your payment information is encrypted and secure
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                {currentStep < 3 ? (
                  <Button onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    loading={processing}
                    className="flex items-center"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Complete Order
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {state.cart.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>{totals.shipping === 0 ? 'Free' : `$${totals.shipping.toFixed(2)}`}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span>${totals.tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span className="text-primary-600">${totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout