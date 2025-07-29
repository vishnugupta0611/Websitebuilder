import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useApp } from '../contexts/AppContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { websiteService } from '../services/websiteService'
import { blogService } from '../services/blogService'
import toast from '../utils/toast'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  User,
  Tag,
  Search,
  Filter,
  MoreVertical,
  ExternalLink,
  Save,
  X
} from 'lucide-react'

function BlogManager() {
  const { user } = useAuth()
  const { dispatch } = useApp()
  const [websites, setWebsites] = useState([])
  const [selectedWebsite, setSelectedWebsite] = useState('')
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    tags: '',
    author: user?.firstName + ' ' + user?.lastName || '',
    status: 'draft',
    layout: 'column',
    customizations: {
      showAuthor: true,
      showDate: true,
      showTags: true,
      layout: 'column'
    }
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadWebsites()
  }, [])

  useEffect(() => {
    if (selectedWebsite) {
      loadBlogs()
    }
  }, [selectedWebsite])

  const loadWebsites = async () => {
    try {
      const result = await websiteService.getWebsites()
      if (result.success) {
        setWebsites(result.data)
        if (result.data.length > 0) {
          setSelectedWebsite(result.data[0].id)
        }
      }
    } catch (error) {
      console.error('Error loading websites:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load websites' })
    }
  }

  const loadBlogs = async () => {
    try {
      setLoading(true)
      const result = await blogService.getBlogs(selectedWebsite)
      if (result.success) {
        setBlogs(result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
      }
    } catch (error) {
      console.error('Error loading blogs:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load blogs' })
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'title' && { slug: generateSlug(value) })
    }))
  }

  const handleCustomizationChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        [key]: value
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const blogData = {
        ...formData,
        website: selectedWebsite,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }

      let result
      if (editingBlog) {
        result = await blogService.updateBlog(editingBlog.id, blogData)
      } else {
        result = await blogService.createBlog(blogData)
      }

      if (result.success) {
        toast.success(editingBlog ? 'Blog updated successfully!' : 'Blog created successfully!')
        setShowCreateModal(false)
        setShowEditModal(false)
        setEditingBlog(null)
        resetForm()
        loadBlogs()
      } else {
        toast.error(result.error || 'Failed to save blog')
      }
    } catch (error) {
      console.error('Error saving blog:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save blog' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || '',
      content: blog.content,
      featuredImage: blog.featuredImage || '',
      tags: blog.tags ? blog.tags.join(', ') : '',
      author: blog.author,
      status: blog.status,
      layout: blog.layout || 'column',
      customizations: blog.customizations || {
        showAuthor: true,
        showDate: true,
        showTags: true,
        layout: 'column'
      }
    })
    setShowEditModal(true)
  }

  const handleDelete = async (blogId) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      // Instantly remove from UI
      setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogId))
      toast.success('Blog deleted successfully!')

      // Delete from backend
      const result = await blogService.deleteBlog(blogId)
      if (!result.success) {
        // If backend delete fails, restore the blog and show error
        loadBlogs() // Reload to restore the blog
        toast.error(result.error || 'Failed to delete blog')
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      // Restore the blog on error
      loadBlogs()
      toast.error('Failed to delete blog')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      tags: '',
      author: user?.firstName + ' ' + user?.lastName || '',
      status: 'draft',
      layout: 'column',
      customizations: {
        showAuthor: true,
        showDate: true,
        showTags: true,
        layout: 'column'
      }
    })
  }

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    
    const matchesStatus = statusFilter === 'all' || blog.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100'
      case 'draft': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const selectedWebsiteData = websites.find(w => w.id === parseInt(selectedWebsite))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Manager</h1>
          <p className="text-gray-600 mt-2">Create and manage your blog posts</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={!selectedWebsite}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Blog Post
        </Button>
      </div>

      {/* Website Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Website
        </label>
        <select
          value={selectedWebsite}
          onChange={(e) => setSelectedWebsite(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select a website...</option>
          {websites.map(website => (
            <option key={website.id} value={website.id}>
              {website.name} ({website.slug})
            </option>
          ))}
        </select>
      </div>

      {selectedWebsite && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Blog List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {blogs.length === 0 ? 'No blog posts yet' : 'No posts found'}
              </h3>
              <p className="text-gray-600">
                {blogs.length === 0
                  ? 'Create your first blog post to get started.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBlogs.map(blog => (
                      <tr key={blog.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {blog.featuredImage && (
                              <img
                                src={blog.featuredImage}
                                alt={blog.title}
                                className="w-12 h-12 rounded-lg object-cover mr-4"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {blog.title}
                              </div>
                              {blog.excerpt && (
                                <div className="text-sm text-gray-500 line-clamp-1">
                                  {blog.excerpt}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(blog.status)}`}>
                            {blog.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {blog.author}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {blog.status === 'published' && selectedWebsiteData && (
                              <a
                                href={`/${selectedWebsiteData.slug}/blogs/${blog.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-600"
                                title="View Blog"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                            <button
                              onClick={() => handleEdit(blog)}
                              className="text-gray-400 hover:text-gray-600"
                              title="Edit Blog"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(blog.id)}
                              className="text-red-400 hover:text-red-600"
                              title="Delete Blog"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setShowEditModal(false)
                    setEditingBlog(null)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      label="Title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter blog title..."
                    />
                  </div>
                  <div>
                    <Input
                      label="Slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      required
                      placeholder="blog-post-slug"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Brief description of the blog post..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={12}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Write your blog content here..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      label="Featured Image URL"
                      name="featuredImage"
                      value={formData.featuredImage}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Input
                      label="Tags (comma separated)"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="technology, web development, react"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Input
                      label="Author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Layout
                    </label>
                    <select
                      name="layout"
                      value={formData.layout}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="column">Column</option>
                      <option value="row-image-left">Row (Image Left)</option>
                      <option value="row-image-right">Row (Image Right)</option>
                      <option value="hover-overlay">Hover Overlay</option>
                    </select>
                  </div>
                </div>

                {/* Customizations */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Display Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.customizations.showAuthor}
                        onChange={(e) => handleCustomizationChange('showAuthor', e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show Author</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.customizations.showDate}
                        onChange={(e) => handleCustomizationChange('showDate', e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show Date</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.customizations.showTags}
                        onChange={(e) => handleCustomizationChange('showTags', e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Show Tags</span>
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateModal(false)
                      setShowEditModal(false)
                      setEditingBlog(null)
                      resetForm()
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {submitting ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editingBlog ? 'Update Blog' : 'Create Blog'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogManager