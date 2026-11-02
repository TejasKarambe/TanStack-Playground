-- V4__seed_complete_topics.sql
-- Drop the restrictive unique constraint on (library_id, order_index)
ALTER TABLE topics DROP CONSTRAINT IF EXISTS uq_library_topic_order;

-- Clean up any legacy placeholder topics from previous migrations
DELETE FROM bookmarks WHERE topic_id IN (SELECT id FROM topics WHERE slug IN ('basic-table', 'sorting', 'route-definitions', 'basic-form', 'virtual-list', 'server-functions', 'collections', 'store-basics', 'debouncing', 'key-sequences', 'streaming-chat'));
DELETE FROM user_progress WHERE topic_id IN (SELECT id FROM topics WHERE slug IN ('basic-table', 'sorting', 'route-definitions', 'basic-form', 'virtual-list', 'server-functions', 'collections', 'store-basics', 'debouncing', 'key-sequences', 'streaming-chat'));
DELETE FROM topic_contents WHERE topic_id IN (SELECT id FROM topics WHERE slug IN ('basic-table', 'sorting', 'route-definitions', 'basic-form', 'virtual-list', 'server-functions', 'collections', 'store-basics', 'debouncing', 'key-sequences', 'streaming-chat'));
DELETE FROM examples WHERE topic_id IN (SELECT id FROM topics WHERE slug IN ('basic-table', 'sorting', 'route-definitions', 'basic-form', 'virtual-list', 'server-functions', 'collections', 'store-basics', 'debouncing', 'key-sequences', 'streaming-chat'));
DELETE FROM topics WHERE slug IN ('basic-table', 'sorting', 'route-definitions', 'basic-form', 'virtual-list', 'server-functions', 'collections', 'store-basics', 'debouncing', 'key-sequences', 'streaming-chat');

-- ============================================================
-- QUERY TOPICS  (library: a0000000-0000-0000-0000-000000000001)
-- ============================================================
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
       'query-keys', 'Query Keys', 'Hierarchical query keys, dependency array synchronization, and key factory patterns.',
       'BEGINNER', 20, 2, 'https://tanstack.com/query/latest/docs/framework/react/guides/query-keys', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'query-keys') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001',
       'query-caching', 'Query Caching', 'Explore in-memory hydration, cache hit mechanisms, and navigating without network refetches.',
       'BEGINNER', 20, 3, 'https://tanstack.com/query/latest/docs/framework/react/guides/caching', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'query-caching') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b1000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001',
       'query-stale-time', 'Stale Time & Garbage Collection', 'Master staleTime and gcTime sliders, background refresh triggers, and cache eviction.',
       'INTERMEDIATE', 20, 4, 'https://tanstack.com/query/latest/docs/framework/react/guides/caching', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'query-stale-time') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b1000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001',
       'query-mutations', 'Mutations', 'Perform side-effect mutations with useMutation and track pending/error states.',
       'BEGINNER', 20, 5, 'https://tanstack.com/query/latest/docs/framework/react/guides/mutations', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'query-mutations') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b1000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001',
       'query-invalidation', 'Query Invalidation', 'Automate cache re-synchronization with useQueryClient and invalidateQueries.',
       'BEGINNER', 20, 6, 'https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'query-invalidation') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b1000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001',
       'query-optimistic-updates', 'Optimistic Updates', 'Instantly update the UI before the server confirms data mutation with rollback.',
       'INTERMEDIATE', 25, 7, 'https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'query-optimistic-updates') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b1000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001',
       'query-pagination', 'Pagination', 'Server-side page slicing using placeholderData keepPreviousData for zero-flicker transitions.',
       'INTERMEDIATE', 25, 8, 'https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'query-pagination') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b1000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001',
       'query-infinite-scroll', 'Infinite Queries', 'Manage cursor-based infinite feeds with useInfiniteQuery, getNextPageParam, and flatMap.',
       'ADVANCED', 25, 9, 'https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'query-infinite-scroll') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b1000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001',
       'query-dependent', 'Dependent Queries', 'Execute sequential dependent queries using the enabled option to coordinate waterfall requests.',
       'INTERMEDIATE', 20, 10, 'https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'query-dependent') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b1000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001',
       'query-parallel', 'Parallel Queries', 'Execute multiple concurrent queries dynamically with useQueries and aggregate state tracking.',
       'INTERMEDIATE', 20, 11, 'https://tanstack.com/query/latest/docs/framework/react/guides/parallel-queries', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'query-parallel') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b1000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000001',
       'query-cancellation', 'Query Cancellation', 'Halt in-flight network requests using AbortSignal and queryClient.cancelQueries.',
       'ADVANCED', 20, 12, 'https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'query-cancellation') ON CONFLICT DO NOTHING;

