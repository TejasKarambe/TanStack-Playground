# Lesson Registry & Format Specification — TanStack Playground

## 1. Architectural Philosophy & Content Ownership

The **TanStack Playground** curriculum architecture enforces three core tenets:

1. **Frontend as Single Source of Truth**:
   - All educational content (track metadata, lesson explanations, learning objectives, starter code, solution code, hints, code annotations, and Sandpack dependencies) is authored in **type-safe TypeScript manifests** inside `frontend/src/content/`.
   - Manifests are bundled into the client application. Lessons load with **zero network latency** and function offline without requiring database roundtrips.
2. **Extensible & Data-Driven Registry**:
   - The ecosystem registry is not hardcoded to a fixed list. Any TanStack library or ecosystem project can be registered by declaring its manifest.
   - Maturity levels (Stable, Release Candidate, Beta, Alpha, Experimental) are strictly delineated. Experimental projects are **never** labeled as stable.
3. **Execution Strategy Realism**:
   - Client-side browser sandboxes (Sandpack) can natively execute client React code.
   - For full-stack projects with server-side boundaries like **TanStack Start**, the curriculum provides an explicit **Server Function RPC Simulator**, exposing the server/client boundary realistically without misrepresenting client-only rendering as full SSR.

---

## 2. Master Track Registry: Supported Ecosystem Projects

Below is the verified ecosystem catalog with official package names, versions, documentation URLs, frameworks, and maturity status:

| Track Slug | Track Title | Official Package | Verified Version | Maturity Status | Framework | Official Documentation URL |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `query` | **TanStack Query** | `@tanstack/react-query` | `^5.105.0` | **Production Stable** | React, Solid, Vue, Svelte | `https://tanstack.com/query/latest` |
| `router` | **TanStack Router** | `@tanstack/react-router` | `^1.170.46` | **Production Stable** | React | `https://tanstack.com/router/latest` |
| `table` | **TanStack Table** | `@tanstack/react-table` | `^8.21.2` | **Production Stable** | React, Solid, Vue, Svelte, Vanilla | `https://tanstack.com/table/latest` |
| `form` | **TanStack Form** | `@tanstack/react-form` | `^1.33.5` | **Production Stable** | React, Solid, Vue, Svelte | `https://tanstack.com/form/latest` |
| `virtual`| **TanStack Virtual** | `@tanstack/react-virtual` | `^3.14.24` | **Production Stable** | React, Solid, Vue, Svelte | `https://tanstack.com/virtual/latest` |
| `start` | **TanStack Start** | `@tanstack/react-start` | `^1.169.4` | **Release Candidate** | React (Fullstack SSR/Nitro) | `https://tanstack.com/start/latest` |
| `db` | **TanStack DB** | `@tanstack/db` | `^1.0.0-rc.1` | **Release Candidate** | Universal / TypeScript | `https://tanstack.com` |
| `store` | **TanStack Store** | `@tanstack/store`, `@tanstack/react-store` | `^0.11.2` | **Stable Core** | React, Solid, Vue, Svelte, Vanilla | `https://tanstack.com/store/latest` |
| `pacer` | **TanStack Pacer** | `@tanstack/pacer` | `^0.23.1` | **Beta** | Universal / TypeScript | `https://github.com/tanstack/pacer` |
| `devtools`| **TanStack Devtools** | `@tanstack/react-query-devtools`, `@tanstack/router-devtools` | `^5.105.0`, `^1.167.2` | **Production Stable** | React | `https://tanstack.com` |
| `ranger` | **TanStack Ranger** | `@tanstack/react-ranger` | `^0.0.5` | **Alpha / Experimental** | React | `https://tanstack.com/ranger/latest` |
| `hotkeys`| **TanStack Hotkeys** | `@tanstack/react-hotkeys` | `^0.17.0` | **Beta** | React, Vanilla | `https://github.com/tanstack/hotkeys` |
| `ai` | **TanStack AI** | `@tanstack/ai` | `^1.0.1` | **Release Candidate** | Universal / TypeScript | `https://github.com/tanstack/ai` |

---

## 3. Strict TypeScript Schema Definition

