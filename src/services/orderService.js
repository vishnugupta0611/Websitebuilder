import api from './api'

export const orderService = {
  // Get user orders (for website owners)
  async getOrders() {
    try {
      const response = await api.get('/orders/')
      return { success: true, data: response.results || response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get customer orders by email and website slug
  async getCustomerOrders(customerEmail, websiteSlug) {
    try {
      const response = await api.get(`/orders/customer_orders/?email=${encodeURIComponent(customerEmail)}&website_slug=${encodeURIComponent(websiteSlug)}`)
      return { success: true, data: response.results || response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get valid status choices from backend
  async getStatusChoices() {
    try {
      const response = await api.options('/orders/1/'); // OPTIONS request to get field choices
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
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
      console.log(`Attempting to update order ${id} status to: ${status}`);
      
      // Map frontend status to backend status based on what works
      const statusMapping = {
        'pending': 'pending',
        'processing': 'processing', 
        'completed': 'delivered',  // Backend uses 'delivered' instead of 'completed'
        'cancelled': 'cancelled'
      };

      const backendStatus = statusMapping[status] || status;
      console.log(`Mapped ${status} to backend status: ${backendStatus}`);

      const response = await api.patch(`/orders/${id}/`, { status: backendStatus });
      console.log(`✅ Success with status: ${backendStatus}`);
      
      return { success: true, data: { ...response, status: backendStatus } };
    } catch (error) {
      console.error('Order status update error:', error);
      return { 
        success: false, 
        error: error.response?.data || error.message || 'Failed to update order status'
      }
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