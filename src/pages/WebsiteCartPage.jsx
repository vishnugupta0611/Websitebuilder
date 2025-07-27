import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { WebsiteCartProvider } from '../contexts/WebsiteCartContext'
import WebsiteCart from '../components/website/WebsiteCart'
import LoadingSpinner from '../components/ui/LoadingSpinner'

function WebsiteCartPage() {
    const { slug } = useParams()
    const [website, setWebsite] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadWebsiteData()
    }, [slug])

    const loadWebsiteData = async () => {
        try {
            setLoading(true)

            // Load website data from localStorage
            const userWebsites = JSON.parse(localStorage.getItem('userWebsites') || '[]')
            const websiteData = userWebsites.find(site => site.slug === slug && site.status === 'published')

            if (!websiteData) {
                console.error('Website not found')
                return
            }

            setWebsite(websiteData)
        } catch (error) {
            console.error('Error loading website:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    if (!website) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Website Not Found</h1>
                    <p className="text-gray-600">The website you're looking for doesn't exist or isn't published.</p>
                </div>
            </div>
        )
    }

    return (
        <WebsiteCartProvider websiteSlug={slug}>
            <WebsiteCart website={website} />
        </WebsiteCartProvider>
    )
}

export default WebsiteCartPage