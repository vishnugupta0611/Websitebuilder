import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { websiteService } from '../services/websiteService'
import { blogService } from '../services/blogService'
import {
    ArrowLeft,
    Calendar,
    User,
    Tag,
    ShoppingCart,
    Clock,
    Share2,
    Facebook,
    Twitter,
    Linkedin
} from 'lucide-react'

function UserBlogDetail() {
    const { slug, blogSlug } = useParams()
    const { state, dispatch } = useApp()
    const [website, setWebsite] = useState(null)
    const [blog, setBlog] = useState(null)
    const [relatedBlogs, setRelatedBlogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [slug, blogSlug])

    const loadData = async () => {
        try {
            setLoading(true)

            // Load website data from API
            const websiteResult = await websiteService.getWebsiteBySlug(slug)
            
            if (!websiteResult.success) {
                dispatch({ type: 'SET_ERROR', payload: 'Website not found' })
                setLoading(false)
                return
            }

            const websiteData = websiteResult.data

            // Only show published websites
            if (websiteData.status !== 'published') {
                dispatch({ type: 'SET_ERROR', payload: 'Website not found' })
                setLoading(false)
                return
            }

            // Load blogs for this website from API
            const blogsResult = await blogService.getBlogsByWebsiteSlug(slug)
            
            if (!blogsResult.success) {
                dispatch({ type: 'SET_ERROR', payload: 'Failed to load blogs' })
                setLoading(false)
                return
            }

            const websiteBlogs = blogsResult.data

            // Find the specific blog
            const currentBlog = websiteBlogs.find(blog => blog.slug === blogSlug)

            if (!currentBlog) {
                dispatch({ type: 'SET_ERROR', payload: 'Blog post not found' })
                setLoading(false)
                return
            }

            // Get related blogs (same tags or recent posts)
            const related = websiteBlogs
                .filter(b => b.id !== currentBlog.id)
                .filter(b => b.tags && currentBlog.tags && b.tags.some(tag => currentBlog.tags.includes(tag)))
                .slice(0, 3)

            if (related.length < 3) {
                const recentBlogs = websiteBlogs
                    .filter(b => b.id !== currentBlog.id && !related.find(r => r.id === b.id))
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3 - related.length)

                related.push(...recentBlogs)
            }

            setWebsite(websiteData)
            setBlog(currentBlog)
            setRelatedBlogs(related)
        } catch (error) {
            console.error('Error loading blog:', error)
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load blog post' })
        } finally {
            setLoading(false)
        }
    }

    const shareUrl = window.location.href
    const shareTitle = blog?.title || ''

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (!website || !blog) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {!website ? 'Website not found' : 'Blog post not found'}
                    </h2>
                    <Link to="/" className="text-primary-600 hover:text-primary-700">
                        Go Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: website.customizations.colors.background,
                color: website.customizations.colors.text,
                fontFamily: website.customizations.typography.bodyFont
            }}
        >
            {/* Header */}
            <header
                className="border-b shadow-sm"
                style={{
                    backgroundColor: website.customizations.colors.background,
                    borderColor: website.customizations.colors.secondary + '20'
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link
                            to={`/${slug}`}
                            className="flex items-center hover:opacity-75 transition-opacity"
                            style={{ color: website.customizations.colors.primary }}
                        >
                            <h1
                                className="text-2xl font-bold"
                                style={{ fontFamily: website.customizations.typography.headingFont }}
                            >
                                {website.name}
                            </h1>
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <Link
                                to={`/${slug}`}
                                className="hover:opacity-75 transition-opacity"
                                style={{ color: website.customizations.colors.text }}
                            >
                                Home
                            </Link>
                            <Link
                                to={`/${slug}/about`}
                                className="hover:opacity-75 transition-opacity"
                                style={{ color: website.customizations.colors.text }}
                            >
                                About
                            </Link>
                            <Link
                                to={`/${slug}/blogs`}
                                className="hover:opacity-75 transition-opacity font-semibold"
                                style={{ color: website.customizations.colors.primary }}
                            >
                                Blogs
                            </Link>
                            <Link
                                to={`/${slug}/contact`}
                                className="hover:opacity-75 transition-opacity"
                                style={{ color: website.customizations.colors.text }}
                            >
                                Contact
                            </Link>
                        </nav>

                        <Button
                            as={Link}
                            to={`/${slug}/getstarted`}
                            style={{
                                backgroundColor: website.customizations.colors.primary,
                                color: 'white'
                            }}
                            className="hover:opacity-90 transition-opacity"
                        >
                            Get Started
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="mb-8">
                    <div className="flex items-center space-x-2 text-sm">
                        <Link
                            to={`/${slug}`}
                            className="hover:opacity-75 transition-opacity"
                            style={{ color: website.customizations.colors.primary }}
                        >
                            Home
                        </Link>
                        <span style={{ color: website.customizations.colors.secondary }}>→</span>
                        <Link
                            to={`/${slug}/blogs`}
                            className="hover:opacity-75 transition-opacity"
                            style={{ color: website.customizations.colors.primary }}
                        >
                            Blogs
                        </Link>
                        <span style={{ color: website.customizations.colors.secondary }}>→</span>
                        <span style={{ color: website.customizations.colors.text }}>{blog.title}</span>
                    </div>
                </div>

                {/* Blog Header */}
                <header className="mb-8">
                    <h1
                        className="text-4xl md:text-5xl font-bold mb-6"
                        style={{
                            color: website.customizations.colors.primary,
                            fontFamily: website.customizations.typography.headingFont
                        }}
                    >
                        {blog.title}
                    </h1>

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-6 text-sm mb-6" style={{ color: website.customizations.colors.secondary }}>
                        {blog.customizations?.showAuthor && (
                            <div className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                <span>By {blog.author}</span>
                            </div>
                        )}

                        {blog.customizations?.showDate && (
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                        )}

                        <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{Math.ceil(blog.content.split(' ').length / 200)} min read</span>
                        </div>
                    </div>

                    {/* Tags */}
                    {blog.customizations?.showTags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {blog.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                                    style={{
                                        backgroundColor: website.customizations.colors.primary + '20',
                                        color: website.customizations.colors.primary
                                    }}
                                >
                                    <Tag className="h-3 w-3 mr-1" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Share Buttons */}
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium" style={{ color: website.customizations.colors.text }}>
                            Share:
                        </span>
                        <div className="flex space-x-2">
                            <a
                                href={shareLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg hover:opacity-75 transition-opacity"
                                style={{ backgroundColor: website.customizations.colors.primary + '20' }}
                            >
                                <Facebook className="h-4 w-4" style={{ color: website.customizations.colors.primary }} />
                            </a>
                            <a
                                href={shareLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg hover:opacity-75 transition-opacity"
                                style={{ backgroundColor: website.customizations.colors.primary + '20' }}
                            >
                                <Twitter className="h-4 w-4" style={{ color: website.customizations.colors.primary }} />
                            </a>
                            <a
                                href={shareLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg hover:opacity-75 transition-opacity"
                                style={{ backgroundColor: website.customizations.colors.primary + '20' }}
                            >
                                <Linkedin className="h-4 w-4" style={{ color: website.customizations.colors.primary }} />
                            </a>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                {blog.featuredImage && (
                    <div className="mb-8">
                        <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-sm"
                        />
                    </div>
                )}

                {/* Blog Content */}
                <article className="prose prose-lg max-w-none mb-12">
                    <div
                        className="leading-relaxed"
                        style={{
                            color: website.customizations.colors.text,
                            fontSize: '1.125rem',
                            lineHeight: '1.75'
                        }}
                    >
                        {blog.content.split('\n').map((paragraph, index) => (
                            <p key={index} className="mb-4">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </article>

                {/* Back to Blogs */}
                <div className="mb-12">
                    <Link
                        to={`/${slug}/blogs`}
                        className="inline-flex items-center font-medium hover:opacity-75 transition-opacity"
                        style={{ color: website.customizations.colors.primary }}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to All Posts
                    </Link>
                </div>

                {/* Related Posts */}
                {relatedBlogs.length > 0 && (
                    <section>
                        <h2
                            className="text-3xl font-bold mb-8"
                            style={{
                                color: website.customizations.colors.primary,
                                fontFamily: website.customizations.typography.headingFont
                            }}
                        >
                            Related Posts
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedBlogs.map(relatedBlog => (
                                <article
                                    key={relatedBlog.id}
                                    className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow"
                                    style={{ borderColor: website.customizations.colors.secondary + '30' }}
                                >
                                    {relatedBlog.featuredImage && (
                                        <div className="aspect-w-16 aspect-h-9">
                                            <img
                                                src={relatedBlog.featuredImage}
                                                alt={relatedBlog.title}
                                                className="w-full h-32 object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="p-4">
                                        <h3 className="font-semibold mb-2">
                                            <Link
                                                to={`/${slug}/blogs/${relatedBlog.slug}`}
                                                className="hover:opacity-75 transition-opacity"
                                                style={{ color: website.customizations.colors.primary }}
                                            >
                                                {relatedBlog.title}
                                            </Link>
                                        </h3>

                                        {relatedBlog.excerpt && (
                                            <p
                                                className="text-sm mb-3 line-clamp-2"
                                                style={{ color: website.customizations.colors.text }}
                                            >
                                                {relatedBlog.excerpt}
                                            </p>
                                        )}

                                        <div className="flex items-center text-xs" style={{ color: website.customizations.colors.secondary }}>
                                            <Calendar className="h-3 w-3 mr-1" />
                                            <span>{new Date(relatedBlog.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Footer */}
            <footer
                className="py-12 border-t mt-16"
                style={{
                    backgroundColor: website.customizations.colors.secondary + '10',
                    borderColor: website.customizations.colors.secondary + '30'
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p style={{ color: website.customizations.colors.secondary }}>
                        © 2024 {website.name}. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default UserBlogDetail