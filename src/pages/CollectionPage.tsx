import React from 'react'
import AlbumList from '../components/AlbumList'
import { Loader2 } from 'lucide-react'
import { useAlbums, useDeleteAlbum } from '../hooks/useAlbums'

const CollectionPage: React.FC = () => {
  const { data: albums = [], isLoading, error } = useAlbums()
  const deleteAlbumMutation = useDeleteAlbum()

  const handleDeleteAlbum = async (id: string) => {
    try {
      await deleteAlbumMutation.mutateAsync(id)
    } catch (err) {
      // Optionally handle error UI
      console.error('Failed to delete album', err)
    }
  }

  const handleUpdateAlbum = async (updatedAlbum: any) => {
    // This can be handled via optimistic update or refetch, depending on your update logic
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <div className="text-xl">Loading your vinyl collection...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Collection</h1>
          <p className="text-gray-600">
            {albums.length} album{albums.length !== 1 ? 's' : ''} in your vinyl collection
          </p>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-4xl mx-auto">
            {error.message}
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          <AlbumList
            albums={albums}
            onDeleteAlbum={handleDeleteAlbum}
            onUpdateAlbum={handleUpdateAlbum}
          />
        </div>
      </div>
    </div>
  )
}

export default CollectionPage
