import React from 'react'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAlbums, useAddAlbum, useDeleteAlbum, useAddAlbums } from './useAlbums'

// Mock Supabase client
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: {}, error: null })),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
  Album: {},
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useAlbums', () => {
  it('should return hook functions', () => {
    const { result } = renderHook(() => useAlbums(), {
      wrapper: createWrapper(),
    })

    expect(result.current).toBeDefined()
    expect(typeof result.current.data).toBeDefined()
    expect(typeof result.current.isLoading).toBeDefined()
  })
})

describe('useAddAlbum', () => {
  it('should return mutation functions', () => {
    const { result } = renderHook(() => useAddAlbum(), {
      wrapper: createWrapper(),
    })

    expect(result.current).toBeDefined()
    expect(typeof result.current.mutate).toBe('function')
    expect(typeof result.current.isPending).toBeDefined()
  })
})

describe('useAddAlbums', () => {
  it('should return bulk mutation functions', () => {
    const { result } = renderHook(() => useAddAlbums(), {
      wrapper: createWrapper(),
    })

    expect(result.current).toBeDefined()
    expect(typeof result.current.mutate).toBe('function')
    expect(typeof result.current.isPending).toBeDefined()
  })
})

describe('useDeleteAlbum', () => {
  it('should return delete mutation functions', () => {
    const { result } = renderHook(() => useDeleteAlbum(), {
      wrapper: createWrapper(),
    })

    expect(result.current).toBeDefined()
    expect(typeof result.current.mutate).toBe('function')
    expect(typeof result.current.isPending).toBeDefined()
  })
})
