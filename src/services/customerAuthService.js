/**
 * Customer Authentication Service for Subsite Users
 * Handles login/signup for customers on individual websites
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

class CustomerAuthService {
    constructor() {
        this.tokenKey = 'customer_auth_token'
        this.userKey = 'customer_user_data'
        this.websiteKey = 'customer_website_context'
    }

    /**
     * Customer login for specific website
     */
    async customerLogin(email, password, websiteSlug) {
        try {
            const response = await fetch(`${API_BASE_URL}/customer-auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    website_slug: websiteSlug
                })
            })

            const data = await response.json()

            if (response.ok && data.success) {
                // Store customer auth data with website context
                this.setCustomerAuth(data.data, websiteSlug)
                return { success: true, data: data.data }
            } else {
                return { success: false, error: data.error || 'Login failed' }
            }
        } catch (error) {
            console.error('Customer login error:', error)
            return { success: false, error: 'Network error. Please try again.' }
        }
    }

    /**
     * Customer signup for specific website
     */
    async customerSignup(userData, websiteSlug) {
        try {
            const response = await fetch(`${API_BASE_URL}/customer-auth/signup/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userData,
                    website_slug: websiteSlug
                })
            })

            const data = await response.json()

            if (response.ok && data.success) {
                return { success: true, data: data.data }
            } else {
                return { success: false, error: data.error || 'Signup failed' }
            }
        } catch (error) {
            console.error('Customer signup error:', error)
            return { success: false, error: 'Network error. Please try again.' }
        }
    }

    /**
     * Verify customer OTP
     */
    async verifyCustomerOTP(email, otp, websiteSlug) {
        try {
            const response = await fetch(`${API_BASE_URL}/customer-auth/verify-otp/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    otp,
                    website_slug: websiteSlug
                })
            })

            const data = await response.json()

            if (response.ok && data.success) {
                // Store customer auth data after verification
                this.setCustomerAuth(data.data, websiteSlug)
                return { success: true, data: data.data }
            } else {
                return { success: false, error: data.error || 'OTP verification failed' }
            }
        } catch (error) {
            console.error('Customer OTP verification error:', error)
            return { success: false, error: 'Network error. Please try again.' }
        }
    }

    /**
     * Store customer authentication data with website context
     */
    setCustomerAuth(authData, websiteSlug) {
        try {
            // Store auth token
            localStorage.setItem(this.tokenKey, authData.access_token)
            
            // Store user data
            localStorage.setItem(this.userKey, JSON.stringify(authData.user))
            
            // Store website context
            localStorage.setItem(this.websiteKey, websiteSlug)
            
            console.log('Customer auth stored:', {
                user: authData.user.email,
                website: websiteSlug
            })
        } catch (error) {
            console.error('Error storing customer auth:', error)
        }
    }

    /**
     * Get customer authentication token
     */
    getCustomerToken() {
        return localStorage.getItem(this.tokenKey)
    }

    /**
     * Get customer user data
     */
    getCustomerUser() {
        try {
            const userData = localStorage.getItem(this.userKey)
            return userData ? JSON.parse(userData) : null
        } catch (error) {
            console.error('Error getting customer user:', error)
            return null
        }
    }

    /**
     * Get customer website context
     */
    getCustomerWebsite() {
        return localStorage.getItem(this.websiteKey)
    }

    /**
     * Check if customer is authenticated for specific website
     */
    isCustomerAuthenticated(websiteSlug = null) {
        const token = this.getCustomerToken()
        const user = this.getCustomerUser()
        const currentWebsite = this.getCustomerWebsite()
        
        if (!token || !user) {
            return false
        }
        
        // If websiteSlug is provided, check if it matches current context
        if (websiteSlug && currentWebsite !== websiteSlug) {
            return false
        }
        
        return true
    }

    /**
     * Get customer profile for current website
     */
    async getCustomerProfile() {
        const token = this.getCustomerToken()
        const websiteSlug = this.getCustomerWebsite()
        
        if (!token || !websiteSlug) {
            return { success: false, error: 'Not authenticated' }
        }

        try {
            const response = await fetch(`${API_BASE_URL}/customer-auth/profile/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-Website-Slug': websiteSlug
                }
            })

            const data = await response.json()

            if (response.ok && data.success) {
                return { success: true, data: data.data }
            } else {
                return { success: false, error: data.error || 'Failed to get profile' }
            }
        } catch (error) {
            console.error('Get customer profile error:', error)
            return { success: false, error: 'Network error. Please try again.' }
        }
    }

    /**
     * Update customer profile
     */
    async updateCustomerProfile(profileData) {
        const token = this.getCustomerToken()
        const websiteSlug = this.getCustomerWebsite()
        
        if (!token || !websiteSlug) {
            return { success: false, error: 'Not authenticated' }
        }

        try {
            const response = await fetch(`${API_BASE_URL}/customer-auth/profile/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-Website-Slug': websiteSlug
                },
                body: JSON.stringify(profileData)
            })

            const data = await response.json()

            if (response.ok && data.success) {
                // Update stored user data
                const updatedUser = { ...this.getCustomerUser(), ...data.data }
                localStorage.setItem(this.userKey, JSON.stringify(updatedUser))
                return { success: true, data: data.data }
            } else {
                return { success: false, error: data.error || 'Failed to update profile' }
            }
        } catch (error) {
            console.error('Update customer profile error:', error)
            return { success: false, error: 'Network error. Please try again.' }
        }
    }

    /**
     * Customer logout
     */
    async customerLogout() {
        try {
            const token = this.getCustomerToken()
            
            if (token) {
                // Call logout endpoint
                await fetch(`${API_BASE_URL}/customer-auth/logout/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                })
            }
        } catch (error) {
            console.error('Customer logout error:', error)
        } finally {
            // Clear all customer auth data
            this.clearCustomerAuth()
        }
    }

    /**
     * Clear customer authentication data
     */
    clearCustomerAuth() {
        localStorage.removeItem(this.tokenKey)
        localStorage.removeItem(this.userKey)
        localStorage.removeItem(this.websiteKey)
    }

    /**
     * Get authenticated headers for API requests
     */
    getAuthHeaders() {
        const token = this.getCustomerToken()
        const websiteSlug = this.getCustomerWebsite()
        
        const headers = {
            'Content-Type': 'application/json'
        }
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }
        
        if (websiteSlug) {
            headers['X-Website-Slug'] = websiteSlug
        }
        
        return headers
    }

    /**
     * Make authenticated API request
     */
    async makeAuthenticatedRequest(url, options = {}) {
        const headers = {
            ...this.getAuthHeaders(),
            ...options.headers
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            })

            if (response.status === 401) {
                // Token expired or invalid
                this.clearCustomerAuth()
                throw new Error('Authentication expired')
            }

            return response
        } catch (error) {
            console.error('Authenticated request error:', error)
            throw error
        }
    }
}

export const customerAuthService = new CustomerAuthService()
export default customerAuthService