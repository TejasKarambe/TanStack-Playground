import type { LessonManifest } from '../../types'

export const routerAuthGuardsLesson: LessonManifest = {
  id: 'router-auth-guards',
  libraryId: 'router',
  topicId: 'router-auth-guards',
  title: 'Authentication Guards: Protected Routes & Redirects',
  description: 'Protect sensitive routes before component mounting using beforeLoad hooks, redirect triggers, and return URL preservation.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes',
  learningObjectives: [
    'Enforce route security using beforeLoad: ({ context, location }) => ...',
    'Throw redirect({ to: "/login", search: { redirect: location.href } }) on unauthenticated access.',
    'Preserve destination routes and redirect users back upon successful sign-in.',
    'Build protected route layout subtrees that inherit authentication requirements.',
  ],
  conceptSections: [
    {
      title: 'Zero Flash of Unauthenticated Content',
      content:
        'In client-side routers that check authentication inside useEffect, users momentarily see protected content or a jarring spinner before getting redirected. TanStack Router runs beforeLoad before any components mount or data loaders run, redirecting instantly without rendering protected UI.',
    },
    {
      title: 'Preserving Target URLs with Search Params',
      content:
        'When redirecting an unauthenticated user, passing the current location URL in search parameters allows the login screen to send the user directly back to their intended target once credentials are verified.',
    },
  ],
  importantApis: [
    {
      name: 'beforeLoad',
      signature: 'beforeLoad: ({ context, location }) => void | Promise<void>',
      description: 'Hook executed before route loaders and component rendering. Can throw redirect().',
    },
    {
      name: 'throw redirect(options)',
      signature: 'throw redirect({ to: "/login", search: { redirect: string } })',
      description: 'Halts route matching and immediately redirects to another route.',
    },
  ],
  previewInstructions: 'Try clicking on "Account Settings" or "Billing". Notice you are immediately bounced to the Login form with the target preserved. Click "Sign In with Demo Account" to authenticate and automatically return.',
  expectedResult: 'Instant route protection with seamless post-login redirection and sign-out capabilities.',
  commonMistakes: [
    {
      mistake: 'Returning redirect() instead of throwing redirect().',
      fix: 'You must throw redirect(...) to abort the current route transition immediately.',
    },
  ],
  interviewQuestions: [
    {
      question: 'Why does TanStack Router use thrown redirects rather than returned redirects in beforeLoad?',
      answer:
        'Throwing redirect() halts JavaScript execution immediately, guaranteeing that subsequent loaders and components for the protected route will never run or leak sensitive data.',
    },
  ],
  example: {
    id: 'example-router-auth-guards',
    title: 'Protected Route Hierarchy with Return-to URL',
    description: 'Intercepting unauthenticated navigation with beforeLoad and redirecting with return URL tracking.',
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
  useNavigate,
  useSearch,
  redirect,
} from '@tanstack/react-router';
import { ShieldCheck, Lock, LogIn, LogOut, User, CreditCard, ChevronRight } from 'lucide-react';

interface AuthContext {
  auth: {
    isAuthenticated: boolean;
    user: { name: string; email: string } | null;
  };
}

// 1. Root Route
const rootRoute = createRootRouteWithContext<AuthContext>()({
  component: () => (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto', background: '#ffffff', minHeight: '100vh' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={22} color="#16a34a" />
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Security Portal</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#475569' }} activeProps={{ style: { fontWeight: 700, color: '#16a34a' } }}>
            Public Home
          </Link>
          <Link to="/account" style={{ textDecoration: 'none', color: '#475569' }} activeProps={{ style: { fontWeight: 700, color: '#16a34a' } }}>
            Account (Protected)
          </Link>
          <Link to="/billing" style={{ textDecoration: 'none', color: '#475569' }} activeProps={{ style: { fontWeight: 700, color: '#16a34a' } }}>
            Billing (Protected)
          </Link>
        </div>
      </header>
      <Outlet />
    </div>
  ),
});

// 2. Public Home Route
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Public Landing Area</h3>
      <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
        Anyone can view this route without credentials. Try clicking "Account" or "Billing" in the navigation bar to test the beforeLoad guard.
      </p>
    </div>
  ),
});

// 3. Login Route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : '/',
  }),
  component: () => {
    const { redirect: redirectUrl } = useSearch({ from: '/login' });

    return (
      <div style={{ background: '#ffffff', border: '1px solid #fed7aa', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '12px', background: '#fff7ed', borderRadius: '50%', color: '#ea580c', marginBottom: '12px' }}>
          <Lock size={28} />
        </div>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#9a3412' }}>Authentication Required</h3>
        <p style={{ fontSize: '13px', color: '#c2410c', margin: '0 0 16px 0' }}>
          Destination preserved: <code>{redirectUrl}</code>
        </p>
        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 20px 0' }}>
          Clicking below logs you into the demo session and redirects you directly to your target.
        </p>
        <button
          onClick={() => (window as any).__demoLogin(redirectUrl)}
          style={{ background: '#ea580c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <LogIn size={15} /> Sign In with Demo Account
        </button>
      </div>
    );
  },
});

// 4. Protected Parent Route with beforeLoad Guard
const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_authenticated',
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
  component: () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ecfdf5', padding: '10px 16px', borderRadius: '6px', marginBottom: '16px', border: '1px solid #a7f3d0' }}>
        <span style={{ fontSize: '12px', color: '#065f46', fontWeight: 600 }}>
          ✓ Authenticated as Demo User (demo@tanstack.dev)
        </span>
        <button
          onClick={() => (window as any).__demoLogout()}
          style={{ background: '#fff', border: '1px solid #cbd5e1', color: '#dc2626', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <LogOut size={12} /> Sign Out
        </button>
      </div>
      <Outlet />
    </div>
  ),
});

// Protected Child 1: Account
const accountRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/account',
  component: () => (
    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <User size={18} color="#2563eb" />
        <span>User Profile & Security Keys</span>
      </h3>
      <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
        This page was reached only after passing through the beforeLoad authentication barrier.
      </p>
    </div>
  ),
});

// Protected Child 2: Billing
const billingRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/billing',
  component: () => (
    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CreditCard size={18} color="#059669" />
        <span>Enterprise Billing & Invoices</span>
      </h3>
      <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
        Active plan: TanStack Pro Organization. Next invoice scheduled for the 1st of next month.
      </p>
    </div>
  ),
});

// Build Route Tree
const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  protectedRoute.addChildren([accountRoute, billingRoute]),
]);

const memoryHistory = createMemoryHistory({ initialEntries: ['/'] });

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = createRouter({
    routeTree,
    history: memoryHistory,
    context: {
      auth: {
        isAuthenticated,
        user: isAuthenticated ? { name: 'Demo User', email: 'demo@tanstack.dev' } : null,
      },
    },
  });

  // Global helper bindings for isolated demo buttons
  (window as any).__demoLogin = (dest: string) => {
    setIsAuthenticated(true);
    setTimeout(() => {
      router.navigate({ to: dest as any });
    }, 50);
  };

  (window as any).__demoLogout = () => {
    setIsAuthenticated(false);
    setTimeout(() => {
      router.navigate({ to: '/' });
    }, 50);
  };

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

