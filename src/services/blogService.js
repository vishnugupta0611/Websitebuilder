import api from './api'

export const blogService = {
  // Get blogs by website
  async getBlogs(websiteId = null) {
    try {
      const url = websiteId ? `/blogs/?website=${websiteId}` : '/blogs/'
      const response = await api.get(url)
      return { success: true, data: response.results || response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get blogs by website slug (public)
  async getBlogsByWebsiteSlug(slug) {
    try {
      const response = await api.get(`/blogs/by_website_slug/?slug=${slug}`)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get single blog
  async getBlog(id) {
    try {
      const response = await api.get(`/blogs/${id}/`)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Create new blog
  async createBlog(blogData) {
    try {
      const response = await api.post('/blogs/', blogData)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Update blog
  async updateBlog(id, blogData) {
    try {
      const response = await api.put(`/blogs/${id}/`, blogData)
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Delete blog
  async deleteBlog(id) {
    try {
      await api.delete(`/blogs/${id}/`)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}