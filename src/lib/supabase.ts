import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'http://localhost'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'public-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Album {
  id: string
  title: string
  artist: string
  release_year: number
  album_art_url: string
  created_at: string
  updated_at: string
  format?: string
}

export interface Database {
  public: {
    Tables: {
      albums: {
        Row: Album
        Insert: Omit<Album, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Album, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
