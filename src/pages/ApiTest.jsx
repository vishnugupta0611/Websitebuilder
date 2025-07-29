import React, { useState } from 'react'
import { runApiTests } from '../utils/apiTest'

function ApiTest() {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [testStatus, setTestStatus] = useState('ready') // ready, running, complete

  const runFullTest = async () => {
    setLoading(true)
    setTestStatus('running')
    setResults({})

    try {
      const testResults = await runApiTests()
      setResults(testResults)
      setTestStatus('complete')
    } catch (error) {
      setResults({ error: error.message })
      setTestStatus('complete')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (success) => {
    if (success === undefined) return '⏳'
    return success ? '✅' : '❌'
  }

  const getStatusText = (success) => {
    if (success === undefined) return 'Pending'
    return success ? 'Success' : 'Failed'
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🚀 Complete API Integration Test</h1>

      <div className="mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Test Status</h2>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${testStatus === 'ready' ? 'bg-gray-100 text-gray-800' :
                testStatus === 'running' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
              }`}>
              {testStatus === 'ready' ? '⏳ Ready to Test' :
                testStatus === 'running' ? '🔄 Running Tests...' :
                  '✅ Tests Complete'}
            </span>

            <button
              onClick={runFullTest}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Running Tests...' : 'Run Complete API Test'}
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>This test will:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Register a new user and verify OTP</li>
            <li>Test authentication and profile access</li>
            <li>Create and manage websites</li>
            <li>Create and manage products</li>
            <li>Create and manage blog posts</li>
            <li>Test shopping cart functionality</li>
            <li>Test analytics dashboard</li>
          </ul>
        </div>
      </div>

      {/* Test Results */}
      {Object.keys(results).length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Test Results</h2>

          {/* Authentication Tests */}
          {results.auth && (
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                🔐 Authentication Tests
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Registration</span>
                    <span>{getStatusIcon(results.auth.register?.success)}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {getStatusText(results.auth.register?.success)}
                  </span>
                </div>

                <div className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">OTP Verification</span>
                    <span>{getStatusIcon(results.auth.verifyOTP?.success)}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {getStatusText(results.auth.verifyOTP?.success)}
                  </span>
                </div>

                <div className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Profile Access</span>
                    <span>{getStatusIcon(results.auth.profile?.success)}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {getStatusText(results.auth.profile?.success)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Website Tests */}
          {results.websites && (
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                🌐 Website Management Tests
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Create Website</span>
                    <span>{getStatusIcon(results.websites.create?.success)}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {getStatusText(results.websites.create?.success)}
                  </span>
                </div>

                <div className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">List Websites</span>
                    <span>{getStatusIcon(results.websites.list?.success)}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {getStatusText(results.websites.list?.success)}
                  </span>
                </div>

                <div className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Public Access</span>
                    <span>{getStatusIcon(results.websites.getBySlug?.success)}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {getStatusText(results.websites.getBySlug?.success)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Product Tests */}
          {results.products && (
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                📦 Product Management Tests
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Create Product</span>
                    <span>{getStatusIcon(results.products.create?.success)}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {getStatusText(results.products.create?.success)}
                  </span>
                </div>

                <div className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">List Products</span>
                    <span>{getStatusIcon(results.products.list?.success)}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {getStatusText(results.products.list?.success)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Blog Tests */}
          {results.blogs && (
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                📝 Blog Management Tests
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Create Blog</span>
                    <span>{getStatusIcon(results.blogs.create?.success)}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {getStatusText(results.blogs.create?.success)}
                  </span>
                </div>

                <div className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">List Blogs</span>
                    <span>{getStatusIcon(results.blogs.list?.success)}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {getStatusText(results.blogs.list?.success)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Cart Tests */}
          {results.cart && (
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                🛒 Shopping Cart Tests
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Add to Cart</span>
                    <span>{getStatusIcon(results.cart.add?.success)}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {getStatusText(results.cart.add?.success)}
                  </span>
                </div>

                <div className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Get Cart</span>
                    <span>{getStatusIcon(results.cart.get?.success)}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {getStatusText(results.cart.get?.success)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tests */}
          {results.orders && (
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                📊 Analytics Tests
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Dashboard Analytics</span>
                    <span>{getStatusIcon(results.orders.analytics?.success)}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {getStatusText(results.orders.analytics?.success)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {results.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-red-800 mb-4">❌ Test Error</h3>
              <pre className="bg-red-100 p-4 rounded text-sm overflow-auto text-red-700">
                {results.error}
              </pre>
            </div>
          )}

          {/* Raw Results (Collapsible) */}
          <details className="bg-gray-50 border rounded-lg p-6">
            <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
              📋 View Raw Test Results
            </summary>
            <pre className="mt-4 bg-white p-4 rounded text-xs overflow-auto border">
              {JSON.stringify(results, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}

export default ApiTest