import api from './api'
import { websiteService } from './websiteService'
import { blogService } from './blogService'

export const contentService = {
  // Website Management - delegate to websiteService
  async getWebsites() {
    return await websiteService.getWebsites()
  },

  async getWebsiteBySlug(slug) {
    return await websiteService.getWebsiteBySlug(slug)
  },

  async createWebsite(websiteData) {
    return await websiteService.createWebsite(websiteData)
  },

  async updateWebsite(id, websiteData) {
    return await websiteService.updateWebsite(id, websiteData)
  },

  async deleteWebsite(id) {
    return await websiteService.deleteWebsite(id)
  },

  // Blog Management - delegate to blogService
  async getBlogs(websiteId = null) {
    return await blogService.getBlogs(websiteId)
  },

  async getBlogsByWebsiteSlug(slug) {
    return await blogService.getBlogsByWebsiteSlug(slug)
  },

  async getBlogById(id) {
    return await blogService.getBlog(id)
  },

  async createBlog(blogData) {
    return await blogService.createBlog(blogData)
  },

  async updateBlog(id, blogData) {
    return await blogService.updateBlog(id, blogData)
  },

  async deleteBlog(id) {
    return await blogService.deleteBlog(id)
  },

  // Legacy methods for backward compatibility
  async getPages() {
    return await this.getBlogs()
  },

  async getPageById(id) {
    return await this.getBlogById(id)
  },

  async createPage(pageData) {
    return await this.createBlog(pageData)
  },

  async updatePage(id, pageData) {
    return await this.updateBlog(id, pageData)
  },

  async deletePage(id) {
    return await this.deleteBlog(id)
  },

  // Templates (keeping mock for now)
  async getTemplates() {
    try {
      return await api.get('/content/templates')
    } catch (error) {
      // Mock templates for development
      return {
        success: true,
        data: [
          {
            id: 'template-1',
            name: 'Default Page',
            type: 'page',
            structure: {
              sections: ['header', 'content', 'footer']
            },
            defaultStyles: {
              colors: { primary: '#3b82f6', secondary: '#64748b' },
              typography: { headingFont: 'Inter', bodyFont: 'Inter' }
            },
            customizableElements: [
              { id: 'header', type: 'section', label: 'Header Section' },
              { id: 'content', type: 'text', label: 'Main Content' }
            ]
          },
          {
            id: 'template-2',
            name: 'Blog Template',
            type: 'blog',
            structure: {
              sections: ['header', 'article', 'sidebar', 'footer']
            },
            defaultStyles: {
              colors: { primary: '#059669', secondary: '#6b7280' },
              typography: { headingFont: 'Inter', bodyFont: 'Inter' }
            },
            customizableElements: [
              { id: 'article', type: 'text', label: 'Article Content' },
              { id: 'sidebar', type: 'section', label: 'Sidebar' }
            ]
          },
          {
            id: 'template-3',
            name: 'Product Template',
            type: 'product',
            structure: {
              sections: ['gallery', 'details', 'description', 'reviews']
            },
            defaultStyles: {
              colors: { primary: '#dc2626', secondary: '#374151' },
              typography: { headingFont: 'Inter', bodyFont: 'Inter' }
            },
            customizableElements: [
              { id: 'gallery', type: 'image', label: 'Product Gallery' },
              { id: 'details', type: 'section', label: 'Product Details' }
            ]
          }
        ]
      }
    }
  },

  async getTemplateById(id) {
    try {
      return await api.get(`/content/templates/${id}`)
    } catch (error) {
      const templatesResult = await this.getTemplates()
      if (templatesResult.success) {
        const template = templatesResult.data.find(template => template.id === id)
        return { success: true, data: template }
      }
      return { success: false, error: 'Template not found' }
    }
  }
}