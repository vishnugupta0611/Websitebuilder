import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
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
      console.log('Reducer: Setting website info', action.payload)
      const newState = {
        ...state,
        websiteSlug: action.payload.slug,
        websiteId: action.payload.id,
        websiteName: action.payload.name
      }
      console.log('Reducer: New state after website info', newState)
      return newState

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

// Helper function to validate and sanitize product image URLs
const sanitizeProductImage = (imageUrl) => {
  console.log('Sanitizing image URL:', imageUrl)
  
  if (!imageUrl) {
    console.log('No image URL provided, returning empty string')
    return ''
  }
  
  // Truncate if too long (but keep more reasonable length)
  if (imageUrl.length > 500) {
    console.log('Image URL too long, truncating:', imageUrl.length)
    imageUrl = imageUrl.substring(0, 500)
  }
  
  // Only remove data URLs (base64 images) as they're too long for the API
  // Allow relative URLs, http, https, and other valid URL formats
  if (imageUrl.startsWith('data:')) {
    console.log('Removing data URL (too long for API)')
    return ''
  }
  
  console.log('Sanitized image URL:', imageUrl)
  return imageUrl
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
              console.log('=== LOADED CART ITEMS FROM BACKEND ===')
              
              // Fix: Convert product_image to images array if images array is missing
              const fixedCartItems = websiteCartItems.map(item => {
                if (!item.images && item.product_image) {
                  console.log(`Fixing item ${item.product_name}: converting product_image to images array`)
                  return {
                    ...item,
                    images: [item.product_image]
                  }
                }
                return item
              })
              
              fixedCartItems.forEach((item, index) => {
                console.log(`Fixed Item ${index + 1}:`, {
                  name: item.product_name,
                  product_image: item.product_image,
                  images: item.images,
                  images_length: item.images?.length
                })
              })
              console.log('=== END BACKEND CART DEBUG ===')
              dispatch({ type: 'SET_CART', payload: fixedCartItems })
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
                
                // Fix: Convert product_image to images array if images array is missing
                const fixedGuestItems = (cartData.items || []).map(item => {
                  if (!item.images && item.product_image) {
                    console.log(`Fixing guest item ${item.product_name}: converting product_image to images array`)
                    return {
                      ...item,
                      images: [item.product_image]
                    }
                  }
                  return item
                })
                
                dispatch({ type: 'SET_CART', payload: fixedGuestItems })
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

  const addToCart = useCallback(async (product, quantity = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Debug: Log the product being added
      console.log('=== ADDING PRODUCT TO CART ===')
      console.log('Full product object:', product)
      console.log('Product images array:', product.images)
      console.log('Product image (single):', product.image)
      console.log('Product first image:', product.images?.[0])
      console.log('=== END ADD TO CART DEBUG ===')
      
      if (authService.isAuthenticated()) {
        const originalImage = product.images?.[0] || product.image
        const productImage = sanitizeProductImage(originalImage)
        console.log('=== IMAGE SANITIZATION ===')
        console.log('Original image URL:', originalImage)
        console.log('Sanitized image URL:', productImage)
        console.log('Image was removed:', originalImage && !productImage)
        console.log('=== END SANITIZATION ===')
        
        const cartItem = {
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          product_image: productImage,
          product_sku: product.sku,
          quantity,
          websiteSlug: state.websiteSlug || websiteSlug,
          websiteId: state.websiteId,
          websiteName: state.websiteName,
          // Preserve original images array for display
          images: product.images
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
              product_image: productImage,
              product_sku: product.sku,
              quantity,
              websiteSlug: state.websiteSlug || websiteSlug,
              addedAt: new Date().toISOString(),
              // Keep original images array as backup
              images: product.images
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
              
              // Fix: Convert product_image to images array if images array is missing
              const fixedReloadedItems = websiteCartItems.map(item => {
                if (!item.images && item.product_image) {
                  return {
                    ...item,
                    images: [item.product_image]
                  }
                }
                return item
              })
              
              dispatch({ type: 'SET_CART', payload: fixedReloadedItems })
            }
          }, 100)
        }
        return result
      } else {
        // For non-authenticated users, use localStorage
        const originalImage = product.images?.[0] || product.image
        const productImage = sanitizeProductImage(originalImage)
        console.log('=== GUEST IMAGE SANITIZATION ===')
        console.log('Original image URL:', originalImage)
        console.log('Sanitized image URL:', productImage)
        console.log('Image was removed:', originalImage && !productImage)
        console.log('=== END GUEST SANITIZATION ===')
        
        const cartItem = { 
          ...product, 
          quantity, 
          addedAt: new Date().toISOString(),
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          product_image: productImage,
          // Keep original images array as backup
          images: product.images
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
  }, [state.items, state.websiteId, state.websiteName, state.websiteSlug, websiteSlug])

  const removeFromCart = useCallback(async (productId) => {
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
              
              // Fix: Convert product_image to images array if images array is missing
              const fixedCartItems = websiteCartItems.map(item => {
                if (!item.images && item.product_image) {
                  return {
                    ...item,
                    images: [item.product_image]
                  }
                }
                return item
              })
              
              dispatch({ type: 'SET_CART', payload: fixedCartItems })
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
  }, [state.items, websiteSlug])

  const updateQuantity = useCallback(async (productId, quantity) => {
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
  }, [state.items, websiteSlug])

  const clearCart = useCallback(async () => {
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
  }, [websiteSlug])

  const setWebsiteInfo = useCallback((websiteInfo) => {
    console.log('CartContext: Setting website info:', websiteInfo)
    console.log('CartContext: Current state before update:', {
      websiteSlug: state.websiteSlug,
      websiteName: state.websiteName
    })
    dispatch({ type: 'SET_WEBSITE_INFO', payload: websiteInfo })
  }, [state.websiteSlug, state.websiteName])

  const checkout = useCallback(async (customerInfo) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Debug: Log current state
      console.log('Checkout - Current state:', {
        stateWebsiteSlug: state.websiteSlug,
        stateWebsiteName: state.websiteName,
        propWebsiteSlug: websiteSlug,
        cartItems: state.items?.length
      })
      
      // Validate required data - use websiteSlug prop as fallback
      const currentWebsiteSlug = state.websiteSlug || websiteSlug
      const currentWebsiteName = state.websiteName || 'Website'
      
      console.log('Using website info:', { currentWebsiteSlug, currentWebsiteName })
      
      if (!currentWebsiteSlug) {
        throw new Error('Website information is missing. Please refresh the page.')
      }
      
      if (!state.items || state.items.length === 0) {
        throw new Error('Cart is empty. Please add items before checkout.')
      }
      
      // Validate customer info
      const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'zipCode']
      for (const field of requiredFields) {
        if (!customerInfo[field]) {
          throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`)
        }
      }
      
      const orderData = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        customerCity: customerInfo.city,
        customerZipCode: customerInfo.zipCode,
        websiteSlug: currentWebsiteSlug,
        websiteName: currentWebsiteName,
        items: state.items.map(item => ({
          product_id: item.product_id || item.id,
          name: item.product_name || item.name,
          price: parseFloat(item.product_price || item.price || 0),
          quantity: parseInt(item.quantity || 0),
          websiteSlug: currentWebsiteSlug,
          websiteName: currentWebsiteName,
          addedAt: item.addedAt
        }))
      }
      
      console.log('Sending order data to API:', orderData)
      
      const result = await orderService.createOrder(orderData)
      if (result.success) {
        console.log('Order created successfully:', result.data)
        // Clear cart after successful order
        await clearCart()
        return result.data
      } else {
        console.error('Order creation failed:', result.error)
        throw new Error(result.error || 'Failed to create order')
      }
    } catch (error) {
      console.error('Checkout error in context:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [state.items, state.websiteSlug, state.websiteName, clearCart])

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