# Lesson Authoring & Curriculum Guide — TanStack Playground

This guide defines the standardized format, lifecycle, and best practices for creating and publishing new interactive learning modules in **TanStack Playground**.

---

## 1. Architectural Philosophy

Every lesson in TanStack Playground is an **executable educational module**. We avoid static documentation or fake non-functional code snippets. 

Key principles:
1. **Self-Contained Executable Sandboxes**: Every lesson provides real, editable source code executed in the browser via Sandpack.
2. **Interactive Simulation Controls**: Where appropriate, code demonstrations must expose real interactive controls (e.g. simulated network latency, retry counts, artificial HTTP 500 error toggles) that genuinely alter the example's behavior.
3. **Multi-File Architecture**: Lessons reflect realistic project architectures (e.g., separating `/App.tsx`, `/api/users.ts`, `/types/user.ts`, `/hooks/useCustomQuery.ts`).
4. **Single Source of Truth**: The curriculum is authored as statically-typed TypeScript manifests in `frontend/src/content/lessons/` and registered centrally.

---

## 2. Directory Structure

Lessons are organized by track under `frontend/src/content/lessons/<library-slug>/`:

```
frontend/src/content/lessons/
├── query/
│   ├── index.ts
│   ├── basic-query.ts
│   ├── query-keys.ts
│   ├── query-caching.ts
│   ├── stale-time.ts
│   ├── mutations.ts
│   ├── query-invalidation.ts
│   ├── optimistic-updates.ts
│   ├── pagination.ts
│   ├── infinite-queries.ts
│   ├── dependent-queries.ts
│   ├── parallel-queries.ts
│   └── query-cancellation.ts
├── table/
│   ├── index.ts
│   ├── basic-table.ts
│   ├── sorting.ts
│   ├── filtering.ts
│   ├── pagination.ts
│   ├── row-selection.ts
│   ├── editable-cells.ts
│   └── server-side.ts
├── router/
│   ├── index.ts
│   ├── basic-routes.ts
│   ├── dynamic-routes.ts
│   ├── search-params.ts
│   ├── navigation.ts
│   ├── loaders.ts
│   ├── route-context.ts
│   ├── error-boundaries.ts
│   ├── auth-guards.ts
│   └── query-integration.ts
├── form/
│   ├── index.ts
│   ├── basic-form.ts
│   ├── field-validation.ts
│   ├── async-validation.ts
│   ├── dynamic-fields.ts
│   ├── field-arrays.ts
│   └── server-side-validation.ts
├── virtual/
│   ├── index.ts
│   ├── basic-virtual.ts
│   ├── dynamic-sizes.ts
│   ├── horizontal-virtual.ts
│   ├── grid-virtual.ts
│   └── window-virtual.ts
├── start/
├── db/
├── store/
├── pacer/
├── devtools/
├── ranger/
├── hotkeys/
└── ai/
```

---

## 3. Lesson Definition Specification

Every lesson file exports a `LessonDefinition` conforming to the schema in [`frontend/src/content/types.ts`](../frontend/src/content/types.ts):

```typescript
export interface LessonDefinition {
  id: string                      // Globally unique kebab-case ID (e.g., 'query-basic-query')
  libraryId: string               // Library identifier ('query', 'table', 'router', etc.)
  topicId: string                 // Topic identifier matching libraries-data ('query-basics')
  title: string                   // Display title
  description: string             // 1-2 sentence executive summary
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  estimatedMinutes: number        // Typical completion time
  learningObjectives: string[]    // 3-5 concrete actionable takeaways
  explanation: string             // In-depth concept explanation (Markdown supported)
  importantApis: ImportantApi[]   // Core functions, hooks, or options taught
  example: LessonExample          // Runnable Sandpack code configuration
  commonMistakes?: MistakeItem[]  // Pitfalls and anti-patterns with solutions
  interviewQuestions?: QuestionItem[] // Practical interview scenarios
  officialDocUrl: string          // Direct link to TanStack official guide
}
```

### 3.1 Important APIs Contract
Each API definition allows the global search dialog (`Ctrl+K`) and in-lesson sidebars to cross-reference symbols:

