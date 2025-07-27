import React, { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext()

const initialState = {
  cart: {
    items: [],
    total: 0,
    discounts: []
  },
  content: {
    pages: [],
    currentPage: null,
    templates: []
  },
  products: [],
  orders: [],
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
    

    case 'ADD_TO_CART':
      const existingItem = state.cart.items.find(item => item.id === action.payload.id)
      let updatedItems
      
      if (existingItem) {
        updatedItems = state.cart.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
      } else {
        updatedItems = [...state.cart.items, action.payload]
      }
      
      const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      return {
        ...state,
        cart: { ...state.cart, items: updatedItems, total }
      }
    
    case 'REMOVE_FROM_CART':
      const filteredItems = state.cart.items.filter(item => item.id !== action.payload)
      const newTotal = filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      return {
        ...state,
        cart: { ...state.cart, items: filteredItems, total: newTotal }
      }
    
    case 'UPDATE_CART_QUANTITY':
      const updatedCartItems = state.cart.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      const updatedTotal = updatedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      return {
        ...state,
        cart: { ...state.cart, items: updatedCartItems, total: updatedTotal }
      }
    
    case 'APPLY_DISCOUNT':
      return {
        ...state,
        cart: { ...state.cart, discounts: [...state.cart.discounts, action.payload] }
      }
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload }
    
    case 'SET_CONTENT_PAGES':
      return { ...state, content: { ...state.content, pages: action.payload } }
    
    case 'SET_CURRENT_PAGE':
      return { ...state, content: { ...state.content, currentPage: action.payload } }
    
    case 'SET_TEMPLATES':
      return { ...state, content: { ...state.content, templates: action.payload } }
    
    case 'SET_SEARCH_RESULTS':
      return { ...state, search: { ...state.search, results: action.payload } }
    
    case 'SET_SEARCH_QUERY':
      return { ...state, search: { ...state.search, query: action.payload } }
    
    case 'SET_ORDERS':
      return { ...state, orders: action.payload }
    
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('corporatePortalCart')
    if (savedCart) {
      const cartData = JSON.parse(savedCart)
      cartData.items.forEach(item => {
        dispatch({ type: 'ADD_TO_CART', payload: item })
      })
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('corporatePortalCart', JSON.stringify(state.cart))
  }, [state.cart])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
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