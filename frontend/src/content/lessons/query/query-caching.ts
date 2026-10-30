import type { LessonManifest } from '../../types'

export const queryCachingLesson: LessonManifest = {
  id: 'query-query-caching',
  libraryId: 'query',
  topicId: 'query-caching',
  title: 'Query Caching: Instant Cache Hits & In-Memory Hydration',
  description: 'Navigate away and return to see instantaneous cache hydration without re-triggering loading spinners.',
  difficulty: 'BEGINNER',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/query/latest/docs/framework/react/guides/caching',
  learningObjectives: [
    'Observe how TanStack Query stores query responses in an in-memory global cache.',
    'Switch between views to experience zero-latency cache hits.',
    'Understand the visual difference between initial loading (isPending) and cached rendering.',
    'Inspect cache timestamps and cache hit counters.',
  ],
  conceptSections: [
    {
      title: 'Stale-While-Revalidate Caching',
      content:
        'When you navigate to a page for the first time, TanStack Query executes the queryFn and displays a loading state. When you leave the page and return later, TanStack Query immediately hydrates the screen with the cached data from memory. If the data is stale, it initiates a quiet background refetch without flickering or unmounting the UI.',
    },
    {
      title: 'Cache Lifetimes',
      content:
        'Even if a component unmounts completely, the QueryClient retains its cache entry. Only when a query has no active subscribers for longer than gcTime (garbage collection time) is it permanently evicted.',
    },
  ],
  importantApis: [
    {
      name: 'queryClient.getQueryData(queryKey)',
      signature: 'queryClient.getQueryData(key): TData | undefined',
      description: 'Synchronously reads data from the cache without subscribing or triggering fetches.',
    },
    {
      name: 'queryClient.getQueryState(queryKey)',
      signature: 'queryClient.getQueryState(key): QueryState',
      description: 'Inspects status, dataUpdatedAt, and fetchFailureCount of a cache entry.',
    },
  ],
  previewInstructions: 'Click on the "Analytics" tab, then switch back to the "Team Directory" tab. Notice how the directory renders immediately from cache with 0ms delay!',
  expectedResult: 'Instant cache hydration when switching between navigation views with real-time cache statistics.',
  commonMistakes: [
    {
      mistake: 'Re-instantiating new QueryClient() inside a component render loop.',
      fix: 'Always maintain a single persistent QueryClient instance outside component renders or via React useState.',
    },
  ],
  interviewQuestions: [
    {
      question: 'What happens when a component unmounts while a query is still in the cache?',
      answer:
        'The query transitions to the "inactive" state. The gcTime timer begins counting down. If the component mounts again before gcTime expires, the cached data is instantly reused.',
    },
  ],
  example: {
    id: 'query-caching-example',
    title: 'Instant Cache Hits on View Navigation',
    description: 'Switch between views to see instant in-memory cache recovery.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-query': '^5.66.0',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import { Database, Users, BarChart3, Clock, Check, ArrowRightLeft } from 'lucide-react';

const queryClient = new QueryClient();

// Simulated API with 700ms latency
async function fetchTeamData() {
  await new Promise((r) => setTimeout(r, 700));
  return [
    { id: 1, name: 'Alice Walker', role: 'Staff Engineer', points: 480 },
    { id: 2, name: 'Bob Henderson', role: 'Frontend Lead', points: 395 },
    { id: 3, name: 'Claire Zhao', role: 'Systems Architect', points: 512 },
  ];
}

function TeamView() {
  const { data, isPending, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ['team-members'],
    queryFn: fetchTeamData,
    staleTime: 30000, // 30s fresh window
  });

  if (isPending) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
        <p>⚡ Performing cold network request (700ms)...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '8px' }}>
      <div style={{ fontSize: '11px', color: '#16a34a', background: '#dcfce7', padding: '6px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Check size={14} />
        Rendered from in-memory cache! Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
      </div>

      {data?.map((m) => (
        <div key={m.id} style={{ padding: '12px 14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <strong>{m.name}</strong>
            <div style={{ fontSize: '11px', color: '#64748b' }}>{m.role}</div>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#3b82f6' }}>{m.points} pts</span>
        </div>
      ))}
    </div>
  );
}

function AnalyticsView() {
  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <h3 style={{ margin: '0 0 8px', fontSize: '14px' }}>System Metrics</h3>
      <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
        While you view this tab, the Team Directory component is unmounted from the DOM. However, TanStack Query preserves its cache entry in memory. When you navigate back, it will render with 0ms delay!
      </p>
    </div>
  );
}

function CachingDemo() {
  const [activeTab, setActiveTab] = useState<'team' | 'analytics'>('team');
  const qc = useQueryClient();

  const cacheState = qc.getQueryState(['team-members']);

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={20} color="#3b82f6" />
          Query Caching & Navigation
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
          Observe instant cache hydration when returning to previously visited views.
        </p>
      </header>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
        <button
          onClick={() => setActiveTab('team')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 600,
            border: '1px solid',
            borderColor: activeTab === 'team' ? '#3b82f6' : '#cbd5e1',
            background: activeTab === 'team' ? '#eff6ff' : '#fff',
            color: activeTab === 'team' ? '#1d4ed8' : '#475569',
            cursor: 'pointer',
          }}
        >
          <Users size={15} /> Team Directory
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 600,
            border: '1px solid',
            borderColor: activeTab === 'analytics' ? '#3b82f6' : '#cbd5e1',
            background: activeTab === 'analytics' ? '#eff6ff' : '#fff',
            color: activeTab === 'analytics' ? '#1d4ed8' : '#475569',
            cursor: 'pointer',
          }}
        >
          <BarChart3 size={15} /> System Analytics
        </button>
      </div>

      {/* Cache Inspection Box */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px 14px', marginBottom: '1.25rem', fontSize: '11px', color: '#64748b' }}>
        <strong>Global Cache Inspector:</strong> ['team-members'] status:{' '}
        <span style={{ color: '#16a34a', fontWeight: 600 }}>{cacheState?.status ?? 'Not in cache yet'}</span> •{' '}
        Subscribers: {cacheState?.data ? 'Cached in Memory' : 'Empty'}
      </div>

      {activeTab === 'team' ? <TeamView /> : <AnalyticsView />}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CachingDemo />
    </QueryClientProvider>
  );
}
`,
      },
    },
  },
}

