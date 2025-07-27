import { useState, useEffect } from 'react'
import { imageStorage } from '../utils/imageUtils'

export function useImageManager() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [storageUsage, setStorageUsage] = useState({ totalImages: 0, totalSize: 0, formattedSize: '0 B' })

  // Load images from localStorage
  const loadImages = () => {
    try {
      const loadedImages = imageStorage.getAllImages()
      setImages(loadedImages)
      setStorageUsage(imageStorage.getStorageUsage())
    } catch (error) {
      console.error('Error loading images:', error)
    } finally {
      setLoading(false)
    }
  }

  // Add new image
  const addImage = (imageData) => {
    try {
      const savedImage = imageStorage.saveImage(imageData)
      setImages(prev => [...prev, savedImage])
      setStorageUsage(imageStorage.getStorageUsage())
      return savedImage
    } catch (error) {
      console.error('Error adding image:', error)
      throw error
    }
  }

  // Delete image
  const deleteImage = (imageId) => {
    try {
      const success = imageStorage.deleteImage(imageId)
      if (success) {
        setImages(prev => prev.filter(img => img.id !== imageId))
        setStorageUsage(imageStorage.getStorageUsage())
      }
      return success
    } catch (error) {
      console.error('Error deleting image:', error)
      return false
    }
  }

  // Update image metadata
  const updateImage = (imageId, updates) => {
    try {
      const updatedImage = imageStorage.updateImage(imageId, updates)
      if (updatedImage) {
        setImages(prev => prev.map(img => 
          img.id === imageId ? updatedImage : img
        ))
      }
      return updatedImage
    } catch (error) {
      console.error('Error updating image:', error)
      return null
    }
  }

  // Get image by ID
  const getImageById = (imageId) => {
    return images.find(img => img.id === imageId) || null
  }

  // Search images
  const searchImages = (query, tags = []) => {
    return images.filter(image => {
      const matchesQuery = !query || image.name.toLowerCase().includes(query.toLowerCase())
      const matchesTags = tags.length === 0 || tags.some(tag => image.tags.includes(tag))
      return matchesQuery && matchesTags
    })
  }

  // Get all unique tags
  const getAllTags = () => {
    return [...new Set(images.flatMap(img => img.tags || []))]
  }

  // Clear all images (with confirmation)
  const clearAllImages = () => {
    try {
      localStorage.removeItem('userImages')
      setImages([])
      setStorageUsage({ totalImages: 0, totalSize: 0, formattedSize: '0 B' })
      return true
    } catch (error) {
      console.error('Error clearing images:', error)
      return false
    }
  }

  // Export images data (for backup)
  const exportImages = () => {
    try {
      const data = {
        images,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      }
      return JSON.stringify(data, null, 2)
    } catch (error) {
      console.error('Error exporting images:', error)
      return null
    }
  }

  // Import images data (from backup)
  const importImages = (jsonData, merge = false) => {
    try {
      const data = JSON.parse(jsonData)
      if (!data.images || !Array.isArray(data.images)) {
        throw new Error('Invalid import data format')
      }

      if (merge) {
        // Merge with existing images
        const existingIds = new Set(images.map(img => img.id))
        const newImages = data.images.filter(img => !existingIds.has(img.id))
        const mergedImages = [...images, ...newImages]
        localStorage.setItem('userImages', JSON.stringify(mergedImages))
        setImages(mergedImages)
      } else {
        // Replace all images
        localStorage.setItem('userImages', JSON.stringify(data.images))
        setImages(data.images)
      }
      
      setStorageUsage(imageStorage.getStorageUsage())
      return true
    } catch (error) {
      console.error('Error importing images:', error)
      return false
    }
  }

  // Load images on mount
  useEffect(() => {
    loadImages()
  }, [])

  return {
    images,
    loading,
    storageUsage,
    addImage,
    deleteImage,
    updateImage,
    getImageById,
    searchImages,
    getAllTags,
    clearAllImages,
    exportImages,
    importImages,
    refreshImages: loadImages
  }
}

export default useImageManager