import type { LessonManifest } from '../../types'

export const queryStaleTimeLesson: LessonManifest = {
  id: 'query-stale-time',
  libraryId: 'query',
  topicId: 'query-stale-time',
  title: 'Stale Time & Garbage Collection: Controlling Cache Lifecycles',
  description: 'Tune staleTime and gcTime with live countdowns and unmount-garbage collection simulations.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/query/latest/docs/framework/react/guides/caching',
  learningObjectives: [
    'Master the critical difference between staleTime and gcTime (formerly cacheTime in v4).',
    'Tune staleTime dynamically to prevent unnecessary network refetches.',
    'Observe the garbage collection timer purge unmounted queries from memory.',
    'Toggle refetchOnWindowFocus to observe real-time window refocus polling.',
  ],
  conceptSections: [
    {
      title: 'staleTime: How Long Data Stays Fresh',
      content:
        'staleTime is the duration (in milliseconds) data remains "fresh". Fresh data is NEVER refetched automatically on window focus, component mount, or network reconnect. Once staleTime passes, data becomes "stale" — it will still be displayed immediately from cache, but a background refetch will occur when triggered.',
    },
    {
      title: 'gcTime: Garbage Collection Lifetime',
      content:
        'gcTime (defaults to 5 minutes) begins counting down the moment a query has ZERO active subscribers (e.g. all components consuming it have unmounted). If no component mounts the query before gcTime elapses, the cached record is completely evicted from memory to prevent memory leaks.',
    },
  ],
  importantApis: [
    {
      name: 'staleTime',
      signature: 'staleTime: number | Infinity',
      description: 'Milliseconds before cached data is considered stale. Default: 0.',
    },
    {
      name: 'gcTime',
      signature: 'gcTime: number | Infinity',
      description: 'Milliseconds an inactive query stays in memory before garbage collection. Default: 300,000 (5 min).',
    },
    {
      name: 'refetchOnWindowFocus',
      signature: 'refetchOnWindowFocus: boolean | "always"',
      description: 'Triggers background refetching when browser window regains focus if data is stale.',
    },
  ],
  previewInstructions: 'Adjust the "Stale Time" slider to 10 seconds. Click "Unmount Component" and watch the Garbage Collection countdown begin in real time!',
  expectedResult: 'A visual control dashboard displaying live freshness badges and garbage collection timers.',
  commonMistakes: [
    {
      mistake: 'Setting gcTime smaller than staleTime.',
      fix: 'gcTime must always be equal to or greater than staleTime, otherwise data will be evicted while still considered fresh.',
    },
  ],
  interviewQuestions: [
    {
      question: 'Why did TanStack Query rename cacheTime to gcTime in v5?',
      answer:
        'To clarify that it represents Garbage Collection time. Developers previously confused cacheTime with how long data was considered fresh (which is actually staleTime).',
    },
  ],
  example: {
    id: 'query-stale-time-example',
    title: 'Interactive staleTime & gcTime Simulator',
    description: 'Tune freshness duration, trigger garbage collection, and inspect cache state.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-query': '^5.66.0',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import { Clock, Trash2, Eye, EyeOff, Sliders, RefreshCw, Zap } from 'lucide-react';

const queryClient = new QueryClient();

async function fetchCryptoPrice() {
  await new Promise((r) => setTimeout(r, 500));
  return {
    symbol: 'BTC/USD',
    price: (96000 + Math.random() * 500).toFixed(2),
    timestamp: new Date().toLocaleTimeString(),
  };
}

function PriceCard({ staleTimeMs, gcTimeMs, refetchOnFocus }: { staleTimeMs: number; gcTimeMs: number; refetchOnFocus: boolean }) {
  const { data, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ['crypto-price'],
    queryFn: fetchCryptoPrice,
    staleTime: staleTimeMs,
    gcTime: gcTimeMs,
    refetchOnWindowFocus: refetchOnFocus,
  });

  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (dataUpdatedAt) {
        setSecondsSinceUpdate(Math.floor((Date.now() - dataUpdatedAt) / 1000));
      }
    }, 500);
    return () => clearInterval(timer);
  }, [dataUpdatedAt]);

  const isFresh = secondsSinceUpdate * 1000 < staleTimeMs;

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <strong style={{ fontSize: '14px' }}>{data?.symbol}</strong>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '999px',
            background: isFresh ? '#dcfce7' : '#fef3c7',
            color: isFresh ? '#166534' : '#b45309',
          }}
        >
          {isFresh ? '✓ Fresh' : '⚡ Stale (Will refetch on trigger)'}
        </span>
      </div>

      <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
        \${data?.price}
      </div>

      <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', gap: '8px' }}>
        <span>Age: {secondsSinceUpdate}s</span>
        <span>•</span>
        <span>staleTime: {staleTimeMs / 1000}s</span>
        <span>•</span>
        <span>Status: {isFetching ? 'Refetching...' : 'Idle'}</span>
      </div>
    </div>
  );
}

function StaleTimeDemo() {
  const [staleTimeSec, setStaleTimeSec] = useState(5);
  const [gcTimeSec, setGcTimeSec] = useState(15);
  const [refetchOnFocus, setRefetchOnFocus] = useState(true);
  const [isMounted, setIsMounted] = useState(true);

  const qc = useQueryClient();
  const queryState = qc.getQueryState(['crypto-price']);

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={20} color="#8b5cf6" />
          staleTime & Garbage Collection
        </h2>
      </header>

      {/* Control Box */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sliders size={14} color="#8b5cf6" />
          Adjustable Cache Tuning
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', fontSize: '12px' }}>
          <div>
            <label style={{ display: 'block', color: '#475569', marginBottom: '4px' }}>
              staleTime: <strong>{staleTimeSec} seconds</strong>
            </label>
            <input
              type="range"
              min={0}
              max={20}
              value={staleTimeSec}
              onChange={(e) => setStaleTimeSec(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#475569', marginBottom: '4px' }}>
              gcTime (Unmounted retention): <strong>{gcTimeSec} seconds</strong>
            </label>
            <input
              type="range"
              min={5}
              max={30}
              value={gcTimeSec}
              onChange={(e) => setGcTimeSec(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={refetchOnFocus}
                onChange={(e) => setRefetchOnFocus(e.target.checked)}
              />
              Refetch on Window Focus
            </label>
          </div>
        </div>
      </div>

      {/* Mount Toggle Button */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setIsMounted(!isMounted)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            background: isMounted ? '#fee2e2' : '#ecfdf5',
            color: isMounted ? '#991b1b' : '#065f46',
            fontWeight: 600,
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          {isMounted ? <EyeOff size={14} /> : <Eye size={14} />}
          {isMounted ? 'Unmount Component (Starts gcTime timer)' : 'Mount Component'}
        </button>
      </div>

      {/* Component or Unmounted Notice */}
      {isMounted ? (
        <PriceCard
          staleTimeMs={staleTimeSec * 1000}
          gcTimeMs={gcTimeSec * 1000}
          refetchOnFocus={refetchOnFocus}
        />
      ) : (
        <div style={{ padding: '24px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#64748b' }}>
            Component unmounted! Subscribers = 0.
          </p>
          <div style={{ fontSize: '11px', color: '#b45309' }}>
            gcTime timer active: Data will be permanently evicted in {gcTimeSec}s if not remounted.
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StaleTimeDemo />
    </QueryClientProvider>
  );
}
`,
      },
    },
  },
}

