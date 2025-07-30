import api from './api'

export const authService = {
  // Register new user
  async register(userData) {
    try {
      const response = await api.post('/auth/register/', userData)
      return { success: true, data: response }
    } catch (error) {
      // Handle specific validation errors
      let errorMessage = error.message
      
      try {
        const errorData = JSON.parse(error.message)
        if (errorData.password) {
          errorMessage = errorData.password[0]
        } else if (errorData.confirmPassword) {
          errorMessage = errorData.confirmPassword[0]
        } else if (errorData.email) {
          errorMessage = errorData.email[0]
        } else if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors[0]
        }
      } catch (e) {
        // If parsing fails, use the original error message
      }
      
      return { success: false, error: errorMessage }
    }
  },

  // Verify OTP
  async verifyOTP(email, otp) {
    try {
      const response = await api.post('/auth/verify-otp/', { email, otp })
      
      if (response.tokens) {
        localStorage.setItem('authToken', response.tokens.access)
        localStorage.setItem('refreshToken', response.tokens.refresh)
        localStorage.setItem('currentUser', JSON.stringify(response.user))
      }
      
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/auth/login/', { email, password })
      
      if (response.tokens) {
        localStorage.setItem('authToken', response.tokens.access)
        localStorage.setItem('refreshToken', response.tokens.refresh)
        localStorage.setItem('currentUser', JSON.stringify(response.user))
      }
      
      return { success: true, data: response }
    } catch (error) {
      // Handle specific validation errors
      let errorMessage = error.message
      
      try {
        const errorData = JSON.parse(error.message)
        if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors[0]
        } else if (errorData.email) {
          errorMessage = errorData.email[0]
        } else if (errorData.password) {
          errorMessage = errorData.password[0]
        }
      } catch (e) {
        // If parsing fails, use the original error message
      }
      
      return { success: false, error: errorMessage }
    }
  },

  // Logout user
  async logout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('currentUser')
    }
  },

  // Get user profile
  async getProfile() {
    try {
      const response = await api.get('/auth/profile/')
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await api.put('/auth/profile/', userData)
      localStorage.setItem('currentUser', JSON.stringify(response))
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Resend OTP
  async resendOTP(email) {
    try {
      const response = await api.post('/auth/resend-otp/', { email })
      return { success: true, data: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('authToken')
  },

  // Get current user from localStorage
  getCurrentUser() {
    const userData = localStorage.getItem('currentUser')
    return userData ? JSON.parse(userData) : null
  }
}