-- ============================================================
-- TABLE TOPICS  (library: a0000000-0000-0000-0000-000000000002)
-- ============================================================
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b2000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002',
       'table-basics', 'Basic Table', 'Create column definitions using createColumnHelper, flexRender, and native HTML tables.',
       'BEGINNER', 15, 1, 'https://tanstack.com/table/latest/docs/guide/columns', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'table-basics') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b2000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002',
       'table-sorting', 'Sorting', 'Enable multi-column sorting with getSortedRowModel and column sort direction handlers.',
       'BEGINNER', 20, 2, 'https://tanstack.com/table/latest/docs/guide/sorting', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'table-sorting') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b2000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002',
       'table-filtering', 'Filtering', 'Construct real-time fuzzy search filters and column-level faceted dropdown filters.',
       'INTERMEDIATE', 20, 3, 'https://tanstack.com/table/latest/docs/guide/filters', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'table-filtering') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b2000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002',
       'table-pagination', 'Pagination', 'Slice datasets into digestible pages with page jumps and dynamic page size selectors.',
       'INTERMEDIATE', 20, 4, 'https://tanstack.com/table/latest/docs/guide/pagination', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'table-pagination') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b2000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002',
       'table-row-selection', 'Row Selection', 'Manage selected row state sets with select-all, indeterminate checkbox status, and batch actions.',
       'INTERMEDIATE', 20, 5, 'https://tanstack.com/table/latest/docs/guide/row-selection', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'table-row-selection') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b2000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002',
       'table-column-visibility', 'Column Visibility', 'Dynamically toggle column display states with column visibility state and toggle menus.',
       'INTERMEDIATE', 20, 6, 'https://tanstack.com/table/latest/docs/guide/column-visibility', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'table-column-visibility') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b2000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000002',
       'table-column-ordering', 'Column Ordering', 'Dynamically alter column order sequences with setColumnOrder and interactive position swappers.',
       'INTERMEDIATE', 20, 7, 'https://tanstack.com/table/latest/docs/guide/column-ordering', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'table-column-ordering') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b2000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000002',
       'table-grouping', 'Grouping & Aggregation', 'Group rows hierarchically, collapse/expand categories, and calculate aggregate sums and counts.',
       'ADVANCED', 25, 8, 'https://tanstack.com/table/latest/docs/guide/grouping', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'table-grouping') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b2000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000002',
       'table-editable-cells', 'Editable Cells', 'Inline spreadsheet cell editing using table.options.meta and local state commits on blur.',
       'INTERMEDIATE', 20, 9, 'https://tanstack.com/table/latest/docs/guide/cells', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'table-editable-cells') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b2000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000002',
       'table-server-side', 'Server-Side Operations', 'Connect manual pagination, sorting, and filtering to a mock SQL service with query logs.',
       'ADVANCED', 25, 10, 'https://tanstack.com/table/latest/docs/guide/pagination#manual-pagination', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'table-server-side') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b2000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000002',
       'table-virtualized', 'Virtualized Table', 'Render 5,000+ data rows at smooth 60 FPS using @tanstack/react-virtual and transform positioning.',
       'ADVANCED', 25, 11, 'https://tanstack.com/virtual/latest/docs/guide/introduction', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'table-virtualized') ON CONFLICT DO NOTHING;

-- ============================================================
-- ROUTER TOPICS  (library: a0000000-0000-0000-0000-000000000003)
-- ============================================================
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b3000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003',
       'router-basics', 'Basic Routes', 'Configure root layouts, child routes, and nested outlet hierarchies.',
       'BEGINNER', 20, 1, 'https://tanstack.com/router/latest/docs/framework/react/guide/route-trees', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'router-basics') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b3000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003',
       'router-dynamic-routes', 'Dynamic Route', 'Parse dynamic URL path segments with $param tokens and strongly-typed useParams.',
       'INTERMEDIATE', 20, 2, 'https://tanstack.com/router/latest/docs/framework/react/guide/path-params', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'router-dynamic-routes') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b3000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003',
       'router-search-params', 'Search Parameters', 'Validate, parse, and synchronize URL query parameters with validateSearch schemas.',
       'INTERMEDIATE', 25, 3, 'https://tanstack.com/router/latest/docs/framework/react/guide/search-params', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'router-search-params') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b3000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000003',
       'router-navigation', 'Programmatic Navigation', 'Imperative transitions with useNavigate, back/forward history, and live Route Explorer.',
       'BEGINNER', 20, 4, 'https://tanstack.com/router/latest/docs/framework/react/guide/navigation', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'router-navigation') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b3000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003',
       'router-loaders', 'Route Loaders', 'Preload data before component rendering and consume typed payloads with useLoaderData.',
       'INTERMEDIATE', 20, 5, 'https://tanstack.com/router/latest/docs/framework/react/guide/data-loading', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'router-loaders') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b3000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000003',
       'router-context', 'Route Context', 'Inject global dependencies and permissions across route trees with createRootRouteWithContext.',
       'INTERMEDIATE', 20, 6, 'https://tanstack.com/router/latest/docs/framework/react/guide/router-context', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'router-context') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b3000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000003',
       'router-errors', 'Error Boundaries & 404', 'Catch loader exceptions with errorComponent and handle missing routes with notFoundComponent.',
       'INTERMEDIATE', 20, 7, 'https://tanstack.com/router/latest/docs/framework/react/guide/error-handling', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'router-errors') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b3000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000003',
       'router-auth-guards', 'Authentication Guards', 'Enforce route protection before rendering with beforeLoad and preserved return URL redirects.',
       'INTERMEDIATE', 20, 8, 'https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'router-auth-guards') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b3000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000003',
       'router-query-integration', 'TanStack Query Integration', 'Combine TanStack Query with Router loaders using ensureQueryData and useSuspenseQuery.',
       'ADVANCED', 25, 9, 'https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#integrating-with-tanstack-query', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'router-query-integration') ON CONFLICT DO NOTHING;

