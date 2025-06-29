import React, { useState, useEffect } from 'react';
import { Album } from '../lib/supabase';
import { albumService } from '../services/albumService';
import AlbumList from '../components/AlbumList';
import { Loader2 } from 'lucide-react';

const CollectionPage: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      setLoading(true);
      const data = await albumService.getAllAlbums();
      setAlbums(data);
    } catch (err) {
      setError('Failed to load albums');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    try {
      await albumService.deleteAlbum(id);
      setAlbums(albums.filter(album => album.id !== id));
    } catch (err) {
      setError('Failed to delete album');
      console.error(err);
    }
  };

  const handleUpdateAlbum = async (updatedAlbum: Album) => {
    try {
      setAlbums(albums.map(album => 
        album.id === updatedAlbum.id ? updatedAlbum : album
      ));
    } catch (err) {
      setError('Failed to update album');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <div className="text-xl">Loading your vinyl collection...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Collection</h1>
          <p className="text-gray-600">
            {albums.length} album{albums.length !== 1 ? 's' : ''} in your vinyl collection
          </p>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-4xl mx-auto">
            {error}
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
  );
};

export default CollectionPage; 