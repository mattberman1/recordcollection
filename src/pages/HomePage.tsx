import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, Music } from 'lucide-react'
import AlbumOfTheDay from '../components/AlbumOfTheDay'

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
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Manage your vinyl record collection with ease. Search, organize, and track your albums
            with automatic data from MusicBrainz.
          </p>
        </div>

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