-- ============================================================
-- FORM TOPICS  (library: a0000000-0000-0000-0000-000000000004)
-- ============================================================
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b4000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000004',
       'form-basics', 'Basic Form', 'Bind form fields using form.Field with fine-grained subscription reactivity.',
       'BEGINNER', 15, 1, 'https://tanstack.com/form/latest/docs/guide/overview', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'form-basics') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b4000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004',
       'form-validation', 'Field Validation', 'Enforce synchronous and asynchronous validation rules with field-level errors.',
       'INTERMEDIATE', 20, 2, 'https://tanstack.com/form/latest/docs/guide/validation', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'form-validation') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b4000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000004',
       'form-submission', 'Form Submission', 'Coordinate asynchronous submission, canSubmit validation guards, and progress spinners.',
       'INTERMEDIATE', 20, 3, 'https://tanstack.com/form/latest/docs/guide/submission', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'form-submission') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b4000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004',
       'form-async-validation', 'Async Validation', 'Perform debounced asynchronous uniqueness checks with onChangeAsync and isValidating.',
       'INTERMEDIATE', 20, 4, 'https://tanstack.com/form/latest/docs/guide/validation#async-validation', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'form-async-validation') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b4000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000004',
       'form-dependent-fields', 'Dependent Fields', 'Construct conditional sections and dynamic cross-field rules with form.Subscribe.',
       'INTERMEDIATE', 20, 5, 'https://tanstack.com/form/latest/docs/guide/dependent-fields', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'form-dependent-fields') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b4000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000004',
       'form-dynamic-fields', 'Dynamic Fields & Arrays', 'Manage repeatable field collections with field.pushValue, removeValue, and array limits.',
       'INTERMEDIATE', 20, 6, 'https://tanstack.com/form/latest/docs/guide/arrays', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'form-dynamic-fields') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b4000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000004',
       'form-server-validation', 'Server Error Mapping', 'Map backend HTTP 422 validation errors directly into reactive field error states.',
       'ADVANCED', 20, 7, 'https://tanstack.com/form/latest/docs/guide/submission#handling-server-side-errors', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'form-server-validation') ON CONFLICT DO NOTHING;

-- ============================================================
-- VIRTUAL TOPICS  (library: a0000000-0000-0000-0000-000000000005)
-- ============================================================
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b5000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005',
       'virtual-10k-list', 'Basic Virtual List', 'Virtualize a huge scroll list with fixed element heights using useVirtualizer.',
       'BEGINNER', 15, 1, 'https://tanstack.com/virtual/latest/docs/guide/introduction', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'virtual-10k-list') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b5000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005',
       'virtual-large-dataset', 'Large Dataset (100k Items)', 'Interactive sliders for dataset count, row height, overscan, and live DOM diagnostics.',
       'INTERMEDIATE', 20, 2, 'https://tanstack.com/virtual/latest/docs/guide/introduction', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'virtual-large-dataset') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b5000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000005',
       'virtual-variable-height', 'Variable-Height Rows', 'Dynamic element measurement with ref={virtualizer.measureElement} and expand/collapse.',
       'INTERMEDIATE', 20, 3, 'https://tanstack.com/virtual/latest/docs/guide/dynamic', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'virtual-variable-height') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b5000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000005',
       'virtual-horizontal', 'Horizontal Virtualization', 'Multi-year timeline carousel along the X-axis using horizontal: true and translateX.',
       'INTERMEDIATE', 20, 4, 'https://tanstack.com/virtual/latest/docs/guide/horizontal', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'virtual-horizontal') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b5000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005',
       'virtual-grid', '2D Grid Virtualization', '10,000 cells spreadsheet matrix with dual row and column virtualizers.',
       'ADVANCED', 25, 5, 'https://tanstack.com/virtual/latest/docs/guide/grid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'virtual-grid') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b5000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000005',
       'virtual-table', 'Virtualized Table', '5,000 transaction rows with sticky column headers and zero cell misalignments.',
       'ADVANCED', 20, 6, 'https://tanstack.com/virtual/latest/docs/guide/introduction', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'virtual-table') ON CONFLICT DO NOTHING;

