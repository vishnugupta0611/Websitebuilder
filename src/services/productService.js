import api from './api'

export const productService = {
  // Get products by website
  async getProducts(websiteId = null) {
    try {
      const url = websiteId ? `/products/?website=${websiteId}` : '/products/'
      const response = await api.get(url)
      return { success: true, data: response.results || response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get products by website slug (public)
  async getProductsByWebsiteSlug(slug) {
    try {
      const response = await api.get(`/products/by_website_slug/?slug=${slug}`)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get single product
  async getProduct(id) {
    try {
      const response = await api.get(`/products/${id}/`)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Create new product
  async createProduct(productData) {
    try {
      const response = await api.post('/products/', productData)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Update product
  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/products/${id}/`, productData)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Delete product
  async deleteProduct(id) {
    try {
      await api.delete(`/products/${id}/`)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}