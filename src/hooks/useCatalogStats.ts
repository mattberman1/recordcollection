import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export const useCatalogStats = () =>
  useQuery({
    queryKey: ['catalogStats'],
    queryFn: async () => {
      // Get all artists to aggregate top 5
      const { data: allAlbums } = await supabase.from('albums').select('artist')

      // Aggregate top 5 artists in JS
      const artistCounts: Record<string, number> = {}
      allAlbums?.forEach((a) => {
        artistCounts[a.artist] = (artistCounts[a.artist] || 0) + 1
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

      const { data: totals } = await supabase.rpc('album_totals')
      return { topArtists, oldest, newest, ...totals }
    },
    staleTime: 60_000,
  })
