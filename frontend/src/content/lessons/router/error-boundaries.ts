import type { LessonManifest } from '../../types'

export const routerErrorBoundariesLesson: LessonManifest = {
  id: 'router-error-boundaries',
  libraryId: 'router',
  topicId: 'router-errors',
  title: 'Error Boundaries & 404 Not Found Handling',
  description: 'Catch loader failures and rendering exceptions gracefully with per-route errorComponent and global notFoundComponent.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/router/latest/docs/framework/react/guide/error-handling',
  learningObjectives: [
    'Define route-level error boundaries using errorComponent: ({ error, reset }) => ...',
    'Trigger retry attempts using the reset callback provided to errorComponent.',
    'Implement catch-all 404 handling using defaultNotFoundComponent.',
    'Differentiate between thrown HTTP redirects and application errors.',
  ],
  conceptSections: [
    {
      title: 'Fine-Grained Route Error Boundaries',
      content:
        'In TanStack Router, an unhandled exception inside a loader or route component does not crash the entire application. The nearest parent route containing an errorComponent catches the failure and renders a fallback while preserving the rest of your navigation UI.',
    },
    {
      title: 'Built-in Retry Mechanics',
      content:
        'The errorComponent receives { error, reset }. Calling reset() instructs TanStack Router to re-attempt loading and rendering the active route without requiring a full browser page reload.',
    },
  ],
  importantApis: [
    {
      name: 'errorComponent',
      signature: 'errorComponent: ({ error, reset }) => <ErrorView />',
      description: 'Component rendered when a route loader throws an uncaught error.',
    },
    {
      name: 'notFoundComponent',
      signature: 'notFoundComponent: () => <NotFoundView />',
      description: 'Component displayed when a route URL does not match any route definition.',
    },
  ],
  previewInstructions: 'Click "Load Faulty Report" to trigger a simulated 500 error and test the retry button. Then click "Invalid Route" to observe the custom 404 screen.',
  expectedResult: 'Isolated error handling within the route outlet and custom 404 resolution without breaking the main navigation layout.',
  commonMistakes: [
    {
      mistake: 'Throwing plain strings instead of Error objects or responses in loaders.',
      fix: 'Always throw new Error("Detailed message") or proper HTTP error structures.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How do error boundaries in TanStack Router differ from standard React ErrorBoundaries?',
      answer:
        'TanStack Router error boundaries integrate directly into the route lifecycle, catching async loader errors before component mounting occurs and providing an automatic reset() retry handler.',
    },
  ],
  example: {
    id: 'example-router-error-boundaries',
    title: 'Route Error Recovery & 404 Not Found Fallback',
    description: 'Demonstrating route-level error components with instant reset retry and 404 match fallbacks.',
    entryFile: '/App.tsx',
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
  Outlet,
  Link,
  useNavigate,
} from '@tanstack/react-router';
import { AlertCircle, RotateCcw, Home, FileQuestion, CheckCircle2, ShieldAlert } from 'lucide-react';

let simulatedFailCount = 1;

// 1. Root Route with Global 404 Handler
const rootRoute = createRootRoute({
  component: () => (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto', background: '#ffffff', minHeight: '100vh' }}>
      <header style={{ paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={22} color="#e11d48" />
          <span>Error Boundary & 404 Sandbox</span>
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link
            to="/"
            style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '13px', textDecoration: 'none', color: '#475569', border: '1px solid #e2e8f0' }}
            activeProps={{ style: { background: '#f1f5f9', fontWeight: 600 } }}
          >
            Healthy Page
          </Link>
          <Link
            to="/report"
            style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '13px', textDecoration: 'none', color: '#e11d48', border: '1px solid #fecdd3' }}
            activeProps={{ style: { background: '#ffe4e6', fontWeight: 600 } }}
          >
            Simulate Error
          </Link>
          <Link
            to="/non-existent-url"
            style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '13px', textDecoration: 'none', color: '#64748b', border: '1px solid #e2e8f0' }}
          >
            Trigger 404
          </Link>
        </div>
      </header>
      <Outlet />
    </div>
  ),
  notFoundComponent: () => (
    <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <FileQuestion size={40} color="#64748b" style={{ margin: '0 auto 12px auto' }} />
      <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#0f172a' }}>404 - Route Not Found</h3>
      <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '13px' }}>
        The path you requested does not match any declared route in this router tree.
      </p>
      <Link
        to="/"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0f172a', color: '#ffffff', textDecoration: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}
      >
        <Home size={14} /> Return to Home
      </Link>
    </div>
  ),
});

// 2. Healthy Route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 600, marginBottom: '6px' }}>
        <CheckCircle2 size={18} />
        <span>Healthy Route Operational</span>
      </div>
      <p style={{ margin: 0, fontSize: '13px', color: '#15803d' }}>
        This route loader and component execute normally without any exceptions.
      </p>
    </div>
  ),
});

// 3. Faulty Route with Error Component
const reportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/report',
  loader: async () => {
    if (simulatedFailCount > 0) {
      simulatedFailCount--;
      throw new Error('Database connection timed out while querying quarterly financial metrics.');
    }
    return { status: 'Recovered', timestamp: new Date().toLocaleTimeString() };
  },
  errorComponent: ({ error, reset }) => (
    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991b1b', fontWeight: 700, marginBottom: '8px' }}>
        <AlertCircle size={20} color="#dc2626" />
        <span>Route Loader Error Caught</span>
      </div>
      <p style={{ fontSize: '13px', color: '#b91c1c', margin: '0 0 16px 0', fontFamily: 'monospace', background: '#fee2e2', padding: '10px', borderRadius: '6px' }}>
        {error.message}
      </p>
      <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0' }}>
        The parent layout remains mounted! Click retry to re-execute the route loader.
      </p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => reset()}
          style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RotateCcw size={14} /> Retry Loader
        </button>
        <Link
          to="/"
          style={{ background: '#fff', border: '1px solid #cbd5e1', color: '#334155', textDecoration: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          Back to Safety
        </Link>
      </div>
    </div>
  ),
  component: () => {
    const data = reportRoute.useLoaderData();
    return (
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#059669', fontSize: '16px' }}>Report Generated Successfully</h3>
        <p style={{ fontSize: '13px', color: '#475569' }}>The loader retry succeeded and delivered data resolved at {data.timestamp}.</p>
      </div>
    );
  },
});

// Route Tree & Memory Router
const routeTree = rootRoute.addChildren([indexRoute, reportRoute]);
const memoryHistory = createMemoryHistory({ initialEntries: ['/'] });
const router = createRouter({ routeTree, history: memoryHistory });

export default function App() {
  return <RouterProvider router={router} />;
}
`,
      },
    },
    dependencies: {
      '@tanstack/react-router': '^1.170.46',
      'lucide-react': '^1.65.0',
    },
  },
}

