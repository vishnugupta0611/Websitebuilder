import React, { createContext, useContext, useReducer, useEffect } from 'react'

const WebsiteCartContext = createContext()

const initialState = {
  items: [],
  total: 0,
  websiteSlug: null,
  websiteId: null,
  websiteName: null
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_WEBSITE_INFO':
      return {
        ...state,
        websiteSlug: action.payload.slug,
        websiteId: action.payload.id,
        websiteName: action.payload.name
      }

    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id)
      let updatedItems
      
      if (existingItem) {
        updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
      } else {
        // Add website info to each cart item
        updatedItems = [...state.items, {
          ...action.payload,
          websiteSlug: state.websiteSlug,
          websiteId: state.websiteId,
          websiteName: state.websiteName,
          addedAt: new Date().toISOString()
        }]
      }
      
      const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      const newState = {
        ...state,
        items: updatedItems,
        total
      }
      
      // Save to localStorage with website-specific key
      localStorage.setItem(`cart_${state.websiteSlug}`, JSON.stringify(newState))
      
      return newState

    case 'REMOVE_FROM_CART':
      const filteredItems = state.items.filter(item => item.id !== action.payload)
      const newTotal = filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      const updatedState = {
        ...state,
        items: filteredItems,
        total: newTotal
      }
      
      localStorage.setItem(`cart_${state.websiteSlug}`, JSON.stringify(updatedState))
      
      return updatedState

    case 'UPDATE_CART_QUANTITY':
      const updatedCartItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      const updatedTotal = updatedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      const quantityUpdatedState = {
        ...state,
        items: updatedCartItems,
        total: updatedTotal
      }
      
      localStorage.setItem(`cart_${state.websiteSlug}`, JSON.stringify(quantityUpdatedState))
      
      return quantityUpdatedState

    case 'CLEAR_CART':
      const clearedState = {
        ...state,
        items: [],
        total: 0
      }
      
      localStorage.setItem(`cart_${state.websiteSlug}`, JSON.stringify(clearedState))
      
      return clearedState

    case 'LOAD_CART':
      return {
        ...state,
        ...action.payload
      }

    default:
      return state
  }
}

export function WebsiteCartProvider({ children, websiteSlug }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage when website changes
  useEffect(() => {
    if (websiteSlug) {
      const savedCart = localStorage.getItem(`cart_${websiteSlug}`)
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart)
          dispatch({ type: 'LOAD_CART', payload: cartData })
        } catch (error) {
          console.error('Error loading cart:', error)
        }
      }
    }
  }, [websiteSlug])

  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, quantity }
    })
  }

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      dispatch({
        type: 'UPDATE_CART_QUANTITY',
        payload: { id: productId, quantity }
      })
    }
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const setWebsiteInfo = (websiteInfo) => {
    dispatch({ type: 'SET_WEBSITE_INFO', payload: websiteInfo })
  }

  const checkout = async (customerInfo) => {
    // Create order with website tracking
    const order = {
      id: Date.now().toString(),
      websiteSlug: state.websiteSlug,
      websiteId: state.websiteId,
      websiteName: state.websiteName,
      items: state.items,
      total: state.total,
      customer: customerInfo,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('websiteOrders') || '[]')
    existingOrders.push(order)
    localStorage.setItem('websiteOrders', JSON.stringify(existingOrders))

    // Clear cart after successful order
    clearCart()

    console.log('Order created:', order)
    return order
  }

  const value = {
    cart: state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setWebsiteInfo,
    checkout
  }

  return (
    <WebsiteCartContext.Provider value={value}>
      {children}
    </WebsiteCartContext.Provider>
  )
}

export function useWebsiteCart() {
  const context = useContext(WebsiteCartContext)
  if (!context) {
    throw new Error('useWebsiteCart must be used within a WebsiteCartProvider')
  }
  return context
}

export default WebsiteCartContext