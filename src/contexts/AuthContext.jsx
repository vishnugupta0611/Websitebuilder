import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
}

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      }
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
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

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for existing user session on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (authService.isAuthenticated()) {
          const result = await authService.getProfile()
          if (result.success) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: result.data })
          } else {
            // Token might be expired, clear it
            authService.logout()
            dispatch({ type: 'SET_LOADING', payload: false })
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
        authService.logout()
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkAuthStatus()
  }, [])

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null }) // Clear previous errors
      
      const result = await authService.register(userData)
      
      if (result.success) {
        dispatch({ type: 'SET_LOADING', payload: false })
        return { success: true, user: result.data.user }
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error })
        return { success: false, error: result.error }
      }
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const verifyOTP = async (email, otp) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const result = await authService.verifyOTP(email, otp)
      
      if (result.success) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: result.data.user })
        return { success: true, user: result.data.user }
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error })
        return { success: false, error: result.error }
      }
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const result = await authService.login(email, password)
      
      if (result.success) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: result.data.user })
        return { success: true, user: result.data.user }
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error })
        return { success: false, error: result.error }
      }
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      dispatch({ type: 'LOGOUT' })
    } catch (error) {
      console.error('Logout error:', error)
      dispatch({ type: 'LOGOUT' })
    }
  }

  const updateUser = async (userData) => {
    try {
      const result = await authService.updateProfile(userData)
      
      if (result.success) {
        dispatch({ type: 'UPDATE_USER', payload: userData })
        return { success: true, user: result.data }
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error })
        return { success: false, error: result.error }
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null })
  }

  const value = {
    ...state,
    register,
    verifyOTP,
    login,
    logout,
    updateUser,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext