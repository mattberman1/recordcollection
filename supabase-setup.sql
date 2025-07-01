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

-- Create a table to track the album of the day
CREATE TABLE album_of_the_day (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
  date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for the album of the day table
CREATE INDEX idx_album_of_the_day_date ON album_of_the_day(date);

-- Enable Row Level Security (RLS)
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_of_the_day ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for now - you can restrict this later)
CREATE POLICY "Allow all operations" ON albums FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON album_of_the_day FOR ALL USING (true);

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

-- Function to get or create the album of the day
CREATE OR REPLACE FUNCTION get_album_of_the_day()
RETURNS TABLE (
  id UUID,
  title TEXT,
  artist TEXT,
  release_year INTEGER,
  album_art_url TEXT
) AS $$
DECLARE
  today_date DATE := CURRENT_DATE;
  existing_album_id UUID;
  random_album_id UUID;
BEGIN
  -- Check if we already have an album of the day for today
  SELECT album_id INTO existing_album_id 
  FROM album_of_the_day 
  WHERE date = today_date;
  
  -- If no album exists for today, create one
  IF existing_album_id IS NULL THEN
    -- Get a random album
    SELECT a.id INTO random_album_id
    FROM albums a
    ORDER BY RANDOM()
    LIMIT 1;
    
    -- If we found an album, insert it as album of the day
    IF random_album_id IS NOT NULL THEN
      INSERT INTO album_of_the_day (album_id, date)
      VALUES (random_album_id, today_date);
      
      existing_album_id := random_album_id;
    END IF;
  END IF;
  
  -- Return the album details
  RETURN QUERY
  SELECT a.id, a.title, a.artist, a.release_year, a.album_art_url
  FROM albums a
  WHERE a.id = existing_album_id;
END;
$$ LANGUAGE plpgsql; 