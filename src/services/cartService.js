import api from './api'

export const cartService = {
  // Get user cart
  async getCart() {
    try {
      const response = await api.get('/cart/')
      return { success: true, data: response.results || response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Add item to cart
  async addToCart(cartItem) {
    try {
      const response = await api.post('/cart/add_to_cart/', cartItem)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Update cart item quantity
  async updateCartItem(id, updateData) {
    try {
      const response = await api.put(`/cart/${id}/`, updateData)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Remove item from cart
  async removeFromCart(id) {
    try {
      await api.delete(`/cart/${id}/`)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Clear cart
  async clearCart(websiteSlug = null) {
    try {
      const url = websiteSlug ? `/cart/clear_cart/?website_slug=${websiteSlug}` : '/cart/clear_cart/'
      await api.delete(url)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}