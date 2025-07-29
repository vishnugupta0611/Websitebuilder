import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { cartService } from '../services/cartService'
import { websiteService } from '../services/websiteService'
import { productService } from '../services/productService'
import { orderService } from '../services/orderService'
import { authService } from '../services/authService'

const AppContext = createContext()

const initialState = {
  cart: {
    items: [],
    total: 0,
    discounts: []
  },
  websites: [],
  
  products: [],
  blogs: [],
  orders: [],
  analytics: null,
  search: {
    query: '',
    results: [],
    filters: {}
  },
  ui: {
    loading: false,
    error: null,
    theme: 'light'
  }
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, ui: { ...state.ui, loading: action.payload } }
    
    case 'SET_ERROR':
      return { ...state, ui: { ...state.ui, error: action.payload } }
    
    case 'SET_CART':
      const total = action.payload.reduce((sum, item) => sum + (item.product_price * item.quantity), 0)
      return {
        ...state,
        cart: { ...state.cart, items: action.payload, total }
      }
    
    case 'SET_WEBSITES':
      return { ...state, websites: action.payload }
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload }
    
    case 'SET_BLOGS':
      return { ...state, blogs: action.payload }
    
    case 'SET_ORDERS':
      return { ...state, orders: action.payload }
    
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload }
    
    case 'SET_SEARCH_RESULTS':
      return { ...state, search: { ...state.search, results: action.payload } }
    
    case 'SET_SEARCH_QUERY':
      return { ...state, search: { ...state.search, query: action.payload } }
    
    case 'APPLY_DISCOUNT':
      return {
        ...state,
        cart: { ...state.cart, discounts: [...state.cart.discounts, action.payload] }
      }
    
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load user data on mount if authenticated
  useEffect(() => {
    const loadUserData = async () => {
      if (authService.isAuthenticated()) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true })
          
          // Load cart (silently fail if backend not available)
          try {
            const cartResult = await cartService.getCart()
            if (cartResult.success) {
              dispatch({ type: 'SET_CART', payload: cartResult.data })
            }
          } catch (error) {
            console.log('Cart loading failed (backend may not be running):', error.message)
          }
          
          // Load websites (silently fail if backend not available)
          try {
            const websitesResult = await websiteService.getWebsites()
            if (websitesResult.success) {
              dispatch({ type: 'SET_WEBSITES', payload: websitesResult.data })
            }
          } catch (error) {
            console.log('Websites loading failed (backend may not be running):', error.message)
          }
          
          // Load orders (silently fail if backend not available)
          try {
            const ordersResult = await orderService.getOrders()
            if (ordersResult.success) {
              dispatch({ type: 'SET_ORDERS', payload: ordersResult.data })
            }
          } catch (error) {
            console.log('Orders loading failed (backend may not be running):', error.message)
          }
          
          // Load analytics (silently fail if backend not available)
          try {
            const analyticsResult = await orderService.getDashboardAnalytics()
            if (analyticsResult.success) {
              dispatch({ type: 'SET_ANALYTICS', payload: analyticsResult.data })
            }
          } catch (error) {
            console.log('Analytics loading failed (backend may not be running):', error.message)
          }
          
        } catch (error) {
          console.log('User data loading failed:', error.message)
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    loadUserData()
  }, [])

  // API service methods
  const addToCart = async (cartItem) => {
    try {
      const result = await cartService.addToCart(cartItem)
      if (result.success) {
        // Reload cart
        const cartResult = await cartService.getCart()
        if (cartResult.success) {
          dispatch({ type: 'SET_CART', payload: cartResult.data })
        }
        return result
      }
      return result
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const removeFromCart = async (id) => {
    try {
      const result = await cartService.removeFromCart(id)
      if (result.success) {
        // Reload cart
        const cartResult = await cartService.getCart()
        if (cartResult.success) {
          dispatch({ type: 'SET_CART', payload: cartResult.data })
        }
      }
      return result
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const updateCartQuantity = async (id, quantity) => {
    try {
      const result = await cartService.updateCartItem(id, quantity)
      if (result.success) {
        // Reload cart
        const cartResult = await cartService.getCart()
        if (cartResult.success) {
          dispatch({ type: 'SET_CART', payload: cartResult.data })
        }
      }
      return result
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const clearCart = async (websiteSlug = null) => {
    try {
      const result = await cartService.clearCart(websiteSlug)
      if (result.success) {
        // Reload cart
        const cartResult = await cartService.getCart()
        if (cartResult.success) {
          dispatch({ type: 'SET_CART', payload: cartResult.data })
        }
      }
      return result
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const loadWebsites = async () => {
    try {
      const result = await websiteService.getWebsites()
      if (result.success) {
        dispatch({ type: 'SET_WEBSITES', payload: result.data })
      }
      return result
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const loadProducts = async (websiteId = null) => {
    try {
      const result = await productService.getProducts(websiteId)
      if (result.success) {
        dispatch({ type: 'SET_PRODUCTS', payload: result.data })
      }
      return result
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const value = {
    state,
    dispatch,
    // Cart methods
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    // Data loading methods
    loadWebsites,
    loadProducts,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}