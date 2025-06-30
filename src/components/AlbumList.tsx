import React, { useState } from 'react'
import { Album } from '../lib/supabase'
import { Trash2, Music } from 'lucide-react'
import AlbumDetailModal from './AlbumDetailModal'

interface AlbumListProps {
  albums: Album[]
  onDeleteAlbum: (id: string) => void
  onUpdateAlbum: (updatedAlbum: Album) => void
  sortKey?: string
}

const AlbumList: React.FC<AlbumListProps> = ({ albums, onDeleteAlbum, onUpdateAlbum, sortKey }) => {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAlbumClick = (album: Album) => {
    setSelectedAlbum(album)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedAlbum(null)
  }

  const handleUpdateAlbum = (updatedAlbum: Album) => {
    onUpdateAlbum(updatedAlbum)
  }

  const handleDeleteFromModal = (id: string) => {
    onDeleteAlbum(id)
    handleCloseModal()
  }

  if (albums.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow dark:bg-gray-800/80 p-8 text-center">
        <Music className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No albums yet</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Start building your vinyl collection by adding your first album!
        </p>
      </div>
    )
  }

  // Check if we should group by artist (only when no specific sorting is applied)
  const shouldGroupByArtist = !sortKey || sortKey === 'artist-asc' || sortKey === 'artist-desc'

  if (shouldGroupByArtist) {
    // Group albums by artist and sort
    const groupedAlbums = albums.reduce((groups: { [key: string]: Album[] }, album) => {
      const artist = album.artist
      if (!groups[artist]) {
        groups[artist] = []
      }
      groups[artist].push(album)
      return groups
    }, {})

    // Sort artists based on sortKey direction
    const sortedArtists = Object.keys(groupedAlbums).sort((a, b) => {
      if (sortKey === 'artist-desc') {
        return b.localeCompare(a) // Descending: Z to A
      }
      return a.localeCompare(b) // Ascending: A to Z (default)
    })

    sortedArtists.forEach((artist) => {
      groupedAlbums[artist].sort((a, b) => {
        // Sort by release year (newest first), then by title
        if (a.release_year !== b.release_year) {
          return (b.release_year || 0) - (a.release_year || 0)
        }
        return a.title.localeCompare(b.title)
      })
    })

    return (
      <>
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow dark:bg-gray-800/80">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-left">
              Your Collection ({albums.length} albums)
            </h2>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {sortedArtists.map((artist, artistIndex) => (
              <div key={artist} className="p-6">
                {/* Artist Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 text-left">
                    {artist}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                      ({groupedAlbums[artist].length} album
                      {groupedAlbums[artist].length !== 1 ? 's' : ''})
                    </span>
                  </h3>
                </div>

                {/* Albums for this artist */}
                <div className="space-y-3">
                  {groupedAlbums[artist].map((album) => (
                    <div
                      key={album.id}
                      className="flex items-center justify-between space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
                      onClick={() => handleAlbumClick(album)}
                    >
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          {album.album_art_url ? (
                            <img
                              className="h-16 w-16 rounded-lg object-cover"
                              src={album.album_art_url}
                              alt={`${album.title} album art`}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                target.nextElementSibling?.classList.remove('hidden')
                              }}
                            />
                          ) : null}
                          <div
                            className={`h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center ${album.album_art_url ? 'hidden' : ''}`}
                          >
                            <Music className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 flex flex-row items-center">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 transition-colors text-left flex-1">
                            {album.title}
                          </h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400 w-20 text-right tabular-nums flex-shrink-0">
                            {album.release_year > 0 ? album.release_year : '—'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteAlbum(album.id)
                        }}
                        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete album"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Album Detail Modal */}
        <AlbumDetailModal
          album={selectedAlbum}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdate={handleUpdateAlbum}
          onDelete={handleDeleteFromModal}
        />
      </>
    )
  }

  // Show albums in a flat list when sorting by non-artist criteria
  return (
    <>
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow dark:bg-gray-800/80">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-left">
            Your Collection ({albums.length} albums)
          </h2>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {albums.map((album) => (
            <div
              key={album.id}
              className="flex items-center justify-between space-x-4 p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
              onClick={() => handleAlbumClick(album)}
            >
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {album.album_art_url ? (
                    <img
                      className="h-16 w-16 rounded-lg object-cover"
                      src={album.album_art_url}
                      alt={`${album.title} album art`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div
                    className={`h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center ${album.album_art_url ? 'hidden' : ''}`}
                  >
                    <Music className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-row items-center">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 transition-colors text-left flex-1">
                    {album.title}
                  </h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-20 text-right tabular-nums flex-shrink-0">
                    {album.release_year > 0 ? album.release_year : '—'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 dark:text-gray-400 text-right min-w-[100px]">
                  {album.artist}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteAlbum(album.id)
                  }}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete album"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Album Detail Modal */}
      <AlbumDetailModal
        album={selectedAlbum}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleUpdateAlbum}
        onDelete={handleDeleteFromModal}
      />
    </>
  )
}

export default AlbumList
