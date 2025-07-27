import api from './api'

export const ecommerceService = {
  // Products
  async getProducts(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString()
      return await api.get(`/products?${queryParams}`)
    } catch (error) {
      // Mock products for development
      return [
        {
          id: '1',
          sku: 'CORP-001',
          name: 'Professional Business Card Holder',
          description: 'Elegant leather business card holder perfect for corporate professionals.',
          price: 29.99,
          images: [
            { id: '1', url: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Business+Card+Holder', alt: 'Business Card Holder' }
          ],
          variants: [
            { id: '1', name: 'Black Leather', price: 29.99, inventory: 50 },
            { id: '2', name: 'Brown Leather', price: 29.99, inventory: 30 }
          ],
          inventory: { total: 80, available: 80, reserved: 0 },
          categories: ['office', 'accessories'],
          tags: ['business', 'professional', 'leather'],
          customizations: {
            colors: { primary: '#1f2937', accent: '#3b82f6' },
            layout: { style: 'grid' }
          }
        },
        {
          id: '2',
          sku: 'CORP-002',
          name: 'Executive Pen Set',
          description: 'Premium pen set with gold accents, perfect for signing important documents.',
          price: 89.99,
          images: [
            { id: '2', url: 'https://via.placeholder.com/400x300/059669/ffffff?text=Executive+Pen+Set', alt: 'Executive Pen Set' }
          ],
          variants: [
            { id: '3', name: 'Gold Accent', price: 89.99, inventory: 25 },
            { id: '4', name: 'Silver Accent', price: 79.99, inventory: 35 }
          ],
          inventory: { total: 60, available: 60, reserved: 0 },
          categories: ['office', 'writing'],
          tags: ['executive', 'premium', 'gold'],
          customizations: {
            colors: { primary: '#059669', accent: '#fbbf24' },
            layout: { style: 'showcase' }
          }
        },
        {
          id: '3',
          sku: 'CORP-003',
          name: 'Corporate Laptop Bag',
          description: 'Durable and stylish laptop bag designed for business professionals.',
          price: 149.99,
          images: [
            { id: '3', url: 'https://via.placeholder.com/400x300/dc2626/ffffff?text=Laptop+Bag', alt: 'Corporate Laptop Bag' }
          ],
          variants: [
            { id: '5', name: '15" Laptop', price: 149.99, inventory: 40 },
            { id: '6', name: '17" Laptop', price: 169.99, inventory: 20 }
          ],
          inventory: { total: 60, available: 60, reserved: 0 },
          categories: ['bags', 'technology'],
          tags: ['laptop', 'business', 'travel'],
          customizations: {
            colors: { primary: '#dc2626', accent: '#374151' },
            layout: { style: 'detailed' }
          }
        }
      ]
    }
  },

  async getProductById(id) {
    try {
      return await api.get(`/products/${id}`)
    } catch (error) {
      const products = await this.getProducts()
      return products.find(product => product.id === id)
    }
  },

  // Orders
  async createOrder(orderData) {
    try {
      return await api.post('/orders', orderData)
    } catch (error) {
      // Mock order creation for development
      return {
        id: Date.now().toString(),
        ...orderData,
        status: 'pending',
        timeline: [
          {
            status: 'created',
            timestamp: new Date().toISOString(),
            note: 'Order created successfully'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  },

  async getOrders(customerId) {
    try {
      return await api.get(`/orders?customerId=${customerId}`)
    } catch (error) {
      // Mock orders for development
      return [
        {
          id: '1001',
          customerId: 'customer-1',
          items: [
            {
              id: '1',
              productId: '1',
              name: 'Professional Business Card Holder',
              quantity: 2,
              price: 29.99,
              total: 59.98
            }
          ],
          status: 'shipped',
          billing: {
            name: 'John Doe',
            address: '123 Business St',
            city: 'Corporate City',
            state: 'CC',
            zip: '12345'
          },
          shipping: {
            name: 'John Doe',
            address: '123 Business St',
            city: 'Corporate City',
            state: 'CC',
            zip: '12345'
          },
          payment: {
            method: 'credit_card',
            last4: '1234',
            status: 'completed'
          },
          totals: {
            subtotal: 59.98,
            tax: 4.80,
            shipping: 9.99,
            total: 74.77
          },
          timeline: [
            {
              status: 'created',
              timestamp: '2024-01-15T10:00:00Z',
              note: 'Order created'
            },
            {
              status: 'paid',
              timestamp: '2024-01-15T10:05:00Z',
              note: 'Payment processed'
            },
            {
              status: 'shipped',
              timestamp: '2024-01-16T14:30:00Z',
              note: 'Order shipped via UPS',
              trackingNumber: 'UPS123456789'
            }
          ],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-16T14:30:00Z'
        }
      ]
    }
  },

  async getOrderById(id) {
    try {
      return await api.get(`/orders/${id}`)
    } catch (error) {
      const orders = await this.getOrders()
      return orders.find(order => order.id === id)
    }
  },

  // Discounts and Coupons
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
        return coupon
      }
      
      return { valid: false, message: 'Invalid coupon code' }
    }
  },

  // Payment Processing
  async processPayment(paymentData) {
    try {
      return await api.post('/payments/process', paymentData)
    } catch (error) {
      // Mock payment processing for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            transactionId: `txn_${Date.now()}`,
            status: 'completed',
            message: 'Payment processed successfully'
          })
        }, 2000) // Simulate processing time
      })
    }
  }
}