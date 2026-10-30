import type { LessonManifest } from '../../types'

export const routerQueryIntegrationLesson: LessonManifest = {
  id: 'router-query-integration',
  libraryId: 'router',
  topicId: 'router-query-integration',
  title: 'TanStack Query Integration: ensureQueryData & Suspense',
  description: 'Combine TanStack Query with TanStack Router using queryClient.ensureQueryData in loaders and useSuspenseQuery in components.',
  difficulty: 'ADVANCED',
  estimatedMinutes: 25,
  officialDocUrl: 'https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#integrating-with-tanstack-query',
  learningObjectives: [
    'Share queryClient instance with TanStack Router through router context.',
    'Execute queryClient.ensureQueryData() inside route loaders for instant cache warming.',
    'Render data with useSuspenseQuery() inside route components without loading flickers.',
    'Enable link hover prefetching that automatically primes the TanStack Query cache.',
  ],
  conceptSections: [
    {
      title: 'The Golden Stack: Router + Query',
      content:
        'TanStack Router coordinates URL changes, code splitting, and preloading, while TanStack Query manages caching, deduplication, background garbage collection, and stale-while-revalidate invalidation. Together, they create an optimal developer and user experience.',
    },
    {
      title: 'ensureQueryData vs fetchQuery',
      content:
        'In route loaders, calling queryClient.ensureQueryData(options) checks if fresh data is already in cache. If cached, it returns instantly without making a network request; if not, it fetches and caches the result.',
    },
  ],
  importantApis: [
    {
      name: 'queryClient.ensureQueryData()',
      signature: 'await queryClient.ensureQueryData(queryOptions)',
      description: 'Fetches query data if not already cached and fresh.',
    },
    {
      name: 'useSuspenseQuery()',
      signature: 'const { data } = useSuspenseQuery(queryOptions)',
      description: 'Hook that suspends component until query data is loaded from the cache.',
    },
  ],
  previewInstructions: 'Click between "Users" and "Analytics". Notice the cache indicators. On the second visit to Users, the route loader resolves instantly from the TanStack Query cache.',
  expectedResult: 'A synchronized Query + Router architecture with zero redundant network requests.',
  commonMistakes: [
    {
      mistake: 'Calling queryClient.fetchQuery in loaders instead of ensureQueryData.',
      fix: 'fetchQuery always refetches over the network. ensureQueryData respects staleTime and uses existing cache.',
    },
  ],
  interviewQuestions: [
    {
      question: 'Why is queryClient.ensureQueryData preferred over fetchQuery in TanStack Router loaders?',
      answer:
        'ensureQueryData checks if cached data already exists within its staleTime window. If it does, it returns immediately without firing redundant network requests.',
    },
  ],
  example: {
    id: 'example-router-query-integration',
    title: 'Integrated Router Loaders with TanStack Query Cache',
    description: 'Pre-warming TanStack Query cache inside TanStack Router loaders and using useSuspenseQuery.',
    entryFile: '/App.tsx',
    files: {
      '/App.tsx': {
        code: `import React, { Suspense } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useSuspenseQuery,
  queryOptions,
} from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
  Outlet,
  Link,
} from '@tanstack/react-router';
import { Database, Network, Users, BarChart3, RefreshCw, Zap } from 'lucide-react';

// 1. Setup Query Client with 1-minute staleTime
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

let fetchCounter = 0;

// 2. Define Query Options
const teamQueryOptions = queryOptions({
  queryKey: ['team', 'members'],
  queryFn: async () => {
    fetchCounter++;
    await new Promise((r) => setTimeout(r, 400));
    return [
      { id: 1, name: 'Tanner Linsley', role: 'Creator & Architect', avatar: 'TL' },
      { id: 2, name: 'Dominik Dorfmeister', role: 'Query Maintainer', avatar: 'DD' },
      { id: 3, name: 'Sean Cassiere', role: 'Router Core', avatar: 'SC' },
    ];
  },
});

const metricsQueryOptions = queryOptions({
  queryKey: ['metrics', 'summary'],
  queryFn: async () => {
    await new Promise((r) => setTimeout(r, 400));
    return {
      activeUsers: '128,490',
      totalDownloads: '4.8M / mo',
      cacheHitRatio: '99.4%',
    };
  },
});

// 3. Router Context Definition
interface MyRouterContext {
  queryClient: QueryClient;
}

// 4. Root Route
const rootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto', background: '#ffffff', minHeight: '100vh' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Network size={22} color="#10b981" />
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Router + Query</h2>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link
            to="/team"
            style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '13px', textDecoration: 'none', color: '#475569', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}
            activeProps={{ style: { background: '#10b981', color: '#fff', borderColor: '#10b981', fontWeight: 600 } }}
          >
            <Users size={14} /> Team
          </Link>
          <Link
            to="/metrics"
            style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '13px', textDecoration: 'none', color: '#475569', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}
            activeProps={{ style: { background: '#10b981', color: '#fff', borderColor: '#10b981', fontWeight: 600 } }}
          >
            <BarChart3 size={14} /> Metrics
          </Link>
        </div>
      </header>

      <Suspense fallback={<div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Suspended loading...</div>}>
        <Outlet />
      </Suspense>
    </div>
  ),
});

// 5. Team Route: Loader calls ensureQueryData
const teamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/team',
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(teamQueryOptions),
  component: () => {
    const { data: team } = useSuspenseQuery(teamQueryOptions);

    return (
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Core Team Directory</h3>
          <span style={{ fontSize: '11px', color: '#059669', background: '#ecfdf5', padding: '3px 8px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={12} /> Network Calls: {fetchCounter}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {team.map((member) => (
            <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px' }}>
                {member.avatar}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{member.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
});

// 6. Metrics Route
const metricsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/metrics',
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(metricsQueryOptions),
  component: () => {
    const { data } = useSuspenseQuery(metricsQueryOptions);

    return (
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0f172a' }}>Ecosystem Metrics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Active Users</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{data.activeUsers}</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Monthly NPM</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{data.totalDownloads}</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Cache Hit Rate</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#10b981' }}>{data.cacheHitRatio}</div>
          </div>
        </div>
      </div>
    );
  },
});

// Build Route Tree & Isolated Memory Router
const routeTree = rootRoute.addChildren([teamRoute, metricsRoute]);
const memoryHistory = createMemoryHistory({ initialEntries: ['/team'] });
const router = createRouter({
  routeTree,
  history: memoryHistory,
  context: { queryClient },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
`,
      },
    },
    dependencies: {
      '@tanstack/react-router': '^1.170.46',
      '@tanstack/react-query': '^5.105.0',
      'lucide-react': '^1.65.0',
    },
  },
}

