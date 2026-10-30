import type { LessonManifest } from '../../types'

export const routerSearchParamsLesson: LessonManifest = {
  id: 'router-search-params',
  libraryId: 'router',
  topicId: 'router-search-params',
  title: 'Search Parameters: URL Query Validation & Synchronization',
  description: 'Validate, parse, and synchronize URL query parameters with Zod or custom schema parsers.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 25,
  officialDocUrl: 'https://tanstack.com/router/latest/docs/framework/react/guide/search-params',
  learningObjectives: [
    'Define type-safe search schemas using validateSearch on route definitions.',
    'Access typed search params with the useSearch hook.',
    'Update search parameters programmatically with useNavigate().',
    'Understand URL serialization of complex types (numbers, booleans, objects).',
  ],
  conceptSections: [
    {
      title: 'Search Params as State Store',
      content:
        'The URL is the best global state store in web apps. It allows users to bookmark searches, copy links, share filtered tables, and use browser back/forward buttons naturally.',
    },
    {
      title: 'validateSearch Pipeline',
      content:
        'TanStack Router parses raw query strings and passes them through validateSearch. You can validate using simple TypeScript parser functions or Zod schemas. If the search params are invalid, TanStack Router falls back to safe defaults.',
    },
  ],
  importantApis: [
    {
      name: 'createRoute({ validateSearch })',
      signature: 'validateSearch: (raw: Record<string, unknown>) => ValidatedType',
      description: 'Parses and validates raw URL query parameters into strongly typed objects.',
    },
    {
      name: 'useSearch({ from })',
      signature: 'const search = useSearch({ from: string })',
      description: 'Reads reactive, validated search parameters.',
    },
    {
      name: 'navigate({ search })',
      signature: 'navigate({ search: (prev) => ({ ...prev, filter: "val" }) })',
      description: 'Updates search parameters functionally while preserving existing query keys.',
    },
  ],
  previewInstructions: 'Type into the search input or change the sort direction. Watch how the URL query state box reflects every change in real time!',
  expectedResult: 'A reactive filtered view where state is completely synchronized with type-safe URL search parameters.',
  commonMistakes: [
    {
      mistake: 'Directly reading window.location.search or URLSearchParams.',
      fix: 'Use useSearch({ from }) to guarantee reactivity and compile-time type validation.',
    },
  ],
  interviewQuestions: [
    {
      question: 'What is the advantage of validateSearch over manually parsing search parameters?',
      answer:
        'validateSearch ensures invalid or malicious URL parameters are validated before any component renders, preventing type coercion bugs (like strings instead of numbers) and sanitizing query states.',
    },
  ],
  example: {
    id: 'router-search-params-example',
    title: 'Type-Safe URL Search Parameters',
    description: 'Validate query params with validateSearch and update via useNavigate.',
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
  useSearch,
  useNavigate,
} from '@tanstack/react-router';
import { SlidersHorizontal, Search, ArrowUpDown, Filter } from 'lucide-react';

interface SearchSchema {
  query: string;
  sortBy: 'name' | 'stars';
  order: 'asc' | 'desc';
}

const rootRoute = createRootRoute({
  component: () => (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      <main style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  ),
});

const packages = [
  { name: 'TanStack Query', category: 'Data Fetching', stars: 42000 },
  { name: 'TanStack Table', category: 'Data Grids', stars: 26000 },
  { name: 'TanStack Router', category: 'Type-Safe Routing', stars: 15500 },
  { name: 'TanStack Form', category: 'Reactive Forms', stars: 6200 },
  { name: 'TanStack Virtual', category: 'DOM Virtualization', stars: 6900 },
];

const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  // Strongly-typed query parameter validation
  validateSearch: (search: Record<string, unknown>): SearchSchema => {
    return {
      query: (search.query as string) || '',
      sortBy: (search.sortBy as 'name' | 'stars') || 'stars',
      order: (search.order as 'asc' | 'desc') || 'desc',
    };
  },
  component: () => {
    const search = useSearch({ from: '/' });
    const navigate = useNavigate({ from: '/' });

    // Filter and sort items based on search parameters
    const filtered = packages
      .filter((pkg) => pkg.name.toLowerCase().includes(search.query.toLowerCase()))
      .sort((a, b) => {
        const modifier = search.order === 'asc' ? 1 : -1;
        if (search.sortBy === 'name') return a.name.localeCompare(b.name) * modifier;
        return (a.stars - b.stars) * modifier;
      });

    return (
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <header style={{ marginBottom: '16px' }}>
          <h2 style={{ margin: '0 0 6px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SlidersHorizontal size={20} color="#10b981" />
            Ecosystem Search
          </h2>
          <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: '6px', fontSize: '11px', color: '#475569' }}>
            Current Validated URL Search State:{' '}
            <code>{JSON.stringify(search)}</code>
          </div>
        </header>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            type="text"
            value={search.query}
            onChange={(e) =>
              navigate({
                search: (prev) => ({ ...prev, query: e.target.value }),
              })
            }
            placeholder="Search packages..."
            style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
          />

          <select
            value={search.sortBy}
            onChange={(e) =>
              navigate({
                search: (prev) => ({ ...prev, sortBy: e.target.value as any }),
              })
            }
            style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
          >
            <option value="stars">Stars</option>
            <option value="name">Name</option>
          </select>

          <button
            onClick={() =>
              navigate({
                search: (prev) => ({
                  ...prev,
                  order: prev.order === 'asc' ? 'desc' : 'asc',
                }),
              })
            }
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#fff',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            {search.order.toUpperCase()}
          </button>
        </div>

        {/* Results */}
        <div style={{ display: 'grid', gap: '8px' }}>
          {filtered.map((item) => (
            <div
              key={item.name}
              style={{
                padding: '12px 14px',
                borderRadius: '6px',
                border: '1px solid #f1f5f9',
                background: '#f8fafc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong style={{ fontSize: '13px', color: '#0f172a' }}>{item.name}</strong>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{item.category}</div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#f59e0b' }}>
                ★ {item.stars.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  },
});

const routeTree = rootRoute.addChildren([catalogRoute]);
const memoryHistory = createMemoryHistory({ initialEntries: ['/?sortBy=stars&order=desc'] });
const router = createRouter({ routeTree, history: memoryHistory });

export default function App() {
  return <RouterProvider router={router} />;
}
`,
      },
    },
  },
}

