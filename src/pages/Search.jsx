import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { searchService } from '../services/searchService'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Search as SearchIcon, Filter, Clock, Star } from 'lucide-react'

function Search() {
  const { dispatch } = useApp()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    type: '',
    dateRange: '',
    sortBy: 'relevance'
  })
  const [suggestions, setSuggestions] = useState([])
  const [popularSearches, setPopularSearches] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
    loadPopularSearches()
  }, [initialQuery])

  const performSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const searchResults = await searchService.search(searchQuery, filters)
      setResults(searchResults.results || [])
      setSuggestions(searchResults.suggestions || [])
      
      // Update URL
      setSearchParams({ q: searchQuery })
      
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: searchResults.results })
      dispatch({ type: 'SET_SEARCH_QUERY', payload: searchQuery })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Search failed' })
    } finally {
      setLoading(false)
    }
  }

  const loadPopularSearches = async () => {
    try {
      const popular = await searchService.getPopularSearches()
      setPopularSearches(popular)
    } catch (error) {
      console.error('Failed to load popular searches:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    performSearch()
  }

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)
    if (query) {
      performSearch(query)
    }
  }

  const getResultIcon = (type) => {
    switch (type) {
      case 'product':
        return '🛍️'
      case 'page':
        return '📄'
      case 'blog':
        return '📝'
      case 'article':
        return '📰'
      default:
        return '📄'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Search</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for products, pages, articles..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                />
              </div>
              <Button type="submit" size="lg" loading={loading}>
                Search
              </Button>
            </div>
          </form>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <div className={`flex flex-col lg:flex-row gap-4 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Types</option>
                  <option value="page">Pages</option>
                  <option value="product">Products</option>
                  <option value="blog">Blog Posts</option>
                  <option value="article">Articles</option>
                </select>

                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Any Time</option>
                  <option value="day">Past Day</option>
                  <option value="week">Past Week</option>
                  <option value="month">Past Month</option>
                  <option value="year">Past Year</option>
                </select>

                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="date">Most Recent</option>
                  <option value="title">Alphabetical</option>
                </select>
              </div>

              {results.length > 0 && (
                <span className="text-sm text-gray-600">
                  {results.length} results found
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Popular Searches */}
            {!query && popularSearches.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Popular Searches
                </h3>
                <div className="space-y-2">
                  {popularSearches.slice(0, 5).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(search.query)
                        performSearch(search.query)
                      }}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      {search.query}
                      <span className="text-xs text-gray-500 ml-2">
                        ({search.count})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Related Searches
                </h3>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(suggestion)
                        performSearch(suggestion)
                      }}
                      className="block w-full text-left px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                {results.map((result) => (
                  <div key={result.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getResultIcon(result.type)}</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {result.type}
                        </span>
                      </div>
                      {result.relevance && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">
                            {Math.round(result.relevance * 100)}% match
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      <Link 
                        to={result.url} 
                        className="hover:text-primary-600 transition-colors"
                      >
                        {result.title}
                      </Link>
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {result.snippet}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>
                          Updated {new Date(result.lastModified).toLocaleDateString()}
                        </span>
                        {result.price && (
                          <span className="font-semibold text-primary-600">
                            ${result.price}
                          </span>
                        )}
                      </div>
                      
                      <Link
                        to={result.url}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : query ? (
              <div className="text-center py-12">
                <SearchIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or filters
                </p>
                <Button onClick={() => setQuery('')}>
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Start your search
                </h3>
                <p className="text-gray-600">
                  Enter keywords to find products, pages, and content
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search