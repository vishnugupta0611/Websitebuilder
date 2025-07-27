import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import { ArrowRight, Star, ShoppingCart, Calendar, User, Tag, ShoppingBag } from 'lucide-react'

function TemplateRenderer({ website, products, blogs, onAddToCart }) {
  const { template, templateContent, customizations } = website

  if (!template || !template.id) {
    return <DefaultTemplate website={website} products={products} blogs={blogs} onAddToCart={onAddToCart} />
  }

  switch (template.id) {
    case 'hero-products':
      return <HeroProductsTemplate website={website} products={products} blogs={blogs} onAddToCart={onAddToCart} />
    case 'text-image-split':
      return <TextImageSplitTemplate website={website} products={products} blogs={blogs} onAddToCart={onAddToCart} />
    case 'blog-focused':
      return <BlogFocusedTemplate website={website} products={products} blogs={blogs} onAddToCart={onAddToCart} />
    case 'products-blogs-combo':
      return <ProductsBlogsComboTemplate website={website} products={products} blogs={blogs} onAddToCart={onAddToCart} />
    case 'image-left-content':
      return <ImageLeftContentTemplate website={website} products={products} blogs={blogs} onAddToCart={onAddToCart} />
    case 'minimal-clean':
      return <MinimalCleanTemplate website={website} products={products} blogs={blogs} onAddToCart={onAddToCart} />
    default:
      return <DefaultTemplate website={website} products={products} blogs={blogs} onAddToCart={onAddToCart} />
  }
}

