import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from './HomePage'

jest.mock('../hooks/useRandomAlbum', () => ({
  useRandomAlbum: () => ({
    data: {
      id: '1',
      title: 'Random Album',
      artist: 'Some Artist',
      release_year: 1999,
      album_art_url: '',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
    isLoading: false,
  }),
}))

describe('HomePage', () => {
  it('shows album of the day', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(screen.getByText(/album of the day/i)).toBeInTheDocument()
  })

  it('does not render features section', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(screen.queryByText(/features/i)).not.toBeInTheDocument()
  })
})
