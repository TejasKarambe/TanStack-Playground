import React from 'react'
import {
  createRouter,
  createRoute,
  createRootRoute,
  Navigate,
} from '@tanstack/react-router'
import { z } from 'zod'
import { MainLayout } from '@/components/layout/main-layout'
import { DashboardView } from '@/features/dashboard/dashboard-view'
import { LibrariesView } from '@/features/libraries/libraries-view'
import { LibraryDetailView } from '@/features/libraries/library-detail-view'
import { TopicDetailView } from '@/features/libraries/topic-detail-view'
import { PlaygroundView } from '@/features/playground/playground-view'
import { ProgressView } from '@/features/progress/progress-view'
import { BookmarksView } from '@/features/bookmarks/bookmarks-view'
import { SettingsView } from '@/features/settings/settings-view'

// Root route hosting the global shell (Sidebar, Navbar, Theme, Toasts, Outlet)
const rootRoute = createRootRoute({
  component: MainLayout,
})

// Index route redirects to /dashboard
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Navigate to="/dashboard" replace />,
})

// Dashboard
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardView,
})

// Search validation schema for /libraries
const librariesSearchSchema = z.object({
  q: z.string().optional(),
  filter: z.enum(['ALL', 'STABLE', 'ECOSYSTEM']).optional(),
})

// Libraries Directory
const librariesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/libraries',
  validateSearch: (search) => librariesSearchSchema.parse(search),
  component: LibrariesView,
})

// Library Detail
const libraryDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/library/$libraryId',
  component: LibraryDetailView,
})

// Topic Detail (Main dual-pane interactive view)
const topicDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/library/$libraryId/$topicId',
  component: TopicDetailView,
})

// Standalone Playground
const playgroundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/playground',
  component: PlaygroundView,
})

// Learning Progress
const progressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/progress',
  component: ProgressView,
})

// Bookmarks
const bookmarksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bookmarks',
  component: BookmarksView,
})

// Settings & Preferences
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsView,
})

// Build complete Route Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  librariesRoute,
  libraryDetailRoute,
  topicDetailRoute,
  playgroundRoute,
  progressRoute,
  bookmarksRoute,
  settingsRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

