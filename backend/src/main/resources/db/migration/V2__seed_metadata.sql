-- V2__seed_metadata.sql
-- Seed 13 TanStack Ecosystem Libraries and Sample Topics

-- 1. TanStack Query
INSERT INTO libraries (id, slug, name, description, package_name, icon, documentation_url, status, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'query',
    'TanStack Query',
    'Declarative, auto-managed asynchronous server state synchronization and caching.',
    '@tanstack/react-query',
    'Database',
    'https://tanstack.com/query/latest',
    'STABLE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 2. TanStack Table
INSERT INTO libraries (id, slug, name, description, package_name, icon, documentation_url, status, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000002',
    'table',
    'TanStack Table',
    'Headless UI for building powerful tables and datagrids with total styling freedom.',
    '@tanstack/react-table',
    'Table',
    'https://tanstack.com/table/latest',
    'STABLE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 3. TanStack Router
INSERT INTO libraries (id, slug, name, description, package_name, icon, documentation_url, status, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000003',
    'router',
    'TanStack Router',
    'Type-safe routing with built-in search params management, loaders, and code splitting.',
    '@tanstack/react-router',
    'Network',
    'https://tanstack.com/router/latest',
    'STABLE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 4. TanStack Form
INSERT INTO libraries (id, slug, name, description, package_name, icon, documentation_url, status, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000004',
    'form',
    'TanStack Form',
    'Headless, reactive form state management with first-class Zod validator adapters.',
    '@tanstack/react-form',
    'CheckSquare',
    'https://tanstack.com/form/latest',
    'STABLE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 5. TanStack Virtual
INSERT INTO libraries (id, slug, name, description, package_name, icon, documentation_url, status, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000005',
    'virtual',
    'TanStack Virtual',
    'Headless DOM virtualization for 10,000+ item lists, tables, and grids at 60 FPS.',
    '@tanstack/react-virtual',
    'Layers',
    'https://tanstack.com/virtual/latest',
    'STABLE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 6. TanStack Start
INSERT INTO libraries (id, slug, name, description, package_name, icon, documentation_url, status, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000006',
    'start',
    'TanStack Start',
    'Full-stack React framework powered by TanStack Router and RPC server functions.',
    '@tanstack/react-start',
    'Zap',
    'https://tanstack.com/start/latest',
    'RELEASE_CANDIDATE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 7. TanStack DB
INSERT INTO libraries (id, slug, name, description, package_name, icon, documentation_url, status, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000007',
    'db',
    'TanStack DB',
    'Local-first reactive client store designed for high-performance synchronization.',
    '@tanstack/db',
    'HardDrive',
    'https://tanstack.com',
    'RELEASE_CANDIDATE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 8. TanStack Store
INSERT INTO libraries (id, slug, name, description, package_name, icon, documentation_url, status, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000008',
    'store',
    'TanStack Store',
    'Framework-agnostic, lightweight reactive state container with derived selectors.',
    '@tanstack/store',
    'Box',
    'https://tanstack.com/store/latest',
    'STABLE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 9. TanStack Pacer
INSERT INTO libraries (id, slug, name, description, package_name, icon, documentation_url, status, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000009',
    'pacer',
    'TanStack Pacer',
    'Headless utilities for debouncing, throttling, rate-limiting, and task queues.',
    '@tanstack/pacer',
    'Gauge',
    'https://github.com/tanstack/pacer',
    'BETA',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 10. TanStack Devtools
INSERT INTO libraries (id, slug, name, description, package_name, icon, documentation_url, status, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000010',
    'devtools',
    'TanStack Devtools',
    'Visual inspectors and live state debugging panels for TanStack Query and Router.',
    '@tanstack/react-query-devtools',
    'Wrench',
    'https://tanstack.com',
    'STABLE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 11. TanStack Ranger
INSERT INTO libraries (id, slug, name, description, package_name, icon, documentation_url, status, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000011',
    'ranger',
    'TanStack Ranger',
    'Headless range, slider, and multi-handle selector logic.',
    '@tanstack/react-ranger',
    'Sliders',
    'https://tanstack.com/ranger/latest',
    'ALPHA',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 12. TanStack Hotkeys
INSERT INTO libraries (id, slug, name, description, package_name, icon, documentation_url, status, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000012',
    'hotkeys',
    'TanStack Hotkeys',
    'Headless keyboard shortcut manager for complex web applications.',
    '@tanstack/react-hotkeys',
    'Keyboard',
    'https://github.com/tanstack/hotkeys',
    'BETA',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 13. TanStack AI
INSERT INTO libraries (id, slug, name, description, package_name, icon, documentation_url, status, created_at, updated_at)
VALUES (
    'a0000000-0000-0000-0000-000000000013',
    'ai',
    'TanStack AI',
    'Streaming AI workflow coordination and model tool calling orchestration.',
    '@tanstack/ai',
    'Sparkles',
    'https://github.com/tanstack/ai',
    'RELEASE_CANDIDATE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Seed Sample Topics for Query
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'query-basics',
    'Query Basics & Caching',
    'Understand useQuery, query keys, staleTime, and cache invalidation mechanics.',
    'BEGINNER',
    15,
    1,
    'https://tanstack.com/query/latest/docs/framework/react/guides/queries',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO topic_contents (id, topic_id, introduction, learning_objectives, explanation, key_concepts, example_notes)
VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'TanStack Query is often described as the missing data-fetching library for web applications.',
    '["Define a query with useQuery and a unique queryKey", "Handle loading, error, and success states", "Observe background refetching and stale time"]',
    'At its core, TanStack Query manages query caching for you based on query keys. Unlike traditional global state stores, it treats server data as an asynchronous cache.',
    '["queryKey: unique serializable cache identifier", "queryFn: async function returning data", "staleTime: time until data is marked stale"]',
    'Notice how the mock API introduces an artificial 600ms latency to demonstrate the isPending flag.'
);

-- Seed Sample Example for Query Basics
INSERT INTO examples (id, topic_id, title, description, difficulty, default_file, dependencies_json, is_active)
VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'Basic User Query Demonstration',
    'Demonstration of useQuery fetching and caching a list of developer profiles.',
    'BEGINNER',
    '/App.tsx',
    '{"@tanstack/react-query": "^5.105.0", "lucide-react": "^1.65.0"}',
    TRUE
);

-- Seed Example Files
INSERT INTO example_files (id, example_id, file_name, file_path, language, source_code, order_index)
VALUES (
    'e0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'App.tsx',
    '/App.tsx',
    'typescript',
    'import React from ''react'';
import { useQuery } from ''@tanstack/react-query'';
import { fetchUsers } from ''./api'';

export default function App() {
  const { data: users, isPending, isError, refetch } = useQuery({
    queryKey: [''users''],
    queryFn: fetchUsers,
    staleTime: 5000,
  });

  return (
    <div style={{ fontFamily: ''sans-serif'', padding: ''1.5rem'' }}>
      <h2>TanStack Query Users</h2>
      {isPending && <p>Loading users...</p>}
      {isError && <p style={{ color: ''red'' }}>Failed to load users.</p>}
      {users && (
        <ul>
          {users.map(u => (
            <li key={u.id}><strong>{u.name}</strong> — {u.role}</li>
          ))}
        </ul>
      )}
      <button onClick={() => refetch()} style={{ padding: ''8px 16px'', cursor: ''pointer'' }}>
        Refetch Data
      </button>
    </div>
  );
}',
    1
);

INSERT INTO example_files (id, example_id, file_name, file_path, language, source_code, order_index)
VALUES (
    'e0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000001',
    'api.ts',
    '/api.ts',
    'typescript',
    'export interface User {
  id: number;
  name: string;
  role: string;
}

const MOCK_USERS: User[] = [
  { id: 1, name: ''Tanner Linsley'', role: ''Creator of TanStack'' },
  { id: 2, name: ''Dominik Dorfmeister'', role: ''Query Maintainer'' }
];

export async function fetchUsers(): Promise<User[]> {
  await new Promise(r => setTimeout(r, 600));
  return [...MOCK_USERS];
}',
    2
);