```typescript
export interface ImportantApi {
  name: string          // Symbol name (e.g., 'useQuery', 'useMutation')
  signature: string     // TypeScript signature (e.g., 'useQuery({ queryKey, queryFn, ...options })')
  description: string   // Brief explanation of the parameter or return value
  officialDocUrl?: string
}
```

### 3.2 Runnable Example Contract
The code sandbox configuration must specify all virtual files, entry points, and dependencies:

```typescript
export interface LessonExample {
  id: string                               // Stable example ID
  title: string                            // Header title in workspace
  description: string                      // Brief sandbox task
  entryFile: string                        // Initial active tab (e.g., '/App.tsx')
  files: Record<string, string | { code: string; hidden?: boolean; active?: boolean }>
  dependencies: Record<string, string>     // npm packages & pinned versions
  devDependencies?: Record<string, string>
}
```

---

## 4. Complete Code Authoring Example

Here is a canonical implementation demonstrating multi-file separation and interactive learning controls:

```typescript
import { LessonDefinition } from '../types'

export const queryBasicQueryLesson: LessonDefinition = {
  id: 'query-basic-query',
  libraryId: 'query',
  topicId: 'query-basics',
  title: 'Basic Query: Fetching, Lifecycle States & Error Handling',
  description: 'Master useQuery to fetch, cache, and handle loading, error, and success states with interactive controls.',
  difficulty: 'BEGINNER',
  estimatedMinutes: 15,
  learningObjectives: [
    'Define strongly-typed queries using useQuery and unique query keys.',
    'Handle lifecycle states: isPending, isError, isFetching, and success data.',
    'Understand request deduplication and background cache synchronization.',
    'Configure interactive controls: artificial network delay, error simulation, and retry attempts.',
  ],
  explanation: `
### The Asynchronous State Dilemma

