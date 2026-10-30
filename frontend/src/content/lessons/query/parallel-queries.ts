import type { LessonManifest } from '../../types'

export const queryParallelQueriesLesson: LessonManifest = {
  id: 'query-parallel-queries',
  libraryId: 'query',
  topicId: 'query-parallel',
  title: 'Parallel Queries: Simultaneous Execution & useQueries',
  description: 'Execute multiple queries concurrently with manual parallel hooks or dynamic useQueries.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/query/latest/docs/framework/react/guides/parallel-queries',
  learningObjectives: [
    'Execute fixed parallel queries using multiple useQuery hooks.',
    'Use useQueries for dynamic array-driven parallel executions.',
    'Aggregate combined loading and error states using array methods.',
    'Observe non-blocking simultaneous network waterfall optimization.',
  ],
  conceptSections: [
    {
      title: 'Manual vs Dynamic Parallel Queries',
      content:
        'When the number of parallel requests is fixed, calling useQuery side-by-side executes them in parallel without blocking. When the number of queries depends on user input or dynamic lists, useQueries({ queries: ids.map(id => ({ queryKey: ["item", id], queryFn: () => fetchItem(id) })) }) executes all queries simultaneously while adhering to React Hook rules.',
    },
    {
      title: 'Combining Results',
      content:
        'useQueries returns an array of query results. In v5, you can use the combine option: useQueries({ queries, combine: (results) => ({ data: results.map(r => r.data), isPending: results.some(r => r.isPending) }) }).',
    },
  ],
  importantApis: [
    {
      name: 'useQueries({ queries, combine? })',
      signature: 'useQueries({ queries: [...], combine?: (results) => combined })',
      description: 'Executes a dynamic array of queries in parallel and aggregates responses.',
    },
  ],
  previewInstructions: 'Click "Fetch All Data Simultaneously". Notice how the Server Status, Recent Alerts, and Active Users all fetch at the same time without waiting on each other.',
  expectedResult: 'A unified operations overview aggregating three concurrent asynchronous queries.',
  commonMistakes: [
    {
      mistake: 'Putting useQuery inside a loop (e.g. ids.forEach(id => useQuery(...))).',
      fix: 'Never invoke hooks inside loops. Use useQueries when query count is dynamic.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How do browsers limit parallel HTTP requests to the same origin?',
      answer:
        'Under HTTP/1.1, browsers enforce a connection pool of ~6 concurrent TCP sockets per origin. Under HTTP/2 and HTTP/3 with multiplexing, hundreds of requests can stream over a single connection in parallel.',
    },
  ],
  example: {
    id: 'query-parallel-queries-example',
    title: 'Simultaneous Dashboard Data Loading',
    description: 'Fetch three independent resources concurrently and track aggregate states.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-query': '^5.66.0',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React from 'react';
import { QueryClient, QueryClientProvider, useQueries } from '@tanstack/react-query';
import { Activity, Bell, Users, RefreshCw, CheckCircle2 } from 'lucide-react';
import { fetchServerHealth, fetchSystemAlerts, fetchOnlineUsers } from './api/dashboard';

const queryClient = new QueryClient();

function ParallelDashboard() {
  // useQueries executes multiple queries in parallel dynamically
  const results = useQueries({
    queries: [
      { queryKey: ['metrics', 'health'], queryFn: fetchServerHealth },
      { queryKey: ['metrics', 'alerts'], queryFn: fetchSystemAlerts },
      { queryKey: ['metrics', 'users'], queryFn: fetchOnlineUsers },
    ],
  });

  const [healthQuery, alertsQuery, usersQuery] = results;
  const isAnyPending = results.some((r) => r.isPending);
  const isAnyFetching = results.some((r) => r.isFetching);

  const handleRefetchAll = () => {
    results.forEach((r) => r.refetch());
  };

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="#3b82f6" />
            Operations Overview (Parallel Queries)
          </h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {isAnyFetching ? '⚡ 3 parallel network requests in-flight...' : '✓ All parallel queries synchronized'}
          </span>
        </div>

        <button
          onClick={handleRefetchAll}
          disabled={isAnyFetching}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            background: isAnyFetching ? '#f1f5f9' : '#fff',
            cursor: isAnyFetching ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          <RefreshCw size={14} style={{ animation: isAnyFetching ? 'spin 1s linear infinite' : 'none' }} />
          Refetch All 3
        </button>
      </header>

      {/* Grid of 3 Independent Data Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {/* Widget 1: Health */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Cluster Uptime</span>
            <Activity size={16} color="#10b981" />
          </div>
          {healthQuery.isPending ? (
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Fetching uptime (400ms)...</div>
          ) : (
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
                {healthQuery.data?.uptime}%
              </div>
              <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '2px' }}>
                Status: {healthQuery.data?.status}
              </div>
            </div>
          )}
        </div>

        {/* Widget 2: Alerts */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Active Alerts</span>
            <Bell size={16} color="#f59e0b" />
          </div>
          {alertsQuery.isPending ? (
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Fetching alerts (600ms)...</div>
          ) : (
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
                {alertsQuery.data?.length} Active
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                Severity: Minimal
              </div>
            </div>
          )}
        </div>

        {/* Widget 3: Active Users */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Online Engineers</span>
            <Users size={16} color="#6366f1" />
          </div>
          {usersQuery.isPending ? (
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Fetching users (800ms)...</div>
          ) : (
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
                {usersQuery.data?.count}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                Across 4 regions
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ParallelDashboard />
    </QueryClientProvider>
  );
}
`,
      },
      '/api/dashboard.ts': {
        code: `export async function fetchServerHealth() {
  await new Promise((r) => setTimeout(r, 400));
  return { uptime: '99.98', status: 'Healthy' };
}

export async function fetchSystemAlerts() {
  await new Promise((r) => setTimeout(r, 650));
  return [
    { id: 1, message: 'SSL Cert renewal scheduled' },
    { id: 2, message: 'Database backup completed' },
  ];
}

export async function fetchOnlineUsers() {
  await new Promise((r) => setTimeout(r, 850));
  return { count: 1420 };
}
`,
      },
    },
  },
}

