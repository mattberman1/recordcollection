import React from 'react'

interface CollectionControlsProps {
  query: string
  setQuery: (q: string) => void
  sortKey: string
  setSortKey: (k: string) => void
  filterDecade: string
  setFilterDecade: (d: string) => void
  filterFormat: string
  setFilterFormat: (f: string) => void
  formatOptions: string[]
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
  filterFormat,
  setFilterFormat,
  formatOptions,
}) => {
  return (
    <div className="flex flex-row gap-4 items-center sticky top-0 bg-white/80 z-10 p-4 rounded-xl shadow mb-6">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search title or artist…"
        aria-label="Search title or artist"
        className="min-h-10 rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-white"
      />
      <select
        value={sortKey}
        onChange={e => setSortKey(e.target.value)}
        aria-label="Sort by"
        className="min-h-10 rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-white"
      >
        {sortOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <select
        value={filterDecade}
        onChange={e => setFilterDecade(e.target.value)}
        aria-label="Filter by decade"
        className="min-h-10 rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-white"
      >
        {decadeOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <select
        value={filterFormat}
        onChange={e => setFilterFormat(e.target.value)}
        aria-label="Filter by format"
        className="min-h-10 rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-900 dark:text-white"
      >
        <option value="">All Formats</option>
        {formatOptions.map(f => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>
    </div>
  )
}

export default CollectionControls 