import React, { useState } from 'react';
import { Album } from '../lib/supabase';
import { Plus } from 'lucide-react';

interface AddAlbumFormProps {
  onAddAlbum: (album: Omit<Album, 'id' | 'created_at' | 'updated_at'>) => void;
}

const AddAlbumForm: React.FC<AddAlbumFormProps> = ({ onAddAlbum }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    release_year: '',
    album_art_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.artist) return;

    setIsSubmitting(true);
    try {
      await onAddAlbum({
        title: formData.title,
        artist: formData.artist,
        release_year: formData.release_year ? parseInt(formData.release_year) : 0,
        album_art_url: formData.album_art_url || ''
      });

      // Reset form
      setFormData({
        title: '',
        artist: '',
        release_year: '',
        album_art_url: ''
      });
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
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Album</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label htmlFor="release_year" className="block text-sm font-medium text-gray-700 mb-1">
            Release Year
          </label>
          <input
            type="number"
            id="release_year"
            name="release_year"
            value={formData.release_year}
            onChange={handleInputChange}
            min="1900"
            max={new Date().getFullYear()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 1975"
          />
        </div>

        <div>
          <label htmlFor="album_art_url" className="block text-sm font-medium text-gray-700 mb-1">
            Album Art URL
          </label>
          <input
            type="url"
            id="album_art_url"
            name="album_art_url"
            value={formData.album_art_url}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/album-art.jpg"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !formData.title || !formData.artist}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Add Album</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddAlbumForm; 