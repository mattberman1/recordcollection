import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, within, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CollectionPage from './CollectionPage'

// Use real timers for debounce

jest.mock('../hooks/useAlbums', () => ({
  useAlbums: () => ({
    data: [
      {
        id: '1',
        title: 'Abbey Road',
        artist: 'The Beatles',
        release_year: 1969,
        album_art_url: '',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        format: 'LP',
      },
      {
        id: '2',
        title: 'Kind of Blue',
        artist: 'Miles Davis',
        release_year: 1959,
        album_art_url: '',
        created_at: '2023-01-02T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
        format: 'LP',
      },
      {
        id: '3',
        title: 'Discovery',
        artist: 'Daft Punk',
        release_year: 2001,
        album_art_url: '',
        created_at: '2023-01-03T00:00:00Z',
        updated_at: '2023-01-03T00:00:00Z',
        format: 'EP',
      },
    ],
    isLoading: false,
    error: null,
  }),
  useDeleteAlbum: () => ({ mutateAsync: jest.fn() }),
}))

describe('CollectionPage', () => {
  it('renders the toolbar', () => {
    render(<CollectionPage />)
    expect(screen.getByPlaceholderText(/search title or artist/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/filter by decade/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/filter by format/i)).toBeInTheDocument()
  })

  it('filters the list by search', async () => {
    render(<CollectionPage />)
    const input = screen.getByPlaceholderText(/search title or artist/i)
    await userEvent.type(input, 'daft')
    // Wait for debounce and filtering
    await new Promise((resolve) => setTimeout(resolve, 350))
    const allTitles = screen.getAllByRole('heading', { level: 4 })
    expect(allTitles).toHaveLength(1)
    expect(allTitles[0]).toHaveTextContent('Discovery')
    expect(screen.getByText('Daft Punk')).toBeInTheDocument()
  })

  it('sorts the list by title descending', async () => {
    render(<CollectionPage />)
    const select = screen.getByLabelText(/sort by/i)
    await userEvent.selectOptions(select, 'title-desc')
    const allTitles = screen.getAllByRole('heading', { level: 4 })
    expect(allTitles.map((el) => el.textContent)).toContain('Kind of Blue')
    const titles = allTitles.map((el) => el.textContent)
    expect(titles).toEqual(expect.arrayContaining(['Kind of Blue', 'Discovery', 'Abbey Road']))
  })
})