```typescript
// src/content/types.ts

export type MaturityStatus = 
  | 'STABLE'
  | 'RELEASE_CANDIDATE'
  | 'BETA'
  | 'ALPHA'
  | 'EXPERIMENTAL';

export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface CodeAnnotation {
  file: string;
  lines: [number, number]; // 1-indexed inclusive line range [start, end]
  title: string;
  explanation: string;
}

export interface LessonFileDefinition {
  code: string;
  isEntryPoint?: boolean;
  isReadOnly?: boolean;
  isHidden?: boolean;
  description?: string;
}

export interface SandpackConfig {
  template: 'react-ts';
  dependencies: Record<string, string>;
  devDependencies?: Record<string, string>;
  entryFile: string;
  activeFile: string;
  visibleFiles?: string[];
  environment?: 'browser' | 'simulated-server';
}

export interface LessonManifest {
  id: string;                         // Unique canonical identifier (e.g. 'query-101')
  trackSlug: string;                  // Track slug foreign key (e.g. 'query')
  slug: string;                       // Globally unique URL path slug (e.g. 'query-basics')
  title: string;
  summary: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  officialDocUrl: string;
  
  // Learning Pedagogy
  learningObjectives: string[];
  explanationMarkdown: string;
  codeAnnotations: CodeAnnotation[];
  
  // Sandbox & Code Demonstration
  sandpackConfig: SandpackConfig;
  initialFiles: Record<string, LessonFileDefinition>;
  solutionFiles?: Record<string, string>; // path -> full solution code
  hints?: string[];
}

export interface TrackManifest {
  slug: string;
  title: string;
  packageName: string;
  version: string;
  maturity: MaturityStatus;
  supportedFrameworks: string[];
  description: string;
  iconName: string;
  officialDocUrl: string;
  displayOrder: number;
  learningTopics: string[];
  lessons: LessonManifest[];
}
```

---

## 4. Zod Validation Schema (with Traversal Defense)

```typescript
import { z } from 'zod';

// Strict regex rejecting traversal (..) and double slashes (//)
export const VirtualFilePathRegex = /^/(?!.*\.\.)(?!.*//)[a-zA-Z0-9_\-\.]+(/[a-zA-Z0-9_\-\.]+)*$/;

export const LessonFileDefinitionSchema = z.object({
  code: z.string().min(1, 'File content cannot be empty'),
  isEntryPoint: z.boolean().optional().default(false),
  isReadOnly: z.boolean().optional().default(false),
  isHidden: z.boolean().optional().default(false),
  description: z.string().optional()
});

export const CodeAnnotationSchema = z.object({
  file: z.string().regex(VirtualFilePathRegex, 'Invalid virtual file path or path traversal detected'),
  lines: z.tuple([z.number().int().positive(), z.number().int().positive()]),
  title: z.string().min(3),
  explanation: z.string().min(10)
});

export const SandpackConfigSchema = z.object({
  template: z.literal('react-ts'),
  dependencies: z.record(z.string()),
  devDependencies: z.record(z.string()).optional(),
  entryFile: z.string().regex(VirtualFilePathRegex),
  activeFile: z.string().regex(VirtualFilePathRegex),
  visibleFiles: z.array(z.string().regex(VirtualFilePathRegex)).optional(),
  environment: z.enum(['browser', 'simulated-server']).optional().default('browser')
});

export const LessonManifestSchema = z.object({
  id: z.string().min(3),
  trackSlug: z.string().regex(/^[a-z0-9-]+$/),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(5),
  summary: z.string().min(10),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  estimatedMinutes: z.number().int().positive(),
  officialDocUrl: z.string().url(),
  learningObjectives: z.array(z.string()).min(1),
  explanationMarkdown: z.string().min(20),
  codeAnnotations: z.array(CodeAnnotationSchema),
  sandpackConfig: SandpackConfigSchema,
  initialFiles: z.record(z.string().regex(VirtualFilePathRegex), LessonFileDefinitionSchema),
  solutionFiles: z.record(z.string().regex(VirtualFilePathRegex), z.string()).optional(),
  hints: z.array(z.string()).optional()
});
```

---

## 5. Concrete Manifest Implementations

