import React, { useState, useMemo } from 'react'
import AlbumList from '../components/AlbumList'
import { Loader2 } from 'lucide-react'
import { useAlbums, useDeleteAlbum } from '../hooks/useAlbums'
import { Album } from '../lib/supabase'
import CollectionControls from '../components/CollectionControls'
import { useDebounce } from '../hooks/useDebounce'

const getDecade = (year?: number) => {
  if (!year || year < 1950) return ''
  return `${Math.floor(year / 10) * 10}`
}

const CollectionPage: React.FC = () => {
  const { data: albums = [], isLoading, error } = useAlbums()
  const deleteAlbumMutation = useDeleteAlbum()

  // Controls state
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState('artist-asc')
  const [filterDecade, setFilterDecade] = useState('')
  const [filterFormat, setFilterFormat] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  // Filter and sort albums
  const visibleAlbums = useMemo(() => {
    let filtered = albums
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase()
      filtered = filtered.filter(
        (a) => a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q),
      )
    }
    if (filterDecade) {
      filtered = filtered.filter((a) => getDecade(a.release_year) === filterDecade)
    }
    if (filterFormat) {
      filtered = filtered.filter(
        (a) => (a.format || '').toLowerCase() === filterFormat.toLowerCase(),
      )
    }
    // Sorting
    const sorted = [...filtered]

    switch (sortKey) {
      case 'title-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'title-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'artist-asc':
        sorted.sort((a, b) => a.artist.localeCompare(b.artist))
        break
      case 'artist-desc':
        sorted.sort((a, b) => b.artist.localeCompare(a.artist))
        break
      case 'year-asc':
        sorted.sort((a, b) => (a.release_year || 0) - (b.release_year || 0))
        break
      case 'year-desc':
        sorted.sort((a, b) => (b.release_year || 0) - (a.release_year || 0))
        break
      case 'date-asc':
        sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case 'date-desc':
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      default:
        break
    }

    return sorted
  }, [albums, debouncedQuery, sortKey, filterDecade, filterFormat])

  const handleDeleteAlbum = async (id: string) => {
    try {
      await deleteAlbumMutation.mutateAsync(id)
    } catch (err) {
      // Optionally handle error UI
      console.error('Failed to delete album', err)
    }
  }

  const handleUpdateAlbum = async (updatedAlbum: Album) => {
    // This can be handled via optimistic update or refetch, depending on your update logic
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <div className="text-xl">Loading your vinyl collection...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Your Collection
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {albums.length} album{albums.length !== 1 ? 's' : ''} in your vinyl collection
          </p>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-200/10 dark:border-red-400 dark:text-red-300 px-4 py-3 rounded mb-6 max-w-4xl mx-auto">
            {error.message}
          </div>
        )}

        <CollectionControls
          query={query}
          setQuery={setQuery}
          sortKey={sortKey}
          setSortKey={setSortKey}
          filterDecade={filterDecade}
          setFilterDecade={setFilterDecade}
          filterFormat={filterFormat}
          setFilterFormat={setFilterFormat}
        />

        <div className="max-w-6xl mx-auto">
          <AlbumList
            albums={visibleAlbums}
            onDeleteAlbum={handleDeleteAlbum}
            onUpdateAlbum={handleUpdateAlbum}
            sortKey={sortKey}
          />
        </div>
      </div>
    </div>
  )
}

export default CollectionPage
