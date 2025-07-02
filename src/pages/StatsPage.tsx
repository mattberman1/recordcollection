import { useCatalogStats } from '../hooks/useCatalogStats'
import StatsCard from '../components/StatsCard'

interface Album {
  id: number
  artist: string
  title: string
  release_year: number
  album_art_url?: string
  created_at?: string
}

interface CatalogStats {
  topArtists: { artist: string; count: number }[]
  oldest: Album
  newest: Album
  total: number
  unique_artists: number
  decade_counts: Record<string, number>
}

const StatsPage = () => {
  const { data, isLoading, error } = useCatalogStats()
  if (isLoading) return <p className="p-8 text-center">Loading…</p>
  if (error) return <p className="p-8 text-center text-red-500">Error!</p>
  if (!data) return null
  const stats = data as CatalogStats

  return (
    <section className="mx-auto grid max-w-5xl gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatsCard title="Total albums" value={stats.total} />
      <StatsCard title="Unique artists" value={stats.unique_artists} />

      <StatsCard title="Top artists">
        {stats.topArtists.map((a) => (
          <div key={a.artist} className="flex justify-between">
            <span>{a.artist}</span>
            <span>{a.count}</span>
          </div>
        ))}
      </StatsCard>

      <StatsCard title="Oldest album">
        <div className="flex items-center gap-3">
          <img
            src={stats.oldest.album_art_url || '/placeholder.jpg'}
            alt={stats.oldest.title}
            className="h-16 w-16 rounded shadow"
          />
          <div>
            <p className="font-medium">{stats.oldest.title}</p>
            <p className="text-xs text-slate-400">
              {stats.oldest.artist} • {stats.oldest.release_year}
            </p>
          </div>
        </div>
      </StatsCard>

      <StatsCard title="Newest album">
        <div className="flex items-center gap-3">
          <img
            src={stats.newest.album_art_url || '/placeholder.jpg'}
            alt={stats.newest.title}
            className="h-16 w-16 rounded shadow"
          />
          <div>
            <p className="font-medium">{stats.newest.title}</p>
            <p className="text-xs text-slate-400">
              {stats.newest.artist} • {stats.newest.release_year}
            </p>
          </div>
        </div>
      </StatsCard>

      <StatsCard title="Albums by decade">
        {Object.entries(stats.decade_counts)
          .sort()
          .map(([dec, cnt]) => (
            <div key={dec} className="flex justify-between">
              <span>{dec}s</span>
              <span>{cnt as number}</span>
            </div>
          ))}
      </StatsCard>
    </section>
  )
}
export default StatsPage