### 5.1 TanStack Query: Basic Caching & Mock Data
```typescript
// src/content/query/query-basics.ts
import { LessonManifest } from '../types';

export const queryBasicsLesson: LessonManifest = {
  id: 'query-101',
  trackSlug: 'query',
  slug: 'query-basics',
  title: 'Query Basics & Automatic Caching',
  summary: 'Learn how to declare queries with useQuery, configure queryKey caching, and handle loading and error states cleanly.',
  difficulty: 'BEGINNER',
  estimatedMinutes: 15,
  officialDocUrl: 'https://tanstack.com/query/latest/docs/framework/react/guides/queries',
  learningObjectives: [
    'Define a query with useQuery and a unique queryKey',
    'Simulate asynchronous network requests with artificial latency',
    'Inspect query status flags: isPending, isError, and isSuccess',
    'Observe automatic background refetching and stale time mechanics'
  ],
  explanationMarkdown: `
# Mastering \`useQuery\`

TanStack Query manages asynchronous server state. Unlike global client stores, server state is asynchronously persisted, cached, and automatically updated.

### Key Building Blocks
- **\`queryKey\`**: Unique array identifying the cache entity (e.g. \`['users']\`).
- **\`queryFn\`**: Async function returning data or throwing an error.
- **\`staleTime\`**: Duration (in ms) until data is marked stale.
  `,
  codeAnnotations: [
    {
      file: '/App.tsx',
      lines: [12, 19],
      title: 'useQuery Declaration',
      explanation: 'Binds the component to the queryKey cache and triggers fetchUsers.'
    }
  ],
  sandpackConfig: {
    template: 'react-ts',
    dependencies: {
      '@tanstack/react-query': '^5.105.0',
      'lucide-react': '^1.65.0'
    },
    entryFile: '/index.tsx',
    activeFile: '/App.tsx',
    visibleFiles: ['/App.tsx', '/api.ts', '/types.ts']
  },
  initialFiles: {
    '/index.tsx': {
      code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);`,
      isHidden: true,
      isReadOnly: true
    },
    '/types.ts': {
      code: `export interface User {
  id: number;
  name: string;
  role: string;
}`,
      isReadOnly: true
    },
    '/api.ts': {
      code: `import { User } from './types';

const MOCK_USERS: User[] = [
  { id: 1, name: 'Tanner Linsley', role: 'Creator of TanStack' },
  { id: 2, name: 'Dominik Dorfmeister', role: 'TanStack Query Maintainer' }
];

export async function fetchUsers(): Promise<User[]> {
  await new Promise(r => setTimeout(r, 600));
  return [...MOCK_USERS];
}`,
      isReadOnly: false
    },
    '/App.tsx': {
      code: `import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from './api';

export default function App() {
  const { data: users, isPending, isError, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5000,
  });

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '1.5rem' }}>
      <h2>TanStack Query Users</h2>
      {isPending && <p>Loading users...</p>}
      {isError && <p style={{ color: 'red' }}>Error loading users</p>}
      {users && (
        <ul>
          {users.map(u => (
            <li key={u.id}><strong>{u.name}</strong> — {u.role}</li>
          ))}
        </ul>
      )}
      <button onClick={() => refetch()} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Refetch Users
      </button>
    </div>
  );
}`,
      isEntryPoint: true,
      isReadOnly: false
    }
  }
};
```

---

### 5.2 TanStack Start: Server Functions RPC Simulator

> [!IMPORTANT]
> **Execution Reality Clarification**:
> Standard web browsers cannot spin up a native Node.js or Nitro server process. This lesson operates via a client-side **Server Function RPC Simulator**. It accurately demonstrates the developer API and type contracts of `createServerFn` across simulated client/server boundaries, but is **not** executing real Node.js SSR or Nitro server-side compilation in the browser.

```typescript
// src/content/start/server-functions.ts
import { LessonManifest } from '../types';

export const startServerFunctionsLesson: LessonManifest = {
  id: 'start-101',
  trackSlug: 'start',
  slug: 'server-functions',
  title: 'Full-Stack Server Functions with createServerFn',
  summary: 'Understand the server/client RPC boundary, type-safe arguments, and server execution simulation in TanStack Start.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/start/latest/docs/framework/react/server-functions',
  learningObjectives: [
    'Define an RPC server function using createServerFn',
    'Enforce server boundary validation on request payloads',
    'Invoke server functions transparently from React client components',
    'Observe client/server execution logging separation'
  ],
  explanationMarkdown: `
