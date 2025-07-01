import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Music } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface AlbumOfTheDay {
  id: string
  title: string
  artist: string
  release_year: number
  album_art_url: string
}

const AlbumOfTheDay: React.FC = () => {
  const [album, setAlbum] = useState<AlbumOfTheDay | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAlbumOfTheDay = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase.rpc('get_album_of_the_day')
        if (error) {
          setError('Failed to load album: ' + error.message)
          setAlbum(null)
        } else if (!data || (Array.isArray(data) && data.length === 0)) {
          setError('No albums found. Add some albums to your collection!')
          setAlbum(null)
        } else {
          // Supabase RPC may return an array or a single object
          const albumData = Array.isArray(data) ? data[0] : data
          setAlbum(albumData)
        }
      } catch (err: any) {
        setError('Failed to load album: ' + (err.message || err.toString()))
        setAlbum(null)
      } finally {
        setLoading(false)
      }
    }
    fetchAlbumOfTheDay()
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse flex items-center gap-4 p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow mb-8 max-w-xl mx-auto">
        <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/3" />
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-200/10 border border-red-400 dark:border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-8 max-w-xl mx-auto">
        {error}
      </div>
    )
  }
  if (!album) return null
  return (
    <div className="flex items-center gap-4 p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow mb-8 max-w-xl mx-auto">
      <div className="h-20 w-20 flex-shrink-0">
        {album.album_art_url ? (
          <img
            src={album.album_art_url}
            alt={`${album.title} album art`}
            className="h-20 w-20 rounded-lg object-cover"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        ) : (
          <div className="h-20 w-20 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <Music className="h-10 w-10 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Album of the Day
        </div>
        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate mb-1">
          {album.title}
        </div>
        <div className="text-gray-600 dark:text-gray-400 truncate mb-1">{album.artist}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {album.release_year > 0 ? album.release_year : '—'}
        </div>
      </div>
    </div>
  )
}

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Vinyl Catalog Logo" className="h-20 w-20 rounded-xl shadow" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Vinyl Catalog
          </h1>
        </div>

        {/* Album of the Day */}
        <AlbumOfTheDay />

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* View Collection Card */}
          <Link
            to="/collection"
            className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group dark:bg-gray-800/80"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto group-hover:bg-blue-200 transition-colors">
              <Music className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3 text-center">
              View Collection
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Browse your vinyl collection organized by artist. See album covers, release years, and
              manage your records.
            </p>
          </Link>

          {/* Add Albums Card */}
          <Link
            to="/add"
            className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group dark:bg-gray-800/80"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mx-auto group-hover:bg-green-200 transition-colors">
              <Plus className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3 text-center">
              Add Albums
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Add albums one by one or bulk import from CSV. Automatic data fetching with cover art
              and release information.
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
