import React, { useState } from 'react'
import { Album } from '../lib/supabase'
import { Upload, Loader2, CheckCircle, X } from 'lucide-react'

interface CSVImportProps {
  onAddAlbums: (albums: Omit<Album, 'id' | 'created_at' | 'updated_at'>[]) => void
}

interface CSVRow {
  albumName: string
  artistName: string
}

interface ImportResult {
  row: CSVRow
  success: boolean
  album?: Omit<Album, 'id' | 'created_at' | 'updated_at'>
  error?: string
}

interface MusicBrainzRelease {
  id: string
  title: string
  date?: string
  'first-release-date'?: string
}

const CSVImport: React.FC<CSVImportProps> = ({ onAddAlbums }) => {
  const [isImporting, setIsImporting] = useState(false)
  const [importResults, setImportResults] = useState<ImportResult[]>([])
  const [showResults, setShowResults] = useState(false)

  const parseCSV = (file: File): Promise<CSVRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string
          const lines = text.split(/\r?\n/).filter((line) => line.trim())

          // Skip header row if it looks like column names
          let dataLines = lines
          if (
            lines[0].toLowerCase().includes('album') &&
            lines[0].toLowerCase().includes('artist')
          ) {
            dataLines = lines.slice(1)
          }

          const rows: CSVRow[] = dataLines.map((line, index) => {
            const columns = line.split(',').map((col) => col.trim().replace(/"/g, ''))
            if (columns.length < 2) {
              throw new Error(
                `Row ${index + 2}: Invalid format. Expected 2 columns (Album Name, Artist Name)`,
              )
            }
            return {
              albumName: columns[0],
              artistName: columns[1],
            }
          })

          resolve(rows)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  // Add delay between API calls to respect rate limits
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const searchMusicBrainz = async (
    title: string,
    artist: string,
  ): Promise<Omit<Album, 'id' | 'created_at' | 'updated_at'> | null> => {
    try {
      const query = `release:"${title}" AND artist:"${artist}"`
      const response = await fetch(
        `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(query)}&fmt=json&limit=10`,
        {
          headers: {
            'User-Agent': 'VinylCatalog/1.0.0 (mattberman1@gmail.com)',
          },
        },
      )

      if (response.status === 503) {
        throw new Error('MusicBrainz API is temporarily unavailable. Please try again later.')
      }

      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.')
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const releases: MusicBrainzRelease[] = data.releases || []

      if (releases.length > 0) {
        // Sort by release date (earliest first)
        const sortedReleases = releases.sort((a, b) => {
          const dateA = a.date ?? a['first-release-date'] ?? ''
          const dateB = b.date ?? b['first-release-date'] ?? ''
          const yearA = parseInt(dateA.split('-')[0]) || 9999
          const yearB = parseInt(dateB.split('-')[0]) || 9999
          return yearA - yearB
        })

        const selectedRelease = sortedReleases[0]
        const releaseYear =
          parseInt(
            (selectedRelease.date ?? selectedRelease['first-release-date'] ?? '').split('-')[0],
          ) || 0

        // Get cover art
        let albumArtUrl = ''
        try {
          const coverResponse = await fetch(
            `https://coverartarchive.org/release/${selectedRelease.id}/front-250`,
            { method: 'HEAD' },
          )
          if (coverResponse.ok) {
            albumArtUrl = `https://coverartarchive.org/release/${selectedRelease.id}/front-250`
          }
        } catch (error) {
          console.error('Error fetching cover art:', error)
        }

        return {
          title: selectedRelease.title,
          artist: artist,
          release_year: releaseYear,
          album_art_url: albumArtUrl,
        }
      }

      return null
    } catch (error) {
      console.error('Error searching MusicBrainz:', error)
      throw error
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setShowResults(false)
    setImportResults([])

    try {
      const rows = await parseCSV(file)
      const results: ImportResult[] = []

      // Process albums with rate limiting
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]

        try {
          // Add delay between requests to respect rate limits
          if (i > 0) {
            await delay(1000) // 1 second delay between requests
          }

          const album = await searchMusicBrainz(row.albumName, row.artistName)

          if (album) {
            results.push({
              row,
              success: true,
              album,
            })
          } else {
            results.push({
              row,
              success: false,
              error: 'Album not found',
            })
          }
        } catch (error) {
          results.push({
            row,
            success: false,
            error: error instanceof Error ? error.message : 'Search failed',
          })

          // If we hit a rate limit or service unavailable, stop processing
          if (
            error instanceof Error &&
            (error.message.includes('Rate limit') || error.message.includes('unavailable'))
          ) {
            break
          }
        }
      }

      setImportResults(results)
      setShowResults(true)
    } catch (error) {
      console.error('Import error:', error)
      alert('Error parsing CSV file. Please check the format.')
    } finally {
      setIsImporting(false)
    }
  }

  const handleImportAll = () => {
    const allAlbums = importResults
      .filter((result) => result.success && result.album)
      .map((result) => result.album!)

    if (allAlbums.length > 0) {
      onAddAlbums(allAlbums)
      setShowResults(false)
      setImportResults([])
    }
  }

  const successfulCount = importResults.filter((r) => r.success).length
  const failedCount = importResults.filter((r) => !r.success).length

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow p-6 dark:bg-gray-800/80">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Bulk Import from CSV
      </h2>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Upload a CSV file with columns: <strong>Album Name, Artist Name</strong>
        </p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isImporting}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <span className="text-blue-600">Processing CSV...</span>
                <span className="text-xs text-gray-500">
                  This may take a while due to API rate limits
                </span>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-gray-600">Click to upload CSV file</span>
                <span className="text-xs text-gray-500">or drag and drop</span>
              </>
            )}
          </label>
        </div>
      </div>

      {showResults && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Found: <span className="font-medium text-green-600">{successfulCount}</span> albums
              </span>
              {failedCount > 0 && (
                <span className="text-sm text-gray-600">
                  Failed: <span className="font-medium text-red-600">{failedCount}</span> albums
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              {successfulCount > 0 && (
                <button
                  onClick={handleImportAll}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                  Import All Found
                </button>
              )}
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto border rounded-lg">
            {importResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 border-b last:border-b-0 flex items-center justify-between ${
                  result.success
                    ? 'bg-green-50 dark:bg-green-900/30'
                    : 'bg-red-50 dark:bg-red-900/30'
                }`}
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {result.row.albumName} - {result.row.artistName}
                  </div>
                  {result.success && result.album && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {result.album.release_year > 0
                        ? result.album.release_year
                        : 'Release year unknown'}
                    </div>
                  )}
                  {!result.success && <div className="text-sm text-red-600">{result.error}</div>}
                </div>
                <div className="ml-4">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CSVImport
