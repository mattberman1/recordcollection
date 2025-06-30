import { useQuery } from '@tanstack/react-query'
import { supabase, Album } from '../lib/supabase'

const fetchRandomAlbum = async (): Promise<Album | null> => {
  const { data, error } = await supabase.rpc('get_random_album').single()
  if (error && error.code !== 'PGRST116') throw error
  return (data as Album) ?? null
}

export const useRandomAlbum = () =>
  useQuery<Album | null, Error>({
    queryKey: ['randomAlbum'],
    queryFn: fetchRandomAlbum,
    staleTime: 86_400_000,
  })
