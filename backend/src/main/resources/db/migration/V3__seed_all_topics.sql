-- V3__seed_all_topics.sql
-- Seed complete topics for all TanStack ecosystem libraries

-- Devtools
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b0000000-0000-0000-0000-000000000050', 'a0000000-0000-0000-0000-000000000010', 'devtools-inspection', 'Devtools Cache Inspection', 'Inspect query cache, observation subscribers, and fetch timings', 'BEGINNER', 15, 0, 'https://tanstack.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'devtools-inspection') ON CONFLICT DO NOTHING;

-- Table
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b0000000-0000-0000-0000-000000000020', 'a0000000-0000-0000-0000-000000000002', 'basic-table', 'Basic Table & Column Definitions', 'Headless table foundation and accessor columns', 'BEGINNER', 15, 0, 'https://tanstack.com/table/latest', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'basic-table') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b0000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000002', 'sorting', 'Multi-Column Sorting', 'Ascending and descending sort states', 'BEGINNER', 20, 1, 'https://tanstack.com/table/latest', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'sorting') ON CONFLICT DO NOTHING;

-- Router
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b0000000-0000-0000-0000-000000000030', 'a0000000-0000-0000-0000-000000000003', 'route-definitions', 'Type-safe Route Definitions', 'File-based routing and root route structures', 'BEGINNER', 15, 0, 'https://tanstack.com/router/latest', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'route-definitions') ON CONFLICT DO NOTHING;

-- Form
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b0000000-0000-0000-0000-000000000040', 'a0000000-0000-0000-0000-000000000004', 'basic-form', 'Basic Form & useForm Hook', 'Reactivity and field registration', 'BEGINNER', 15, 0, 'https://tanstack.com/form/latest', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'basic-form') ON CONFLICT DO NOTHING;

-- Virtual
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b0000000-0000-0000-0000-000000000060', 'a0000000-0000-0000-0000-000000000005', 'virtual-list', 'Virtual List with Fixed Row Heights', 'Windowing 10,000+ items at 60 FPS', 'BEGINNER', 15, 0, 'https://tanstack.com/virtual/latest', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'virtual-list') ON CONFLICT DO NOTHING;

-- Start
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b0000000-0000-0000-0000-000000000070', 'a0000000-0000-0000-0000-000000000006', 'server-functions', 'Server Functions & RPC', 'Type-safe server RPC executions', 'INTERMEDIATE', 25, 0, 'https://tanstack.com/start/latest', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'server-functions') ON CONFLICT DO NOTHING;

-- DB
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b0000000-0000-0000-0000-000000000080', 'a0000000-0000-0000-0000-000000000007', 'collections', 'Reactive Collections & Queries', 'Client storage synchronizations', 'INTERMEDIATE', 25, 0, 'https://tanstack.com/db', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'collections') ON CONFLICT DO NOTHING;

-- Store
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b0000000-0000-0000-0000-000000000090', 'a0000000-0000-0000-0000-000000000008', 'store-basics', 'Reactive Stores & Derived State', 'Fine-grained state reactivity', 'BEGINNER', 15, 0, 'https://tanstack.com/store/latest', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'store-basics') ON CONFLICT DO NOTHING;

-- Pacer
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b0000000-0000-0000-0000-000000000091', 'a0000000-0000-0000-0000-000000000009', 'debouncing', 'Rate Limiting & Batched Queues', 'Throttling and request queues', 'BEGINNER', 15, 0, 'https://tanstack.com/pacer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'debouncing') ON CONFLICT DO NOTHING;

-- Ranger
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b0000000-0000-0000-0000-000000000092', 'a0000000-0000-0000-0000-000000000011', 'multi-slider', 'Multi-thumb Sliders & Steps', 'Headless range handlers', 'BEGINNER', 15, 0, 'https://tanstack.com/ranger/latest', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'multi-slider') ON CONFLICT DO NOTHING;

-- Hotkeys
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b0000000-0000-0000-0000-000000000093', 'a0000000-0000-0000-0000-000000000012', 'key-sequences', 'Keyboard Shortcuts & Scopes', 'Scoped key bindings and sequences', 'BEGINNER', 15, 0, 'https://tanstack.com/hotkeys', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'key-sequences') ON CONFLICT DO NOTHING;

-- AI
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b0000000-0000-0000-0000-000000000094', 'a0000000-0000-0000-0000-000000000013', 'streaming-chat', 'Streaming Completions & UI', 'LLM chat streams and tool handling', 'INTERMEDIATE', 25, 0, 'https://tanstack.com/ai', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'streaming-chat') ON CONFLICT DO NOTHING;
