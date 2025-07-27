// Test data utility to help with development and testing

export const createTestWebsite = () => {
  const testWebsite = {
    id: 'test-website-1',
    name: 'Test Fashion Store',
    slug: 'test-fashion-store',
    description: 'A test fashion store to demonstrate the website functionality',
    category: 'fashion',
    template: {
      id: 'products-blogs-combo',
      name: 'Products & Blogs Combo',
      metadata: {
        heroLayout: 'center',
        showProducts: true,
        showBlogs: true,
        productsCount: 4,
        blogsCount: 3,
        hasAboutPreview: true,
        hasContactCTA: false,
        heroImagePosition: 'background'
      }
    },
    templateContent: {
      heroTitle: 'Welcome to Test Fashion Store',
      heroDescription: 'Discover amazing fashion products and stay updated with our latest style insights',
      heroImage: 'https://via.placeholder.com/1200x600/3b82f6/ffffff?text=Fashion+Hero',
      heroButtonText: 'Shop Now',
      productSectionTitle: 'Featured Products',
      blogSectionTitle: 'Style Updates'
    },
    theme: 'modern',
    aboutContent: {
      companyStory: 'We started this business to provide high-quality fashion items to our customers. Our journey began with a simple vision: to make premium fashion accessible to everyone while maintaining the highest standards of quality and customer service.',
      whyCreated: 'We wanted to make fashion accessible to everyone while ensuring that style doesn\'t compromise on quality or affordability.',
      mission: 'To provide the best fashion products at affordable prices while delivering exceptional customer experiences.',
      vision: 'To become the leading fashion retailer in the market, known for our quality, style, and customer-first approach.',
      features: ['High Quality Products', 'Fast Shipping', 'Excellent Customer Service', 'Style Consultation', 'Easy Returns'],
      teamInfo: 'Our team consists of experienced fashion experts, designers, and customer service professionals who are passionate about helping you look and feel your best.',
      contactInfo: {
        email: 'contact@testfashion.com',
        phone: '+1 (555) 123-4567',
        address: '123 Fashion Street, Style City, SC 12345'
      }
    },
    customizations: {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#059669',
        text: '#1f2937',
        background: '#ffffff'
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter'
      },
      layout: {
        style: 'modern',
        headerStyle: 'centered'
      }
    },
    seo: {
      title: 'Test Fashion Store - Premium Fashion',
      description: 'Discover premium fashion and accessories at Test Fashion Store',
      keywords: 'fashion, clothing, accessories, test'
    },
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // Save to localStorage
  const existingWebsites = JSON.parse(localStorage.getItem('userWebsites') || '[]')
  
  // Check if test website already exists
  const existingIndex = existingWebsites.findIndex(site => site.id === testWebsite.id)
  
  if (existingIndex >= 0) {
    existingWebsites[existingIndex] = testWebsite
  } else {
    existingWebsites.push(testWebsite)
  }
  
  localStorage.setItem('userWebsites', JSON.stringify(existingWebsites))
  
  console.log('Test website created:', testWebsite)
  return testWebsite
}

export const createTestProducts = (websiteId = 'test-website-1') => {
  const testProducts = [
    {
      id: 'test-product-1',
      websiteId: websiteId,
      name: 'Premium Leather Jacket',
      description: 'High-quality leather jacket perfect for any occasion',
      shortDescription: 'Premium leather jacket',
      price: 299.99,
      originalPrice: 399.99,
      category: 'clothing',
      status: 'published',
      inventory: 25,
      images: ['https://via.placeholder.com/400x400/3b82f6/ffffff?text=Leather+Jacket'],
      rating: 4.8,
      reviews: 24,
      inStock: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'test-product-2',
      websiteId: websiteId,
      name: 'Designer Handbag',
      description: 'Elegant designer handbag for modern women',
      shortDescription: 'Designer handbag',
      price: 199.99,
      originalPrice: null,
      category: 'accessories',
      status: 'published',
      inventory: 15,
      images: ['https://via.placeholder.com/400x400/059669/ffffff?text=Designer+Handbag'],
      rating: 4.9,
      reviews: 18,
      inStock: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'test-product-3',
      websiteId: websiteId,
      name: 'Casual Sneakers',
      description: 'Comfortable casual sneakers for everyday wear',
      shortDescription: 'Casual sneakers',
      price: 89.99,
      originalPrice: 120.00,
      category: 'footwear',
      status: 'published',
      inventory: 40,
      images: ['https://via.placeholder.com/400x400/7c3aed/ffffff?text=Casual+Sneakers'],
      rating: 4.6,
      reviews: 32,
      inStock: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

  // Save to localStorage
  const existingProducts = JSON.parse(localStorage.getItem('userProducts') || '[]')
  
  // Remove existing test products for this website
  const filteredProducts = existingProducts.filter(p => !p.id.startsWith('test-product-'))
  
  // Add new test products
  const updatedProducts = [...filteredProducts, ...testProducts]
  
  localStorage.setItem('userProducts', JSON.stringify(updatedProducts))
  
  console.log('Test products created:', testProducts)
  return testProducts
}

export const createTestBlog = (websiteId = 'test-website-1') => {
  const testBlog = {
    id: 'test-blog-1',
    title: 'Welcome to Our Fashion Store',
    slug: 'welcome-to-our-fashion-store',
    content: 'Welcome to our amazing fashion store! We are excited to share our latest collections with you. Our team has carefully curated the best fashion items to help you look and feel your best.',
    excerpt: 'Welcome to our amazing fashion store! We are excited to share our latest collections with you.',
    websiteId: websiteId,
    featuredImage: 'https://via.placeholder.com/800x400/3b82f6/ffffff?text=Welcome+Blog',
    author: 'Fashion Team',
    tags: ['welcome', 'fashion', 'store'],
    status: 'published',
    publishDate: new Date().toISOString(),
    template: 'default',
    customizations: {
      layout: 'column',
      showAuthor: true,
      showDate: true,
      showTags: true,
      cardStyle: 'modern'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // Save to localStorage
  const existingBlogs = JSON.parse(localStorage.getItem('userBlogs') || '[]')
  
  // Check if test blog already exists
  const existingIndex = existingBlogs.findIndex(blog => blog.id === testBlog.id)
  
  if (existingIndex >= 0) {
    existingBlogs[existingIndex] = testBlog
  } else {
    existingBlogs.push(testBlog)
  }
  
  localStorage.setItem('userBlogs', JSON.stringify(existingBlogs))
  
  console.log('Test blog created:', testBlog)
  return testBlog
}

export const setupTestData = () => {
  console.log('Setting up test data...')
  
  const website = createTestWebsite()
  const products = createTestProducts(website.id)
  const blog = createTestBlog(website.id)
  
  console.log('Test data setup complete!')
  console.log('You can now visit: http://localhost:3000/test-fashion-store')
  
  return {
    website,
    products,
    blog
  }
}

export const clearTestData = () => {
  localStorage.removeItem('userWebsites')
  localStorage.removeItem('userProducts')
  localStorage.removeItem('userBlogs')
  console.log('All test data cleared!')
}

// Make functions available globally for easy testing in browser console
if (typeof window !== 'undefined') {
  window.setupTestData = setupTestData
  window.clearTestData = clearTestData
  window.createTestWebsite = createTestWebsite
  window.createTestProducts = createTestProducts
  window.createTestBlog = createTestBlog
}