Traditional React applications rely on \`useEffect\` and \`useState\` to manage network requests. This approach suffers from race conditions, missing cache layers, repetitive loading state flags, and lacks background synchronization.

TanStack Query replaces manual imperative fetching with declarative query subscriptions:
- **Automatic Caching**: Results are stored under the specified \`queryKey\`.
- **Deduplication**: Simultaneous calls to the same key share a single in-flight network request.
- **Background Synchronization**: Data is seamlessly kept fresh upon window refocus or network reconnect.
  `,
  importantApis: [
    {
      name: 'useQuery',
      signature: 'useQuery({ queryKey: QueryKey, queryFn: (context) => Promise<TData>, ...options })',
      description: 'Primary hook subscribing component to asynchronous cache queries.',
      officialDocUrl: 'https://tanstack.com/query/latest/docs/framework/react/reference/useQuery',
    },
    {
      name: 'queryKey',
      signature: 'readonly unknown[]',
      description: 'Unique array identifier used for caching, invalidation, and refetching.',
    },
    {
      name: 'isPending',
      signature: 'boolean',
      description: 'True when query has no cached data and is performing its initial fetch.',
    },
  ],
  example: {
    id: 'query-basic-query-example',
    title: 'useQuery with Interactive Simulation Controls',
    description: 'Experiment with simulated latency, forced HTTP 500 errors, and automatic retries.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-query': '^5.105.0',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': `import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { fetchUsers } from './api/users';
import type { User } from './types/user';
import { RefreshCw, Users, AlertCircle, Sliders } from 'lucide-react';

const queryClient = new QueryClient();

function UsersComponent() {
  const [simulatedDelay, setSimulatedDelay] = useState(800);
  const [shouldFail, setShouldFail] = useState(false);
  const [retryCount, setRetryCount] = useState(1);

  const { data, isPending, isError, error, isFetching, refetch, failureCount } = useQuery<User[]>({
    queryKey: ['users', { simulatedDelay, shouldFail }],
    queryFn: () => fetchUsers({ delayMs: simulatedDelay, fail: shouldFail }),
    retry: retryCount,
    staleTime: 5000,
  });

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 640, margin: '0 auto' }}>
      {/* Interactive Controls that genuinely alter execution */}
      <div style={{ background: '#18181b', padding: 16, borderRadius: 8, marginBottom: 20, border: '1px solid #27272a' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: 13, color: '#38bdf8' }}>Interactive Learning Controls</h4>
        <label style={{ display: 'block', fontSize: 12, color: '#a1a1aa', marginBottom: 8 }}>
          Simulated Delay: <strong>{simulatedDelay}ms</strong>
          <input
            type="range" min="0" max="3000" step="200" value={simulatedDelay}
            onChange={(e) => setSimulatedDelay(Number(e.target.value))}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#f43f5e', cursor: 'pointer' }}>
          <input type="checkbox" checked={shouldFail} onChange={(e) => setShouldFail(e.target.checked)} />
          Simulate HTTP 500 Failure
        </label>
      </div>

      {/* Query Status Output */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>Engineering Team</h3>
        <button onClick={() => refetch()} style={{ padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}>
          Refetch
        </button>
      </div>

      {isPending ? <p>Loading users...</p> : null}
      {isError ? <p style={{ color: '#ef4444' }}>Error: {(error as Error).message}</p> : null}
      {data && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {data.map((u) => (
            <li key={u.id} style={{ padding: '8px 12px', borderBottom: '1px solid #27272a' }}>
              <strong>{u.name}</strong> — {u.role}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UsersComponent />
    </QueryClientProvider>
  );
}`,
      '/api/users.ts': `import { User } from '../types/user';

const MOCK_USERS: User[] = [
  { id: '1', name: 'Tanner Linsley', role: 'Creator & Lead', email: 'tanner@tanstack.com' },
  { id: '2', name: 'Dominik Dorfmeister', role: 'Query Maintainer', email: 'dominik@tanstack.com' },
];

export async function fetchUsers({ delayMs = 600, fail = false } = {}): Promise<User[]> {
  await new Promise((res) => setTimeout(res, delayMs));
  if (fail) throw new Error('Simulated HTTP 500 Server Error');
  return MOCK_USERS;
}`,
      '/types/user.ts': `export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}`,
    },
  },
  commonMistakes: [
    {
      mistake: 'Passing an unstable non-memoized object or function directly into queryFn.',
      fix: 'Pass serializable query keys and define fetch functions outside the component.',
    },
  ],
  interviewQuestions: [
    {
      question: 'What is the distinction between isPending and isFetching in TanStack Query v5?',
      answer: 'isPending is true when there is no cached data yet and an initial query is running. isFetching is true whenever any request is in flight, including background cache refreshes.',
    },
  ],
  officialDocUrl: 'https://tanstack.com/query/latest/docs/framework/react/guides/queries',
}
```

---

## 5. Registering Lessons

Once authored, register your lesson in two files:

1. **`frontend/src/content/registry.ts`**:
   Import your lesson and append it to the `ALL_LESSONS` array:
   ```typescript
   import { myNewLesson } from './lessons/track/my-lesson'

   export const ALL_LESSONS: LessonDefinition[] = [
     // ...
     myNewLesson,
   ]
   ```
2. **`frontend/src/content/libraries-data.ts`**:
   Ensure the parent library's `topics` list includes the corresponding topic definition with matching `id`:
   ```typescript
   {
     id: 'my-topic-id',
     title: 'My Lesson Title',
     summary: 'Brief description...',
     difficulty: 'BEGINNER',
     estimatedMinutes: 15,
     officialDocUrl: 'https://tanstack.com/...',
   }
   ```

---

## 6. Authoring Quality Checklist

Before submitting a new lesson:
- [ ] Example runs cleanly in Sandpack without missing imports.
- [ ] Dependencies are listed in `example.dependencies` with compatible versions.
- [ ] Interactive learning controls genuinely modify the state or behavior.
- [ ] File tree separates UI, mock data/APIs, and TypeScript interfaces.
- [ ] Common mistakes and interview questions provide real industry insight.
- [ ] TypeScript build succeeds (`npm run build`).
- [ ] Unit tests pass (`npm run test`).

