export interface TopicItem {
  id: string
  title: string
  summary: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  estimatedMinutes: number
  officialDocUrl: string
  isCompleted?: boolean
  isBookmarked?: boolean
  lastVisited?: string
}

export interface LibraryItem {
  id: string
  name: string
  shortName: string
  packageName: string
  version: string
  description: string
  iconName: string
  color: string
  maturity: 'STABLE' | 'RELEASE_CANDIDATE' | 'BETA' | 'ALPHA' | 'EXPERIMENTAL'
  officialDocUrl: string
  topics: TopicItem[]
}

export const TANSTACK_LIBRARIES: LibraryItem[] = [
  {
    id: 'query',
    name: 'TanStack Query',
    shortName: 'Query',
    packageName: '@tanstack/react-query',
    version: '5.105.0',
    description: 'Declarative, always up-to-date auto-managed queries and mutations for asynchronous state.',
    iconName: 'Database',
    color: '#ef4444',
    maturity: 'STABLE',
    officialDocUrl: 'https://tanstack.com/query/latest',
    topics: [
      {
        id: 'query-basics',
        title: 'Query Basics & Caching',
        summary: 'Understand useQuery, query keys, staleTime, and cache invalidation mechanics.',
        difficulty: 'BEGINNER',
        estimatedMinutes: 15,
        officialDocUrl: 'https://tanstack.com/query/latest/docs/framework/react/guides/queries',
        isCompleted: true,
        lastVisited: '10 mins ago',
      },
      {
        id: 'query-mutations',
        title: 'Mutations & Invalidation',
        summary: 'Perform side-effect mutations with useMutation and trigger automated cache invalidation.',
        difficulty: 'BEGINNER',
        estimatedMinutes: 20,
        officialDocUrl: 'https://tanstack.com/query/latest/docs/framework/react/guides/mutations',
        isCompleted: true,
        isBookmarked: true,
        lastVisited: 'Yesterday',
      },
      {
        id: 'query-optimistic-updates',
        title: 'Optimistic UI Updates',
        summary: 'Instantly update the user interface before the server confirms data mutation.',
        difficulty: 'INTERMEDIATE',
        estimatedMinutes: 25,
        officialDocUrl: 'https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates',
        isCompleted: false,
        isBookmarked: true,
      },
      {
        id: 'query-infinite-scroll',
        title: 'Infinite Queries & Pagination',
        summary: 'Implement seamless pagination and infinite scrolling feeds with useInfiniteQuery.',
        difficulty: 'ADVANCED',
        estimatedMinutes: 30,
        officialDocUrl: 'https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries',
        isCompleted: false,
      },
    ],
  },
  {
    id: 'table',
    name: 'TanStack Table',
    shortName: 'Table',
    packageName: '@tanstack/react-table',
    version: '8.21.2',
    description: 'Headless UI for building powerful tables and datagrids with total styling control.',
    iconName: 'Table',
    color: '#3b82f6',
    maturity: 'STABLE',
    officialDocUrl: 'https://tanstack.com/table/latest',
    topics: [
      {
        id: 'table-basics',
        title: 'Column Definitions & Cells',
        summary: 'Create strongly-typed column helpers and render data models using flexRender.',
        difficulty: 'BEGINNER',
        estimatedMinutes: 15,
        officialDocUrl: 'https://tanstack.com/table/latest/docs/guide/columns',
        isCompleted: true,
        lastVisited: '2 days ago',
      },
      {
        id: 'table-sorting',
        title: 'Multi-Column Sorting',
        summary: 'Enable interactive sorting with getSortedRowModel and column sort toggles.',
        difficulty: 'BEGINNER',
        estimatedMinutes: 20,
        officialDocUrl: 'https://tanstack.com/table/latest/docs/guide/sorting',
        isCompleted: true,
      },
      {
        id: 'table-filtering',
        title: 'Global & Faceted Filtering',
        summary: 'Construct fuzzy search filters and column-level faceted dropdown filters.',
        difficulty: 'INTERMEDIATE',
        estimatedMinutes: 25,
        officialDocUrl: 'https://tanstack.com/table/latest/docs/guide/filters',
        isCompleted: false,
        isBookmarked: true,
      },
      {
        id: 'table-pagination',
        title: 'Pagination & Row Selection',
        summary: 'Control table page state and manage row selection sets with select-all support.',
        difficulty: 'INTERMEDIATE',
        estimatedMinutes: 20,
        officialDocUrl: 'https://tanstack.com/table/latest/docs/guide/pagination',
        isCompleted: false,
      },
    ],
  },
  {
    id: 'router',
    name: 'TanStack Router',
    shortName: 'Router',
    packageName: '@tanstack/react-router',
    version: '1.170.46',
    description: 'Type-safe routing with built-in search params management, loaders, and code splitting.',
    iconName: 'Network',
    color: '#10b981',
    maturity: 'STABLE',
    officialDocUrl: 'https://tanstack.com/router/latest',
    topics: [
      {
        id: 'router-basics',
        title: 'Route Trees & Layouts',
        summary: 'Configure root layouts, child routes, and nested outlet hierarchies.',
        difficulty: 'BEGINNER',
        estimatedMinutes: 20,
        officialDocUrl: 'https://tanstack.com/router/latest/docs/framework/react/guide/route-trees',
        isCompleted: true,
        lastVisited: '3 days ago',
      },
      {
        id: 'router-search-params',
        title: 'Type-Safe Search Parameters',
        summary: 'Validate and sync search parameters in the URL using Zod schema validators.',
        difficulty: 'INTERMEDIATE',
        estimatedMinutes: 25,
        officialDocUrl: 'https://tanstack.com/router/latest/docs/framework/react/guide/search-params',
        isCompleted: false,
      },
      {
        id: 'router-loaders',
        title: 'Data Loaders & Prefetching',
        summary: 'Preload asynchronous route data and eliminate client-side loading cascades.',
        difficulty: 'ADVANCED',
        estimatedMinutes: 30,
        officialDocUrl: 'https://tanstack.com/router/latest/docs/framework/react/guide/data-loading',
        isCompleted: false,
      },
    ],
  },
  {
    id: 'form',
    name: 'TanStack Form',
    shortName: 'Form',
    packageName: '@tanstack/react-form',
    version: '1.33.5',
    description: 'Headless, reactive, and high-performance form state management with validator adapters.',
    iconName: 'CheckSquare',
    color: '#f59e0b',
    maturity: 'STABLE',
    officialDocUrl: 'https://tanstack.com/form/latest',
    topics: [
      {
        id: 'form-basics',
        title: 'Reactive Form State & Fields',
        summary: 'Bind form fields using form.Field with fine-grained subscription reactivity.',
        difficulty: 'BEGINNER',
        estimatedMinutes: 15,
        officialDocUrl: 'https://tanstack.com/form/latest/docs/guide/overview',
        isCompleted: false,
      },
      {
        id: 'form-validation',
        title: 'Zod Schema Validation',
        summary: 'Enforce synchronous and asynchronous validation rules with field-level errors.',
        difficulty: 'INTERMEDIATE',
        estimatedMinutes: 20,
        officialDocUrl: 'https://tanstack.com/form/latest/docs/guide/validation',
        isCompleted: false,
      },
      {
        id: 'form-dynamic-arrays',
        title: 'Dynamic Array Fields',
        summary: 'Build complex forms with dynamically added or removed subfields.',
        difficulty: 'ADVANCED',
        estimatedMinutes: 25,
        officialDocUrl: 'https://tanstack.com/form/latest/docs/guide/arrays',
        isCompleted: false,
      },
    ],
  },
  {
    id: 'virtual',
    name: 'TanStack Virtual',
    shortName: 'Virtual',
    packageName: '@tanstack/react-virtual',
    version: '3.14.24',
    description: 'Headless DOM virtualization for massive lists, tables, and grids at 60 FPS.',
    iconName: 'Layers',
    color: '#8b5cf6',
    maturity: 'STABLE',
    officialDocUrl: 'https://tanstack.com/virtual/latest',
    topics: [
      {
        id: 'virtual-10k-list',
        title: '10,000 Item List Virtualization',
        summary: 'Virtualize a huge scroll list with fixed element heights using useVirtualizer.',
        difficulty: 'BEGINNER',
        estimatedMinutes: 15,
        officialDocUrl: 'https://tanstack.com/virtual/latest/docs/guide/introduction',
        isCompleted: false,
      },
      {
        id: 'virtual-dynamic-height',
        title: 'Dynamic Item Heights',
        summary: 'Measure dynamic DOM nodes automatically with resize observer integration.',
        difficulty: 'ADVANCED',
        estimatedMinutes: 25,
        officialDocUrl: 'https://tanstack.com/virtual/latest/docs/guide/dynamic',
        isCompleted: false,
      },
    ],
  },
  {
    id: 'start',
    name: 'TanStack Start',
    shortName: 'Start',
    packageName: '@tanstack/react-start',
    version: '1.169.4',
    description: 'Full-stack React framework powered by TanStack Router and server functions.',
    iconName: 'Zap',
    color: '#06b6d4',
    maturity: 'RELEASE_CANDIDATE',
    officialDocUrl: 'https://tanstack.com/start/latest',
    topics: [
      {
        id: 'start-server-functions',
        title: 'Server Functions RPC Simulation',
        summary: 'Understand createServerFn boundaries, argument validation, and server logging.',
        difficulty: 'INTERMEDIATE',
        estimatedMinutes: 20,
        officialDocUrl: 'https://tanstack.com/start/latest/docs/framework/react/server-functions',
        isCompleted: false,
      },
      {
        id: 'start-ssr-hydration',
        title: 'SSR Hydration & Metadata',
        summary: 'Explore isomorphic execution, document headers, and client hydration contracts.',
        difficulty: 'ADVANCED',
        estimatedMinutes: 25,
        officialDocUrl: 'https://tanstack.com/start/latest/docs/framework/react/overview',
        isCompleted: false,
      },
    ],
  },
  {
    id: 'db',
    name: 'TanStack DB',
    shortName: 'DB',
    packageName: '@tanstack/db',
    version: '1.0.0-rc.1',
    description: 'Local-first reactive client store designed for high-performance data synchronization.',
    iconName: 'HardDrive',
    color: '#ec4899',
    maturity: 'RELEASE_CANDIDATE',
    officialDocUrl: 'https://tanstack.com',
    topics: [
      {
        id: 'db-collections',
        title: 'Collections & Local Queries',
        summary: 'Create client-side data collections with reactive querying and change tracking.',
        difficulty: 'INTERMEDIATE',
        estimatedMinutes: 20,
        officialDocUrl: 'https://tanstack.com',
        isCompleted: false,
      },
    ],
  },
  {
    id: 'store',
    name: 'TanStack Store',
    shortName: 'Store',
    packageName: '@tanstack/store',
    version: '0.11.2',
    description: 'Framework-agnostic, lightweight reactive state container with derived selectors.',
    iconName: 'Box',
    color: '#6366f1',
    maturity: 'STABLE',
    officialDocUrl: 'https://tanstack.com/store/latest',
    topics: [
      {
        id: 'store-basics',
        title: 'Standalone Reactive State',
        summary: 'Define stores outside React and subscribe components with fine-grained selectors.',
        difficulty: 'BEGINNER',
        estimatedMinutes: 15,
        officialDocUrl: 'https://tanstack.com/store/latest/docs/guide/introduction',
        isCompleted: false,
      },
    ],
  },
  {
    id: 'pacer',
    name: 'TanStack Pacer',
    shortName: 'Pacer',
    packageName: '@tanstack/pacer',
    version: '0.23.1',
    description: 'Headless utilities for debouncing, throttling, rate-limiting, and task queue coordination.',
    iconName: 'Gauge',
    color: '#14b8a6',
    maturity: 'BETA',
    officialDocUrl: 'https://github.com/tanstack/pacer',
    topics: [
      {
        id: 'pacer-debouncing',
        title: 'Debouncing & Task Queues',
        summary: 'Tame rapid user inputs and batch asynchronous operations with Pacer queues.',
        difficulty: 'BEGINNER',
        estimatedMinutes: 15,
        officialDocUrl: 'https://github.com/tanstack/pacer',
        isCompleted: false,
      },
    ],
  },
  {
    id: 'devtools',
    name: 'TanStack Devtools',
    shortName: 'Devtools',
    packageName: '@tanstack/react-query-devtools',
    version: '5.105.0',
    description: 'Visual inspectors and live state debugging panels for TanStack Query and Router.',
    iconName: 'Wrench',
    color: '#f97316',
    maturity: 'STABLE',
    officialDocUrl: 'https://tanstack.com',
    topics: [
      {
        id: 'devtools-inspection',
        title: 'Inspecting Query Cache & Traces',
        summary: 'Mount embedded query devtools to inspect query keys, states, and cache timers.',
        difficulty: 'BEGINNER',
        estimatedMinutes: 15,
        officialDocUrl: 'https://tanstack.com',
        isCompleted: false,
      },
    ],
  },
  {
    id: 'ranger',
    name: 'TanStack Ranger',
    shortName: 'Ranger',
    packageName: '@tanstack/react-ranger',
    version: '0.0.5',
    description: 'Headless range, slider, and multi-handle selector logic.',
    iconName: 'Sliders',
    color: '#84cc16',
    maturity: 'ALPHA',
    officialDocUrl: 'https://tanstack.com/ranger/latest',
    topics: [
      {
        id: 'ranger-multi-slider',
        title: 'Multi-Handle Sliders',
        summary: 'Build custom accessible range sliders with multiple drag handles.',
        difficulty: 'INTERMEDIATE',
        estimatedMinutes: 15,
        officialDocUrl: 'https://tanstack.com/ranger/latest',
        isCompleted: false,
      },
    ],
  },
  {
    id: 'hotkeys',
    name: 'TanStack Hotkeys',
    shortName: 'Hotkeys',
    packageName: '@tanstack/react-hotkeys',
    version: '0.17.0',
    description: 'Headless keyboard shortcut manager for complex web applications.',
    iconName: 'Keyboard',
    color: '#a855f7',
    maturity: 'BETA',
    officialDocUrl: 'https://github.com/tanstack/hotkeys',
    topics: [
      {
        id: 'hotkeys-sequences',
        title: 'Key Combinations & Scopes',
        summary: 'Bind application actions to key combinations and scoped modal boundaries.',
        difficulty: 'BEGINNER',
        estimatedMinutes: 15,
        officialDocUrl: 'https://github.com/tanstack/hotkeys',
        isCompleted: false,
      },
    ],
  },
  {
    id: 'ai',
    name: 'TanStack AI',
    shortName: 'AI',
    packageName: '@tanstack/ai',
    version: '1.0.1',
    description: 'Streaming AI workflow coordination and model tool calling orchestration.',
    iconName: 'Sparkles',
    color: '#e11d48',
    maturity: 'RELEASE_CANDIDATE',
    officialDocUrl: 'https://github.com/tanstack/ai',
    topics: [
      {
        id: 'ai-tool-streams',
        title: 'Streaming Tool Invocations',
        summary: 'Coordinate streaming LLM responses and client tool callbacks.',
        difficulty: 'ADVANCED',
        estimatedMinutes: 20,
        officialDocUrl: 'https://github.com/tanstack/ai',
        isCompleted: false,
      },
    ],
  },
]

export const TOTAL_LIBRARIES = TANSTACK_LIBRARIES.length
export const TOTAL_LESSONS = TANSTACK_LIBRARIES.reduce(
  (acc, lib) => acc + lib.topics.length,
  0
)
export const COMPLETED_LESSONS = TANSTACK_LIBRARIES.reduce(
  (acc, lib) => acc + lib.topics.filter((t) => t.isCompleted).length,
  0
)
export const BOOKMARKED_LESSONS = TANSTACK_LIBRARIES.flatMap((lib) =>
  lib.topics
    .filter((t) => t.isBookmarked)
    .map((topic) => ({ ...topic, libraryId: lib.id, libraryName: lib.name }))
)
export const RECENTLY_VISITED = TANSTACK_LIBRARIES.flatMap((lib) =>
  lib.topics
    .filter((t) => t.lastVisited)
    .map((topic) => ({ ...topic, libraryId: lib.id, libraryName: lib.name }))
)

