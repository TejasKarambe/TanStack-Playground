import type { LessonManifest } from '../../types'

export const queryOptimisticUpdatesLesson: LessonManifest = {
  id: 'query-optimistic-updates',
  libraryId: 'query',
  topicId: 'query-optimistic-updates',
  title: 'Optimistic UI Updates: Zero-Latency User Interactions',
  description: 'Update the user interface immediately before network confirmation, with automated rollback on server failure.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 25,
  officialDocUrl: 'https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates',
  learningObjectives: [
    'Understand the optimistic update lifecycle: cancelQueries, snapshot, setQueryData, and rollback.',
    'Implement the onMutate callback to cancel in-flight queries and return rollback context.',
    'Safely roll back cache state in the onError handler using previous snapshot data.',
    'Re-synchronize with the server in onSettled using invalidateQueries.',
  ],
  conceptSections: [
    {
      title: 'The Philosophy of Optimistic UI',
      content:
        'In high-quality apps (like liking a post, toggling a checkbox, or reordering an item), waiting 400ms for a roundtrip makes the app feel sluggish. Optimistic updates assume success, immediately updating the cache so the UI responds at 60 FPS.',
    },
    {
      title: 'The 4-Step Optimistic Pattern',
      content:
        '1. onMutate: Cancel outgoing queries with queryClient.cancelQueries() so background fetches do not overwrite optimistic data. 2. Snapshot the current cache state. 3. Optimistically update the cache with queryClient.setQueryData(). 4. Return context containing the snapshot. If an error occurs, onError(err, vars, context) restores the snapshot.',
    },
    {
      title: 'Graceful Error Recovery',
      content:
        'If the server responds with HTTP 500 or network timeout, the user is notified, and the item silently snaps back to its original state. Finally, onSettled invalidates the query to guarantee exact server truth.',
    },
  ],
  importantApis: [
    {
      name: 'queryClient.cancelQueries({ queryKey })',
      signature: 'cancelQueries({ queryKey })',
      description: 'Cancels any active in-flight query refetches to avoid overwriting optimistic data.',
    },
    {
      name: 'queryClient.setQueryData(queryKey, updater)',
      signature: 'setQueryData(key, (oldData) => newData)',
      description: 'Synchronously updates a query cache entry without network calls.',
    },
    {
      name: 'onMutate / onError / onSettled',
      signature: 'onMutate: () => context, onError: (err, newTodo, context) => void',
      description: 'The trinity of hooks managing optimistic cache transactions.',
    },
  ],
  previewInstructions: 'Click the thumbs-up button to like a post. Notice how the like counter and icon update with zero delay! You can also toggle "Simulate Server Failure" to see the counter automatically roll back.',
  expectedResult: 'Instantaneous UI reactions for likes with robust rollback when failures are simulated.',
  commonMistakes: [
    {
      mistake: 'Forgetting to await or return queryClient.cancelQueries() in onMutate.',
      fix: 'Always await queryClient.cancelQueries({ queryKey }) to prevent active background requests from overriding your optimistic data.',
    },
    {
      mistake: 'Failing to return the previous data snapshot from onMutate.',
      fix: 'Return { previousData } from onMutate so onError can access it via the context argument.',
    },
  ],
  interviewQuestions: [
    {
      question: 'Why must you cancel active queries in onMutate before calling setQueryData?',
      answer:
        'If an in-flight background query resolves after you optimistically set data, its outdated response would overwrite your optimistic state before the mutation completes.',
    },
  ],
  example: {
    id: 'query-optimistic-updates-example',
    title: 'Optimistic Post Likes with Rollback',
    description: 'Instant optimistic reaction with rollback toggle to simulate network errors.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-query': '^5.66.0',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPosts, toggleLikeApi } from './api/posts';
import type { Post } from './types/post';
import { Heart, Sparkles, AlertTriangle } from 'lucide-react';

const queryClient = new QueryClient();

function PostFeed() {
  const qc = useQueryClient();
  const [simulateError, setSimulateError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: posts } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const mutation = useMutation({
    mutationFn: (variables: { id: string; shouldFail: boolean }) =>
      toggleLikeApi(variables.id, variables.shouldFail),

    // 1. Optimistic update before request hits network
    onMutate: async ({ id }) => {
      setErrorMessage(null);
      // Cancel refetches so they don't overwrite optimistic value
      await qc.cancelQueries({ queryKey: ['posts'] });

      // Snapshot previous value
      const previousPosts = qc.getQueryData<Post[]>(['posts']);

      // Optimistically update cache
      if (previousPosts) {
        qc.setQueryData<Post[]>(['posts'], (old = []) =>
          old.map((p) =>
            p.id === id
              ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked }
              : p
          )
        );
      }

      // Return context with snapshot for rollback
      return { previousPosts };
    },

    // 2. Rollback if mutation fails
    onError: (err, _variables, context) => {
      setErrorMessage('Server error! Reverting optimistic like.');
      if (context?.previousPosts) {
        qc.setQueryData(['posts'], context.previousPosts);
      }
    },

    // 3. Always refetch after error or success to guarantee sync
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="#ec4899" />
          Community Stream
        </h2>
        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: simulateError ? '#e11d48' : '#64748b' }}>
            <input
              type="checkbox"
              checked={simulateError}
              onChange={(e) => setSimulateError(e.target.checked)}
            />
            Simulate Server Failure (Triggers Rollback)
          </label>
        </div>
      </header>

      {errorMessage && (
        <div style={{ padding: '10px 14px', background: '#ffe4e6', color: '#be123c', borderRadius: '6px', fontSize: '12px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertTriangle size={15} />
          {errorMessage}
        </div>
      )}

      <div style={{ display: 'grid', gap: '12px' }}>
        {posts?.map((post) => (
          <div
            key={post.id}
            style={{
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{post.author}</div>
            <p style={{ fontSize: '13px', color: '#334155', margin: '0 0 12px 0' }}>{post.content}</p>

            <button
              onClick={() => mutation.mutate({ id: post.id, shouldFail: simulateError })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '999px',
                border: '1px solid',
                borderColor: post.isLiked ? '#fda4af' : '#e2e8f0',
                background: post.isLiked ? '#fff1f2' : '#f8fafc',
                color: post.isLiked ? '#e11d48' : '#64748b',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '12px',
                transition: 'all 0.15s ease',
              }}
            >
              <Heart size={15} fill={post.isLiked ? '#e11d48' : 'none'} />
              <span>{post.likes}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PostFeed />
    </QueryClientProvider>
  );
}
`,
      },
      '/api/posts.ts': {
        code: `import type { Post } from '../types/post';

let SERVER_POSTS: Post[] = [
  { id: '1', author: 'Sophie Chen', content: 'TanStack Query optimistic updates give instant feedback to users!', likes: 42, isLiked: false },
  { id: '2', author: 'Marco Silva', content: 'Zero latency UI with automatic rollback is the golden standard.', likes: 19, isLiked: true },
];

export async function fetchPosts(): Promise<Post[]> {
  await new Promise((r) => setTimeout(r, 400));
  return [...SERVER_POSTS];
}

export async function toggleLikeApi(id: string, shouldFail: boolean): Promise<Post> {
  await new Promise((r) => setTimeout(r, 600));

  if (shouldFail) {
    throw new Error('500 Internal Server Error: Database write timed out');
  }

  const post = SERVER_POSTS.find((p) => p.id === id);
  if (!post) throw new Error('Post not found');

  post.isLiked = !post.isLiked;
  post.likes += post.isLiked ? 1 : -1;
  return { ...post };
}
`,
      },
      '/types/post.ts': {
        code: `export interface Post {
  id: string;
  author: string;
  content: string;
  likes: number;
  isLiked: boolean;
}
`,
      },
    },
  },
}

