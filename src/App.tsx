import React, { useState, useEffect } from 'react';
import { Album } from './lib/supabase';
import { albumService } from './services/albumService';
import AlbumList from './components/AlbumList';
import AddAlbumForm from './components/AddAlbumForm';
import './App.css';

function App() {
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

  const handleAddAlbum = async (album: Omit<Album, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newAlbum = await albumService.addAlbum(album);
      setAlbums([newAlbum, ...albums]);
    } catch (err) {
      setError('Failed to add album');
      console.error(err);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading your vinyl collection...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Vinyl Catalog</h1>
          <p className="text-gray-600">Manage your vinyl record collection</p>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <AddAlbumForm onAddAlbum={handleAddAlbum} />
          </div>
          <div className="lg:col-span-2">
            <AlbumList 
              albums={albums} 
              onDeleteAlbum={handleDeleteAlbum}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 