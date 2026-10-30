import type { LessonManifest } from '../../types'

export const routerDynamicRoutesLesson: LessonManifest = {
  id: 'router-dynamic-routes',
  libraryId: 'router',
  topicId: 'router-dynamic-routes',
  title: 'Dynamic Routes: Path Parameters & useParams',
  description: 'Parse URL segments dynamically with $param tokens and strongly typed useParams hook.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/router/latest/docs/framework/react/guide/path-params',
  learningObjectives: [
    'Declare dynamic path segments using $param syntax (e.g. /posts/$postId).',
    'Extract strongly-typed route params via useParams().',
    'Pass typed params into <Link params={{ postId }} />.',
    'Handle 404 / missing parameter states gracefully.',
  ],
  conceptSections: [
    {
      title: 'Dollar Sign Path Tokens',
      content:
        'In TanStack Router, dynamic path segments are prefixed with a dollar sign: $postId. The token name becomes the key in the params object. For instance, path: "/courses/$courseId/lessons/$lessonId" generates params: { courseId: string, lessonId: string } automatically.',
    },
    {
      title: 'Strongly Typed useParams',
      content:
        'useParams({ from: "/posts/$postId" }) provides compile-time safety. If you attempt to access an undeclared property (e.g. params.slug), TypeScript flags it as a compile error.',
    },
  ],
  importantApis: [
    {
      name: 'createRoute({ path: "/posts/$postId" })',
      signature: 'path: "$paramName"',
      description: 'Designates a dynamic variable segment in the URL.',
    },
    {
      name: 'useParams({ from })',
      signature: 'const params = useParams({ from: string })',
      description: 'Hook to extract typed parameters from the active route context.',
    },
  ],
  previewInstructions: 'Click on any post in the list to navigate to its dynamic detail route (e.g. /posts/2). Click "Back to Posts" to return.',
  expectedResult: 'Smooth master-detail navigation with URL params accurately parsed and rendered.',
  commonMistakes: [
    {
      mistake: 'Using colon syntax like "/posts/:postId" from older routers.',
      fix: 'TanStack Router uses the dollar sign syntax: "/posts/$postId".',
    },
  ],
  interviewQuestions: [
    {
      question: 'Why does useParams require the { from } option in TanStack Router?',
      answer:
        'The { from: "/route/path" } option grounds the hook in a specific route definition, allowing TypeScript to narrow the return type to the exact params declared on that route.',
    },
  ],
  example: {
    id: 'router-dynamic-routes-example',
    title: 'Master-Detail Routing with $postId',
    description: 'Dynamic params parsing and typed link navigation.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-router': '^1.170.46',
      'lucide-react': '^1.65.0',
    },
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
  useParams,
} from '@tanstack/react-router';
import { BookOpen, ArrowLeft, ChevronRight, FileText } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  content: string;
}

const ARTICLES: Article[] = [
  { id: '1', title: 'Why TanStack Router changes client SPA routing', category: 'Architecture', readTime: '5 min', content: 'Type-safety ensures links never break and refactoring routes across large applications is effortless.' },
  { id: '2', title: 'Deep dive into deterministic Query keys', category: 'TanStack Query', readTime: '7 min', content: 'Deterministic hashing removes order dependency from key objects, eliminating subtle cache duplication bugs.' },
  { id: '3', title: 'DOM Virtualization with 60 FPS scrolling', category: 'Performance', readTime: '4 min', content: 'Virtualization renders only visible DOM nodes plus a configurable overscan buffer to prevent layout thrashing.' },
];

const rootRoute = createRootRoute({
  component: () => (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f8fafc', padding: '24px' }}>
      <header style={{ maxWidth: '600px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BookOpen size={20} color="#10b981" />
        <h1 style={{ fontSize: '18px', margin: 0 }}>Engineering Articles</h1>
      </header>
      <main style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  ),
});

// List Route
const articlesIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div style={{ display: 'grid', gap: '10px' }}>
      {ARTICLES.map((article) => (
        <Link
          key={article.id}
          to="/articles/$articleId"
          params={{ articleId: article.id }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            textDecoration: 'none',
            color: '#0f172a',
            transition: 'border-color 0.15s ease',
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{article.title}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {article.category} • {article.readTime}
            </div>
          </div>
          <ChevronRight size={18} color="#94a3b8" />
        </Link>
      ))}
    </div>
  ),
});

// Dynamic Detail Route: /articles/$articleId
const articleDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/articles/$articleId',
  component: () => {
    const { articleId } = useParams({ from: '/articles/$articleId' });
    const article = ARTICLES.find((a) => a.id === articleId);

    if (!article) {
      return (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <p>Article #{articleId} not found.</p>
          <Link to="/" style={{ color: '#10b981', fontSize: '13px' }}>Back to articles</Link>
        </div>
      );
    }

    return (
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#10b981',
            textDecoration: 'none',
            marginBottom: '16px',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={14} /> Back to Articles
        </Link>

        <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: '#ecfdf5', color: '#065f46', marginBottom: '8px' }}>
          {article.category}
        </span>
        <h2 style={{ margin: '0 0 12px', fontSize: '18px' }}>{article.title}</h2>
        <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>{article.content}</p>

        <footer style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', fontSize: '11px', color: '#94a3b8' }}>
          Route matched: <code>/articles/{articleId}</code>
        </footer>
      </div>
    );
  },
});

const routeTree = rootRoute.addChildren([articlesIndexRoute, articleDetailRoute]);
const memoryHistory = createMemoryHistory({ initialEntries: ['/'] });
const router = createRouter({ routeTree, history: memoryHistory });

export default function App() {
  return <RouterProvider router={router} />;
}
`,
      },
    },
  },
}

