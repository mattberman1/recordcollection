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

  // Group albums by artist and sort
  const groupedAlbums = albums.reduce((groups: { [key: string]: Album[] }, album) => {
    const artist = album.artist;
    if (!groups[artist]) {
      groups[artist] = [];
    }
    groups[artist].push(album);
    return groups;
  }, {});

  // Sort artists alphabetically and albums by release year (newest first)
  const sortedArtists = Object.keys(groupedAlbums).sort();
  sortedArtists.forEach(artist => {
    groupedAlbums[artist].sort((a, b) => {
      // Sort by release year (newest first), then by title
      if (a.release_year !== b.release_year) {
        return (b.release_year || 0) - (a.release_year || 0);
      }
      return a.title.localeCompare(b.title);
    });
  });

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Your Collection ({albums.length} albums)</h2>
      </div>
      
      <div className="divide-y divide-gray-100">
        {sortedArtists.map((artist, artistIndex) => (
          <div key={artist} className="p-6">
            {/* Artist Header */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                {artist}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({groupedAlbums[artist].length} album{groupedAlbums[artist].length !== 1 ? 's' : ''})
                </span>
              </h3>
            </div>
            
            {/* Albums for this artist */}
            <div className="space-y-3">
              {groupedAlbums[artist].map((album) => (
                <div key={album.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0">
                    {album.album_art_url ? (
                      <img
                        className="h-16 w-16 rounded-lg object-cover"
                        src={album.album_art_url}
                        alt={`${album.title} album art`}
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center ${album.album_art_url ? 'hidden' : ''}`}>
                      <Music className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-medium text-gray-900 truncate">
                      {album.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {album.release_year > 0 ? album.release_year : 'Release year unknown'}
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
        ))}
      </div>
    </div>
  );
};

export default AlbumList; 