import React, { useState, useEffect, useCallback } from 'react';
import { Album } from '../lib/supabase';
import { Plus, Search, Loader2, Music } from 'lucide-react';

interface AddAlbumFormProps {
  onAddAlbum: (album: Omit<Album, 'id' | 'created_at' | 'updated_at'>) => void;
}

interface MusicBrainzRelease {
  id: string;
  title: string;
  date?: string;
  'first-release-date'?: string;
  'cover-art-archive'?: {
    front: boolean;
    back: boolean;
    count: number;
  };
}

interface AlbumWithArt extends MusicBrainzRelease {
  coverArtUrl?: string;
}

const AddAlbumForm: React.FC<AddAlbumFormProps> = ({ onAddAlbum }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<AlbumWithArt[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumWithArt | null>(null);

  const searchMusicBrainz = async (title: string, artist: string) => {
    if (!title || !artist) return;

    setIsSearching(true);
    try {
      // Search for releases by title and artist
      const query = `release:"${title}" AND artist:"${artist}"`;
      const response = await fetch(
        `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(query)}&fmt=json&limit=5`,
        {
          headers: {
            'User-Agent': 'VinylCatalog/1.0.0 (mattberman1@gmail.com)'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Initialize results with cover art URLs
        const resultsWithArt: AlbumWithArt[] = (data.releases || []).map((release: MusicBrainzRelease) => ({
          ...release,
          coverArtUrl: undefined // Will be populated by useEffect
        }));

        setSearchResults(resultsWithArt);
      } else {
        console.error('MusicBrainz API error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error searching MusicBrainz:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchCoverArt = useCallback(async (albumId: string): Promise<string | undefined> => {
    try {

      // Use a simpler approach - directly try to get the cover art URL
      // The Cover Art Archive has a predictable URL structure
      const coverArtUrl = `https://coverartarchive.org/release/${albumId}/front-250`;

      // Test if the image exists by trying to fetch it
      const response = await fetch(coverArtUrl, {
        method: 'HEAD' // Only check if the resource exists, don't download it
      });

      if (response.ok) {
        return coverArtUrl;
      } else {
        return undefined;
      }
    } catch (error) {
      console.error('Error fetching cover art for', albumId, error);
      return undefined;
    }
  }, []);

  // Fetch cover art for search results
  useEffect(() => {
    const loadCoverArt = async () => {
      if (searchResults.length === 0) return;
      if (!searchResults.some(album => !album.coverArtUrl)) return;

      const updatedResults = await Promise.all(
        searchResults.map(async (album: AlbumWithArt) => {
          if (album.coverArtUrl) return album;
          const coverArtUrl = await fetchCoverArt(album.id);
          return {
            ...album,
            coverArtUrl
          };
        })
      );

      setSearchResults(updatedResults);
    };

    void loadCoverArt();
  }, [searchResults, fetchCoverArt]);

  const getAlbumArt = async (releaseId: string): Promise<string> => {
    const coverArtUrl = await fetchCoverArt(releaseId);
    return coverArtUrl || '';
  };

  const extractReleaseYear = (album: MusicBrainzRelease): number => {
    // Try multiple date fields that MusicBrainz might use
    const dateString = album.date || album['first-release-date'];

    if (dateString) {
      // Extract year from date string (could be YYYY, YYYY-MM, or YYYY-MM-DD)
      const yearMatch = dateString.match(/^(\d{4})/);
      if (yearMatch) {
        return parseInt(yearMatch[1]);
      }
    }

    return 0;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.artist) return;

    await searchMusicBrainz(formData.title, formData.artist);
  };

  const handleSelectAlbum = async (album: AlbumWithArt) => {
    setSelectedAlbum(album);
    setSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.artist) return;

    setIsSubmitting(true);
    try {
      let releaseYear = 0;
      let albumArtUrl = '';

      if (selectedAlbum) {
        // Extract release year from the selected album
        releaseYear = extractReleaseYear(selectedAlbum);

        // Use the cover art URL from the selected album or fetch it
        albumArtUrl = selectedAlbum.coverArtUrl || await getAlbumArt(selectedAlbum.id);
      }

      await onAddAlbum({
        title: formData.title,
        artist: formData.artist,
        release_year: releaseYear,
        album_art_url: albumArtUrl
      });

      // Reset form
      setFormData({
        title: '',
        artist: ''
      });
      setSelectedAlbum(null);
      setSearchResults([]);
    } catch (error) {
      console.error('Failed to add album:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as keyof typeof prev]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Album</h2>

      <form onSubmit={handleSearch} className="space-y-4 mb-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Album Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter album title"
          />
        </div>

        <div>
          <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-1">
            Artist *
          </label>
          <input
            type="text"
            id="artist"
            name="artist"
            value={formData.artist}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter artist name"
          />
        </div>

        <button
          type="submit"
          disabled={isSearching || !formData.title || !formData.artist}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSearching ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              <span>Search Album Info</span>
            </>
          )}
        </button>
      </form>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Select an album:</h3>
          <div className="space-y-3">
            {searchResults.map((album: AlbumWithArt) => {
              const releaseYear = extractReleaseYear(album);
              return (
                <button
                  key={album.id}
                  onClick={() => handleSelectAlbum(album)}
                  className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-3"
                >
                  <div className="flex-shrink-0">
                    {album.coverArtUrl ? (
                      <img
                        src={album.coverArtUrl}
                        alt={`${album.title} cover art`}
                        className="h-12 w-12 rounded object-cover"
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          console.error('Image failed to load:', album.coverArtUrl);
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`h-12 w-12 rounded bg-gray-200 flex items-center justify-center ${album.coverArtUrl ? 'hidden' : ''}`}>
                      <Music className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{album.title}</div>
                    <div className="text-sm text-gray-500">
                      {releaseYear > 0 ?
                        `Released: ${releaseYear}` :
                        'Release date unknown'
                      }
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Album Info */}
      {selectedAlbum && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Selected Album:</h3>
          <div className="flex items-center space-x-3">
            {selectedAlbum.coverArtUrl ? (
              <img
                src={selectedAlbum.coverArtUrl}
                alt={`${selectedAlbum.title} cover art`}
                className="h-16 w-16 rounded object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  console.error('Selected album image failed to load:', selectedAlbum.coverArtUrl);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`h-16 w-16 rounded bg-gray-200 flex items-center justify-center ${selectedAlbum.coverArtUrl ? 'hidden' : ''}`}>
              <Music className="h-8 w-8 text-gray-400" />
            </div>
            <div className="text-sm text-blue-800">
              <div><strong>{selectedAlbum.title}</strong></div>
              <div>Release Year: {extractReleaseYear(selectedAlbum) > 0 ? extractReleaseYear(selectedAlbum) : 'Unknown'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Add to Collection Button */}
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          disabled={isSubmitting || !formData.title || !formData.artist}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Add to Collection</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddAlbumForm;
