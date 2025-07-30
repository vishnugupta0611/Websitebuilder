import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { customerAuthService } from '../services/customerAuthService'

const CustomerAuthContext = createContext()

const initialState = {
    isAuthenticated: false,
    user: null,
    websiteSlug: null,
    loading: true,
    error: null
}

function customerAuthReducer(state, action) {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            }

        case 'SET_AUTHENTICATED':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                websiteSlug: action.payload.websiteSlug,
                loading: false,
                error: null
            }

        case 'SET_UNAUTHENTICATED':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                websiteSlug: null,
                loading: false,
                error: null
            }

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                loading: false
            }

        case 'UPDATE_USER':
            return {
                ...state,
                user: { ...state.user, ...action.payload }
            }

        default:
            return state
    }
}

export function CustomerAuthProvider({ children, websiteSlug }) {
    const [state, dispatch] = useReducer(customerAuthReducer, initialState)

    // Check authentication status on mount and website change
    useEffect(() => {
        checkAuthStatus()
    }, [websiteSlug])

    const checkAuthStatus = () => {
        dispatch({ type: 'SET_LOADING', payload: true })

        try {
            const isAuth = customerAuthService.isCustomerAuthenticated(websiteSlug)
            
            if (isAuth) {
                const user = customerAuthService.getCustomerUser()
                const currentWebsite = customerAuthService.getCustomerWebsite()
                
                dispatch({
                    type: 'SET_AUTHENTICATED',
                    payload: {
                        user,
                        websiteSlug: currentWebsite
                    }
                })
            } else {
                dispatch({ type: 'SET_UNAUTHENTICATED' })
            }
        } catch (error) {
            console.error('Auth check error:', error)
            dispatch({ type: 'SET_ERROR', payload: 'Authentication check failed' })
        }
    }

    const login = async (email, password) => {
        dispatch({ type: 'SET_LOADING', payload: true })

        try {
            const result = await customerAuthService.customerLogin(email, password, websiteSlug)
            
            if (result.success) {
                dispatch({
                    type: 'SET_AUTHENTICATED',
                    payload: {
                        user: result.data.user,
                        websiteSlug: websiteSlug
                    }
                })
                return { success: true }
            } else {
                dispatch({ type: 'SET_ERROR', payload: result.error })
                return { success: false, error: result.error }
            }
        } catch (error) {
            const errorMessage = 'Login failed. Please try again.'
            dispatch({ type: 'SET_ERROR', payload: errorMessage })
            return { success: false, error: errorMessage }
        }
    }

    const signup = async (userData) => {
        dispatch({ type: 'SET_LOADING', payload: true })

        try {
            const result = await customerAuthService.customerSignup(userData, websiteSlug)
            
            if (result.success) {
                dispatch({ type: 'SET_LOADING', payload: false })
                return { success: true, data: result.data }
            } else {
                dispatch({ type: 'SET_ERROR', payload: result.error })
                return { success: false, error: result.error }
            }
        } catch (error) {
            const errorMessage = 'Signup failed. Please try again.'
            dispatch({ type: 'SET_ERROR', payload: errorMessage })
            return { success: false, error: errorMessage }
        }
    }

    const verifyOTP = async (email, otp) => {
        dispatch({ type: 'SET_LOADING', payload: true })

        try {
            const result = await customerAuthService.verifyCustomerOTP(email, otp, websiteSlug)
            
            if (result.success) {
                dispatch({
                    type: 'SET_AUTHENTICATED',
                    payload: {
                        user: result.data.user,
                        websiteSlug: websiteSlug
                    }
                })
                return { success: true }
            } else {
                dispatch({ type: 'SET_ERROR', payload: result.error })
                return { success: false, error: result.error }
            }
        } catch (error) {
            const errorMessage = 'OTP verification failed. Please try again.'
            dispatch({ type: 'SET_ERROR', payload: errorMessage })
            return { success: false, error: errorMessage }
        }
    }

    const updateProfile = async (profileData) => {
        try {
            const result = await customerAuthService.updateCustomerProfile(profileData)
            
            if (result.success) {
                dispatch({ type: 'UPDATE_USER', payload: result.data })
                return { success: true, data: result.data }
            } else {
                return { success: false, error: result.error }
            }
        } catch (error) {
            return { success: false, error: 'Profile update failed. Please try again.' }
        }
    }

    const logout = async () => {
        try {
            await customerAuthService.customerLogout()
            dispatch({ type: 'SET_UNAUTHENTICATED' })
        } catch (error) {
            console.error('Logout error:', error)
            // Still clear local state even if API call fails
            dispatch({ type: 'SET_UNAUTHENTICATED' })
        }
    }

    const clearError = () => {
        dispatch({ type: 'SET_ERROR', payload: null })
    }

    const value = {
        ...state,
        login,
        signup,
        verifyOTP,
        updateProfile,
        logout,
        clearError,
        checkAuthStatus
    }

    return (
        <CustomerAuthContext.Provider value={value}>
            {children}
        </CustomerAuthContext.Provider>
    )
}

export function useCustomerAuth() {
    const context = useContext(CustomerAuthContext)
    if (!context) {
        throw new Error('useCustomerAuth must be used within a CustomerAuthProvider')
    }
    return context
}

export default CustomerAuthContext