-- ============================================================
-- START TOPICS  (library: a0000000-0000-0000-0000-000000000006)
-- ============================================================
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b6000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006',
       'start-server-functions', 'Server Functions RPC Simulation', 'Understand createServerFn boundaries, argument validation, and server logging.',
       'INTERMEDIATE', 20, 1, 'https://tanstack.com/start/latest/docs/framework/react/server-functions', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'start-server-functions') ON CONFLICT DO NOTHING;

INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b6000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000006',
       'start-ssr-hydration', 'SSR Hydration & Metadata', 'Explore isomorphic execution, document headers, and client hydration contracts.',
       'ADVANCED', 25, 2, 'https://tanstack.com/start/latest/docs/framework/react/overview', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'start-ssr-hydration') ON CONFLICT DO NOTHING;

-- ============================================================
-- DB TOPICS  (library: a0000000-0000-0000-0000-000000000007)
-- ============================================================
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b7000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000007',
       'db-collections', 'Collections & Local Queries', 'Create client-side data collections with reactive querying and change tracking.',
       'INTERMEDIATE', 20, 1, 'https://tanstack.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'db-collections') ON CONFLICT DO NOTHING;

-- ============================================================
-- STORE TOPICS  (library: a0000000-0000-0000-0000-000000000008)
-- ============================================================
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b8000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000008',
       'store-basics', 'Standalone Reactive State', 'Define stores outside React and subscribe components with fine-grained selectors.',
       'BEGINNER', 15, 1, 'https://tanstack.com/store/latest/docs/guide/introduction', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'store-basics') ON CONFLICT DO NOTHING;

-- ============================================================
-- PACER TOPICS  (library: a0000000-0000-0000-0000-000000000009)
-- ============================================================
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'b9000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000009',
       'pacer-debouncing', 'Debouncing & Task Queues', 'Tame rapid user inputs and batch asynchronous operations with Pacer queues.',
       'BEGINNER', 15, 1, 'https://github.com/tanstack/pacer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'pacer-debouncing') ON CONFLICT DO NOTHING;

-- ============================================================
-- DEVTOOLS TOPICS  (library: a0000000-0000-0000-0000-000000000010)
-- ============================================================
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'ba000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000010',
       'devtools-inspection', 'Inspecting Query Cache & Traces', 'Mount embedded query devtools to inspect query keys, states, and cache timers.',
       'BEGINNER', 15, 1, 'https://tanstack.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'devtools-inspection') ON CONFLICT DO NOTHING;

-- ============================================================
-- RANGER TOPICS  (library: a0000000-0000-0000-0000-000000000011)
-- ============================================================
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'bb000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000011',
       'ranger-multi-slider', 'Multi-Handle Sliders', 'Build custom accessible range sliders with multiple drag handles.',
       'INTERMEDIATE', 15, 1, 'https://tanstack.com/ranger/latest', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'ranger-multi-slider') ON CONFLICT DO NOTHING;

-- ============================================================
-- HOTKEYS TOPICS  (library: a0000000-0000-0000-0000-000000000012)
-- ============================================================
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'bc000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000012',
       'hotkeys-sequences', 'Key Combinations & Scopes', 'Bind application actions to key combinations and scoped modal boundaries.',
       'BEGINNER', 15, 1, 'https://github.com/tanstack/hotkeys', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'hotkeys-sequences') ON CONFLICT DO NOTHING;

-- ============================================================
-- AI TOPICS  (library: a0000000-0000-0000-0000-000000000013)
-- ============================================================
INSERT INTO topics (id, library_id, slug, title, description, difficulty, estimated_minutes, order_index, documentation_url, created_at, updated_at)
SELECT 'bd000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000013',
       'ai-tool-streams', 'Streaming Tool Invocations', 'Coordinate streaming LLM responses and client tool callbacks.',
       'ADVANCED', 20, 1, 'https://github.com/tanstack/ai', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE slug = 'ai-tool-streams') ON CONFLICT DO NOTHING;
