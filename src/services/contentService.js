import api from './api'

export const contentService = {
  // Content Management
  async getPages() {
    try {
      return await api.get('/content/pages')
    } catch (error) {
      // Mock data for development
      return [
        {
          id: '1',
          type: 'page',
          title: 'Home Page',
          slug: 'home',
          content: '<h1>Welcome to Corporate Portal</h1><p>This is the home page content.</p>',
          template: { id: 'template-1', name: 'Default Page' },
          customizations: {
            colors: { primary: '#3b82f6', secondary: '#64748b' },
            typography: { headingFont: 'Inter', bodyFont: 'Inter' }
          },
          status: 'published',
          publishDate: new Date().toISOString(),
          author: { id: '1', name: 'Admin User' },
          tags: ['home', 'main'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'blog',
          title: 'Company News',
          slug: 'company-news',
          content: '<h2>Latest Company Updates</h2><p>Stay informed about our latest developments.</p>',
          template: { id: 'template-2', name: 'Blog Template' },
          customizations: {
            colors: { primary: '#059669', secondary: '#6b7280' },
            typography: { headingFont: 'Inter', bodyFont: 'Inter' }
          },
          status: 'published',
          publishDate: new Date().toISOString(),
          author: { id: '2', name: 'Content Manager' },
          tags: ['blog', 'news'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    }
  },

  async getPageById(id) {
    try {
      return await api.get(`/content/pages/${id}`)
    } catch (error) {
      const pages = await this.getPages()
      return pages.find(page => page.id === id)
    }
  },

  async createPage(pageData) {
    try {
      return await api.post('/content/pages', pageData)
    } catch (error) {
      // Mock response for development
      return {
        id: Date.now().toString(),
        ...pageData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  },

  async updatePage(id, pageData) {
    try {
      return await api.put(`/content/pages/${id}`, pageData)
    } catch (error) {
      // Mock response for development
      return {
        id,
        ...pageData,
        updatedAt: new Date().toISOString()
      }
    }
  },

  async deletePage(id) {
    try {
      return await api.delete(`/content/pages/${id}`)
    } catch (error) {
      // Mock response for development
      return { success: true }
    }
  },

  // Templates
  async getTemplates() {
    try {
      return await api.get('/content/templates')
    } catch (error) {
      // Mock templates for development
      return [
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
  },

  async getTemplateById(id) {
    try {
      return await api.get(`/content/templates/${id}`)
    } catch (error) {
      const templates = await this.getTemplates()
      return templates.find(template => template.id === id)
    }
  }
}