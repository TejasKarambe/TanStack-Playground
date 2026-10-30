import type { LessonManifest } from '../../types'

export const queryPaginationLesson: LessonManifest = {
  id: 'query-pagination',
  libraryId: 'query',
  topicId: 'query-pagination',
  title: 'Pagination: Server-Side Page Slicing & keepPreviousData',
  description: 'Navigate server-paginated endpoints smoothly using query keys and placeholderData: keepPreviousData.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 25,
  officialDocUrl: 'https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries',
  learningObjectives: [
    'Include the page index in queryKey: ["items", { page, pageSize }].',
    'Use placeholderData: keepPreviousData to maintain previous screen data while fetching next pages.',
    'Implement boundary guards for disabled previous/next buttons.',
    'Prefetch subsequent pages for instant next-page transitions.',
  ],
  conceptSections: [
    {
      title: 'The Pagination Flashing Problem',
      content:
        'When moving from Page 1 to Page 2 without keepPreviousData, useQuery treats Page 2 as a new, uncached query, temporarily flashing an empty loading state. In TanStack Query v5, importing keepPreviousData and passing placeholderData: keepPreviousData keeps Page 1 on screen while Page 2 fetches in the background.',
    },
    {
      title: 'Server-Side Contract',
      content:
        'A real-world paginated API accepts page and pageSize query parameters and returns an envelope: { items, total, totalPages, page }. Your frontend computes whether more pages exist from totalPages.',
    },
  ],
  importantApis: [
    {
      name: 'placeholderData: keepPreviousData',
      signature: 'import { keepPreviousData } from "@tanstack/react-query";\nplaceholderData: keepPreviousData',
      description: 'Preserves the previous query result while the next page is in-flight.',
    },
    {
      name: 'isPlaceholderData',
      signature: 'isPlaceholderData: boolean',
      description: 'True when the displayed data is placeholder/previous data and not the final response.',
    },
  ],
  previewInstructions: 'Click "Next Page" to navigate through items. Notice how the current page content remains visible until the next page arrives, completely eliminating UI flicker!',
  expectedResult: 'A seamless paginated transaction table with smooth transitions and disabled boundary controls.',
  commonMistakes: [
    {
      mistake: 'Using keepPreviousData: true (the v4 syntax).',
      fix: 'In v5, import keepPreviousData from @tanstack/react-query and supply placeholderData: keepPreviousData.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How do you prefetch the next page before the user clicks "Next"?',
      answer:
        'Use queryClient.prefetchQuery({ queryKey: ["items", page + 1], queryFn: () => fetchItems(page + 1) }) in an effect or mouseover handler.',
    },
  ],
  example: {
    id: 'query-pagination-example',
    title: 'Server Pagination with keepPreviousData',
    description: 'Paginate remote API data without loading flickers using placeholderData.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-query': '^5.66.0',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  keepPreviousData,
} from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Database, Loader2, ArrowUpDown } from 'lucide-react';
import { fetchPaginatedTransactions } from './api/transactions';
import type { TransactionPage } from './types/transaction';

const queryClient = new QueryClient();

function TransactionsTable() {
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const {
    data,
    isPending,
    isFetching,
    isPlaceholderData,
  } = useQuery<TransactionPage>({
    queryKey: ['transactions', { page, pageSize }],
    queryFn: () => fetchPaginatedTransactions(page, pageSize),
    placeholderData: keepPreviousData, // v5 smooth pagination
  });

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={20} color="#3b82f6" />
            Financial Ledger
          </h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {isFetching ? '⚡ Fetching server page...' : '✓ In sync with server'}
          </span>
        </div>

        <div style={{ fontSize: '12px', color: '#475569' }}>
          Total records: <strong>{data?.total ?? 0}</strong>
        </div>
      </header>

      {/* Table Container */}
      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '1rem',
          opacity: isPlaceholderData ? 0.6 : 1, // Subtle indicator of background fetch
          transition: 'opacity 0.15s ease',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '10px 14px', fontWeight: 600, color: '#334155' }}>Tx ID</th>
              <th style={{ padding: '10px 14px', fontWeight: 600, color: '#334155' }}>Customer</th>
              <th style={{ padding: '10px 14px', fontWeight: 600, color: '#334155' }}>Amount</th>
              <th style={{ padding: '10px 14px', fontWeight: 600, color: '#334155' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((tx) => (
              <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: '11px', color: '#64748b' }}>
                  {tx.id}
                </td>
                <td style={{ padding: '10px 14px', fontWeight: 500 }}>{tx.customer}</td>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}>
                  \${tx.amount.toFixed(2)}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: tx.status === 'COMPLETED' ? '#dcfce7' : '#fef3c7',
                      color: tx.status === 'COMPLETED' ? '#166534' : '#b45309',
                    }}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
        <span style={{ color: '#64748b' }}>
          Page <strong>{page}</strong> of <strong>{data?.totalPages ?? 1}</strong>
        </span>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1 || isFetching}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#fff',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              opacity: page === 1 ? 0.5 : 1,
              fontSize: '12px',
            }}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <button
            onClick={() => {
              if (!isPlaceholderData && data && page < data.totalPages) {
                setPage((old) => old + 1);
              }
            }}
            disabled={isPlaceholderData || !data || page >= data.totalPages}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#fff',
              cursor: page >= (data?.totalPages ?? 1) ? 'not-allowed' : 'pointer',
              opacity: page >= (data?.totalPages ?? 1) ? 0.5 : 1,
              fontSize: '12px',
            }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TransactionsTable />
    </QueryClientProvider>
  );
}
`,
      },
      '/api/transactions.ts': {
        code: `import type { TransactionPage } from '../types/transaction';

const ALL_TRANSACTIONS = Array.from({ length: 16 }, (_, i) => ({
  id: 'TX_' + (1000 + i),
  customer: ['Stripe Inc.', 'Shopify', 'Vercel', 'Linear', 'Supabase', 'Neon', 'Resend', 'OpenAI'][i % 8],
  amount: 250 + (i * 85),
  status: (i % 3 === 0 ? 'PENDING' : 'COMPLETED') as 'PENDING' | 'COMPLETED',
}));

export async function fetchPaginatedTransactions(page: number, pageSize: number): Promise<TransactionPage> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 450));

  const total = ALL_TRANSACTIONS.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const items = ALL_TRANSACTIONS.slice(start, start + pageSize);

  return { items, total, page, totalPages };
}
`,
      },
      '/types/transaction.ts': {
        code: `export interface Transaction {
  id: string;
  customer: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED';
}

export interface TransactionPage {
  items: Transaction[];
  total: number;
  page: number;
  totalPages: number;
}
`,
      },
    },
  },
}

