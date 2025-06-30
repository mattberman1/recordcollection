# Vinyl Catalog

A modern web application for cataloging and managing your vinyl record collection. Built with React, TypeScript, and Supabase.

## Features

- 📀 Add albums to your collection with title, artist, release year, and album art
- 🎵 Browse your complete vinyl collection
- 🗑️ Delete albums from your collection
- 🎨 Beautiful, responsive UI with Tailwind CSS
- 🔍 Search functionality (coming soon)
- 📱 Mobile-friendly design

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Query (TanStack Query)
- **Code Quality**: ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd vinyl-catalog
```

2. Install dependencies:

```bash
npm install
```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings → API and copy your project URL and anon key
   - Create a `.env` file in the root directory:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
   - Go to your Supabase dashboard → SQL Editor
   - Run the following SQL:

```sql
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

-- Create a policy that allows all operations
CREATE POLICY "Allow all operations" ON albums FOR ALL USING (true);
```

5. Start the development server:

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

## Development Scripts

- `npm start` - Start the development server
- `npm run build` - Build the app for production
- `npm test` - Run tests with Jest
- `npm run lint` - Run ESLint to check for code issues
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run format` - Format code with Prettier

## Usage

1. **Adding Albums**: Use the form on the left to add new albums to your collection
2. **Browsing**: View all your albums in the main area on the right
3. **Deleting**: Click the trash icon next to any album to remove it from your collection

## Project Structure

```
src/
├── components/          # React components
│   ├── AddAlbumForm.tsx # Form for adding new albums
│   ├── AlbumList.tsx    # Component to display album list
│   └── AlbumDetailModal.tsx # Modal for album details
├── hooks/               # Custom React hooks
│   └── useAlbums.ts     # React Query hooks for album operations
├── lib/
│   └── supabase.ts      # Supabase client configuration
├── pages/               # Page components
│   ├── HomePage.tsx     # Home page
│   ├── AddAlbumPage.tsx # Add album page
│   └── CollectionPage.tsx # Collection page
├── services/
│   └── albumService.ts  # Database operations (legacy)
├── App.tsx              # Main app component
├── index.tsx            # App entry point
└── index.css            # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Future Enhancements

- [ ] Integration with music APIs (Discogs, MusicBrainz) for automatic album data
- [ ] Advanced search and filtering
- [ ] Album ratings and reviews
- [ ] Export/import functionality
- [ ] User authentication
- [ ] Multiple collections support
- [ ] Album condition tracking
- [ ] Wishlist functionality
