/**
 * Frontend API Integration Test
 * This file tests all API services to ensure they're working correctly
 */

import { authService } from '../services/authService'
import { websiteService } from '../services/websiteService'
import { productService } from '../services/productService'
import { blogService } from '../services/blogService'
import { cartService } from '../services/cartService'
import { orderService } from '../services/orderService'

export const runApiTests = async () => {
  console.log('🚀 Starting Frontend API Integration Tests...')
  console.log('=' * 50)
  
  const results = {
    auth: {},
    websites: {},
    products: {},
    blogs: {},
    cart: {},
    orders: {}
  }
  
  try {
    // Test 1: Authentication Flow
    console.log('\n1. Testing Authentication Flow...')
    
    // Register
    const registerResult = await authService.register({
      firstName: 'Frontend',
      lastName: 'Test',
      email: 'frontend@test.com',
      phone: '9876543210',
      password: 'testpass123',
      confirmPassword: 'testpass123'
    })
    
    results.auth.register = registerResult
    console.log('Register result:', registerResult.success ? '✅' : '❌')
    
    if (registerResult.success) {
      // Verify OTP
      const otpResult = await authService.verifyOTP('frontend@test.com', '123456')
      results.auth.verifyOTP = otpResult
      console.log('OTP verification result:', otpResult.success ? '✅' : '❌')
      
      if (otpResult.success) {
        // Test Profile
        const profileResult = await authService.getProfile()
        results.auth.profile = profileResult
        console.log('Profile fetch result:', profileResult.success ? '✅' : '❌')
        
        // Test 2: Website Management
        console.log('\n2. Testing Website Management...')
        
        const websiteData = {
          name: 'Frontend Test Website',
          slug: 'frontend-test-site',
          description: 'A test website created from frontend',
          category: 'business',
          status: 'published',
          heroTitle: 'Welcome to Test Site',
          heroDescription: 'This is a test description'
        }
        
        const createWebsiteResult = await websiteService.createWebsite(websiteData)
        results.websites.create = createWebsiteResult
        console.log('Website creation result:', createWebsiteResult.success ? '✅' : '❌')
        
        if (createWebsiteResult.success) {
          const websiteId = createWebsiteResult.data.id
          
          // Get websites
          const getWebsitesResult = await websiteService.getWebsites()
          results.websites.list = getWebsitesResult
          console.log('Get websites result:', getWebsitesResult.success ? '✅' : '❌')
          
          // Get website by slug
          const getBySlugResult = await websiteService.getWebsiteBySlug('frontend-test-site')
          results.websites.getBySlug = getBySlugResult
          console.log('Get website by slug result:', getBySlugResult.success ? '✅' : '❌')
          
          // Test 3: Product Management
          console.log('\n3. Testing Product Management...')
          
          const productData = {
            name: 'Test Product',
            slug: 'test-product',
            description: 'A test product',
            shortDescription: 'Test product description',
            price: 99.99,
            category: 'electronics',
            website: websiteId,
            inventory: 10,
            sku: 'TEST-001',
            status: 'active'
          }
          
          const createProductResult = await productService.createProduct(productData)
          results.products.create = createProductResult
          console.log('Product creation result:', createProductResult.success ? '✅' : '❌')
          
          if (createProductResult.success) {
            // Get products
            const getProductsResult = await productService.getProducts()
            results.products.list = getProductsResult
            console.log('Get products result:', getProductsResult.success ? '✅' : '❌')
          }
          
          // Test 4: Blog Management
          console.log('\n4. Testing Blog Management...')
          
          const blogData = {
            title: 'Test Blog Post',
            slug: 'test-blog-post',
            content: 'This is a test blog post content.',
            excerpt: 'Test excerpt',
            website: websiteId,
            author: 'Test Author',
            tags: ['test', 'blog'],
            status: 'published'
          }
          
          const createBlogResult = await blogService.createBlog(blogData)
          results.blogs.create = createBlogResult
          console.log('Blog creation result:', createBlogResult.success ? '✅' : '❌')
          
          if (createBlogResult.success) {
            // Get blogs
            const getBlogsResult = await blogService.getBlogs()
            results.blogs.list = getBlogsResult
            console.log('Get blogs result:', getBlogsResult.success ? '✅' : '❌')
          }
          
          // Test 5: Cart Management
          console.log('\n5. Testing Cart Management...')
          
          if (createProductResult.success) {
            const cartItem = {
              product_id: createProductResult.data.id,
              product_name: 'Test Product',
              product_price: 99.99,
              product_image: '',
              product_sku: 'TEST-001',
              quantity: 2,
              websiteSlug: 'frontend-test-site',
              websiteId: websiteId,
              websiteName: 'Frontend Test Website'
            }
            
            const addToCartResult = await cartService.addToCart(cartItem)
            results.cart.add = addToCartResult
            console.log('Add to cart result:', addToCartResult.success ? '✅' : '❌')
            
            if (addToCartResult.success) {
              // Get cart
              const getCartResult = await cartService.getCart()
              results.cart.get = getCartResult
              console.log('Get cart result:', getCartResult.success ? '✅' : '❌')
            }
          }
          
          // Test 6: Analytics
          console.log('\n6. Testing Analytics...')
          
          const analyticsResult = await orderService.getDashboardAnalytics()
          results.orders.analytics = analyticsResult
          console.log('Analytics result:', analyticsResult.success ? '✅' : '❌')
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test error:', error)
    results.error = error.message
  }
  
  console.log('\n' + '=' * 50)
  console.log('🎉 Frontend API Tests Complete!')
  console.log('Full results:', results)
  
  return results
}

// Export for use in components
export default runApiTests