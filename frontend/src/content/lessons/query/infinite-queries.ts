import type { LessonManifest } from '../../types'

export const queryInfiniteQueriesLesson: LessonManifest = {
  id: 'query-infinite-queries',
  libraryId: 'query',
  topicId: 'query-infinite-scroll',
  title: 'Infinite Queries: Cursor Pagination & Infinite Scrolling',
  description: 'Construct continuous data streams and "Load More" feeds with useInfiniteQuery and cursor calculations.',
  difficulty: 'ADVANCED',
  estimatedMinutes: 25,
  officialDocUrl: 'https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries',
  learningObjectives: [
    'Initialize useInfiniteQuery with initialPageParam and getNextPageParam.',
    'Render multi-page array pages using data.pages.flatMap().',
    'Trigger subsequent chunks via fetchNextPage() and track isFetchingNextPage.',
    'Disable pagination buttons when hasNextPage is false.',
  ],
  conceptSections: [
    {
      title: 'How Infinite Queries Differ from Standard Queries',
      content:
        'Standard useQuery replaces old data when the page changes. useInfiniteQuery appends each newly fetched page into an array of pages: { pages: [Page1, Page2, ...], pageParams: [1, 2, ...] }. This allows building continuous scrolling feeds like Twitter, GitHub commits, or product catalogs.',
    },
    {
      title: 'getNextPageParam and v5 Changes',
      content:
        'In TanStack Query v5, initialPageParam is a mandatory property. getNextPageParam receives (lastPage, allPages, lastPageParam, allPageParams) and returns the cursor for the next fetch or undefined when there are no more pages.',
    },
  ],
  importantApis: [
    {
      name: 'useInfiniteQuery(options)',
      signature: 'useInfiniteQuery({ queryKey, queryFn, initialPageParam, getNextPageParam })',
      description: 'Primary hook for cursor-based and infinite list fetching.',
    },
    {
      name: 'fetchNextPage()',
      signature: 'fetchNextPage(): Promise<InfiniteQueryObserverResult>',
      description: 'Fetches the next batch using the cursor returned by getNextPageParam.',
    },
    {
      name: 'hasNextPage',
      signature: 'hasNextPage: boolean',
      description: 'True as long as getNextPageParam returns a valid page cursor.',
    },
  ],
  previewInstructions: 'Click "Load More Activities" to append additional activity events to the continuous list. Watch the page counter and cursor advance.',
  expectedResult: 'A seamless infinite activity stream with animated append states and disabled load-more button once all pages are consumed.',
  commonMistakes: [
    {
      mistake: 'Omitting initialPageParam in TanStack Query v5.',
      fix: 'In v5, initialPageParam (e.g. 1 or null) is strictly required on useInfiniteQuery.',
    },
  ],
  interviewQuestions: [
    {
      question: 'What is the structure of data returned by useInfiniteQuery?',
      answer:
        'It returns an object containing pages (array of each page response) and pageParams (array of cursors used for each page request).',
    },
  ],
  example: {
    id: 'query-infinite-queries-example',
    title: 'useInfiniteQuery Activity Feed',
    description: 'Fetch sequential pages with getNextPageParam and append to a live stream.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-query': '^5.66.0',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { GitCommit, Loader2, ArrowDownCircle, CheckCircle2 } from 'lucide-react';
import { fetchActivityChunk } from './api/activities';
import type { ActivityPage } from './types/activity';

const queryClient = new QueryClient();

function ActivityFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery<ActivityPage>({
    queryKey: ['github-activities'],
    queryFn: ({ pageParam = 1 }) => fetchActivityChunk(Number(pageParam)),
    initialPageParam: 1, // Mandatory in v5
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const allActivities = data?.pages.flatMap((page) => page.items) ?? [];

  if (isPending) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
        <p>Loading initial activity chunk...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GitCommit size={20} color="#10b981" />
          Repository Activity Stream
        </h2>
        <span style={{ fontSize: '12px', color: '#64748b' }}>
          Rendered <strong>{allActivities.length}</strong> events across {data?.pages.length} page(s)
        </span>
      </header>

      {/* Activities Timeline */}
      <div style={{ display: 'grid', gap: '8px', marginBottom: '1.5rem' }}>
        {allActivities.map((act) => (
          <div
            key={act.id}
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
              <div style={{ fontWeight: 600, fontSize: '13px' }}>{act.message}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                by <strong>{act.author}</strong> in <code>{act.branch}</code>
              </div>
            </div>
            <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#94a3b8' }}>
              #{act.hash}
            </span>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div style={{ textAlign: 'center' }}>
        {hasNextPage ? (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: isFetchingNextPage ? '#f1f5f9' : '#fff',
              fontWeight: 600,
              fontSize: '13px',
              cursor: isFetchingNextPage ? 'not-allowed' : 'pointer',
            }}
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Fetching Page {((data?.pages.length ?? 0) + 1)}...
              </>
            ) : (
              <>
                <ArrowDownCircle size={16} color="#10b981" />
                Load More Activities (Page {((data?.pages.length ?? 0) + 1)})
              </>
            )}
          </button>
        ) : (
          <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <CheckCircle2 size={15} color="#10b981" />
            All repository events have been loaded.
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ActivityFeed />
    </QueryClientProvider>
  );
}
`,
      },
      '/api/activities.ts': {
        code: `import type { ActivityPage } from '../types/activity';

const TOTAL_PAGES = 3;

export async function fetchActivityChunk(page: number): Promise<ActivityPage> {
  await new Promise((r) => setTimeout(r, 600));

  const items = Array.from({ length: 3 }, (_, i) => {
    const idx = (page - 1) * 3 + (i + 1);
    return {
      id: String(idx),
      message: \`Commit #\${idx}: Update query caching and hydration\`,
      author: ['tannerlinsley', 'tkdodo', 'kevinvancott'][i % 3],
      branch: 'main',
      hash: Math.random().toString(16).substring(2, 9),
    };
  });

  return {
    items,
    nextCursor: page < TOTAL_PAGES ? page + 1 : undefined,
  };
}
`,
      },
      '/types/activity.ts': {
        code: `export interface ActivityItem {
  id: string;
  message: string;
  author: string;
  branch: string;
  hash: string;
}

export interface ActivityPage {
  items: ActivityItem[];
  nextCursor?: number;
}
`,
      },
    },
  },
}

