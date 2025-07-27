// Image Upload and Management Utilities

// Convert file to base64
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    })
}

// Compress image before storing
export const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
            // Calculate new dimensions
            let { width, height } = img

            if (width > maxWidth) {
                height = (height * maxWidth) / width
                width = maxWidth
            }

            // Set canvas dimensions
            canvas.width = width
            canvas.height = height

            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height)

            // Convert to base64
            const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
            resolve(compressedBase64)
        }

        img.src = URL.createObjectURL(file)
    })
}

// Validate image file
export const validateImageFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!validTypes.includes(file.type)) {
        return { valid: false, error: 'Please select a valid image file (JPEG, PNG, WebP, or GIF)' }
    }

    if (file.size > maxSize) {
        return { valid: false, error: 'Image size must be less than 10MB' }
    }

    return { valid: true }
}

// Generate unique image ID
export const generateImageId = () => {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Format file size
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'

    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Image storage management
export const imageStorage = {
    // Save image to localStorage
    saveImage: (imageData) => {
        try {
            const existingImages = JSON.parse(localStorage.getItem('userImages') || '[]')
            const newImage = {
                id: generateImageId(),
                name: imageData.name,
                base64: imageData.base64,
                size: imageData.size,
                type: imageData.type,
                uploadedAt: new Date().toISOString(),
                tags: imageData.tags || []
            }

            existingImages.push(newImage)
            localStorage.setItem('userImages', JSON.stringify(existingImages))

            return newImage
        } catch (error) {
            console.error('Error saving image:', error)
            throw new Error('Failed to save image')
        }
    },

    // Get all images
    getAllImages: () => {
        try {
            return JSON.parse(localStorage.getItem('userImages') || '[]')
        } catch (error) {
            console.error('Error loading images:', error)
            return []
        }
    },

    // Get image by ID
    getImageById: (id) => {
        try {
            const images = JSON.parse(localStorage.getItem('userImages') || '[]')
            return images.find(img => img.id === id)
        } catch (error) {
            console.error('Error loading image:', error)
            return null
        }
    },

    // Delete image
    deleteImage: (id) => {
        try {
            const images = JSON.parse(localStorage.getItem('userImages') || '[]')
            const updatedImages = images.filter(img => img.id !== id)
            localStorage.setItem('userImages', JSON.stringify(updatedImages))
            return true
        } catch (error) {
            console.error('Error deleting image:', error)
            return false
        }
    },

    // Update image metadata
    updateImage: (id, updates) => {
        try {
            const images = JSON.parse(localStorage.getItem('userImages') || '[]')
            const updatedImages = images.map(img =>
                img.id === id ? { ...img, ...updates, updatedAt: new Date().toISOString() } : img
            )
            localStorage.setItem('userImages', JSON.stringify(updatedImages))
            return updatedImages.find(img => img.id === id)
        } catch (error) {
            console.error('Error updating image:', error)
            return null
        }
    },

    // Get storage usage
    getStorageUsage: () => {
        try {
            const images = JSON.parse(localStorage.getItem('userImages') || '[]')
            const totalSize = images.reduce((sum, img) => sum + (img.size || 0), 0)
            return {
                totalImages: images.length,
                totalSize,
                formattedSize: formatFileSize(totalSize)
            }
        } catch (error) {
            console.error('Error calculating storage usage:', error)
            return { totalImages: 0, totalSize: 0, formattedSize: '0 B' }
        }
    }
}