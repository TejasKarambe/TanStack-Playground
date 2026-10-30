import { describe, it, expect, vi } from 'vitest'
import { QueryClient } from '@tanstack/react-query'

describe('TanStack Query Behavior & Cache Lifecycles', () => {
  it('deduplicates simultaneous in-flight queries', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    const fetchSpy = vi.fn().mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 20))
      return { id: 1, name: 'TanStack Core' }
    })

    // Execute parallel fetches with the same query key
    const p1 = queryClient.fetchQuery({ queryKey: ['test', 'item'], queryFn: fetchSpy })
    const p2 = queryClient.fetchQuery({ queryKey: ['test', 'item'], queryFn: fetchSpy })

    const [res1, res2] = await Promise.all([p1, p2])

    expect(res1).toEqual(res2)
    // Spy was called only once due to deduplication
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('respects staleTime cache window', async () => {
    const queryClient = new QueryClient()
    const fetchSpy = vi.fn().mockResolvedValue('fresh-data')

    // First fetch warms the cache
    await queryClient.ensureQueryData({
      queryKey: ['stale-test'],
      queryFn: fetchSpy,
      staleTime: 5000,
    })
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    // Second ensureQueryData returns cached without calling fetchSpy
    const cached = await queryClient.ensureQueryData({
      queryKey: ['stale-test'],
      queryFn: fetchSpy,
      staleTime: 5000,
    })

    expect(cached).toBe('fresh-data')
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('invalidates queries and forces background re-fetch', async () => {
    const queryClient = new QueryClient()
    let count = 0
    const queryFn = vi.fn().mockImplementation(async () => ++count)

    await queryClient.fetchQuery({ queryKey: ['counter'], queryFn })
    expect(count).toBe(1)

    // Invalidate
    await queryClient.invalidateQueries({ queryKey: ['counter'] })
    const data = await queryClient.fetchQuery({ queryKey: ['counter'], queryFn })

    expect(data).toBe(2)
    expect(queryFn).toHaveBeenCalledTimes(2)
  })
})

