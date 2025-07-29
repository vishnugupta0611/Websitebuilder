import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { cartService } from '../services/cartService'
import { orderService } from '../services/orderService'
import { authService } from '../services/authService'

const WebsiteCartContext = createContext()

const initialState = {
  items: [],
  total: 0,
  websiteSlug: null,
  websiteId: null,
  websiteName: null,
  loading: true, // Start with loading true
  error: null
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

    case 'SET_CART':
      const total = action.payload.reduce((sum, item) => {
        const price = item.product_price || item.price || 0
        const quantity = item.quantity || 0
        return sum + (price * quantity)
      }, 0)
      return {
        ...state,
        items: action.payload,
        total
      }

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      }

    default:
      return state
  }
}

export function WebsiteCartProvider({ children, websiteSlug }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart when website changes or user is authenticated
  useEffect(() => {
    const loadCart = async () => {
      if (websiteSlug) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true })
          
          if (authService.isAuthenticated()) {
            console.log('Loading cart for authenticated user, website:', websiteSlug)
            const result = await cartService.getCart()
            if (result.success) {
              // Filter cart items for this website
              const websiteCartItems = result.data.filter(item => item.websiteSlug === websiteSlug)
              console.log('Cart items loaded:', websiteCartItems.length)
              dispatch({ type: 'SET_CART', payload: websiteCartItems })
            } else {
              console.error('Failed to load cart:', result.error)
              dispatch({ type: 'SET_CART', payload: [] })
            }
          } else {
            console.log('Loading cart for guest user, website:', websiteSlug)
            // For non-authenticated users, use localStorage as fallback
            const savedCart = localStorage.getItem(`cart_${websiteSlug}`)
            if (savedCart) {
              try {
                const cartData = JSON.parse(savedCart)
                console.log('Guest cart loaded:', cartData.items?.length || 0)
                dispatch({ type: 'SET_CART', payload: cartData.items || [] })
              } catch (error) {
                console.error('Error parsing saved cart:', error)
                dispatch({ type: 'SET_CART', payload: [] })
              }
            } else {
              console.log('No saved cart found for guest user')
              dispatch({ type: 'SET_CART', payload: [] })
            }
          }
        } catch (error) {
          console.error('Error loading cart:', error)
          dispatch({ type: 'SET_ERROR', payload: error.message })
          dispatch({ type: 'SET_CART', payload: [] })
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      }
    }

    loadCart()
  }, [websiteSlug])

  const addToCart = async (product, quantity = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      if (authService.isAuthenticated()) {
        const cartItem = {
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          product_image: product.images?.[0] || '',
          product_sku: product.sku,
          quantity,
          websiteSlug: state.websiteSlug || websiteSlug,
          websiteId: state.websiteId,
          websiteName: state.websiteName
        }
        
        const result = await cartService.addToCart(cartItem)
        if (result.success) {
          // Optimistically update cart immediately
          const existingItemIndex = state.items.findIndex(item => 
            (item.product_id || item.id) === product.id
          )
          
          let updatedItems
          if (existingItemIndex >= 0) {
            // Update existing item
            updatedItems = [...state.items]
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity
            }
          } else {
            // Add new item
            updatedItems = [...state.items, {
              id: result.data.id || Date.now(),
              product_id: product.id,
              product_name: product.name,
              product_price: product.price,
              product_image: product.images?.[0] || '',
              product_sku: product.sku,
              quantity,
              websiteSlug: state.websiteSlug || websiteSlug,
              addedAt: new Date().toISOString()
            }]
          }
          
          dispatch({ type: 'SET_CART', payload: updatedItems })
          
          // Also reload from server to ensure consistency
          setTimeout(async () => {
            const cartResult = await cartService.getCart()
            if (cartResult.success) {
              const websiteCartItems = cartResult.data.filter(item => 
                item.websiteSlug === (state.websiteSlug || websiteSlug)
              )
              dispatch({ type: 'SET_CART', payload: websiteCartItems })
            }
          }, 100)
        }
        return result
      } else {
        // For non-authenticated users, use localStorage
        const cartItem = { 
          ...product, 
          quantity, 
          addedAt: new Date().toISOString(),
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          product_image: product.images?.[0] || ''
        }
        const savedCart = JSON.parse(localStorage.getItem(`cart_${websiteSlug}`) || '{"items": []}')
        
        const existingItemIndex = savedCart.items.findIndex(item => 
          (item.product_id || item.id) === product.id
        )
        if (existingItemIndex >= 0) {
          savedCart.items[existingItemIndex].quantity += quantity
        } else {
          savedCart.items.push(cartItem)
        }
        
        localStorage.setItem(`cart_${websiteSlug}`, JSON.stringify(savedCart))
        dispatch({ type: 'SET_CART', payload: savedCart.items })
        return { success: true }
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const removeFromCart = async (productId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      if (authService.isAuthenticated()) {
        const cartItem = state.items.find(item => item.product_id === productId)
        if (cartItem) {
          const result = await cartService.removeFromCart(cartItem.id)
          if (result.success) {
            // Reload cart
            const cartResult = await cartService.getCart()
            if (cartResult.success) {
              const websiteCartItems = cartResult.data.filter(item => item.websiteSlug === websiteSlug)
              dispatch({ type: 'SET_CART', payload: websiteCartItems })
            }
          }
          return result
        }
      } else {
        // For non-authenticated users, use localStorage
        const savedCart = JSON.parse(localStorage.getItem(`cart_${websiteSlug}`) || '{"items": []}')
        savedCart.items = savedCart.items.filter(item => item.id !== productId)
        localStorage.setItem(`cart_${websiteSlug}`, JSON.stringify(savedCart))
        dispatch({ type: 'SET_CART', payload: savedCart.items })
        return { success: true }
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return await removeFromCart(productId)
    }
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      if (authService.isAuthenticated()) {
        const cartItem = state.items.find(item => 
          (item.product_id || item.id) === productId
        )
        if (cartItem) {
          // Optimistically update UI first
          const updatedItems = state.items.map(item => 
            (item.product_id || item.id) === productId 
              ? { ...item, quantity }
              : item
          )
          dispatch({ type: 'SET_CART', payload: updatedItems })
          
          // Update on server
          const updateData = {
            product_id: cartItem.product_id,
            product_name: cartItem.product_name,
            product_price: cartItem.product_price,
            product_sku: cartItem.product_sku,
            quantity,
            websiteSlug: cartItem.websiteSlug,
            websiteId: cartItem.websiteId,
            websiteName: cartItem.websiteName
          }
          
          const result = await cartService.updateCartItem(cartItem.id, updateData)
          if (!result.success) {
            // Revert on failure
            dispatch({ type: 'SET_CART', payload: state.items })
          }
          return result
        }
      } else {
        // For non-authenticated users, use localStorage
        const savedCart = JSON.parse(localStorage.getItem(`cart_${websiteSlug}`) || '{"items": []}')
        const itemIndex = savedCart.items.findIndex(item => 
          (item.product_id || item.id) === productId
        )
        if (itemIndex >= 0) {
          savedCart.items[itemIndex].quantity = quantity
          localStorage.setItem(`cart_${websiteSlug}`, JSON.stringify(savedCart))
          dispatch({ type: 'SET_CART', payload: savedCart.items })
        }
        return { success: true }
      }
    } catch (error) {
      console.error('Update quantity error:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      if (authService.isAuthenticated()) {
        const result = await cartService.clearCart(websiteSlug)
        if (result.success) {
          dispatch({ type: 'SET_CART', payload: [] })
        }
        return result
      } else {
        // For non-authenticated users, use localStorage
        localStorage.removeItem(`cart_${websiteSlug}`)
        dispatch({ type: 'SET_CART', payload: [] })
        return { success: true }
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const setWebsiteInfo = (websiteInfo) => {
    dispatch({ type: 'SET_WEBSITE_INFO', payload: websiteInfo })
  }

  const checkout = async (customerInfo) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const orderData = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        customerCity: customerInfo.city,
        customerZipCode: customerInfo.zipCode,
        websiteSlug: state.websiteSlug,
        websiteName: state.websiteName,
        items: state.items.map(item => ({
          product_id: item.product_id || item.id,
          name: item.product_name || item.name,
          price: item.product_price || item.price,
          quantity: item.quantity,
          websiteSlug: state.websiteSlug,
          websiteName: state.websiteName,
          addedAt: item.addedAt
        }))
      }
      
      const result = await orderService.createOrder(orderData)
      if (result.success) {
        // Clear cart after successful order
        await clearCart()
        return result.data
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
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