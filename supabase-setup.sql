-- Vinyl Catalog Database Setup
-- Run this SQL in your Supabase dashboard SQL Editor

-- Create the albums table
CREATE TABLE albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  release_year INTEGER,
  album_art_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster searches
CREATE INDEX idx_albums_title_artist ON albums(title, artist);

-- Enable Row Level Security (RLS)
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for now - you can restrict this later)
CREATE POLICY "Allow all operations" ON albums FOR ALL USING (true);

-- Optional: Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_albums_updated_at 
    BEFORE UPDATE ON albums 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 