import React from 'react';
import { Album } from '../lib/supabase';
import { Trash2, Music } from 'lucide-react';

interface AlbumListProps {
  albums: Album[];
  onDeleteAlbum: (id: string) => void;
}

const AlbumList: React.FC<AlbumListProps> = ({ albums, onDeleteAlbum }) => {
  if (albums.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Music className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No albums yet</h3>
        <p className="text-gray-500">Start building your vinyl collection by adding your first album!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Your Collection ({albums.length})</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {albums.map((album) => (
          <div key={album.id} className="p-6 flex items-center space-x-4">
            <div className="flex-shrink-0">
              {album.album_art_url ? (
                <img
                  className="h-16 w-16 rounded-lg object-cover"
                  src={album.album_art_url}
                  alt={`${album.title} album art`}
                />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                  <Music className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {album.title}
              </h3>
              <p className="text-sm text-gray-500">
                {album.artist} • {album.release_year}
              </p>
            </div>
            <button
              onClick={() => onDeleteAlbum(album.id)}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete album"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumList; 