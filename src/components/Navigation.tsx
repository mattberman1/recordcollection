import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Plus } from 'lucide-react'

const Navigation: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
          >
            <img src="/logo.png" alt="Vinyl Catalog Logo" className="h-8 w-8 rounded" />
            <span>Vinyl Catalog</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link
              to="/collection"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/collection')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Collection
            </Link>
            <Link
              to="/add"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                isActive('/add')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>Add Albums</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
