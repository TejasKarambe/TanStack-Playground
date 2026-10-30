import type { LessonManifest } from '../../types'

export const queryBasicQueryLesson: LessonManifest = {
  id: 'query-basic-query',
  libraryId: 'query',
  topicId: 'query-basics',
  title: 'Basic Query: Fetching, Lifecycle States & Error Handling',
  description: 'Master useQuery to fetch, cache, and handle loading, error, and success states with interactive controls.',
  difficulty: 'BEGINNER',
  estimatedMinutes: 15,
  officialDocUrl: 'https://tanstack.com/query/latest/docs/framework/react/guides/queries',
  learningObjectives: [
    'Define strongly-typed queries using useQuery and unique query keys.',
    'Handle lifecycle states: isPending, isError, isFetching, and success data.',
    'Understand request deduplication and background cache synchronization.',
    'Configure interactive controls: artificial network delay, error simulation, and retry attempts.',
  ],
  conceptSections: [
    {
      title: 'The Asynchronous State Dilemma',
      content:
        'Traditional React applications rely on useEffect and useState to manage network requests. This approach suffers from race conditions, missing cache layers, repetitive loading state flags, and lacks background synchronization. TanStack Query replaces manual imperative fetching with declarative query subscriptions.',
    },
    {
      title: 'Lifecycle States in v5',
      content:
        'useQuery provides explicit status booleans: isPending (no cached data yet and initial fetch is running), isFetching (any request is in-flight, including background refetches), isError (request failed and all retries exhausted), and isSuccess (data is available).',
    },
    {
      title: 'Configurable Retry Logic',
      content:
        'When a queryFn throws an error, TanStack Query automatically retries the request with exponential backoff before transitioning into isError state. You can configure retry: 3 or disable retries with retry: 0.',
    },
  ],
  importantApis: [
    {
      name: 'useQuery(options)',
      signature: 'useQuery({ queryKey, queryFn, retry?, retryDelay? })',
      description: 'Primary React hook for subscribing to cached server state.',
    },
    {
      name: 'isPending vs isFetching',
      signature: 'isPending: boolean, isFetching: boolean',
      description: 'isPending indicates no initial data; isFetching indicates network in-flight.',
    },
    {
      name: 'retry',
      signature: 'retry: number | boolean | ((failureCount, error) => boolean)',
      description: 'Number of automatic retry attempts before reporting failure.',
    },
  ],
  previewInstructions: 'Use the interactive learning controls to increase network delay or toggle "Simulate Server Failure" to test the error state and retry mechanism.',
  expectedResult: 'A reactive user directory with live indicators for loading, background fetching, and simulated HTTP 500 error handling.',
  commonMistakes: [
    {
      mistake: 'Assuming fetch() throws on HTTP 404 or 500 responses.',
      fix: 'fetch only rejects on network loss. In your queryFn, check if (!res.ok) throw new Error(...) to trigger TanStack Query error handling.',
    },
  ],
  interviewQuestions: [
    {
      question: 'What is the distinction between isPending and isFetching in TanStack Query v5?',
      answer:
        'isPending is true only when there is no cached data and the first request is running. isFetching is true whenever any network request is in-flight, including background refetches when cached data is already displayed.',
    },
  ],
  example: {
    id: 'query-basic-query-example',
    title: 'useQuery with Interactive Simulation Controls',
    description: 'Adjust latency, simulate server failures, change retry counts, and observe lifecycle states.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-query': '^5.66.0',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { fetchUsers } from './api/users';
import type { User } from './types/user';
import { RefreshCw, Users, AlertCircle, Sliders, CheckCircle2 } from 'lucide-react';

const queryClient = new QueryClient();

function UserDirectory() {
  // Real interactive learning controls
  const [delayMs, setDelayMs] = useState(800);
  const [simulateError, setSimulateError] = useState(false);
  const [retryCount, setRetryCount] = useState(1);

  const {
    data: users,
    isPending,
    isFetching,
    isError,
    error,
    failureCount,
    refetch,
  } = useQuery<User[]>({
    queryKey: ['users', { simulateError, delayMs }],
    queryFn: () => fetchUsers(delayMs, simulateError),
    retry: retryCount,
    retryDelay: 400,
  });

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      {/* Learning Controls Panel */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
          <Sliders size={14} color="#3b82f6" />
          Interactive Learning Controls (Actually alters query behavior)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontSize: '12px' }}>
          {/* Latency Control */}
          <div>
            <label style={{ display: 'block', color: '#64748b', marginBottom: '2px' }}>
              Simulated Delay: <strong>{delayMs}ms</strong>
            </label>
            <input
              type="range"
              min={100}
              max={2500}
              step={100}
              value={delayMs}
              onChange={(e) => setDelayMs(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          {/* Retry Count */}
          <div>
            <label style={{ display: 'block', color: '#64748b', marginBottom: '2px' }}>
              Retry Attempts: <strong>{retryCount}</strong>
            </label>
            <select
              value={retryCount}
              onChange={(e) => setRetryCount(Number(e.target.value))}
              style={{ width: '100%', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
            >
              <option value={0}>0 (Fail immediately)</option>
              <option value={1}>1 Retry</option>
              <option value={3}>3 Retries (Default)</option>
            </select>
          </div>

          {/* Error Simulation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: simulateError ? '#ef4444' : '#475569', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={simulateError}
                onChange={(e) => setSimulateError(e.target.checked)}
              />
              Simulate HTTP 500 Failure
            </label>
          </div>
        </div>
      </div>

      {/* Header & Status Indicator */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="#3b82f6" />
            Engineering Team
          </h2>
          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b', marginTop: '4px' }}>
            isPending: <span style={{ color: isPending ? '#f59e0b' : '#10b981' }}>{String(isPending)}</span> •{' '}
            isFetching: <span style={{ color: isFetching ? '#3b82f6' : '#64748b' }}>{String(isFetching)}</span> •{' '}
            Retries: {failureCount}
          </div>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            background: isFetching ? '#f1f5f9' : '#fff',
            cursor: isFetching ? 'not-allowed' : 'pointer',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          <RefreshCw size={14} style={{ animation: isFetching ? 'spin 1s linear infinite' : 'none' }} />
          Refetch
        </button>
      </header>

      {/* Loading State */}
      {isPending && (
        <div style={{ padding: '2.5rem', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
          <RefreshCw size={24} color="#3b82f6" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Loading initial dataset ({delayMs}ms delay)...
          </p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div style={{ padding: '16px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#991b1b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
            <AlertCircle size={18} />
            Error State Encountered
          </div>
          <p style={{ margin: '0 0 8px', fontSize: '12px' }}>
            {error.message} (Tried {failureCount} times)
          </p>
          <button
            onClick={() => {
              setSimulateError(false);
              refetch();
            }}
            style={{ padding: '4px 10px', borderRadius: '4px', border: 'none', background: '#991b1b', color: '#fff', fontSize: '11px', cursor: 'pointer' }}
          >
            Turn Off Error Simulation & Retry
          </button>
        </div>
      )}

      {/* Success State */}
      {users && !isPending && !isError && (
        <div style={{ display: 'grid', gap: '8px' }}>
          {users.map((user) => (
            <div
              key={user.id}
              style={{
                padding: '12px 14px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong style={{ fontSize: '13px', color: '#0f172a' }}>{user.name}</strong>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{user.role} • {user.email}</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: '#dcfce7', color: '#166534' }}>
                {user.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserDirectory />
    </QueryClientProvider>
  );
}
`,
      },
      '/api/users.ts': {
        code: `import type { User } from '../types/user';

export async function fetchUsers(delayMs: number, shouldFail: boolean): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  if (shouldFail) {
    throw new Error('500 Internal Server Error: Database pool exhausted');
  }

  return [
    { id: '1', name: 'Tanner Linsley', role: 'Creator & Lead', email: 'tanner@tanstack.com', status: 'Active' },
    { id: '2', name: 'Dominik Dorfmeister', role: 'Query Maintainer (TkDodo)', email: 'dominik@tanstack.com', status: 'Active' },
    { id: '3', name: 'Kevin Van Cott', role: 'Table Lead', email: 'kevin@tanstack.com', status: 'Active' },
    { id: '4', name: 'Jack Herrington', role: 'Educator & Contributor', email: 'jack@tanstack.com', status: 'Active' },
  ];
}
`,
      },
      '/types/user.ts': {
        code: `export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  status: string;
}
`,
      },
    },
  },
}
