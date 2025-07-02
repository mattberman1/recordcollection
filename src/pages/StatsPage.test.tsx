import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import StatsPage from './StatsPage'

jest.mock('../hooks/useCatalogStats')
import { useCatalogStats } from '../hooks/useCatalogStats'

const mockData = {
  topArtists: [
    { artist: 'Artist A', count: 10 },
    { artist: 'Artist B', count: 8 },
    { artist: 'Artist C', count: 7 },
    { artist: 'Artist D', count: 6 },
    { artist: 'Artist E', count: 5 },
  ],
  oldest: {
    id: 1,
    artist: 'Old Artist',
    title: 'Old Album',
    release_year: 1955,
    album_art_url: '/old.jpg',
  },
  newest: {
    id: 2,
    artist: 'New Artist',
    title: 'New Album',
    release_year: 2023,
    album_art_url: '/new.jpg',
  },
  total: 30,
  unique_artists: 12,
  decade_counts: { '1950': 2, '1960': 3, '1970': 5, '1980': 7, '1990': 4, '2000': 3, '2010': 4, '2020': 2 },
}

describe('StatsPage', () => {
  beforeEach(() => {
    (useCatalogStats as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
      isError: false,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      refetch: jest.fn(),
      status: 'success',
      fetchStatus: 'idle',
      isFetched: true,
      isSuccess: true,
      isRefetching: false,
      isStale: false,
      isPaused: false,
      failureCount: 0,
      failureReason: null,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      isPlaceholderData: false,
      isFetching: false,
      isFetchedAfterMount: true,
      isInitialLoading: false,
      errorUpdateCount: 0,
      promise: Promise.resolve(mockData),
    })
  })

  it('renders all stats and images', () => {
    render(<StatsPage />)
    expect(screen.getByText('Total albums')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.getByText('Unique artists')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('Top artists')).toBeInTheDocument()
    expect(screen.getAllByText(/Artist [A-E]/).length).toBe(5)
    expect(screen.getByText('Oldest album')).toBeInTheDocument()
    expect(screen.getByAltText('Old Album')).toHaveAttribute('src', '/old.jpg')
    expect(screen.getByText('Old Artist • 1955')).toBeInTheDocument()
    expect(screen.getByText('Newest album')).toBeInTheDocument()
    expect(screen.getByAltText('New Album')).toHaveAttribute('src', '/new.jpg')
    expect(screen.getByText('New Artist • 2023')).toBeInTheDocument()
    expect(screen.getByText('Albums by decade')).toBeInTheDocument()
    expect(screen.getByText('1950s')).toBeInTheDocument()
    expect(screen.getAllByText('2').length).toBeGreaterThan(0)
  })
})
