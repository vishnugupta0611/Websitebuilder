import api from './api'

export const searchService = {
  async search(query, filters = {}) {
    try {
      const searchParams = {
        q: query,
        ...filters
      }
      const queryString = new URLSearchParams(searchParams).toString()
      const response = await api.get(`/search/?${queryString}`)
      return response
    } catch (error) {
      console.error('Search API error:', error)
      
      // Fallback to mock data if API fails
      const mockResults = [
        {
          id: '1',
          type: 'page',
          title: 'Sample Website',
          snippet: 'This is a sample website page that matches your search...',
          url: '/sample-website',
          relevance: 0.85,
          lastModified: new Date().toISOString()
        },
        {
          id: '2',
          type: 'product',
          title: 'Sample Product',
          snippet: 'This is a sample product that matches your search criteria...',
          url: '/sample-website/products/1',
          relevance: 0.75,
          lastModified: new Date().toISOString(),
          price: 99.99
        },
        {
          id: '3',
          type: 'blog',
          title: 'Sample Blog Post',
          snippet: 'This is a sample blog post that contains relevant information...',
          url: '/sample-website/blogs/sample-post',
          relevance: 0.65,
          lastModified: new Date().toISOString()
        }
      ]

      // Filter results based on query
      if (query) {
        const filteredResults = mockResults.filter(result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.snippet.toLowerCase().includes(query.toLowerCase())
        )
        return {
          results: filteredResults,
          total: filteredResults.length,
          query,
          suggestions: ['sample', 'website', 'product', 'blog']
        }
      }

      return {
        results: [],
        total: 0,
        query,
        suggestions: []
      }
    }
  },

  async getSearchSuggestions(query) {
    try {
      const response = await api.get(`/search/suggestions/?q=${query}`)
      return response
    } catch (error) {
      console.error('Search suggestions API error:', error)
      
      // Mock suggestions for development
      const mockSuggestions = [
        'website',
        'product',
        'blog',
        'business',
        'portfolio'
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
      const response = await api.get('/search/popular/')
      return response
    } catch (error) {
      console.error('Popular searches API error:', error)
      
      // Mock popular searches for development
      return [
        { query: 'websites', count: 150 },
        { query: 'products', count: 89 },
        { query: 'blog posts', count: 76 },
        { query: 'business', count: 65 },
        { query: 'portfolio', count: 54 }
      ]
    }
  }
}