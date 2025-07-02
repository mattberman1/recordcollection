import React, { useState, useEffect, useRef } from 'react'
import { Album } from '../lib/supabase'
import { useDeleteAlbum, useUpdateAlbum } from '../hooks/useAlbums'
import { X, Edit, Save, Trash2, Music, Calendar, User, Upload } from 'lucide-react'
import AlbumArt from './AlbumArt'

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
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url')
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const deleteAlbumMutation = useDeleteAlbum()
  const updateAlbumMutation = useUpdateAlbum()

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
      const updatedAlbum = await updateAlbumMutation.mutateAsync({
        id: editedAlbum.id,
        updates: {
          title: editedAlbum.title,
          artist: editedAlbum.artist,
          release_year: editedAlbum.release_year,
          album_art_url: uploadedImageUrl || editedAlbum.album_art_url,
        },
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
      await deleteAlbumMutation.mutateAsync(album.id)
      onDelete(album.id)
      onClose()
    } catch (error) {
      console.error('Failed to delete album:', error)
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
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto dark:bg-gray-800/90">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {isEditing ? 'Edit Album' : 'Album Details'}
          </h2>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900 rounded-lg transition-colors"
                title="Edit album"
              >
                <Edit className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg transition-colors"
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
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Cover Art</h3>
              <div className="aspect-square bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                <AlbumArt
                  url={getCurrentImageUrl() || undefined}
                  alt={`${editedAlbum.title} cover art`}
                  className="w-full h-full"
                  iconClassName="h-16 w-16"
                />
              </div>

              {isEditing && (
                <div className="space-y-4">
                  {/* Upload Method Toggle */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setUploadMethod('url')}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        uploadMethod === 'url'
                          ? 'bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-gray-50 text-gray-600 border border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                      }`}
                    >
                      URL
                    </button>
                    <button
                      onClick={() => setUploadMethod('file')}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        uploadMethod === 'file'
                          ? 'bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-gray-50 text-gray-600 border border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                      }`}
                    >
                      File
                    </button>
                  </div>

                  {/* URL Input */}
                  {uploadMethod === 'url' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Album Art URL
                      </label>
                      <input
                        type="url"
                        value={editedAlbum.album_art_url || ''}
                        onChange={(e) => handleInputChange('album_art_url', e.target.value)}
                        placeholder="https://example.com/album-art.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {/* File Upload */}
                  {uploadMethod === 'file' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Upload Album Art
                      </label>
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        disabled={isUploading}
                        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isUploading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span>Uploading...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <Upload className="h-5 w-5" />
                            <span>Choose Image</span>
                          </div>
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Album Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Album Details
              </h3>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Music className="h-4 w-4 inline mr-1" />
                  Title
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedAlbum.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium dark:text-gray-100">
                    {editedAlbum.title}
                  </p>
                )}
              </div>

              {/* Artist */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Artist
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedAlbum.artist}
                    onChange={(e) => handleInputChange('artist', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium dark:text-gray-100">
                    {editedAlbum.artist}
                  </p>
                )}
              </div>

              {/* Release Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Release Year
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedAlbum.release_year || ''}
                    onChange={(e) =>
                      handleInputChange('release_year', parseInt(e.target.value) || 0)
                    }
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium dark:text-gray-100">
                    {editedAlbum.release_year || 'Unknown'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              {isEditing && (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center space-x-2"
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
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setEditedAlbum({ ...album })
                      setUploadedImageUrl(null)
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-100 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

            <button
              onClick={handleDelete}
              disabled={deleteAlbumMutation.isPending}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center space-x-2"
            >
              {deleteAlbumMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Album</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlbumDetailModal
