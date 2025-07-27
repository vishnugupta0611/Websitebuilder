import React, { useState, useRef } from 'react'
import { 
  fileToBase64, 
  compressImage, 
  validateImageFile, 
  imageStorage, 
  formatFileSize 
} from '../../utils/imageUtils'
import Button from './Button'
import Modal from './Modal'
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Check, 
  Loader, 
  Trash2,
  Eye,
  Download,
  Tag,
  Search
} from 'lucide-react'

function ImageUpload({ 
  onImageSelect, 
  selectedImage = null, 
  label = "Upload Image",
  showGallery = true,
  acceptedTypes = "image/*",
  maxSize = 10,
  compress = true,
  className = ""
}) {
  const [uploading, setUploading] = useState(false)
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [galleryImages, setGalleryImages] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [previewImage, setPreviewImage] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    setUploading(true)
    
    try {
      let base64
      
      if (compress) {
        base64 = await compressImage(file)
      } else {
        base64 = await fileToBase64(file)
      }

      // Save to localStorage
      const savedImage = imageStorage.saveImage({
        name: file.name,
        base64,
        size: file.size,
        type: file.type,
        tags: []
      })

      // Call the callback with the saved image
      onImageSelect(savedImage)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const openGallery = () => {
    const images = imageStorage.getAllImages()
    setGalleryImages(images)
    setShowGalleryModal(true)
  }

  const handleGalleryImageSelect = (image) => {
    onImageSelect(image)
    setShowGalleryModal(false)
  }

  const deleteImage = (imageId) => {
    if (confirm('Are you sure you want to delete this image?')) {
      imageStorage.deleteImage(imageId)
      const updatedImages = imageStorage.getAllImages()
      setGalleryImages(updatedImages)
      
      // If the deleted image was selected, clear selection
      if (selectedImage && selectedImage.id === imageId) {
        onImageSelect(null)
      }
    }
  }

  const filteredImages = galleryImages.filter(image => {
    const matchesSearch = image.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => image.tags.includes(tag))
    return matchesSearch && matchesTags
  })

  const allTags = [...new Set(galleryImages.flatMap(img => img.tags))]

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Selected Image Preview */}
      {selectedImage && (
        <div className="relative inline-block">
          <img
            src={selectedImage.base64}
            alt={selectedImage.name}
            className="w-32 h-32 object-cover rounded-lg border border-gray-300"
          />
          <button
            onClick={() => onImageSelect(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
          <div className="mt-2 text-xs text-gray-500 max-w-32 truncate">
            {selectedImage.name}
          </div>
        </div>
      )}

      {/* Upload Buttons */}
      <div className="flex space-x-3">
        {/* Upload New Image */}
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileSelect}
            className="hidden"
            id={`image-upload-${Math.random()}`}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center"
          >
            {uploading ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {uploading ? 'Uploading...' : 'Upload New'}
          </Button>
        </div>

        {/* Open Gallery */}
        {showGallery && (
          <Button
            variant="outline"
            onClick={openGallery}
            className="flex items-center"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Gallery
          </Button>
        )}
      </div>

      {/* Upload Info */}
      <p className="text-xs text-gray-500">
        Supported formats: JPEG, PNG, WebP, GIF. Max size: {maxSize}MB.
        {compress && ' Images will be compressed for optimal storage.'}
      </p>

      {/* Image Gallery Modal */}
      <Modal
        isOpen={showGalleryModal}
        onClose={() => setShowGalleryModal(false)}
        title="Image Gallery"
        size="xl"
      >
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            {/* Tag Filter */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      if (selectedTags.includes(tag)) {
                        setSelectedTags(selectedTags.filter(t => t !== tag))
                      } else {
                        setSelectedTags([...selectedTags, tag])
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-100 text-primary-800 border border-primary-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    <Tag className="h-3 w-3 mr-1 inline" />
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Storage Usage */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Storage Usage:</span>
              <span className="font-medium">
                {imageStorage.getStorageUsage().formattedSize} 
                ({imageStorage.getStorageUsage().totalImages} images)
              </span>
            </div>
          </div>

          {/* Images Grid */}
          {filteredImages.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {galleryImages.length === 0 
                  ? 'No images uploaded yet. Upload your first image to get started.'
                  : 'No images match your search criteria.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {filteredImages.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.base64}
                    alt={image.name}
                    className="w-full h-24 object-cover rounded-lg border border-gray-300 cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={() => handleGalleryImageSelect(image)}
                  />
                  
                  {/* Image Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setPreviewImage(image)
                        }}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4 text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleGalleryImageSelect(image)
                        }}
                        className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                        title="Select"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteImage(image.id)
                        }}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Selected Indicator */}
                  {selectedImage && selectedImage.id === image.id && (
                    <div className="absolute top-2 right-2 bg-primary-600 text-white rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  
                  {/* Image Info */}
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 truncate" title={image.name}>
                      {image.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(image.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Image Preview Modal */}
      {previewImage && (
        <Modal
          isOpen={!!previewImage}
          onClose={() => setPreviewImage(null)}
          title={previewImage.name}
          size="lg"
        >
          <div className="space-y-4">
            <img
              src={previewImage.base64}
              alt={previewImage.name}
              className="w-full max-h-96 object-contain rounded-lg"
            />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">File Size:</span>
                <span className="ml-2 text-gray-600">{formatFileSize(previewImage.size)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <span className="ml-2 text-gray-600">{previewImage.type}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Uploaded:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(previewImage.uploadedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={() => {
                  handleGalleryImageSelect(previewImage)
                  setPreviewImage(null)
                }}
                className="flex items-center"
              >
                <Check className="h-4 w-4 mr-2" />
                Select This Image
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = previewImage.base64
                  link.download = previewImage.name
                  link.click()
                }}
                className="flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default ImageUpload