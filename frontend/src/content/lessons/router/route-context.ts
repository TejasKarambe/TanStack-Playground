import type { LessonManifest } from '../../types'

export const routerRouteContextLesson: LessonManifest = {
  id: 'router-route-context',
  libraryId: 'router',
  topicId: 'router-context',
  title: 'Route Context: Dependency Injection across Route Trees',
  description: 'Provide global dependencies, auth state, and API clients to loaders, guards, and route components with zero boilerplate.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/router/latest/docs/framework/react/guide/router-context',
  learningObjectives: [
    'Define strongly typed context using createRootRouteWithContext<TRouterContext>().',
    'Pass context instances when constructing createRouter({ routeTree, context }).',
    'Access context in route loaders and beforeLoad hooks via ({ context }) argument.',
    'Update router context dynamically with router.update({ context: newContext }).',
  ],
  conceptSections: [
    {
      title: 'Type-Safe Dependency Injection',
      content:
        'Instead of relying on global singleton imports or nested React Context providers that are inaccessible during pre-render loaders, TanStack Router allows you to define a strongly-typed router context. This context is injected directly into every loader, guard, and component.',
    },
    {
      title: 'Context Propagation in Nested Routes',
      content:
        'Parent routes can also append or modify context for their child routes using context: ({ context }) => ({ ...context, additionalData }). Child routes inherit this enriched context seamlessly.',
    },
  ],
  importantApis: [
    {
      name: 'createRootRouteWithContext<T>()',
      signature: 'createRootRouteWithContext<{ user: User | null; api: ApiClient }>()',
      description: 'Creates a root route that enforces the structure of injected context.',
    },
    {
      name: 'router.update({ context })',
      signature: 'router.update({ context: Partial<TRouterContext> })',
      description: 'Dynamically updates context (such as when user logs in/out) and invalidates affected routes.',
    },
  ],
  previewInstructions: 'Use the "Switch User Role" button to toggle between Admin and Member. Notice how the route context immediately re-evaluates permissions and available navigation items.',
  expectedResult: 'A reactive dashboard demonstrating route-level permission resolution driven by injected router context.',
  commonMistakes: [
    {
      mistake: 'Trying to call React hooks like useContext inside route loaders.',
      fix: 'Pass dependencies through router context instead, which is accessible directly inside loaders: loader: ({ context }) => ...',
    },
  ],
  interviewQuestions: [
    {
      question: 'Why is Router Context superior to React Context for loaders and routing guards?',
      answer:
        'React Context only exists during the component render phase. Router Context is available before rendering begins, enabling loaders and beforeLoad hooks to execute without mounting React provider trees.',
    },
  ],
  example: {
    id: 'example-router-context',
    title: 'Dynamic Router Context & Permission Gates',
    description: 'Injecting auth and feature flag context into route loaders and inspecting inherited context values.',
    entryFile: '/App.tsx',
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
  Outlet,
  Link,
  useRouteContext,
} from '@tanstack/react-router';
import { Shield, UserCheck, Key, Lock, Terminal } from 'lucide-react';

// Context Interface
interface RouterContext {
  currentUser: {
    name: string;
    role: 'ADMIN' | 'MEMBER';
    token: string;
  };
  features: {
    auditLogs: boolean;
    billing: boolean;
  };
}

// 1. Root Route with Enforced Context
const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => {
    const context = useRouteContext({ from: '__root__' });

    return (
      <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '620px', margin: '0 auto', background: '#ffffff', minHeight: '100vh' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={22} color="#7c3aed" />
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Context Gateway</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', background: context.currentUser.role === 'ADMIN' ? '#f3e8ff' : '#f1f5f9', color: context.currentUser.role === 'ADMIN' ? '#7c3aed' : '#475569', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
              {context.currentUser.role}
            </span>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <Link
            to="/"
            style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '13px', textDecoration: 'none', color: '#475569', border: '1px solid #e2e8f0' }}
            activeProps={{ style: { background: '#7c3aed', color: '#fff', borderColor: '#7c3aed', fontWeight: 600 } }}
          >
            Dashboard
          </Link>
          <Link
            to="/admin-audit"
            style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '13px', textDecoration: 'none', color: '#475569', border: '1px solid #e2e8f0' }}
            activeProps={{ style: { background: '#7c3aed', color: '#fff', borderColor: '#7c3aed', fontWeight: 600 } }}
          >
            Admin Audit Logs
          </Link>
        </div>

        <Outlet />
      </div>
    );
  },
});

// 2. Dashboard Route
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    const context = useRouteContext({ from: '/' });

    return (
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>User Session & Context</h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
          Context passed down to this route:
        </p>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div><strong>Active Identity:</strong> {context.currentUser.name}</div>
          <div><strong>Role:</strong> {context.currentUser.role}</div>
          <div><strong>Audit Logs Feature:</strong> {context.features.auditLogs ? 'Enabled' : 'Disabled'}</div>
        </div>
      </div>
    );
  },
});

// 3. Admin Audit Route (Context Guarded)
const auditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin-audit',
  loader: ({ context }) => {
    if (context.currentUser.role !== 'ADMIN') {
      return { accessGranted: false, reason: 'Insufficient privileges: Requires ADMIN role in context.' };
    }
    return {
      accessGranted: true,
      logs: [
        { id: 1, action: 'Updated security policy', user: 'admin@system.local', time: '10:14 AM' },
        { id: 2, action: 'Regenerated OAuth secret', user: 'admin@system.local', time: '11:02 AM' },
      ],
    };
  },
  component: () => {
    const data = auditRoute.useLoaderData();

    if (!data.accessGranted) {
      return (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
          <Lock size={32} color="#dc2626" style={{ margin: '0 auto 8px auto' }} />
          <h4 style={{ margin: '0 0 4px 0', color: '#991b1b' }}>Access Restricted</h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#b91c1c' }}>{data.reason}</p>
        </div>
      );
    }

    return (
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#0f172a' }}>System Audit Records</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {data.logs?.map((log) => (
            <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '6px', fontSize: '13px', border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontWeight: 600 }}>{log.action}</span>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>by {log.user}</span>
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
});

// Create Route Tree
const routeTree = rootRoute.addChildren([dashboardRoute, auditRoute]);
const memoryHistory = createMemoryHistory({ initialEntries: ['/'] });

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  // Dynamic context passed to router
  const currentContext: RouterContext = {
    currentUser: {
      name: isAdmin ? 'Tejas (System Admin)' : 'Guest Reviewer',
      role: isAdmin ? 'ADMIN' : 'MEMBER',
      token: 'jwt_mock_token_777',
    },
    features: {
      auditLogs: isAdmin,
      billing: true,
    },
  };

  const router = createRouter({
    routeTree,
    history: memoryHistory,
    context: currentContext,
  });

  return (
    <div>
      <div style={{ maxWidth: '620px', margin: '0 auto 10px auto', display: 'flex', justifyContent: 'flex-end', padding: '0 20px' }}>
        <button
          onClick={() => setIsAdmin(!isAdmin)}
          style={{ background: isAdmin ? '#7c3aed' : '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <UserCheck size={14} />
          <span>Toggle Role: {isAdmin ? 'Switch to Member' : 'Promote to Admin'}</span>
        </button>
      </div>
      <RouterProvider router={router} />
    </div>
  );
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

