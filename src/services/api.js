const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (!response.ok) {
        // Extract error message from response
        const errorMessage = data.error || data.message || data.detail || 
                           (typeof data === 'object' ? JSON.stringify(data) : data) ||
                           `HTTP error! status: ${response.status}`
        throw new Error(errorMessage)
      }
      
      return data
    } catch (error) {
      console.error('API request failed:', error)
      console.error('Request URL:', url)
      console.error('Request config:', config)
      throw error
    }
  }

  get(endpoint) {
    return this.request(endpoint)
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    })
  }
}

export default new ApiService()