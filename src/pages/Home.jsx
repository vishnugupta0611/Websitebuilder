import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowRight, Edit, Globe, Search, Palette, Code, Layers, Zap, Users, TrendingUp, User } from 'lucide-react'
import { MouseTrailDemo } from '../components/animatedcomp'
import Features from '../components/homecomp/Features'

// Button Component
const Button = ({ children, className = '', size = 'md', variant = 'primary', onClick, ...props }) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const variantClasses = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50'
  }

  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
// Skiper UI Components (simulated for demo)
const TextScroll = ({ text, className, default_velocity = 1 }) => {
  return (
    <div className={`${className} overflow-hidden whitespace-nowrap`}>
      <div
        className="inline-block animate-scroll"
        style={{
          animation: `scroll ${20 / default_velocity}s linear infinite`
        }}
      >
        {text.repeat(3)}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}

// Card Carousel Component
const CardCarousel = ({ images, autoplayDelay = 3000, showPagination = true, showNavigation = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, autoplayDelay)

    return () => clearInterval(interval)
  }, [images.length, autoplayDelay])

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-2xl shadow-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {showPagination && (
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentIndex ? 'bg-slate-800' : 'bg-slate-300'
                }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}



const AnimatedNumber = ({ value, className }) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const increment = value / 50
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, 30)

    return () => clearInterval(timer)
  }, [value])

  return <span className={className}>{displayValue.toLocaleString()}</span>
}

