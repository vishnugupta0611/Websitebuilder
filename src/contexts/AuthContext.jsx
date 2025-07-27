import React, { createContext, useContext, useReducer, useEffect } from 'react'

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
    const checkAuthStatus = () => {
      try {
        const userData = localStorage.getItem('currentUser')
        const authToken = localStorage.getItem('authToken')
        
        if (userData && authToken) {
          const user = JSON.parse(userData)
          dispatch({ type: 'LOGIN_SUCCESS', payload: user })
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkAuthStatus()
  }, [])

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const userExists = existingUsers.find(user => user.email === userData.email)
      
      if (userExists) {
        throw new Error('User with this email already exists')
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVerified: false,
        role: 'user'
      }
      
      // Save to users list
      existingUsers.push(newUser)
      localStorage.setItem('users', JSON.stringify(existingUsers))
      
      console.log('User registered:', newUser)
      return { success: true, user: newUser }
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const verifyOTP = async (email, otp) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Dummy OTP verification (accept any 6-digit number)
      if (otp.length !== 6 || !/^\d+$/.test(otp)) {
        throw new Error('Please enter a valid 6-digit OTP')
      }
      
      // Find user and mark as verified
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const userIndex = users.findIndex(user => user.email === email)
      
      if (userIndex === -1) {
        throw new Error('User not found')
      }
      
      users[userIndex].isVerified = true
      users[userIndex].updatedAt = new Date().toISOString()
      localStorage.setItem('users', JSON.stringify(users))
      
      // Auto-login after verification
      const verifiedUser = users[userIndex]
      const authToken = `token_${verifiedUser.id}_${Date.now()}`
      
      localStorage.setItem('currentUser', JSON.stringify(verifiedUser))
      localStorage.setItem('authToken', authToken)
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: verifiedUser })
      
      console.log('OTP verified and user logged in:', verifiedUser)
      return { success: true, user: verifiedUser }
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Find user
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find(u => u.email === email && u.password === password)
      
      if (!user) {
        throw new Error('Invalid email or password')
      }
      
      if (!user.isVerified) {
        throw new Error('Please verify your email first')
      }
      
      // Create auth token
      const authToken = `token_${user.id}_${Date.now()}`
      
      // Save current user session
      localStorage.setItem('currentUser', JSON.stringify(user))
      localStorage.setItem('authToken', authToken)
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      
      console.log('User logged in:', user)
      return { success: true, user }
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('authToken')
    dispatch({ type: 'LOGOUT' })
    console.log('User logged out')
  }

  const updateUser = (userData) => {
    try {
      const updatedUser = { ...state.user, ...userData, updatedAt: new Date().toISOString() }
      
      // Update in users list
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const userIndex = users.findIndex(u => u.id === state.user.id)
      if (userIndex !== -1) {
        users[userIndex] = updatedUser
        localStorage.setItem('users', JSON.stringify(users))
      }
      
      // Update current user session
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      
      dispatch({ type: 'UPDATE_USER', payload: userData })
      
      return { success: true, user: updatedUser }
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