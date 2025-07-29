import api from './api'
import { productService } from './productService'
import { orderService } from './orderService'

export const ecommerceService = {
  // Products - delegate to productService
  async getProducts(filters = {}) {
    return await productService.getProducts(filters.website)
  },

  async getProductById(id) {
    return await productService.getProduct(id)
  },

  async getProductsByWebsiteSlug(slug) {
    return await productService.getProductsByWebsiteSlug(slug)
  },

  // Orders - delegate to orderService
  async createOrder(orderData) {
    return await orderService.createOrder(orderData)
  },

  async getOrders() {
    return await orderService.getOrders()
  },

  async getOrderById(id) {
    return await orderService.getOrder(id)
  },

  // Discounts and Coupons (keeping mock for now)
  async validateCoupon(couponCode) {
    try {
      return await api.post('/coupons/validate', { code: couponCode })
    } catch (error) {
      // Mock coupon validation for development
      const mockCoupons = {
        'SAVE10': { discount: 10, type: 'percentage', valid: true },
        'WELCOME20': { discount: 20, type: 'percentage', valid: true },
        'EXPIRED': { valid: false, message: 'Coupon has expired' }
      }
      
      const coupon = mockCoupons[couponCode.toUpperCase()]
      if (coupon) {
        return { success: true, data: coupon }
      }
      
      return { success: false, error: 'Invalid coupon code' }
    }
  },

  // Payment Processing (keeping mock for now)
  async processPayment(paymentData) {
    try {
      return await api.post('/payments/process', paymentData)
    } catch (error) {
      // Mock payment processing for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              transactionId: `txn_${Date.now()}`,
              status: 'completed',
              message: 'Payment processed successfully'
            }
          })
        }, 2000) // Simulate processing time
      })
    }
  }
}