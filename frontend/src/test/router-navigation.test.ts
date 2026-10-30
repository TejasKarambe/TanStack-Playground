import { describe, it, expect } from 'vitest'
import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
} from '@tanstack/react-router'

describe('TanStack Router Memory Navigation & Parameter Extraction', () => {
  it('navigates cleanly in memory history without touching window.location', async () => {
    const rootRoute = createRootRoute()
    const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/' })
    const userRoute = createRoute({ getParentRoute: () => rootRoute, path: '/users/$id' })

    const routeTree = rootRoute.addChildren([homeRoute, userRoute])
    const memoryHistory = createMemoryHistory({ initialEntries: ['/'] })
    const router = createRouter({ routeTree, history: memoryHistory })

    expect(router.state.location.pathname).toBe('/')

    await router.navigate({ to: '/users/$id' as any, params: { id: '42' } as any })
    expect(router.state.location.pathname).toBe('/users/42')
  })
})
