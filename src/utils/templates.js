// Homepage Template System with Metadata

export const homepageTemplates = [
  {
    id: 'hero-products',
    name: 'Hero with Products',
    description: 'Large hero section with featured products below',
    category: 'ecommerce',
    preview: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Hero+Products',
    sections: ['hero', 'featured-products', 'about-preview', 'contact-cta'],
    metadata: {
      heroLayout: 'center',
      showProducts: true,
      showBlogs: false,
      productsCount: 6,
      blogsCount: 0,
      hasAboutPreview: true,
      hasContactCTA: true,
      heroImagePosition: 'background'
    },
    requiredFields: ['heroTitle', 'heroDescription', 'heroImage', 'heroButtonText']
  },
  {
    id: 'text-image-split',
    name: 'Text & Image Split',
    description: 'Text content on left, hero image on right',
    category: 'business',
    preview: 'https://via.placeholder.com/400x300/059669/ffffff?text=Text+Image',
    sections: ['split-hero', 'services', 'about-preview', 'contact-form'],
    metadata: {
      heroLayout: 'split',
      showProducts: false,
      showBlogs: false,
      productsCount: 0,
      blogsCount: 0,
      hasAboutPreview: true,
      hasContactForm: true,
      heroImagePosition: 'right',
      textPosition: 'left'
    },
    requiredFields: ['heroTitle', 'heroDescription', 'heroImage', 'services']
  },
  {
    id: 'blog-focused',
    name: 'Blog Focused',
    description: 'Hero section with latest blog posts prominently displayed',
    category: 'blog',
    preview: 'https://via.placeholder.com/400x300/7c3aed/ffffff?text=Blog+Focus',
    sections: ['hero', 'latest-blogs', 'about-preview', 'newsletter'],
    metadata: {
      heroLayout: 'center',
      showProducts: false,
      showBlogs: true,
      productsCount: 0,
      blogsCount: 6,
      hasAboutPreview: true,
      hasNewsletter: true,
      heroImagePosition: 'background'
    },
    requiredFields: ['heroTitle', 'heroDescription', 'heroImage', 'blogSectionTitle']
  },
  {
    id: 'products-blogs-combo',
    name: 'Products & Blogs Combo',
    description: 'Balanced layout with both products and blog posts',
    category: 'hybrid',
    preview: 'https://via.placeholder.com/400x300/dc2626/ffffff?text=Combo+Layout',
    sections: ['hero', 'featured-products', 'latest-blogs', 'about-preview'],
    metadata: {
      heroLayout: 'center',
      showProducts: true,
      showBlogs: true,
      productsCount: 4,
      blogsCount: 3,
      hasAboutPreview: true,
      hasContactCTA: false,
      heroImagePosition: 'background'
    },
    requiredFields: ['heroTitle', 'heroDescription', 'heroImage', 'productSectionTitle', 'blogSectionTitle']
  },
  {
    id: 'image-left-content',
    name: 'Image Left Content',
    description: 'Large image on left, content and links on right',
    category: 'portfolio',
    preview: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Image+Left',
    sections: ['split-hero-reverse', 'portfolio-grid', 'testimonials', 'contact-cta'],
    metadata: {
      heroLayout: 'split',
      showProducts: true,
      showBlogs: false,
      productsCount: 8,
      blogsCount: 0,
      hasTestimonials: true,
      hasContactCTA: true,
      heroImagePosition: 'left',
      textPosition: 'right'
    },
    requiredFields: ['heroTitle', 'heroDescription', 'heroImage', 'portfolioTitle']
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Clean minimal design with focus on content',
    category: 'minimal',
    preview: 'https://via.placeholder.com/400x300/6b7280/ffffff?text=Minimal',
    sections: ['minimal-hero', 'content-blocks', 'simple-contact'],
    metadata: {
      heroLayout: 'minimal',
      showProducts: false,
      showBlogs: true,
      productsCount: 0,
      blogsCount: 3,
      hasAboutPreview: false,
      hasContactForm: true,
      heroImagePosition: 'none',
      isMinimal: true
    },
    requiredFields: ['heroTitle', 'heroDescription', 'contentBlocks']
  }
]

export const getTemplateById = (templateId) => {
  return homepageTemplates.find(template => template.id === templateId)
}

export const getTemplatesByCategory = (category) => {
  return homepageTemplates.filter(template => template.category === category)
}

export const getTemplateRequiredFields = (templateId) => {
  const template = getTemplateById(templateId)
  return template ? template.requiredFields : []
}

export const getTemplateMetadata = (templateId) => {
  const template = getTemplateById(templateId)
  return template ? template.metadata : {}
}

// Default template content structure
export const getDefaultTemplateContent = (templateId) => {
  const template = getTemplateById(templateId)
  if (!template) return {}

  const baseContent = {
    heroTitle: '',
    heroDescription: '',
    heroImage: '',
    heroButtonText: 'Get Started',
    productSectionTitle: 'Our Products',
    blogSectionTitle: 'Latest Posts',
    portfolioTitle: 'Our Work',
    services: [],
    contentBlocks: [],
    testimonials: []
  }

  // Template-specific defaults
  switch (templateId) {
    case 'hero-products':
      return {
        ...baseContent,
        heroTitle: 'Welcome to Our Store',
        heroDescription: 'Discover amazing products and exceptional service',
        productSectionTitle: 'Featured Products'
      }
    
    case 'text-image-split':
      return {
        ...baseContent,
        heroTitle: 'Professional Business Solutions',
        heroDescription: 'We provide comprehensive business solutions tailored to your needs',
        services: ['Consulting', 'Development', 'Support']
      }
    
    case 'blog-focused':
      return {
        ...baseContent,
        heroTitle: 'Stories & Insights',
        heroDescription: 'Stay updated with our latest thoughts and industry insights',
        blogSectionTitle: 'Recent Articles'
      }
    
    case 'products-blogs-combo':
      return {
        ...baseContent,
        heroTitle: 'Your Complete Solution',
        heroDescription: 'Products you need, insights you want',
        productSectionTitle: 'Popular Products',
        blogSectionTitle: 'Latest Updates'
      }
    
    case 'image-left-content':
      return {
        ...baseContent,
        heroTitle: 'Creative Excellence',
        heroDescription: 'Showcasing our best work and creative solutions',
        portfolioTitle: 'Featured Work'
      }
    
    case 'minimal-clean':
      return {
        ...baseContent,
        heroTitle: 'Simple. Effective. Beautiful.',
        heroDescription: 'Clean design meets powerful functionality',
        contentBlocks: [
          { title: 'Quality', description: 'We deliver exceptional quality in everything we do' },
          { title: 'Innovation', description: 'Constantly pushing boundaries and exploring new ideas' },
          { title: 'Support', description: 'Dedicated support team ready to help you succeed' }
        ]
      }
    
    default:
      return baseContent
  }
}