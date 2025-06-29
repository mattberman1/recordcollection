import { supabase } from '../lib/supabase'
import { Album } from '../lib/supabase'

export const albumService = {
  // Get all albums
  async getAllAlbums(): Promise<Album[]> {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Add a new album
  async addAlbum(album: Omit<Album, 'id' | 'created_at' | 'updated_at'>): Promise<Album> {
    const { data, error } = await supabase
      .from('albums')
      .insert(album)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update an album
  async updateAlbum(id: string, updates: Partial<Album>): Promise<Album> {
    const { data, error } = await supabase
      .from('albums')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete an album
  async deleteAlbum(id: string): Promise<void> {
    const { error } = await supabase
      .from('albums')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Search albums
  async searchAlbums(query: string): Promise<Album[]> {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .or(`title.ilike.%${query}%,artist.ilike.%${query}%`)
      .order('title')
    
    if (error) throw error
    return data || []
  }
} 