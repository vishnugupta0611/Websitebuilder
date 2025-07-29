import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { websiteService } from '../services/websiteService'
import { blogService } from '../services/blogService'
import { 
  Save, 
  Eye, 
  Plus, 
  Edit, 
  Trash2,
  Search,
  Filter,
  Grid,
  List,
  Calendar,
  User,
  Globe,
  Layout,
  Image as ImageIcon,
  Type,
  Palette
} from 'lucide-react'

function ContentEditor() {
  const { dispatch } = useApp()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const blogId = searchParams.get('blog')
  const isEditing = !!blogId

  const [blogs, setBlogs] = useState([])
  const [websites, setWebsites] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedWebsite, setSelectedWebsite] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    website: '',
    sortBy: 'date'
  })

  const [blogData, setBlogData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    websiteId: '',
    featuredImage: '',
    author: 'Current User',
    tags: [],
    status: 'draft',
    publishDate: '',
    template: 'default',
    layout: 'card', // 'card', 'hover-overlay'
    customizations: {
      layout: 'column', // 'column', 'row-image-left', 'row-image-right'
      showAuthor: true,
      showDate: true,
      showTags: true,
      cardStyle: 'modern' // 'modern', 'classic', 'minimal'
    }
  })

  const [newTag, setNewTag] = useState('')

  const blogTemplates = [
    {
      id: 'default',
      name: 'Default',
      description: 'Simple and clean blog layout',
      preview: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Default'
    },
    {
      id: 'featured',
      name: 'Featured',
      description: 'Large featured image with content below',
      preview: 'https://via.placeholder.com/300x200/059669/ffffff?text=Featured'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean minimal design with focus on content',
      preview: 'https://via.placeholder.com/300x200/7c3aed/ffffff?text=Minimal'
    }
  ]

  const blogLayouts = [
    {
      id: 'card',
      name: 'Card Layout',
      description: 'Traditional card-based layout',
      preview: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Card+Layout'
    },
    {
      id: 'hover-overlay',
      name: 'Hover Overlay',
      description: 'Large image with hover overlay effect',
      preview: 'https://via.placeholder.com/300x200/dc2626/ffffff?text=Hover+Overlay'
    }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load websites from API
      const websitesResult = await websiteService.getWebsites()
      if (websitesResult.success) {
        setWebsites(websitesResult.data)
      }

      // Load blogs from API
      const blogsResult = await blogService.getBlogs()
      if (blogsResult.success) {
        setBlogs(blogsResult.data)
      }

      // Load existing blog if editing
      if (isEditing) {
        const blogResult = await blogService.getBlog(blogId)
        if (blogResult.success) {
          // Map API data to frontend format
          const blog = blogResult.data
          const mappedBlog = {
            ...blog,
            websiteId: blog.website,
            featuredImage: blog.featuredImage || '',
            tags: blog.tags || [],
            template: blog.template || 'default',
            layout: blog.layout || 'card',
            customizations: blog.customizations || {
              layout: 'column',
              showAuthor: true,
              showDate: true,
              showTags: true,
              cardStyle: 'modern'
            }
          }
          setBlogData(mappedBlog)
          setShowEditor(true)
        }
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (publish = false) => {
    setSaving(true)
    try {
      // Map frontend data to API format
      const saveData = {
        title: blogData.title,
        slug: blogData.slug || blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        content: blogData.content,
        excerpt: blogData.excerpt,
        website: blogData.websiteId,
        featuredImage: blogData.featuredImage,
        author: blogData.author,
        tags: blogData.tags,
        status: publish ? 'published' : 'draft',
        publishDate: publish ? (blogData.publishDate || new Date().toISOString()) : blogData.publishDate,
        template: blogData.template,
        customizations: blogData.customizations
      }

      let result
      if (isEditing) {
        result = await blogService.updateBlog(blogId, saveData)
      } else {
        result = await blogService.createBlog(saveData)
      }
      
      if (!result.success) {
        throw new Error(result.error)
      }
      
      // Reload blogs
      const blogsResult = await blogService.getBlogs()
      if (blogsResult.success) {
        setBlogs(blogsResult.data)
      }
      
      dispatch({ type: 'SET_ERROR', payload: null })
      setShowEditor(false)
      
      // Reset form
      setBlogData({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        websiteId: '',
        featuredImage: '',
        author: 'Current User',
        tags: [],
        status: 'draft',
        publishDate: '',
        template: 'default',
        layout: 'card',
        customizations: {
          layout: 'column',
          showAuthor: true,
          showDate: true,
          showTags: true,
          cardStyle: 'modern'
        }
      })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save blog' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (blogId) => {
    try {
      const result = await blogService.deleteBlog(blogId)
      if (result.success) {
        // Reload blogs
        const blogsResult = await blogService.getBlogs()
        if (blogsResult.success) {
          setBlogs(blogsResult.data)
        }
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to delete blog' })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete blog' })
    }
  }

  const addTag = () => {
    if (newTag.trim() && !blogData.tags.includes(newTag.trim())) {
      setBlogData({
        ...blogData,
        tags: [...blogData.tags, newTag.trim()]
      })
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setBlogData({
      ...blogData,
      tags: blogData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !filters.status || blog.status === filters.status
    const matchesWebsite = !filters.website || blog.websiteId === filters.website
    
    return matchesSearch && matchesStatus && matchesWebsite
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Manager</h1>
              <p className="text-gray-600">Create and manage blog posts for your websites</p>
            </div>
            <Button onClick={() => setShowEditor(true)} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create New Blog Post
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-3">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>

              <select
                value={filters.website}
                onChange={(e) => setFilters({ ...filters, website: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Websites</option>
                {websites.map(website => (
                  <option key={website.id} value={website.id}>
                    {website.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center space-x-1">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-center">
              <Type className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {blogs.length === 0 ? 'No blog posts yet' : 'No posts found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {blogs.length === 0 
                  ? 'Start by creating your first blog post'
                  : 'Try adjusting your search or filters'
                }
              </p>
              {blogs.length === 0 && (
                <Button onClick={() => setShowEditor(true)} size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Blog Post
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Featured Image */}
                {blog.featuredImage && (
                  <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-w-16 aspect-h-9'}>
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className={`object-cover ${viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'}`}
                    />
                  </div>
                )}

                {/* Blog Info */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {blog.title}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(blog.status)}`}>
                      {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                    </span>
                  </div>

                  {blog.excerpt && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {blog.excerpt}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <User className="h-4 w-4 mr-1" />
                    <span className="mr-4">{blog.author}</span>
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="mr-4">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    {blog.websiteId && (
                      <>
                        <Globe className="h-4 w-4 mr-1" />
                        <span>
                          {websites.find(w => w.id === blog.websiteId)?.name || 'Unknown'}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Tags */}
                  {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {blog.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{blog.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setBlogData(blog)
                        setShowEditor(true)
                        navigate(`/content-editor?blog=${blog.id}`)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    
                    {blog.status === 'published' && blog.websiteId && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          const website = websites.find(w => w.id === blog.websiteId)
                          if (website) {
                            window.open(`/${website.slug}/blogs/${blog.slug}`, '_blank')
                          }
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(blog.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blog Editor Modal */}
      <Modal
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        title={isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
        size="xl"
      >
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Blog Title"
              value={blogData.title}
              onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
              placeholder="Enter blog title"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <select
                value={blogData.websiteId}
                onChange={(e) => setBlogData({ ...blogData, websiteId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Website</option>
                {websites.map(website => (
                  <option key={website.id} value={website.id}>
                    {website.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="URL Slug (Optional)"
            value={blogData.slug}
            onChange={(e) => setBlogData({ ...blogData, slug: e.target.value })}
            placeholder="auto-generated-from-title"
            helperText="Leave empty to auto-generate from title"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt
            </label>
            <textarea
              value={blogData.excerpt}
              onChange={(e) => setBlogData({ ...blogData, excerpt: e.target.value })}
              placeholder="Brief description of the blog post"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <Input
            label="Featured Image URL"
            value={blogData.featuredImage}
            onChange={(e) => setBlogData({ ...blogData, featuredImage: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={blogData.content}
              onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
              placeholder="Write your blog content here..."
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {blogData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-primary-600 hover:text-primary-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add a tag"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Button onClick={addTag} size="sm">
                Add Tag
              </Button>
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Blog Template
            </label>
            <div className="grid grid-cols-3 gap-4">
              {blogTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                    blogData.template === template.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setBlogData({ ...blogData, template: template.id })}
                >
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-20 object-cover rounded-md mb-2"
                  />
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  <p className="text-xs text-gray-600">{template.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Blog Layout Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Blog Layout
            </label>
            <div className="grid grid-cols-2 gap-4">
              {blogLayouts.map((layout) => (
                <div
                  key={layout.id}
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                    blogData.layout === layout.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setBlogData({ ...blogData, layout: layout.id })}
                >
                  <img
                    src={layout.preview}
                    alt={layout.name}
                    className="w-full h-20 object-cover rounded-md mb-2"
                  />
                  <h4 className="font-medium text-sm">{layout.name}</h4>
                  <p className="text-xs text-gray-600">{layout.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card Layout Customization (only show when Card layout is selected) */}
          {blogData.layout === 'card' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Card Layout Style
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                    blogData.customizations.layout === 'column'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setBlogData({ 
                    ...blogData, 
                    customizations: { ...blogData.customizations, layout: 'column' }
                  })}
                >
                  <div className="w-full h-16 bg-gray-200 rounded mb-2"></div>
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-300 rounded"></div>
                    <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                  </div>
                  <p className="text-xs font-medium mt-2">Column Layout</p>
                </div>

                <div
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                    blogData.customizations.layout === 'row-image-left'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setBlogData({ 
                    ...blogData, 
                    customizations: { ...blogData.customizations, layout: 'row-image-left' }
                  })}
                >
                  <div className="flex space-x-2">
                    <div className="w-1/3 h-12 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-2 bg-gray-300 rounded"></div>
                      <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  </div>
                  <p className="text-xs font-medium mt-2">Image Left</p>
                </div>

                <div
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                    blogData.customizations.layout === 'row-image-right'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setBlogData({ 
                    ...blogData, 
                    customizations: { ...blogData.customizations, layout: 'row-image-right' }
                  })}
                >
                  <div className="flex space-x-2">
                    <div className="flex-1 space-y-1">
                      <div className="h-2 bg-gray-300 rounded"></div>
                      <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                    </div>
                    <div className="w-1/3 h-12 bg-gray-200 rounded"></div>
                  </div>
                  <p className="text-xs font-medium mt-2">Image Right</p>
                </div>
              </div>
            </div>
          )}

          {/* Display Options (only show when Card layout is selected) */}
          {blogData.layout === 'card' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Display Options
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={blogData.customizations.showAuthor}
                    onChange={(e) => setBlogData({
                      ...blogData,
                      customizations: { ...blogData.customizations, showAuthor: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Author</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={blogData.customizations.showDate}
                    onChange={(e) => setBlogData({
                      ...blogData,
                      customizations: { ...blogData.customizations, showDate: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Date</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={blogData.customizations.showTags}
                    onChange={(e) => setBlogData({
                      ...blogData,
                      customizations: { ...blogData.customizations, showTags: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Tags</span>
                </label>
              </div>
            </div>
          )}

          {/* Display Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Display Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={blogData.customizations.showAuthor}
                  onChange={(e) => setBlogData({ 
                    ...blogData, 
                    customizations: { ...blogData.customizations, showAuthor: e.target.checked }
                  })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Show Author</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={blogData.customizations.showDate}
                  onChange={(e) => setBlogData({ 
                    ...blogData, 
                    customizations: { ...blogData.customizations, showDate: e.target.checked }
                  })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Show Date</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={blogData.customizations.showTags}
                  onChange={(e) => setBlogData({ 
                    ...blogData, 
                    customizations: { ...blogData.customizations, showTags: e.target.checked }
                  })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Show Tags</span>
              </label>
            </div>
          </div>

          {/* Publish Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={blogData.status}
                onChange={(e) => setBlogData({ ...blogData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            {blogData.status === 'scheduled' && (
              <Input
                label="Publish Date"
                type="datetime-local"
                value={blogData.publishDate}
                onChange={(e) => setBlogData({ ...blogData, publishDate: e.target.value })}
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setShowEditor(false)}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              loading={saving}
            >
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave(true)}
              loading={saving}
              disabled={!blogData.title || !blogData.websiteId}
            >
              {blogData.status === 'scheduled' ? 'Schedule' : 'Publish'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ContentEditor