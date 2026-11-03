import type { router } from './router'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

declare module '@tanstack/router-core' {
  interface Register {
    router: typeof router
  }
}
