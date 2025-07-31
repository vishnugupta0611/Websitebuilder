import React from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { ArrowRight, ShoppingCart, Calendar, ShoppingBag } from "lucide-react";

function TemplateRenderer({ website, products, blogs, onAddToCart }) {
  const { template } = website;

  // Debug logging for template selection
  console.log('🎨 TemplateRenderer Debug:');
  console.log('- Website template object:', template);
  console.log('- Template ID:', template?.id);
  console.log('- Template name:', template?.name);
  console.log('- Template metadata:', template?.metadata);

  if (!template || !template.id || template.id === 'default') {
    console.log('⚠️ Using DefaultTemplate - no valid template ID found');
    return (
      <DefaultTemplate
        website={website}
        products={products}
        blogs={blogs}
        onAddToCart={onAddToCart}
      />
    );
  }

  console.log(`✅ Rendering template: ${template.id}`);

  switch (template.id) {
    case "hero-products":
      console.log('🎯 Rendering HeroProductsTemplate');
      return (
        <HeroProductsTemplate
          website={website}
          products={products}
          blogs={blogs}
          onAddToCart={onAddToCart}
        />
      );
    case "text-image-split":
      console.log('🎯 Rendering TextImageSplitTemplate');
      return (
        <TextImageSplitTemplate
          website={website}
          products={products}
          blogs={blogs}
          onAddToCart={onAddToCart}
        />
      );
    case "blog-focused":
      console.log('🎯 Rendering BlogFocusedTemplate');
      return (
        <BlogFocusedTemplate
          website={website}
          products={products}
          blogs={blogs}
          onAddToCart={onAddToCart}
        />
      );
    case "products-blogs-combo":
      console.log('🎯 Rendering ProductsBlogsComboTemplate');
      return (
        <ProductsBlogsComboTemplate
          website={website}
          products={products}
          blogs={blogs}
          onAddToCart={onAddToCart}
        />
      );
    case "image-left-content":
      console.log('🎯 Rendering ImageLeftContentTemplate');
      return (
        <ImageLeftContentTemplate
          website={website}
          products={products}
          blogs={blogs}
          onAddToCart={onAddToCart}
        />
      );
    case "minimal-clean":
      console.log('🎯 Rendering MinimalCleanTemplate');
      return (
        <MinimalCleanTemplate
          website={website}
          products={products}
          blogs={blogs}
          onAddToCart={onAddToCart}
        />
      );
    default:
      console.log(`⚠️ Unknown template ID: ${template.id}, using DefaultTemplate`);
      return (
        <DefaultTemplate
          website={website}
          products={products}
          blogs={blogs}
          onAddToCart={onAddToCart}
        />
      );
  }
}

