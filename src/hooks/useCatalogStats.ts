import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export const useCatalogStats = () =>
  useQuery({
    queryKey: ['catalogStats'],
    queryFn: async () => {
      // Fetch minimal album data to compute stats client side
      const { data: allAlbums = [] } = await supabase.from('albums').select('artist, release_year')

      // Aggregate top 5 artists in JS
      const artistCounts: Record<string, number> = {}
      const decadeCounts: Record<string, number> = {}
      allAlbums.forEach((a) => {
        artistCounts[a.artist] = (artistCounts[a.artist] || 0) + 1
        if (a.release_year) {
          const decade = Math.floor(a.release_year / 10) * 10
          decadeCounts[decade] = (decadeCounts[decade] || 0) + 1
        }
      })

      const topArtists = Object.entries(artistCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([artist, count]) => ({ artist, count }))

      const { data: oldest } = await supabase
        .from('albums')
        .select('*')
        .order('release_year', { ascending: true })
        .limit(1)
        .single()

      const { data: newest } = await supabase
        .from('albums')
        .select('*')
        .order('release_year', { ascending: false })
        .limit(1)
        .single()

      const total = allAlbums.length
      const unique_artists = Object.keys(artistCounts).length

      return {
        topArtists,
        oldest,
        newest,
        total,
        unique_artists,
        decade_counts: decadeCounts,
      }
    },
    staleTime: 60_000,
  })