function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [recentPages] = useState([
    {
      id: 1,
      title: "Getting Started with Website Building",
      content: "Learn how to create your first professional website using our intuitive drag-and-drop builder. This comprehensive guide covers everything from template selection to customization.",
      type: "Guide",
      author: { name: "John Smith" },
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Advanced Content Management Tips",
      content: "Discover powerful features in our content management system that will help you create engaging blog posts and manage your content more efficiently.",
      type: "Tutorial",
      author: { name: "Sarah Johnson" },
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 3,
      title: "Product Showcase Best Practices",
      content: "Learn how to effectively showcase your products with beautiful layouts, compelling descriptions, and strategic positioning to maximize sales.",
      type: "Article",
      author: { name: "Mike Davis" },
      updatedAt: new Date(Date.now() - 172800000).toISOString()
    }
  ])
  const templateImages = [
    { src: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop", alt: "Corporate Business Template" },
    { src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop", alt: "E-commerce Store Template" },
    { src: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=600&fit=crop", alt: "Portfolio Template" },
    { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop", alt: "Agency Template" },
    { src: "https://images.unsplash.com/photo-1486312338219-ce68e2c6b7dc?w=800&h=600&fit=crop", alt: "Tech Startup Template" }
  ]



  useEffect(() => {
    // Simulate loading
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  const features = [
    {
      icon: Globe,
      title: "Website Builder",
      description: "Create stunning websites with our drag-and-drop builder. Choose from dozens of professional templates.",
      color: "bg-blue-50 text-blue-600",
      hoverColor: "group-hover:bg-blue-100"
    },
    {
      icon: Edit,
      title: "Content Management",
      description: "Powerful WYSIWYG editor with advanced customization options for all your content needs.",
      color: "bg-green-50 text-green-600",
      hoverColor: "group-hover:bg-green-100"
    },
    {
      icon: Palette,
      title: "Design Customization",
      description: "Full control over layouts, colors, fonts, and positioning. Make it uniquely yours.",
      color: "bg-purple-50 text-purple-600",
      hoverColor: "group-hover:bg-purple-100"
    },
    {
      icon: Search,
      title: "Advanced Search",
      description: "Intelligent search across all content with filtering, sorting, and relevance ranking.",
      color: "bg-orange-50 text-orange-600",
      hoverColor: "group-hover:bg-orange-100"
    }
  ]

  const stats = [
    { label: "Active Users", value: 12500, icon: Users },
    { label: "Websites Created", value: 8900, icon: Globe },
    { label: "Templates Available", value: 150, icon: Layers },
    { label: "Success Rate", value: 98, suffix: "%", icon: TrendingUp }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-white">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            {/* Welcome Message for Authenticated User */}
            {user && (
              <div className="mb-6">
                <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200">
                  <User className="w-4 h-4 mr-2 text-blue-500" />
                  Welcome back, {user.firstName}! Ready to create something amazing?
                </div>
              </div>
            )}
            
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                Professional Content Management System
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              Build. Create.{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Publish.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              The ultimate content management platform for creating professional websites,
              managing blog posts, and selling products with complete customization control.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button
                size="lg"
                onClick={() => navigate('/website-builder')}
                className="bg-slate-900 text-white hover:bg-slate-800 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl border-0 font-semibold tracking-tight"
              >
                <Globe className="mr-3 h-5 w-5" />
                Start Building Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/website-builder')}
                className="border-2 border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transform hover:scale-105 transition-all duration-300 font-semibold tracking-tight"
              >
                <Code className="mr-3 h-5 w-5" />
                Explore Templates
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl mx-auto mb-3 group-hover:bg-slate-200 transition-colors">
                    <stat.icon className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-slate-900">
                    <AnimatedNumber value={stat.value} />
                    {stat.suffix}
                  </div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling Text */}
      <section className="py-8 bg-slate-50 border-y border-slate-200">
        <TextScroll
          className="text-2xl font-medium text-slate-400"
          text="Create Professional Websites • Manage Content Easily • Customize Everything • Sell Products • "
          default_velocity={2}
        />
      </section>

      {/* Features Section with Skiper UI */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Features Heading */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Check out our features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Discover powerful tools and capabilities designed to enhance your workflow and boost productivity.
            </p>
          </div>

          {/* Skiper UI Features Component */}
          <Features />

          {/* MouseTrailDemo Section */}
          <div className="mt-20">
            <MouseTrailDemo />
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
        Everything you need to succeed
      </h2>
      <p className="text-xl text-slate-600 max-w-3xl mx-auto">
        Powerful tools designed for modern businesses and content creators who demand excellence.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="group relative p-8 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all duration-300 bg-white overflow-hidden"
        >
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center transition-all duration-300 group-hover:scale-105`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-slate-800 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  {feature.description}
                </p>
              </div>
            </div>
            <div className="mt-auto flex items-center">
              <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors duration-300">
                Learn more
              </span>
              <ArrowRight className="ml-2 w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-all duration-300 group-hover:translate-x-1" />
            </div>
          </div>

          {/* Smoky Blur Overlay */}
          <div className="absolute inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            {/* Animated Arrow */}
            {/* <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ">
              <svg 
                width="40" 
                height="40" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-slate-600"
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div> */}
          </div>
          
          {/* Subtle shine effect */}
       <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>   
      ))}
    </div>
  </div>
</section>

     {/* Testimonials Section */}
<section className="py-20 bg-slate-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
        Trusted by Creators
      </h2>
      <p className="text-xl text-slate-600 max-w-3xl mx-auto">
        What our community says about their experience
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {recentPages.slice(0, 5).map((user, index) => {
        // Determine card size based on position
        const cardClass = index === 0 ? 'md:col-span-6' : 
                         index === 1 ? 'md:col-span-6' : 
                         index === 2 ? 'md:col-span-4' : 
                         index === 3 ? 'md:col-span-4' : 
                         'md:col-span-4';
        
        return (
          <div
            key={user.id}
            className={`${cardClass} bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-500 group relative`}
          >
            {/* Content */}
            <div className="p-8 h-full flex flex-col">
              {/* Quote icon - animated on hover */}
              <div className="absolute top-6 right-6 text-slate-200 group-hover:text-slate-300 transition-colors duration-300">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M3 21C3 14.3726 8.37258 9 15 9C16.1913 9 17.3477 9.18391 18.4444 9.52564M8 21C8 15.4772 12.4772 11 18 11C19.1913 11 20.3477 11.1839 21.4444 11.5256" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeLinecap="round"/>
                </svg>
              </div>

              {/* User info */}
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                    {user.author.avatar ? (
                      <img src={user.author.avatar} alt={user.author.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-medium text-slate-600">
                        {user.author.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  {/* Verification badge */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M9 1L3.5 7L1 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-slate-900">{user.author.name}</h4>
                  <p className="text-sm text-slate-500">{user.author.role || 'Content Creator'}</p>
                </div>
              </div>

              {/* Feedback text */}
              <div className="flex-1 mb-6">
                <p className="text-slate-600 italic relative">
                  <span className="absolute -left-4 -top-2 text-2xl text-slate-300">“</span>
                  {user.content.substring(0, index === 0 ? 300 : index === 1 ? 200 : 150)}...
                  <span className="absolute -right-2 -bottom-4 text-2xl text-slate-300">”</span>
                </p>
              </div>

              {/* Rating and date */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={i < 4 ? "currentColor" : "none"}
                      stroke="currentColor"
                      className={`${i < 4 ? 'text-yellow-400' : 'text-slate-200'} w-4 h-4`}
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-slate-500">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Hover overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/70 to-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button className="px-6 py-2 bg-white border border-slate-200 rounded-full shadow-sm text-slate-700 font-medium flex items-center hover:bg-slate-50 transition-all duration-200">
                View Story
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )
      })}
    </div>

    {/* View all button */}
    <div className="text-center mt-12">
      <button
        onClick={() => navigate('/testimonials')}
        className="inline-flex items-center px-6 py-3 border border-slate-200 rounded-full bg-white text-slate-700 font-medium hover:bg-slate-50 hover:shadow-sm transition-all duration-300"
      >
        Read All Testimonials
        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
</section>

      {/* CTA Section */}
  
    </div>
  )
}

export default Home