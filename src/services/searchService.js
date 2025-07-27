import api from './api'

export const searchService = {
  async search(query, filters = {}) {
    try {
      const searchParams = {
        q: query,
        ...filters
      }
      const queryString = new URLSearchParams(searchParams).toString()
      return await api.get(`/search?${queryString}`)
    } catch (error) {
      // Mock search results for development
      const mockResults = [
        {
          id: '1',
          type: 'page',
          title: 'Home Page',
          content: 'Welcome to Corporate Portal. This is the home page content.',
          url: '/',
          snippet: 'Welcome to Corporate Portal. This is the home page...',
          relevance: 0.95,
          lastModified: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          type: 'product',
          title: 'Professional Business Card Holder',
          content: 'Elegant leather business card holder perfect for corporate professionals.',
          url: '/products/1',
          snippet: 'Elegant leather business card holder perfect for corporate...',
          relevance: 0.87,
          lastModified: '2024-01-10T15:30:00Z',
          price: 29.99,
          image: 'https://via.placeholder.com/100x100/3b82f6/ffffff?text=Card+Holder'
        },
        {
          id: '3',
          type: 'blog',
          title: 'Company News',
          content: 'Latest Company Updates. Stay informed about our latest developments.',
          url: '/blog/company-news',
          snippet: 'Latest Company Updates. Stay informed about our latest...',
          relevance: 0.72,
          lastModified: '2024-01-12T09:15:00Z'
        }
      ]

      // Filter results based on query
      if (query) {
        const filteredResults = mockResults.filter(result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.content.toLowerCase().includes(query.toLowerCase())
        )
        return {
          results: filteredResults,
          total: filteredResults.length,
          query,
          filters,
          suggestions: query.length > 0 ? ['corporate', 'business', 'professional'] : []
        }
      }

      return {
        results: mockResults,
        total: mockResults.length,
        query,
        filters,
        suggestions: []
      }
    }
  },

  async getSearchSuggestions(query) {
    try {
      return await api.get(`/search/suggestions?q=${query}`)
    } catch (error) {
      // Mock suggestions for development
      const mockSuggestions = [
        'corporate portal',
        'business cards',
        'professional accessories',
        'executive products',
        'office supplies'
      ]

      if (query) {
        return mockSuggestions.filter(suggestion =>
          suggestion.toLowerCase().includes(query.toLowerCase())
        )
      }

      return mockSuggestions
    }
  },

  async getPopularSearches() {
    try {
      return await api.get('/search/popular')
    } catch (error) {
      // Mock popular searches for development
      return [
        { query: 'business cards', count: 150 },
        { query: 'executive pens', count: 89 },
        { query: 'laptop bags', count: 76 },
        { query: 'corporate gifts', count: 65 },
        { query: 'office accessories', count: 54 }
      ]
    }
  }
}