// Hero with Products Template
function HeroProductsTemplate({ website, products, blogs, onAddToCart }) {
  const { templateContent, customizations } = website;
  const maxProducts = website.template.metadata.productsCount || 6;

  // Enhanced hero image detection - check all possible sources
  const heroImageSources = [
    website?.heroImage, // Direct from backend model
    templateContent?.heroImage, // From templateContent
    website?.hero_image, // Snake case variant
    website?.heroImageUrl, // URL variant
    website?.hero_image_url, // Snake case URL variant
    website?.template?.heroImage, // From template object
  ];

  // Find the first valid image URL
  let heroImage = heroImageSources.find((source) => {
    return (
      source &&
      typeof source === "string" &&
      source.trim() !== "" &&
      (source.startsWith("http") || source.startsWith("data:"))
    );
  });

  // Fallback to default image if no valid image found
  if (!heroImage) {
    heroImage =
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
  }

  return (
    <div>
      {/* Hero Section */}
      <section
        className="py-20 text-center relative min-h-[500px]"
        style={{
          backgroundColor: customizations.colors.primary + "10",
        }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`,
            opacity: 0.8,
          }}
        />

        {/* Content Overlay */}
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{
              color: customizations.colors.primary,
              fontFamily: customizations.typography.headingFont,
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
              color: "white",
            }}
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {templateContent.heroButtonText || "Shop Now"}
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
              fontFamily: customizations.typography.headingFont,
            }}
          >
            {templateContent.productSectionTitle || "Featured Products"}
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
                style={{ color: customizations.colors.text + "80" }}
              >
                We're working hard to bring you amazing products. Check back
                soon!
              </p>
              <Button
                variant="outline"
                style={{
                  borderColor: customizations.colors.primary,
                  color: customizations.colors.primary,
                }}
                onClick={() =>
                  (window.location.href = `/${website.slug}/contact`)
                }
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
                fontFamily: customizations.typography.headingFont,
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
  );
}

// Products & Blogs Combo Template
function ProductsBlogsComboTemplate({ website, products, blogs, onAddToCart }) {
  const { templateContent, customizations } = website;
  const maxProducts = website.template.metadata.productsCount || 4;
  const maxBlogs = website.template.metadata.blogsCount || 3;

  // Enhanced hero image detection - check all possible sources
  const heroImageSources = [
    website?.heroImage, // Direct from backend model
    templateContent?.heroImage, // From templateContent
    website?.hero_image, // Snake case variant
    website?.heroImageUrl, // URL variant
    website?.hero_image_url, // Snake case URL variant
    website?.template?.heroImage, // From template object
  ];

  // Find the first valid image URL
  let heroImage = heroImageSources.find((source) => {
    return (
      source &&
      typeof source === "string" &&
      source.trim() !== "" &&
      (source.startsWith("http") || source.startsWith("data:"))
    );
  });

  // Fallback to default image if no valid image found
  if (!heroImage) {
    heroImage =
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
  }

  // Debug logging
  console.log("🔍 ProductsBlogsComboTemplate - Hero Image Debug:");
  console.log("Website object keys:", Object.keys(website));
  console.log("Direct heroImage:", website?.heroImage);
  console.log("TemplateContent heroImage:", templateContent?.heroImage);
  console.log("Final selected heroImage:", heroImage);

  return (
    <div>
      {/* Hero Section */}
      <section
        className="py-20 text-center relative min-h-[500px]"
        style={{
          backgroundColor: customizations.colors.primary + "10",
        }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <img
            src={heroImage}
            alt="Hero Background"
            className="w-full h-full object-cover"
            style={{ opacity: 0.7 }}
            onError={(e) => {
              console.error("❌ Hero image failed to load:", heroImage);
              e.target.src =
                "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
            }}
            onLoad={() =>
              console.log("✅ Hero image loaded successfully:", heroImage)
            }
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 max-w-4xl mx-auto px-4">
          <h1
            className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg"
            style={{
              fontFamily: customizations.typography.headingFont,
            }}
          >
            {templateContent.heroTitle || website.name}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white drop-shadow-md">
            {templateContent.heroDescription || website.description}
          </p>
          <Button
            size="lg"
            style={{
              backgroundColor: customizations.colors.primary,
              color: "white",
            }}
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {templateContent.heroButtonText || "Shop Now"}
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{
              color: customizations.colors.primary,
              fontFamily: customizations.typography.headingFont,
            }}
          >
            {templateContent.productSectionTitle || "Featured Products"}
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
                style={{ color: customizations.colors.text + "80" }}
              >
                We're working hard to bring you amazing products. Check back
                soon!
              </p>
              <Button
                variant="outline"
                style={{
                  borderColor: customizations.colors.primary,
                  color: customizations.colors.primary,
                }}
                onClick={() =>
                  (window.location.href = `/${website.slug}/contact`)
                }
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
              fontFamily: customizations.typography.headingFont,
            }}
          >
            {templateContent.blogSectionTitle || "Latest Updates"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.slice(0, maxBlogs).map((blog) => (
              <BlogCard key={blog.id} blog={blog} website={website} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Text Image Split Template
function TextImageSplitTemplate({ website, products, blogs, onAddToCart }) {
  const { templateContent, customizations } = website;

  // Enhanced hero image detection
  const heroImageSources = [
    website?.heroImage,
    templateContent?.heroImage,
    website?.hero_image,
    website?.heroImageUrl,
    website?.hero_image_url,
    website?.template?.heroImage,
  ];

  let heroImage = heroImageSources.find((source) => {
    return (
      source &&
      typeof source === "string" &&
      source.trim() !== "" &&
      (source.startsWith("http") || source.startsWith("data:"))
    );
  });

  if (!heroImage) {
    heroImage =
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
  }

  return (
    <div>
      {/* Hero Section with Split Layout */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1
                className="text-5xl font-bold mb-6"
                style={{
                  color: customizations.colors.primary,
                  fontFamily: customizations.typography.headingFont,
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
                  color: "white",
                }}
              >
                {templateContent.heroButtonText || "Get Started"}
              </Button>
            </div>
            <div>
              <img
                src={heroImage}
                alt="Hero"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      {products.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2
              className="text-3xl font-bold text-center mb-12"
              style={{
                color: customizations.colors.primary,
                fontFamily: customizations.typography.headingFont,
              }}
            >
              {templateContent.productSectionTitle || "Our Products"}
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
  );
}

// Blog Focused Template
function BlogFocusedTemplate({ website, products, blogs, onAddToCart }) {
  const { templateContent, customizations } = website;

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 text-center bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1
            className="text-5xl font-bold mb-6"
            style={{
              color: customizations.colors.primary,
              fontFamily: customizations.typography.headingFont,
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
              color: "white",
            }}
            onClick={() =>
              document
                .getElementById("blogs")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {templateContent.heroButtonText || "Read More"}
          </Button>
        </div>
      </section>

      {/* Featured Blogs */}
      <section id="blogs" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{
              color: customizations.colors.primary,
              fontFamily: customizations.typography.headingFont,
            }}
          >
            {templateContent.blogSectionTitle || "Latest Posts"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.slice(0, 6).map((blog) => (
              <BlogCard key={blog.id} blog={blog} website={website} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Image Left Content Template
function ImageLeftContentTemplate({ website, products, blogs, onAddToCart }) {
  const { templateContent, customizations } = website;

  // Enhanced hero image detection
  const heroImageSources = [
    website?.heroImage,
    templateContent?.heroImage,
    website?.hero_image,
    website?.heroImageUrl,
    website?.hero_image_url,
    website?.template?.heroImage,
  ];

  let heroImage = heroImageSources.find((source) => {
    return (
      source &&
      typeof source === "string" &&
      source.trim() !== "" &&
      (source.startsWith("http") || source.startsWith("data:"))
    );
  });

  if (!heroImage) {
    heroImage =
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
  }

  return (
    <div>
      {/* Hero Section with Image Left */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={heroImage}
                alt="Hero"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
                }}
              />
            </div>
            <div>
              <h1
                className="text-5xl font-bold mb-6"
                style={{
                  color: customizations.colors.primary,
                  fontFamily: customizations.typography.headingFont,
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
                  color: "white",
                }}
              >
                {templateContent.heroButtonText || "Learn More"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content sections can be added here */}
    </div>
  );
}

// Minimal Clean Template
function MinimalCleanTemplate({ website, products, blogs, onAddToCart }) {
  const { templateContent, customizations } = website;

  return (
    <div>
      {/* Minimal Hero */}
      <section className="py-32 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1
            className="text-6xl font-light mb-8"
            style={{
              color: customizations.colors.primary,
              fontFamily: customizations.typography.headingFont,
            }}
          >
            {templateContent.heroTitle || website.name}
          </h1>
          <p
            className="text-2xl font-light mb-8"
            style={{ color: customizations.colors.text }}
          >
            {templateContent.heroDescription || website.description}
          </p>
          <Button
            size="lg"
            variant="outline"
            style={{
              borderColor: customizations.colors.primary,
              color: customizations.colors.primary,
            }}
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {templateContent.heroButtonText || "Explore"}
          </Button>
        </div>
      </section>

      {/* Minimal Products Grid */}
      {products.length > 0 && (
        <section id="products" className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
  );
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
          <p className="text-xl text-gray-600">{website.description}</p>
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
  );
}

// Reusable Product Card Component
function ProductCard({ product, website, onAddToCart }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/${website.slug}/products/${product.id}`}>
        <img
          src={
            product.images?.[0] ||
            "https://via.placeholder.com/300x200/gray/white?text=Product"
          }
          alt={product.name}
          className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
        />
      </Link>
      <div className="p-4">
        <Link to={`/${website.slug}/products/${product.id}`}>
          <h3
            className="font-semibold mb-2 hover:underline"
            style={{ color: website.customizations.colors.text }}
          >
            {product.name}
          </h3>
        </Link>
        <p
          className="text-sm mb-3"
          style={{ color: website.customizations.colors.secondary }}
        >
          {product.shortDescription ||
            product.description?.substring(0, 100) + "..."}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span
              className="text-lg font-bold"
              style={{ color: website.customizations.colors.primary }}
            >
              ${product.price}
            </span>
            {product.originalPrice &&
              parseFloat(product.originalPrice) > parseFloat(product.price) && (
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
              color: "white",
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

// Blog Card Component
function BlogCard({ blog, website }) {
  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {blog.featuredImage && (
        <Link to={`/${website.slug}/blogs/${blog.slug}`}>
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
          />
        </Link>
      )}
      <div className="p-6">
        <Link to={`/${website.slug}/blogs/${blog.slug}`}>
          <h3
            className="text-xl font-semibold mb-2 hover:underline"
            style={{ color: website.customizations.colors.text }}
          >
            {blog.title}
          </h3>
        </Link>
        {blog.excerpt && (
          <p
            className="text-gray-600 mb-4"
            style={{ color: website.customizations.colors.secondary }}
          >
            {blog.excerpt}
          </p>
        )}
        <div
          className="flex items-center text-sm"
          style={{ color: website.customizations.colors.secondary }}
        >
          <Calendar className="h-4 w-4 mr-1" />
          {new Date(blog.createdAt).toLocaleDateString()}
        </div>
      </div>
    </article>
  );
}

export default TemplateRenderer;
