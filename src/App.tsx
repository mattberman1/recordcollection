import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import AddAlbumPage from './pages/AddAlbumPage'
import CollectionPage from './pages/CollectionPage'
import StatsPage from './pages/StatsPage'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add" element={<AddAlbumPage />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
