import type { LessonManifest } from '../../types'

export const routerLoadersLesson: LessonManifest = {
  id: 'router-loaders',
  libraryId: 'router',
  topicId: 'router-loaders',
  title: 'Route Loaders: Async Data Fetching & useLoaderData',
  description: 'Preload data before component rendering, eliminate loading water-falls, and consume loader data type-safely.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/router/latest/docs/framework/react/guide/data-loading',
  learningObjectives: [
    'Define async route loaders using loader: async ({ params }) => ...',
    'Retrieve strongly-typed loaded data with useLoaderData().',
    'Display pending fallback interfaces with pendingComponent.',
    'Enable link prefetching on hover to load data before user clicks.',
  ],
  conceptSections: [
    {
      title: 'Eliminating the "Fetch-on-Render" Waterfall',
      content:
        'In traditional React applications, a component renders, triggers an effect, shows a spinner, and then renders children which repeat the same cycle. TanStack Router runs loaders in parallel as soon as the target route matches, preloading all necessary data before the UI is committed.',
    },
    {
      title: 'Type Inference with useLoaderData()',
      content:
        'Whatever your loader returns (e.g. Promise<{ user: User, invoices: Invoice[] }>) is automatically inferred by useLoaderData({ from: "/users/$id" }), providing 100% type-safe data access without manual interface casting.',
    },
  ],
  importantApis: [
    {
      name: 'loader: async ({ params, context })',
      signature: 'loader: async ({ params }) => Promise<T>',
      description: 'Asynchronously fetches data required for the route before component mount.',
    },
    {
      name: 'useLoaderData()',
      signature: 'const data = useLoaderData({ from: "/route" })',
      description: 'Hook that retrieves the resolved payload returned by the route loader.',
    },
    {
      name: 'pendingComponent',
      signature: 'pendingComponent: () => <LoadingSpinner />',
      description: 'UI rendered while route loaders are actively executing.',
    },
  ],
  previewInstructions: 'Click between "Project Alpha", "Project Beta", and "Project Gamma". Notice the simulated network loader delay, pending skeleton, and instant cached return.',
  expectedResult: 'A project dashboard where switching routes executes async loaders and passes typed payloads to child components.',
  commonMistakes: [
    {
      mistake: 'Triggering fetch calls inside useEffect when using TanStack Router.',
      fix: 'Move data fetching directly into the route loader function.',
    },
  ],
  interviewQuestions: [
    {
      question: 'What is the advantage of router loaders compared to component-level useEffect fetching?',
      answer:
        'Loaders can execute in parallel before rendering begins, support automatic prefetching on link hover, and eliminate nested loading spinners (waterfalls).',
    },
  ],
  example: {
    id: 'example-router-loaders',
    title: 'Async Route Loaders with Live Data Prefetching',
    description: 'Demonstrating route loader execution, useLoaderData consumption, and pending skeletons.',
    entryFile: '/App.tsx',
    files: {
      '/App.tsx': {
        code: `import React from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
  Outlet,
  Link,
  useLoaderData,
  useParams,
} from '@tanstack/react-router';
import { Layers, Folder, Clock, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';

// Simulated remote database
interface Project {
  id: string;
  name: string;
  category: string;
  lead: string;
  progress: number;
  tasks: string[];
}

const mockProjects: Record<string, Project> = {
  alpha: {
    id: 'alpha',
    name: 'Project Alpha (Core Engine)',
    category: 'Infrastructure',
    lead: 'Alex Mercer',
    progress: 84,
    tasks: ['Implement memory cache', 'Optimize event loop', 'Audit bundle budget'],
  },
  beta: {
    id: 'beta',
    name: 'Project Beta (Design System)',
    category: 'UI/UX',
    lead: 'Sarah Connor',
    progress: 62,
    tasks: ['Tokenize dark theme', 'Standardize dialog primitives', 'Accessibility pass'],
  },
  gamma: {
    id: 'gamma',
    name: 'Project Gamma (API Gateway)',
    category: 'Backend',
    lead: 'David Miller',
    progress: 95,
    tasks: ['Rate-limiting middleware', 'Zero-downtime deployment', 'OpenAPI schema validation'],
  },
};

// 1. Root Layout Route
const rootRoute = createRootRoute({
  component: () => (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '24px', maxWidth: '650px', margin: '0 auto', background: '#ffffff', minHeight: '100vh' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={22} color="#0284c7" />
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Project Workspace</h2>
        </div>
        <Link to="/" style={{ fontSize: '13px', color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Folder size={14} /> All Projects
        </Link>
      </header>
      <Outlet />
    </div>
  ),
});

// 2. Index Route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Select a Project</h3>
      <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 16px 0' }}>
        Hover over links to observe automatic prefetching. Clicking triggers the async route loader.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {Object.values(mockProjects).map((p) => (
          <Link
            key={p.id}
            to="/projects/$projectId"
            params={{ projectId: p.id }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              color: '#0f172a',
              background: '#f8fafc',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{p.name}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Category: {p.category} • Lead: {p.lead}</div>
            </div>
            <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 600 }}>Load &rarr;</span>
          </Link>
        ))}
      </div>
    </div>
  ),
});

// 3. Project Detail Route with Loader
const projectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$projectId',
  loader: async ({ params }) => {
    // Artificial 500ms network delay to demonstrate loader behavior
    await new Promise((resolve) => setTimeout(resolve, 500));
    const project = mockProjects[params.projectId];
    if (!project) throw new Error('Project not found');
    return { project, loadedAt: new Date().toLocaleTimeString() };
  },
  pendingComponent: () => (
    <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '8px' }}>
      <Loader2 size={28} className="animate-spin" color="#0284c7" style={{ margin: '0 auto 12px auto' }} />
      <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>Executing Route Loader...</div>
      <div style={{ fontSize: '12px', color: '#64748b' }}>Preloading project payload before rendering component</div>
    </div>
  ),
  component: () => {
    const { project, loadedAt } = useLoaderData({ from: '/projects/$projectId' });

    return (
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#0284c7', background: '#e0f2fe', padding: '4px 8px', borderRadius: '4px' }}>
            {project.category}
          </span>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> Loader resolved at: {loadedAt}
          </span>
        </div>

        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0f172a' }}>{project.name}</h3>
        <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px 0' }}>Project Manager: {project.lead}</p>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: \`\${project.progress}%\`, height: '100%', background: '#0284c7', borderRadius: '4px' }} />
          </div>
        </div>

        <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 10px 0', color: '#334155' }}>Active Milestones</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {project.tasks.map((task, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
              <CheckCircle2 size={15} color="#10b981" />
              <span>{task}</span>
            </div>
          ))}
        </div>

        <Link
          to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b', textDecoration: 'none', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px' }}
        >
          <ArrowLeft size={14} /> Back to Projects
        </Link>
      </div>
    );
  },
});

// Build Route Tree & Isolated Memory Router
const routeTree = rootRoute.addChildren([indexRoute, projectDetailRoute]);
const memoryHistory = createMemoryHistory({ initialEntries: ['/'] });
const router = createRouter({ routeTree, history: memoryHistory });

export default function App() {
  return <RouterProvider router={router} />;
}
`,
      },
    },
    dependencies: {
      '@tanstack/react-router': '^1.170.46',
      'lucide-react': '^1.65.0',
    },
  },
}