// Hero with Products Template
function HeroProductsTemplate({ website, products, blogs, onAddToCart }) {
  const { templateContent, customizations } = website
  const maxProducts = website.template.metadata.productsCount || 6

  return (
    <div>
      {/* Hero Section */}
      <section
        className="py-20 text-center"
        style={{
          backgroundColor: customizations.colors.primary + '10',
          backgroundImage: templateContent.heroImage ? `url(${templateContent.heroImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h1
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{
              color: customizations.colors.primary,
              fontFamily: customizations.typography.headingFont
            }}
          >
            {templateContent.heroTitle || website.name}
          </h1>
          <p
            className="text-xl md:text-2xl mb-8"
            style={{ color: customizations.colors.text }}
          >
            {templateContent.heroDescription || website.description}
          </p>
          <Button
            size="lg"
            style={{
              backgroundColor: customizations.colors.primary,
              color: 'white'
            }}
            onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
          >
            {templateContent.heroButtonText || 'Shop Now'}
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{
              color: customizations.colors.primary,
              fontFamily: customizations.typography.headingFont
            }}
          >
            {templateContent.productSectionTitle || 'Featured Products'}
          </h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, maxProducts).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  website={website}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ShoppingBag
                className="h-16 w-16 mx-auto mb-4 opacity-50"
                style={{ color: customizations.colors.primary }}
              />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: customizations.colors.text }}
              >
                Products Coming Soon!
              </h3>
              <p
                className="text-gray-600 mb-6"
                style={{ color: customizations.colors.text + '80' }}
              >
                We're working hard to bring you amazing products. Check back soon!
              </p>
              <Button
                variant="outline"
                style={{
                  borderColor: customizations.colors.primary,
                  color: customizations.colors.primary
                }}
                onClick={() => window.location.href = `/${website.slug}/contact`}
              >
                Get Notified When Available
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* About Preview */}
      {website.aboutContent?.companyStory && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2
              className="text-3xl font-bold mb-6"
              style={{
                color: customizations.colors.primary,
                fontFamily: customizations.typography.headingFont
              }}
            >
              About Us
            </h2>
            <p
              className="text-lg mb-8"
              style={{ color: customizations.colors.text }}
            >
              {website.aboutContent.companyStory.substring(0, 200)}...
            </p>
            <Link
              to={`/${website.slug}/about`}
              className="inline-flex items-center font-medium"
              style={{ color: customizations.colors.primary }}
            >
              Learn More <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

// Text & Image Split Template
function TextImageSplitTemplate({ website, products, blogs, onAddToCart }) {
  const { templateContent, customizations } = website

  return (
    <div>
      {/* Split Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h1
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{
                  color: customizations.colors.primary,
                  fontFamily: customizations.typography.headingFont
                }}
              >
                {templateContent.heroTitle || website.name}
              </h1>
              <p
                className="text-xl mb-8"
                style={{ color: customizations.colors.text }}
              >
                {templateContent.heroDescription || website.description}
              </p>

              {/* Services */}
              {templateContent.services && templateContent.services.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: customizations.colors.primary }}>
                    Our Services
                  </h3>
                  <ul className="space-y-2">
                    {templateContent.services.filter(service => service.trim()).map((service, index) => (
                      <li key={index} className="flex items-center">
                        <div
                          className="w-2 h-2 rounded-full mr-3"
                          style={{ backgroundColor: customizations.colors.accent }}
                        />
                        <span style={{ color: customizations.colors.text }}>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                size="lg"
                style={{
                  backgroundColor: customizations.colors.primary,
                  color: 'white'
                }}
                as={Link}
                to={`/${website.slug}/contact`}
              >
                {templateContent.heroButtonText || 'Get Started'}
              </Button>
            </div>

            {/* Hero Image */}
            <div>
              {templateContent.heroImage && (
                <img
                  src={templateContent.heroImage}
                  alt={website.name}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      {website.aboutContent?.mission && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2
              className="text-3xl font-bold mb-6"
              style={{
                color: customizations.colors.primary,
                fontFamily: customizations.typography.headingFont
              }}
            >
              Our Mission
            </h2>
            <p
              className="text-lg"
              style={{ color: customizations.colors.text }}
            >
              {website.aboutContent.mission}
            </p>
          </div>
        </section>
      )}
    </div>
  )
}

// Blog Focused Template
function BlogFocusedTemplate({ website, products, blogs, onAddToCart }) {
  const { templateContent, customizations } = website
  const maxBlogs = website.template.metadata.blogsCount || 6

  return (
    <div>
      {/* Hero Section */}
      <section
        className="py-20 text-center"
        style={{
          backgroundColor: customizations.colors.primary + '10',
          backgroundImage: templateContent.heroImage ? `url(${templateContent.heroImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h1
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{
              color: customizations.colors.primary,
              fontFamily: customizations.typography.headingFont
            }}
          >
            {templateContent.heroTitle || website.name}
          </h1>
          <p
            className="text-xl md:text-2xl mb-8"
            style={{ color: customizations.colors.text }}
          >
            {templateContent.heroDescription || website.description}
          </p>
          <Button
            size="lg"
            style={{
              backgroundColor: customizations.colors.primary,
              color: 'white'
            }}
            onClick={() => document.getElementById('blogs').scrollIntoView({ behavior: 'smooth' })}
          >
            {templateContent.heroButtonText || 'Read Our Stories'}
          </Button>
        </div>
      </section>

      {/* Latest Blogs */}
      <section id="blogs" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{
              color: customizations.colors.primary,
              fontFamily: customizations.typography.headingFont
            }}
          >
            {templateContent.blogSectionTitle || 'Latest Posts'}
          </h2>

          {blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.slice(0, maxBlogs).map((blog) => {
                  // Use HoverOverlayBlogCard for hover-overlay layout, otherwise use regular BlogCard
                  return blog.layout === 'hover-overlay' ? (
                    <HoverOverlayBlogCard
                      key={blog.id}
                      blog={blog}
                      website={website}
                    />
                  ) : (
                    <BlogCard
                      key={blog.id}
                      blog={blog}
                      website={website}
                    />
                  )
                })}
              </div>

              {blogs.length > maxBlogs && (
                <div className="text-center mt-12">
                  <Link
                    to={`/${website.slug}/blogs`}
                    className="inline-flex items-center font-medium"
                    style={{ color: customizations.colors.primary }}
                  >
                    View All Posts <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Calendar
                className="h-16 w-16 mx-auto mb-4 opacity-50"
                style={{ color: customizations.colors.primary }}
              />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: customizations.colors.text }}
              >
                Blog Posts Coming Soon!
              </h3>
              <p
                className="text-gray-600 mb-6"
                style={{ color: customizations.colors.text + '80' }}
              >
                We're working on some amazing content. Stay tuned for our latest updates!
              </p>
              <Button
                variant="outline"
                style={{
                  borderColor: customizations.colors.primary,
                  color: customizations.colors.primary
                }}
                onClick={() => window.location.href = `/${website.slug}/contact`}
              >
                Subscribe for Updates
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// Products & Blogs Combo Template
function ProductsBlogsComboTemplate({ website, products, blogs, onAddToCart }) {
  const { templateContent, customizations } = website
  const maxProducts = website.template.metadata.productsCount || 4
  const maxBlogs = website.template.metadata.blogsCount || 3

  return (
    <div>
      {/* Hero Section */}
      <section
        className="py-20 text-center"
        style={{
          backgroundColor: customizations.colors.primary + '10',
          backgroundImage: templateContent.heroImage ? `url(${templateContent.heroImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h1
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{
              color: customizations.colors.primary,
              fontFamily: customizations.typography.headingFont
            }}
          >
            {templateContent.heroTitle || website.name}
          </h1>
          <p
            className="text-xl md:text-2xl mb-8"
            style={{ color: customizations.colors.text }}
          >
            {templateContent.heroDescription || website.description}
          </p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{
              color: customizations.colors.primary,
              fontFamily: customizations.typography.headingFont
            }}
          >
            {templateContent.productSectionTitle || 'Featured Products'}
          </h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, maxProducts).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  website={website}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ShoppingBag
                className="h-16 w-16 mx-auto mb-4 opacity-50"
                style={{ color: customizations.colors.primary }}
              />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: customizations.colors.text }}
              >
                Products Coming Soon!
              </h3>
              <p
                className="text-gray-600 mb-6"
                style={{ color: customizations.colors.text + '80' }}
              >
                We're working hard to bring you amazing products. Check back soon!
              </p>
              <Button
                variant="outline"
                style={{
                  borderColor: customizations.colors.primary,
                  color: customizations.colors.primary
                }}
                onClick={() => window.location.href = `/${website.slug}/contact`}
              >
                Get Notified When Available
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Latest Blogs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{
              color: customizations.colors.primary,
              fontFamily: customizations.typography.headingFont
            }}
          >
            {templateContent.blogSectionTitle || 'Latest Updates'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.slice(0, maxBlogs).map((blog) => {
              // Use HoverOverlayBlogCard for hover-overlay layout, otherwise use regular BlogCard
              return blog.layout === 'hover-overlay' ? (
                <HoverOverlayBlogCard
                  key={blog.id}
                  blog={blog}
                  website={website}
                />
              ) : (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  website={website}
                />
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

// Image Left Content Template
function ImageLeftContentTemplate({ website, products, blogs, onAddToCart }) {
  const { templateContent, customizations } = website
  const maxProducts = website.template.metadata.productsCount || 8

  return (
    <div>
      {/* Split Hero Section - Image Left */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Image */}
            <div>
              {templateContent.heroImage && (
                <img
                  src={templateContent.heroImage}
                  alt={website.name}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              )}
            </div>

            {/* Text Content */}
            <div>
              <h1
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{
                  color: customizations.colors.primary,
                  fontFamily: customizations.typography.headingFont
                }}
              >
                {templateContent.heroTitle || website.name}
              </h1>
              <p
                className="text-xl mb-8"
                style={{ color: customizations.colors.text }}
              >
                {templateContent.heroDescription || website.description}
              </p>

              <Button
                size="lg"
                style={{
                  backgroundColor: customizations.colors.primary,
                  color: 'white'
                }}
                onClick={() => document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' })}
              >
                {templateContent.heroButtonText || 'View Our Work'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section id="portfolio" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{
              color: customizations.colors.primary,
              fontFamily: customizations.typography.headingFont
            }}
          >
            {templateContent.portfolioTitle || 'Our Work'}
          </h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, maxProducts).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  website={website}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ShoppingBag
                className="h-16 w-16 mx-auto mb-4 opacity-50"
                style={{ color: customizations.colors.primary }}
              />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: customizations.colors.text }}
              >
                Portfolio Coming Soon!
              </h3>
              <p
                className="text-gray-600 mb-6"
                style={{ color: customizations.colors.text + '80' }}
              >
                We're working on showcasing our amazing work. Check back soon!
              </p>
              <Button
                variant="outline"
                style={{
                  borderColor: customizations.colors.primary,
                  color: customizations.colors.primary
                }}
                onClick={() => window.location.href = `/${website.slug}/contact`}
              >
                Get in Touch
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// Minimal Clean Template
function MinimalCleanTemplate({ website, products, blogs, onAddToCart }) {
  const { templateContent, customizations } = website
  const maxBlogs = website.template.metadata.blogsCount || 3

  return (
    <div>
      {/* Minimal Hero */}
      <section className="py-32 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1
            className="text-6xl md:text-7xl font-light mb-8"
            style={{
              color: customizations.colors.primary,
              fontFamily: customizations.typography.headingFont
            }}
          >
            {templateContent.heroTitle || website.name}
          </h1>
          <p
            className="text-2xl font-light"
            style={{ color: customizations.colors.secondary }}
          >
            {templateContent.heroDescription || website.description}
          </p>
        </div>
      </section>

      {/* Content Blocks */}
      {templateContent.contentBlocks && templateContent.contentBlocks.length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {templateContent.contentBlocks.filter(block => block.title && block.description).map((block, index) => (
                <div key={index} className="text-center">
                  <h3
                    className="text-2xl font-semibold mb-4"
                    style={{
                      color: customizations.colors.primary,
                      fontFamily: customizations.typography.headingFont
                    }}
                  >
                    {block.title}
                  </h3>
                  <p
                    className="text-lg"
                    style={{ color: customizations.colors.text }}
                  >
                    {block.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Simple Blog Section */}
      {blogs.length > 0 && (
        <section className="py-16 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4">
            <h2
              className="text-3xl font-light text-center mb-12"
              style={{
                color: customizations.colors.primary,
                fontFamily: customizations.typography.headingFont
              }}
            >
              Recent Thoughts
            </h2>

            <div className="space-y-8">
              {blogs.slice(0, maxBlogs).map((blog) => (
                <article key={blog.id} className="border-b border-gray-100 pb-8">
                  <h3 className="text-xl font-semibold mb-2">
                    <Link
                      to={`/${website.slug}/blogs/${blog.slug}`}
                      className="hover:opacity-75 transition-opacity"
                      style={{ color: customizations.colors.primary }}
                    >
                      {blog.title}
                    </Link>
                  </h3>
                  {blog.excerpt && (
                    <p
                      className="mb-4"
                      style={{ color: customizations.colors.text }}
                    >
                      {blog.excerpt}
                    </p>
                  )}
                  <div className="text-sm" style={{ color: customizations.colors.secondary }}>
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

// Default Template (fallback)
function DefaultTemplate({ website, products, blogs, onAddToCart }) {
  return (
    <div>
      {/* Simple Hero */}
      <section className="py-20 text-center bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            {website.name}
          </h1>
          <p className="text-xl text-gray-600">
            {website.description}
          </p>
        </div>
      </section>

      {/* Products */}
      {products.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Our Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.slice(0, 6).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  website={website}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

// Reusable Product Card Component
function ProductCard({ product, website, onAddToCart }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/${website.slug}/products/${product.slug || product.id}`}>
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300x200/gray/white?text=Product'}
          alt={product.name}
          className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
        />
      </Link>
      <div className="p-4">
        <Link to={`/${website.slug}/products/${product.slug || product.id}`}>
          <h3 className="font-semibold mb-2 hover:underline" style={{ color: website.customizations.colors.text }}>
            {product.name}
          </h3>
        </Link>
        <p className="text-sm mb-3" style={{ color: website.customizations.colors.secondary }}>
          {product.shortDescription || product.description?.substring(0, 100) + '...'}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span
              className="text-lg font-bold"
              style={{ color: website.customizations.colors.primary }}
            >
              ${product.price}
            </span>
            {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <Button
            size="sm"
            onClick={() => onAddToCart(product)}
            disabled={!product.inventory || product.inventory <= 0}
            style={{
              backgroundColor: website.customizations.colors.primary,
              color: 'white'
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            {product.inventory && product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// New Hover Overlay Blog Card Component
function HoverOverlayBlogCard({ blog, website }) {
  return (
    <article className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Large Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={blog.featuredImage || 'https://via.placeholder.com/600x400/gray/white?text=Blog+Post'}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {/* Blog Title */}
            <h3 className="text-xl md:text-2xl font-bold mb-3 line-clamp-2">
              {blog.title}
            </h3>

            {/* Blog Description/Excerpt */}
            {blog.excerpt && (
              <p className="text-sm md:text-base text-gray-200 mb-4 line-clamp-3">
                {blog.excerpt}
              </p>
            )}

            {/* Blog Meta Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-300">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(blog.createdAt).toLocaleDateString()}
                {blog.author && (
                  <>
                    <User className="h-3 w-3 ml-3 mr-1" />
                    {blog.author}
                  </>
                )}
              </div>

              {/* Read More Button */}
              <Link
                to={`/${website.slug}/blogs/${blog.slug}`}
                className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full hover:bg-white/30 transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                Read More
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {blog.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white"
                  >
                    <Tag className="h-2 w-2 mr-1" />
                    {tag}
                  </span>
                ))}
                {blog.tags.length > 3 && (
                  <span className="text-xs text-gray-300">
                    +{blog.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click Handler for Entire Card */}
      <Link
        to={`/${website.slug}/blogs/${blog.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`Read ${blog.title}`}
      />
    </article>
  )
}

// Reusable Blog Card Component (Original)
function BlogCard({ blog, website }) {
  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {blog.featuredImage && (
        <img
          src={blog.featuredImage}
          alt={blog.title}
          className="w-full h-32 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold mb-2">
          <Link
            to={`/${website.slug}/blogs/${blog.slug}`}
            className="hover:opacity-75 transition-opacity"
            style={{ color: website.customizations.colors.primary }}
          >
            {blog.title}
          </Link>
        </h3>
        {blog.excerpt && (
          <p
            className="text-sm mb-3 line-clamp-2"
            style={{ color: website.customizations.colors.text }}
          >
            {blog.excerpt}
          </p>
        )}
        <div className="flex items-center text-xs" style={{ color: website.customizations.colors.secondary }}>
          <Calendar className="h-3 w-3 mr-1" />
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          {blog.tags.length > 0 && (
            <>
              <Tag className="h-3 w-3 ml-3 mr-1" />
              <span>{blog.tags[0]}</span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

export default TemplateRenderer