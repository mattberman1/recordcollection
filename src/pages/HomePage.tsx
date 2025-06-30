import React from 'react';
import { Link } from 'react-router-dom';
import { Disc, Plus, Upload, Music } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Disc className="h-20 w-20 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Vinyl Catalog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your vinyl record collection with ease. Search, organize, and track your albums with automatic data from MusicBrainz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* View Collection Card */}
          <Link
            to="/collection"
            className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto group-hover:bg-blue-200 transition-colors">
              <Music className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-center">View Collection</h2>
            <p className="text-gray-600 text-center">
              Browse your vinyl collection organized by artist. See album covers, release years, and manage your records.
            </p>
          </Link>

          {/* Add Albums Card */}
          <Link
            to="/add"
            className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mx-auto group-hover:bg-green-200 transition-colors">
              <Plus className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-center">Add Albums</h2>
            <p className="text-gray-600 text-center">
              Add albums one by one or bulk import from CSV. Automatic data fetching with cover art and release information.
            </p>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 mx-auto">
                <Music className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Search</h3>
              <p className="text-gray-600">
                Search MusicBrainz database for automatic album data and cover art
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 mx-auto">
                <Upload className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Bulk Import</h3>
              <p className="text-gray-600">
                Import multiple albums at once using CSV files
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4 mx-auto">
                <Disc className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Organized View</h3>
              <p className="text-gray-600">
                Collection organized by artist with release year sorting
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 