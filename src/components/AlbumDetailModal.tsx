import React, { useState, useEffect, useRef } from 'react'
import { Album } from '../lib/supabase'
import { albumService } from '../services/albumService'
import { X, Edit, Save, Trash2, Music, Calendar, User, Upload } from 'lucide-react'

interface AlbumDetailModalProps {
  album: Album | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedAlbum: Album) => void
  onDelete: (id: string) => void
}

const AlbumDetailModal: React.FC<AlbumDetailModalProps> = ({
  album,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedAlbum, setEditedAlbum] = useState<Album | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url')
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (album) {
      setEditedAlbum({ ...album })
      setIsEditing(false)
      setUploadedImageUrl(null)
      setUploadMethod('url')
    }
  }, [album])

  if (!isOpen || !album || !editedAlbum) {
    return null
  }

  const handleSave = async () => {
    if (!editedAlbum) return

    try {
      setIsSaving(true)
      const updatedAlbum = await albumService.updateAlbum(editedAlbum.id, {
        title: editedAlbum.title,
        artist: editedAlbum.artist,
        release_year: editedAlbum.release_year,
        album_art_url: uploadedImageUrl || editedAlbum.album_art_url,
      })
      onUpdate(updatedAlbum)
      setIsEditing(false)
      setUploadedImageUrl(null)
    } catch (error) {
      console.error('Failed to update album:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${album.title}" by ${album.artist}?`)) {
      return
    }

    try {
      setIsDeleting(true)
      await albumService.deleteAlbum(album.id)
      onDelete(album.id)
      onClose()
    } catch (error) {
      console.error('Failed to delete album:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleInputChange = (field: keyof Album, value: string | number) => {
    if (editedAlbum) {
      setEditedAlbum({
        ...editedAlbum,
        [field]: value,
      })
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, GIF, etc.)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    try {
      setIsUploading(true)

      // Convert file to base64 for preview and storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUploadedImageUrl(result)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const getCurrentImageUrl = () => {
    return uploadedImageUrl || editedAlbum.album_art_url
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Edit Album' : 'Album Details'}
          </h2>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit album"
              >
                <Edit className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Cover Art */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Cover Art</h3>
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                {getCurrentImageUrl() ? (
                  <img
                    src={getCurrentImageUrl()}
                    alt={`${editedAlbum.title} cover art`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full flex items-center justify-center text-gray-500 ${getCurrentImageUrl() ? 'hidden' : ''}`}
                >
                  <Music className="h-16 w-16" />
                </div>
              </div>

              {isEditing && (
                <div className="space-y-4">
                  {/* Upload Method Toggle */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setUploadMethod('url')}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        uploadMethod === 'url'
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-50 text-gray-600 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      URL
                    </button>
                    <button
                      onClick={() => setUploadMethod('file')}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        uploadMethod === 'file'
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-50 text-gray-600 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      Upload
                    </button>
                  </div>

                  {/* URL Input */}
                  {uploadMethod === 'url' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Cover Art URL
                      </label>
                      <input
                        type="url"
                        value={editedAlbum.album_art_url || ''}
                        onChange={(e) => handleInputChange('album_art_url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/cover.jpg"
                      />
                    </div>
                  )}

                  {/* File Upload */}
                  {uploadMethod === 'file' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Upload Image
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        onClick={handleUploadClick}
                        disabled={isUploading}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-5 w-5 text-gray-400" />
                            <span>Click to upload image</span>
                          </>
                        )}
                      </button>
                      <p className="text-xs text-gray-500">
                        Supported formats: JPEG, PNG, GIF. Max size: 5MB
                      </p>
                    </div>
                  )}

                  {/* Uploaded Image Preview */}
                  {uploadedImageUrl && uploadMethod === 'file' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Uploaded Image
                      </label>
                      <div className="relative">
                        <img
                          src={uploadedImageUrl}
                          alt="Uploaded cover art"
                          className="w-full h-32 object-cover rounded-md border border-gray-300"
                        />
                        <button
                          onClick={() => setUploadedImageUrl(null)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          title="Remove uploaded image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Album Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Album Information</h3>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedAlbum.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-800">
                      <Music className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{editedAlbum.title}</span>
                    </div>
                  )}
                </div>

                {/* Artist */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedAlbum.artist}
                      onChange={(e) => handleInputChange('artist', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-800">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{editedAlbum.artist}</span>
                    </div>
                  )}
                </div>

                {/* Release Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Release Year
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedAlbum.release_year || ''}
                      onChange={(e) =>
                        handleInputChange('release_year', parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-800">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{editedAlbum.release_year || 'Unknown'}</span>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="pt-4 space-y-2">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Added:</span>{' '}
                    {new Date(editedAlbum.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Last Updated:</span>{' '}
                    {new Date(editedAlbum.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setUploadedImageUrl(null)
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Album</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlbumDetailModal
