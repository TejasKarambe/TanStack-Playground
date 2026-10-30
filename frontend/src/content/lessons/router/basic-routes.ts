import type { LessonManifest } from '../../types'

export const routerBasicRoutesLesson: LessonManifest = {
  id: 'router-basic-routes',
  libraryId: 'router',
  topicId: 'router-basics',
  title: 'Basic Routes: Root Layout, Outlet & Type-Safe Links',
  description: 'Construct nested route trees with root layouts, outlet hierarchies, and active link states.',
  difficulty: 'BEGINNER',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/router/latest/docs/framework/react/guide/route-trees',
  learningObjectives: [
    'Define the root layout using createRootRoute() and render the <Outlet />.',
    'Create child leaf routes with createRoute() and declare parents.',
    'Build the route tree with rootRoute.addChildren([...]).',
    'Navigate with type-safe <Link /> components and active link styling.',
  ],
  conceptSections: [
    {
      title: 'Full Type-Safety from the Ground Up',
      content:
        'Unlike legacy routers where links are plain strings (e.g. <Link to="/usr/123" />) prone to 404 typos, TanStack Router derives exact TypeScript types from your route tree. Invalid paths or missing parameters are caught at compile-time by the TypeScript compiler.',
    },
    {
      title: 'The Route Tree & Outlet Hierarchy',
      content:
        'createRootRoute defines the shared shell (navigation bars, footers, providers) and embeds <Outlet /> where matching children mount. Routes declare their parent via getParentRoute: () => rootRoute.',
    },
  ],
  importantApis: [
    {
      name: 'createRootRoute()',
      signature: 'createRootRoute({ component: RootComponent })',
      description: 'Creates the top-level layout route for the entire application.',
    },
    {
      name: 'createRoute(options)',
      signature: 'createRoute({ getParentRoute, path, component })',
      description: 'Defines a path node in the route tree.',
    },
    {
      name: '<Link />',
      signature: '<Link to="/path" activeProps={{ className: "active" }}>',
      description: 'Type-safe navigation component that applies active styles automatically.',
    },
  ],
  previewInstructions: 'Click between "Home", "Explore", and "About" in the top navigation bar. Notice the active link indicators and smooth route transitions without full page reloads.',
  expectedResult: 'A fully functional multi-page routing preview running inside the browser sandbox with memory history.',
  commonMistakes: [
    {
      mistake: 'Forgetting to include <Outlet /> in layout route components.',
      fix: 'Child routes cannot render unless the parent route mounts an <Outlet /> element.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How does TanStack Router achieve 100% type-safety for links and route params?',
      answer:
        'By registering the router instance via TypeScript module augmentation (declare module "@tanstack/react-router" { interface Register { router: typeof router } }). This gives the compiler knowledge of all routes, parameters, and search schemas.',
    },
  ],
  example: {
    id: 'router-basic-routes-example',
    title: 'Type-Safe Route Tree & Layouts',
    description: 'Nested layout with Outlet, Link active states, and in-memory routing.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-router': '^1.170.46',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
  Outlet,
  Link,
} from '@tanstack/react-router';
import { Home, Compass, Info, Network } from 'lucide-react';

// 1. Root Layout Route
const rootRoute = createRootRoute({
  component: () => (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f8fafc' }}>
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 20px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginRight: '16px' }}>
          <Network size={20} color="#10b981" />
          <span>TanStack Router</span>
        </div>

        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            textDecoration: 'none',
            color: '#475569',
            padding: '6px 10px',
            borderRadius: '6px',
          }}
          activeProps={{
            style: { color: '#065f46', background: '#ecfdf5', fontWeight: 600 },
          }}
        >
          <Home size={15} /> Home
        </Link>

        <Link
          to="/explore"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            textDecoration: 'none',
            color: '#475569',
            padding: '6px 10px',
            borderRadius: '6px',
          }}
          activeProps={{
            style: { color: '#065f46', background: '#ecfdf5', fontWeight: 600 },
          }}
        >
          <Compass size={15} /> Explore
        </Link>

        <Link
          to="/about"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            textDecoration: 'none',
            color: '#475569',
            padding: '6px 10px',
            borderRadius: '6px',
          }}
          activeProps={{
            style: { color: '#065f46', background: '#ecfdf5', fontWeight: 600 },
          }}
        >
          <Info size={15} /> About
        </Link>
      </nav>

      {/* Outlet renders active child route */}
      <main style={{ padding: '24px', maxWidth: '640px', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  ),
});

// 2. Child Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Welcome to TanStack Router</h2>
      <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
        This client sandbox utilizes an in-memory history router to provide fully isolated navigation without reloading the iframe.
      </p>
    </div>
  ),
});

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explore',
  component: () => (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Ecosystem Explorer</h2>
      <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
        TanStack Router coordinates data loading, pending states, search params validation, and nested layout transitions seamlessly.
      </p>
    </div>
  ),
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: () => (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>About This Route Tree</h2>
      <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
        Configured with strict TypeScript compiler checking and zero runtime route mismatches.
      </p>
    </div>
  ),
});

// 3. Assemble Router
const routeTree = rootRoute.addChildren([indexRoute, exploreRoute, aboutRoute]);
const memoryHistory = createMemoryHistory({ initialEntries: ['/'] });
const router = createRouter({ routeTree, history: memoryHistory });

export default function App() {
  return <RouterProvider router={router} />;
}
`,
      },
    },
  },
}

