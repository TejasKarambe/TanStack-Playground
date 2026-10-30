import type { LessonManifest } from '../../types'

export const routerNavigationLesson: LessonManifest = {
  id: 'router-navigation',
  libraryId: 'router',
  topicId: 'router-navigation',
  title: 'Programmatic Navigation: useNavigate & History Controls',
  description: 'Master imperative navigation, stateful transitions, back/forward history traversal, and active route exploration.',
  difficulty: 'BEGINNER',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/router/latest/docs/framework/react/guide/navigation',
  learningObjectives: [
    'Use useNavigate() hook to trigger imperative route transitions in response to events.',
    'Navigate with typed parameters and search query updates.',
    'Utilize router.history.back() and router.history.forward() for browser history traversal.',
    'Inspect real-time routing state using useRouterState() in a dedicated Route Explorer.',
  ],
  conceptSections: [
    {
      title: 'Imperative vs Declarative Navigation',
      content:
        'While <Link /> is the primary declarative component for user interactions, programmatic transitions via useNavigate() are essential for post-submission redirects, timed delays, keyboard shortcuts, or wizard progressions.',
    },
    {
      title: 'Type Safety in useNavigate()',
      content:
        'useNavigate() derives strict parameter requirements from your route tree. Calling navigate({ to: "/users/$id", params: { id: "42" } }) verifies that the required $id parameter is supplied, preventing broken URLs.',
    },
  ],
  importantApis: [
    {
      name: 'useNavigate()',
      signature: 'const navigate = useNavigate()',
      description: 'Provides the navigate function to programmatically change routes.',
    },
    {
      name: 'useRouterState()',
      signature: 'const routerState = useRouterState()',
      description: 'Subscribes to router lifecycle changes, location pathname, and pending transitions.',
    },
  ],
  previewInstructions: 'Use the step buttons to navigate to different checkout stages, trigger simulated submit redirects, and observe the live Route Explorer display.',
  expectedResult: 'A step-by-step navigation wizard that updates route parameters and displays the exact router state.',
  commonMistakes: [
    {
      mistake: 'Passing untyped string paths to navigate without parameter validation.',
      fix: 'Use structured navigation: navigate({ to: "/step/$stepId", params: { stepId: "2" } }).',
    },
  ],
  interviewQuestions: [
    {
      question: 'How does TanStack Router ensure navigate calls remain type-safe during refactoring?',
      answer:
        'TanStack Router generates or infers route declaration types. If a route path changes or required params change, TypeScript marks any outdated navigate() calls as compile errors.',
    },
  ],
  example: {
    id: 'example-router-navigation',
    title: 'Interactive Navigation Wizard & Route Explorer',
    description: 'Programmatic navigation controls with back/forward history actions and a real-time router state inspector.',
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
  useNavigate,
  useRouterState,
  useParams,
} from '@tanstack/react-router';
import {
  Compass,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Terminal,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

// Route Explorer Component
function RouteExplorer() {
  const routerState = useRouterState();
  return (
    <div style={{ marginTop: '24px', background: '#0f172a', color: '#e2e8f0', borderRadius: '8px', padding: '16px', fontSize: '12px', fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#38bdf8', fontWeight: 600 }}>
        <Terminal size={14} />
        <span>Active Route Explorer</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '4px' }}>
        <span style={{ color: '#94a3b8' }}>Pathname:</span>
        <span style={{ color: '#a7f3d0', fontWeight: 'bold' }}>{routerState.location.pathname}</span>
        <span style={{ color: '#94a3b8' }}>Status:</span>
        <span>{routerState.status}</span>
        <span style={{ color: '#94a3b8' }}>Matches:</span>
        <span>{routerState.matches.map((m) => m.routeId).join(' -> ')}</span>
      </div>
    </div>
  );
}

// 1. Root Layout Route
const rootRoute = createRootRoute({
  component: () => (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto', background: '#ffffff', minHeight: '100vh' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={22} color="#2563eb" />
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Order Setup Wizard</h2>
        </div>
        <Link to="/" style={{ fontSize: '12px', color: '#64748b', textDecoration: 'none' }}>
          Reset to Start
        </Link>
      </header>
      <Outlet />
      <RouteExplorer />
    </div>
  ),
});

// 2. Wizard Start Route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    const navigate = useNavigate();
    return (
      <div style={{ textAlign: 'center', padding: '30px 10px' }}>
        <div style={{ display: 'inline-flex', padding: '12px', background: '#eff6ff', borderRadius: '50%', color: '#2563eb', marginBottom: '16px' }}>
          <Sparkles size={32} />
        </div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>Configure Your Deployment</h3>
        <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '400px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
          Demonstrating imperative navigation using useNavigate() with strongly typed parameters.
        </p>
        <button
          onClick={() => navigate({ to: '/step/$stepId', params: { stepId: '1' } })}
          style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <span>Begin Setup</span>
          <ArrowRight size={16} />
        </button>
      </div>
    );
  },
});

// 3. Step Route
const stepRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/step/$stepId',
  component: () => {
    const params = useParams({ from: '/step/$stepId' });
    const navigate = useNavigate();
    const stepNum = parseInt(params.stepId, 10);

    const steps = [
      { id: 1, title: 'Choose Cloud Region', detail: 'Select primary latency target (e.g., us-east, eu-central).' },
      { id: 2, title: 'Configure Database Node', detail: 'Select compute tier and PostgreSQL connection pooling.' },
      { id: 3, title: 'Finalize & Deploy', detail: 'Confirm environment variables and launch deployment.' },
    ];

    const currentStep = steps.find((s) => s.id === stepNum) || steps[0];

    const handleNext = () => {
      if (stepNum < 3) {
        navigate({ to: '/step/$stepId', params: { stepId: String(stepNum + 1) } });
      } else {
        navigate({ to: '/success' });
      }
    };

    const handlePrev = () => {
      if (stepNum > 1) {
        navigate({ to: '/step/$stepId', params: { stepId: String(stepNum - 1) } });
      } else {
        navigate({ to: '/' });
      }
    };

    return (
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
            Step {currentStep.id} of 3
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Wizard In-Memory Route</span>
        </div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#0f172a' }}>{currentStep.title}</h4>
        <p style={{ margin: '0 0 24px 0', color: '#475569', fontSize: '13px' }}>{currentStep.detail}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={handlePrev}
            style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <button
            onClick={handleNext}
            style={{ background: '#2563eb', border: 'none', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {stepNum === 3 ? 'Deploy Now' : 'Continue'} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  },
});

// 4. Success Route
const successRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/success',
  component: () => {
    const navigate = useNavigate();
    return (
      <div style={{ textAlign: 'center', padding: '30px 10px' }}>
        <div style={{ display: 'inline-flex', padding: '12px', background: '#ecfdf5', borderRadius: '50%', color: '#059669', marginBottom: '16px' }}>
          <CheckCircle2 size={36} />
        </div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#065f46' }}>Deployment Successful!</h3>
        <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
          The deployment pipeline finished and redirected to this completion route.
        </p>
        <button
          onClick={() => navigate({ to: '/' })}
          style={{ background: '#059669', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <RotateCcw size={14} /> Restart Wizard
        </button>
      </div>
    );
  },
});

// Assemble Route Tree & Memory Router
const routeTree = rootRoute.addChildren([indexRoute, stepRoute, successRoute]);
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

