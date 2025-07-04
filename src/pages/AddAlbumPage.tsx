import React, { useState } from 'react'
import AddAlbumForm from '../components/AddAlbumForm'
import CSVImport from '../components/CSVImport'
import { Plus, Upload, CheckCircle } from 'lucide-react'
import { useAddAlbum, useAddAlbums, NewAlbum } from '../hooks/useAlbums'

const AddAlbumPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const addAlbumMutation = useAddAlbum()
  const addAlbumsMutation = useAddAlbums()

  const handleAddAlbum = async (album: NewAlbum) => {
    try {
      await addAlbumMutation.mutateAsync(album)
      setSuccessMessage(`"${album.title}" by ${album.artist} added successfully!`)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      console.error('Failed to add album:', error)
    }
  }

  const handleAddAlbums = async (albums: NewAlbum[]) => {
    try {
      await addAlbumsMutation.mutateAsync(albums)
      setSuccessMessage(`${albums.length} albums added successfully!`)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      console.error('Failed to add albums:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">Add Albums</h1>
          <p className="text-gray-600 dark:text-gray-400">Add albums to your vinyl collection</p>
        </header>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 dark:bg-green-200/10 dark:border-green-400 dark:text-green-300 px-4 py-3 rounded mb-6 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          {/* Tab Navigation */}
          <div className="bg-white/80 backdrop-blur-md rounded-xl shadow mb-6 dark:bg-gray-800/80">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('single')}
                className={`flex-1 px-6 py-4 text-sm font-medium flex items-center justify-center space-x-2 ${
                  activeTab === 'single'
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <Plus className="h-5 w-5" />
                <span>Add Single Album</span>
              </button>
              <button
                onClick={() => setActiveTab('bulk')}
                className={`flex-1 px-6 py-4 text-sm font-medium flex items-center justify-center space-x-2 ${
                  activeTab === 'bulk'
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <Upload className="h-5 w-5" />
                <span>Bulk Import</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'single' ? (
            <AddAlbumForm onAddAlbum={handleAddAlbum} />
          ) : (
            <CSVImport onAddAlbums={handleAddAlbums} />
          )}
        </div>
      </div>
    </div>
  )
}

export default AddAlbumPage
