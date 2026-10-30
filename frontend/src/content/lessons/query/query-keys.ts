import type { LessonManifest } from '../../types'

export const queryKeysLesson: LessonManifest = {
  id: 'query-query-keys',
  libraryId: 'query',
  topicId: 'query-keys',
  title: 'Query Keys: Hierarchical Scoping & Dynamic Parameters',
  description: 'Master hierarchical query keys, dependency array synchronization, and query key factory patterns.',
  difficulty: 'BEGINNER',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/query/latest/docs/framework/react/guides/query-keys',
  learningObjectives: [
    'Construct hierarchical query keys (e.g. ["todos", "list", { status }]).',
    'Understand how TanStack Query automatically refetches when key dependencies change.',
    'Implement the Query Key Factory design pattern for enterprise scale.',
    'Avoid object key ordering bugs with deterministic serialization.',
  ],
  conceptSections: [
    {
      title: 'Query Keys are Dependencies',
      content:
        'Just like useEffect dependency arrays, query keys act as reactive dependencies. Whenever any variable passed inside the queryKey array changes (such as a search query, tab filter, or page index), useQuery automatically initiates a new request with the updated key.',
    },
    {
      title: 'Deterministic Key Serialization',
      content:
        'TanStack Query uses deterministic JSON hashing for objects inside query keys. For instance, ["todos", { status: "active", page: 1 }] is treated as identical to ["todos", { page: 1, status: "active" }]. You do not need to worry about key order inside nested objects.',
    },
    {
      title: 'The Query Key Factory Pattern',
      content:
        'In enterprise codebases, hardcoding inline key arrays invites typos and mismatched invalidations. A query key factory centralizes all key structures into typed objects, ensuring consistency across queries and mutations.',
    },
  ],
  importantApis: [
    {
      name: 'queryKey',
      signature: 'readonly unknown[]',
      description: 'The dependency array passed to useQuery that drives caching and invalidation.',
    },
    {
      name: 'queryClient.invalidateQueries({ queryKey })',
      signature: 'invalidateQueries({ queryKey: ["todos"] })',
      description: 'Prefix matching invalidation that invalidates all sub-keys hierarchically.',
    },
  ],
  previewInstructions: 'Toggle between the "All", "Active", and "Completed" filters. Notice how switching between filters instantly renders cached data without repeat network calls!',
  expectedResult: 'Dynamic task list that filters smoothly with instant cache hits on revisited filter tabs.',
  commonMistakes: [
    {
      mistake: 'Using reactive variables inside queryFn without adding them to queryKey.',
      fix: 'Every state variable accessed inside queryFn MUST be declared inside queryKey to ensure reactivity.',
    },
    {
      mistake: 'Declaring non-serializable values (like functions or class instances) in query keys.',
      fix: 'Use primitives, arrays, and plain serializable objects in query keys.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How does TanStack Query handle prefix matching in query keys?',
      answer:
        'When calling invalidateQueries({ queryKey: ["todos"] }), it matches all queries whose keys begin with "todos", such as ["todos", "list"], ["todos", "detail", 1], etc.',
    },
    {
      question: 'Why does changing a query key trigger an automatic fetch?',
      answer:
        'Because useQuery subscribes to the specific key in the cache. When the key changes, it subscribes to the new cache entry. If that entry is missing or stale, it executes queryFn.',
    },
  ],
  example: {
    id: 'query-query-keys-example',
    title: 'Dynamic Query Keys & Filter Tabs',
    description: 'Filter tasks dynamically and observe cache hits and key changes.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-query': '^5.66.0',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { fetchTodos } from './api/todos';
import type { Todo, TodoFilter } from './types/todo';
import { CheckCircle2, Clock, Filter, ListTodo } from 'lucide-react';

const queryClient = new QueryClient();

// Query Key Factory pattern
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filter: TodoFilter) => [...todoKeys.lists(), { filter }] as const,
};

function TodoApp() {
  const [filter, setFilter] = useState<TodoFilter>('all');

  // useQuery subscribes to the dynamic key
  const { data: todos, isFetching } = useQuery<Todo[]>({
    queryKey: todoKeys.list(filter),
    queryFn: () => fetchTodos(filter),
    staleTime: 10000, // 10 seconds cache freshness
  });

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ListTodo size={20} color="#10b981" />
          Task Pipeline
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
          Current Query Key: <code>{JSON.stringify(todoKeys.list(filter))}</code>
        </p>
      </header>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        {(['all', 'active', 'completed'] as TodoFilter[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              textTransform: 'capitalize',
              border: '1px solid',
              borderColor: filter === tab ? '#10b981' : '#cbd5e1',
              background: filter === tab ? '#ecfdf5' : '#fff',
              color: filter === tab ? '#065f46' : '#475569',
              cursor: 'pointer',
            }}
          >
            {tab}
          </button>
        ))}
        {isFetching && (
          <span style={{ alignSelf: 'center', fontSize: '12px', color: '#10b981', marginLeft: 'auto' }}>
            ⚡ In-flight...
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gap: '8px' }}>
        {todos?.map((todo) => (
          <div
            key={todo.id}
            style={{
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              background: todo.completed ? '#f8fafc' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {todo.completed ? (
              <CheckCircle2 size={16} color="#10b981" />
            ) : (
              <Clock size={16} color="#f59e0b" />
            )}
            <span
              style={{
                fontSize: '13px',
                color: todo.completed ? '#94a3b8' : '#1e293b',
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            >
              {todo.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoApp />
    </QueryClientProvider>
  );
}
`,
      },
      '/api/todos.ts': {
        code: `import type { Todo, TodoFilter } from '../types/todo';

const ALL_TODOS: Todo[] = [
  { id: '1', title: 'Verify TanStack Router v1 types', completed: true },
  { id: '2', title: 'Configure optimistic updates with rollback', completed: true },
  { id: '3', title: 'Set up multi-column table sorting', completed: false },
  { id: '4', title: 'Virtualize 10,000 item list at 60 FPS', completed: false },
];

export async function fetchTodos(filter: TodoFilter): Promise<Todo[]> {
  await new Promise((r) => setTimeout(r, 400));
  if (filter === 'active') return ALL_TODOS.filter((t) => !t.completed);
  if (filter === 'completed') return ALL_TODOS.filter((t) => t.completed);
  return ALL_TODOS;
}
`,
      },
      '/types/todo.ts': {
        code: `export type TodoFilter = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
`,
      },
    },
  },
}

