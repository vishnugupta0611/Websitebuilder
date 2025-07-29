import api from './api'

export const orderService = {
  // Get user orders
  async getOrders() {
    try {
      const response = await api.get('/orders/')
      return { success: true, data: response.results || response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get single order
  async getOrder(id) {
    try {
      const response = await api.get(`/orders/${id}/`)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Create order (checkout)
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders/create_order/', orderData)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Update order status
  async updateOrderStatus(id, status) {
    try {
      const response = await api.put(`/orders/${id}/`, { status })
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get dashboard analytics
  async getDashboardAnalytics() {
    try {
      const response = await api.get('/analytics/dashboard/')
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}