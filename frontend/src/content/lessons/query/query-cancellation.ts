import type { LessonManifest } from '../../types'

export const queryCancellationLesson: LessonManifest = {
  id: 'query-cancellation',
  libraryId: 'query',
  topicId: 'query-cancellation',
  title: 'Query Cancellation: Aborting In-Flight Requests with AbortSignal',
  description: 'Cancel slow or unneeded network requests mid-stream using standard DOM AbortSignal integration.',
  difficulty: 'ADVANCED',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation',
  learningObjectives: [
    'Access the DOM AbortSignal injected into queryFn: ({ signal }) => ....',
    'Forward signal to fetch(url, { signal }) or axios.',
    'Cancel in-flight queries manually via queryClient.cancelQueries().',
    'Observe automatic cancellation when components unmount or keys change before completion.',
  ],
  conceptSections: [
    {
      title: 'Why Cancel In-Flight Requests?',
      content:
        'When a user types rapidly in an autocomplete search or switches tabs before a heavy 4-second report finishes downloading, continuing to process the outdated response wastes network bandwidth and memory. TanStack Query automatically provides a native AbortSignal to every queryFn.',
    },
    {
      title: 'How It Works with fetch()',
      content:
        'Native fetch accepts an AbortSignal via fetch(url, { signal }). If queryClient.cancelQueries() is called or the query unmounts, TanStack Query aborts the signal. The browser immediately closes the TCP socket and throws a DOMException: AbortError, which TanStack Query silences gracefully.',
    },
  ],
  importantApis: [
    {
      name: 'queryFn: ({ signal }) => ...',
      signature: 'queryFn: ({ signal }: QueryFunctionContext) => Promise<TData>',
      description: 'Standard DOM AbortSignal provided automatically by TanStack Query.',
    },
    {
      name: 'queryClient.cancelQueries({ queryKey })',
      signature: 'queryClient.cancelQueries({ queryKey })',
      description: 'Programmatically cancels all in-flight requests matching the key.',
    },
  ],
  previewInstructions: 'Click "Start Heavy Export (4s)". While it is loading, click "Cancel In-Flight Request" and observe the request aborting immediately!',
  expectedResult: 'A request cancellation demonstration showing live progress and instant AbortSignal cancellation.',
  commonMistakes: [
    {
      mistake: 'Forgetting to forward signal to the underlying fetch() call.',
      fix: 'Always pass { signal } to fetch(url, { signal }) so the browser actually terminates the connection.',
    },
  ],
  interviewQuestions: [
    {
      question: 'Does cancelling a query remove it from the cache?',
      answer:
        'No, cancelling a query stops the in-flight network request and reverts the query status back to its previous state (or idle if no previous data existed).',
    },
  ],
  example: {
    id: 'query-cancellation-example',
    title: 'AbortSignal Query Cancellation',
    description: 'Simulate a slow 4-second request and cancel it with queryClient.cancelQueries.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-query': '^5.66.0',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import { Ban, Play, RefreshCw, CheckCircle2, AlertOctagon } from 'lucide-react';
import { executeSlowReportApi } from './api/reports';
import type { ReportResult } from './types/report';

const queryClient = new QueryClient();

function HeavyReportViewer() {
  const qc = useQueryClient();
  const [requestCount, setRequestCount] = useState(0);

  const {
    data,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<ReportResult>({
    queryKey: ['heavy-report', requestCount],
    // Signal is injected automatically into queryFn!
    queryFn: ({ signal }) => executeSlowReportApi(signal),
    enabled: requestCount > 0,
    retry: false,
  });

  const handleStart = () => {
    setRequestCount((c) => c + 1);
  };

  const handleCancel = () => {
    // Abort the active request
    qc.cancelQueries({ queryKey: ['heavy-report'] });
  };

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Ban size={20} color="#ef4444" />
          AbortSignal Query Cancellation
        </h2>
        <span style={{ fontSize: '12px', color: '#64748b' }}>
          Demonstrates client-side aborting of slow 4,000ms network requests
        </span>
      </header>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        <button
          onClick={handleStart}
          disabled={isFetching}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 16px',
            borderRadius: '6px',
            border: 'none',
            background: isFetching ? '#cbd5e1' : '#3b82f6',
            color: '#fff',
            fontWeight: 600,
            fontSize: '13px',
            cursor: isFetching ? 'not-allowed' : 'pointer',
          }}
        >
          <Play size={15} /> Start Heavy Export (4s)
        </button>

        <button
          onClick={handleCancel}
          disabled={!isFetching}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 16px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            background: !isFetching ? '#f8fafc' : '#fee2e2',
            color: !isFetching ? '#94a3b8' : '#991b1b',
            fontWeight: 600,
            fontSize: '13px',
            cursor: !isFetching ? 'not-allowed' : 'pointer',
          }}
        >
          <Ban size={15} /> Cancel In-Flight Request
        </button>
      </div>

      {/* Status Panel */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
        {isFetching && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontSize: '13px' }}>
            <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
            <span>Heavy computation in-flight (Simulated 4,000ms delay)...</span>
          </div>
        )}

        {isError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', fontSize: '13px' }}>
            <AlertOctagon size={18} />
            <span>Request aborted via AbortSignal! ({error.message})</span>
          </div>
        )}

        {data && !isFetching && !isError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontSize: '13px' }}>
            <CheckCircle2 size={18} color="#16a34a" />
            <span>Report generated successfully! Rows: {data.totalRows}</span>
          </div>
        )}

        {requestCount === 0 && (
          <div style={{ color: '#64748b', fontSize: '13px' }}>
            Click "Start Heavy Export" to launch the simulated slow request.
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HeavyReportViewer />
    </QueryClientProvider>
  );
}
`,
      },
      '/api/reports.ts': {
        code: `import type { ReportResult } from '../types/report';

export function executeSlowReportApi(signal?: AbortSignal): Promise<ReportResult> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve({
        id: 'REP_99',
        totalRows: 450000,
        computedInMs: 4000,
      });
    }, 4000);

    // Wire DOM AbortSignal
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new DOMException('The user aborted a request.', 'AbortError'));
      });
    }
  });
}
`,
      },
      '/types/report.ts': {
        code: `export interface ReportResult {
  id: string;
  totalRows: number;
  computedInMs: number;
}
`,
      },
    },
  },
}

