import React from 'react'

interface CollectionControlsProps {
  query: string
  setQuery: (q: string) => void
  sortKey: string
  setSortKey: (k: string) => void
  filterDecade: string
  setFilterDecade: (d: string) => void
}

const sortOptions = [
  { value: 'title-asc', label: 'Title A→Z' },
  { value: 'title-desc', label: 'Title Z→A' },
  { value: 'artist-asc', label: 'Artist A→Z' },
  { value: 'artist-desc', label: 'Artist Z→A' },
  { value: 'year-asc', label: 'Year ↑' },
  { value: 'year-desc', label: 'Year ↓' },
  { value: 'date-asc', label: 'Date added ↑' },
  { value: 'date-desc', label: 'Date added ↓' },
]

const decadeOptions = [
  { value: '', label: 'All' },
  { value: '2020', label: '2020s' },
  { value: '2010', label: '2010s' },
  { value: '2000', label: '2000s' },
  { value: '1990', label: '1990s' },
  { value: '1980', label: '1980s' },
  { value: '1970', label: '1970s' },
  { value: '1960', label: '1960s' },
  { value: '1950', label: '1950s' },
]

const CollectionControls: React.FC<CollectionControlsProps> = ({
  query,
  setQuery,
  sortKey,
  setSortKey,
  filterDecade,
  setFilterDecade,
}) => {
  return (
    <section
      className="bg-white/80 border border-gray-200 shadow-sm rounded-xl mb-8 sticky top-0 z-10 max-w-6xl mx-auto"
      aria-label="Album filters toolbar"
      style={{
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <div className="flex flex-col md:flex-row gap-3 md:gap-6 items-stretch px-4 py-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title or artist…"
          aria-label="Search title or artist"
          className="h-12 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-gray-50 text-gray-900 placeholder-gray-400 w-full md:w-64 transition-all"
        />
        <div className="flex flex-row gap-3 flex-1">
          <div className="flex-1">
            <label htmlFor="sort" className="sr-only">
              Sort by
            </label>
            <select
              id="sort"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              aria-label="Sort by"
              className="h-12 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-gray-50 text-gray-900 w-full transition-all"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="decade" className="sr-only">
              Filter by decade
            </label>
            <select
              id="decade"
              value={filterDecade}
              onChange={(e) => setFilterDecade(e.target.value)}
              aria-label="Filter by decade"
              className="h-12 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-gray-50 text-gray-900 w-full transition-all"
            >
              {decadeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CollectionControls
