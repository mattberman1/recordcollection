import React from 'react'
import { useRandomAlbum } from '../hooks/useRandomAlbum'

const AlbumOfTheDay: React.FC = () => {
  const { data: album, isLoading } = useRandomAlbum()

  return (
    <article className="mx-auto mb-8 w-full max-w-md rounded-xl bg-slate-800/40 p-4 shadow ring-1 ring-white/10 backdrop-blur">
      <header className="mb-3 text-center text-xl font-semibold text-white">
        Album of the Day
      </header>
      {isLoading ? (
        <div className="flex items-center gap-4 animate-pulse">
          <div className="h-36 w-36 flex-none rounded-lg bg-slate-700" />
          <div className="flex-1 space-y-2 py-2">
            <div className="h-6 w-3/4 rounded bg-slate-700" />
            <div className="h-4 w-1/2 rounded bg-slate-700" />
            <div className="h-4 w-1/3 rounded bg-slate-700" />
          </div>
        </div>
      ) : album ? (
        <div className="flex items-center gap-4">
          <img
            src={album.album_art_url || '/placeholder.jpg'}
            alt={`${album.title} cover`}
            className="h-36 w-36 flex-none rounded-lg object-cover shadow"
          />
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-white">{album.title}</h3>
            <p className="text-sm italic text-slate-300">{album.artist}</p>
            <p className="text-sm text-slate-400">{album.release_year ?? '—'}</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-slate-400">No albums yet — add one!</p>
      )}
    </article>
  )
}

export default AlbumOfTheDay