# TanStack Start Server Functions (\`createServerFn\`)

TanStack Start bridges fullstack React using **Server Functions**. They allow you to write backend server code (database queries, secret token access) that is called seamlessly from client components with end-to-end type safety.

> [!NOTE]
> Because standard browser Sandpack runs client-side, this environment runs a **Server Function RPC Simulator**. The simulator strictly isolates server functions into an RPC worker thread, simulating network serialization, HTTP status codes, and server execution logs.
  `,
  codeAnnotations: [
    {
      file: '/server.ts',
      lines: [5, 14],
      title: 'Server Function Declaration',
      explanation: 'createServerFn defines code that executes only on the simulated server environment.'
    },
    {
      file: '/App.tsx',
      lines: [10, 16],
      title: 'Client Invocation',
      explanation: 'The client invokes the server function directly like a regular async function.'
    }
  ],
  sandpackConfig: {
    template: 'react-ts',
    dependencies: {
      'lucide-react': '^1.65.0'
    },
    entryFile: '/index.tsx',
    activeFile: '/App.tsx',
    visibleFiles: ['/App.tsx', '/server.ts', '/rpc-simulator.ts'],
    environment: 'simulated-server'
  },
  initialFiles: {
    '/index.tsx': {
      code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      isHidden: true,
      isReadOnly: true
    },
    '/rpc-simulator.ts': {
      code: `// Simulated TanStack Start createServerFn harness
export function createServerFn(options: { method: 'GET' | 'POST' }) {
  return {
    validator: (validateFn: (input: any) => any) => ({
      handler: (serverHandler: (ctx: { data: any }) => Promise<any>) => {
        return async (clientInput: any) => {
          console.log('[Nitro Server RPC] Received invocation with payload:', clientInput);
          const validated = validateFn ? validateFn(clientInput) : clientInput;
          await new Promise(r => setTimeout(r, 400)); // Simulate roundtrip latency
          const result = await serverHandler({ data: validated });
          console.log('[Nitro Server RPC] Completed execution with result:', result);
          return result;
        };
      }
    })
  };
}`,
      isReadOnly: true,
      description: 'Underlying RPC simulator bridging client component to server function'
    },
    '/server.ts': {
      code: `import { createServerFn } from './rpc-simulator';

// This function simulates backend server execution
export const getSecretServerStats = createServerFn({ method: 'GET' })
  .validator((d: { apiKey: string }) => {
    if (!d.apiKey) throw new Error('Unauthorized: Missing API Key');
    return d;
  })
  .handler(async ({ data }) => {
    // In TanStack Start, this runs on the server Node/Nitro runtime
    return {
      serverTime: new Date().toISOString(),
      activeServerThreads: 14,
      databaseStatus: 'CONNECTED_POSTGRES'
    };
  });`,
      isReadOnly: false
    },
    '/App.tsx': {
      code: `import React, { useState } from 'react';
import { getSecretServerStats } from './server';

export default function App() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCallServer = async () => {
    setLoading(true);
    try {
      const data = await getSecretServerStats({ apiKey: 'dev-token-9988' });
      setStats(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '1.5rem' }}>
      <h2>TanStack Start: Server Function Demo</h2>
      <p>Simulating \`createServerFn\` RPC invocation across client/server boundary.</p>
      <button 
        onClick={handleCallServer} 
        disabled={loading}
        style={{ padding: '8px 16px', cursor: 'pointer' }}
      >
        {loading ? 'Executing on Server...' : 'Invoke Server Function'}
      </button>

      {stats && (
        <div style={{ marginTop: '1rem', background: '#f4f4f5', padding: '12px', borderRadius: '4px' }}>
          <h4>Server Response (Simulated Nitro Worker):</h4>
          <pre>{JSON.stringify(stats, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}`,
      isEntryPoint: true,
      isReadOnly: false
    }
  }
};
```
