import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Album } from '../lib/supabase'

export type NewAlbum = Omit<Album, 'id' | 'created_at' | 'updated_at'>

const fetchAlbums = async (): Promise<Album[]> => {
  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .order('artist', { ascending: true })
    .order('title', { ascending: true })
  if (error) throw error
  return data as Album[]
}

const addAlbum = async (album: NewAlbum): Promise<Album> => {
  const { data, error } = await supabase.from('albums').insert([album]).select().single()
  if (error) throw error
  return data as Album
}

const addAlbums = async (albums: NewAlbum[]): Promise<Album[]> => {
  const { data, error } = await supabase.from('albums').insert(albums).select()
  if (error) throw error
  return data as Album[]
}

const deleteAlbum = async (id: string): Promise<void> => {
  const { error } = await supabase.from('albums').delete().eq('id', id)
  if (error) throw error
}

export function useAlbums() {
  return useQuery<Album[], Error>({
    queryKey: ['albums'],
    queryFn: fetchAlbums,
  })
}

export function useAddAlbum() {
  const queryClient = useQueryClient()
  return useMutation<Album, Error, NewAlbum>({
    mutationFn: addAlbum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] })
    },
  })
}

export function useAddAlbums() {
  const queryClient = useQueryClient()
  return useMutation<Album[], Error, NewAlbum[]>({
    mutationFn: addAlbums,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] })
    },
  })
}

export function useDeleteAlbum() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: deleteAlbum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] })
    },
  })
}
