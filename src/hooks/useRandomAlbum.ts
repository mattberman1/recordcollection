import { useQuery } from '@tanstack/react-query'
import { supabase, Album } from '../lib/supabase'

const fetchRandomAlbum = async (): Promise<Album | null> => {
  const { data, error } = await supabase.rpc<Album[]>('get_random_album')
  if (error) {
    console.error('failed to fetch random album', error)
    return null
  }
  return data?.[0] ?? null
}

export const useRandomAlbum = () =>
  useQuery<Album | null, Error>({
    queryKey: ['randomAlbum'],
    queryFn: fetchRandomAlbum,
    staleTime: 86_400_000,
  })
