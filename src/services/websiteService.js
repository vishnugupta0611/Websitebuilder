import api from './api'

export const websiteService = {
  // Get all user websites
  async getWebsites() {
    try {
      const response = await api.get('/websites/')
      return { success: true, data: response.results || response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get website by slug (public)
  async getWebsiteBySlug(slug) {
    try {
      const response = await api.get(`/websites/by_slug/?slug=${slug}`)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Create new website
  async createWebsite(websiteData) {
    try {
      const response = await api.post('/websites/', websiteData)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Update website
  async updateWebsite(id, websiteData) {
    try {
      const response = await api.put(`/websites/${id}/`, websiteData)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Delete website
  async deleteWebsite(id) {
    try {
      await api.delete(`/websites/${id}/`)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}