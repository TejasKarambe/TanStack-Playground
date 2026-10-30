import type { LessonManifest } from '../../types'

export const startServerFunctionsLesson: LessonManifest = {
  id: 'start-server-functions',
  libraryId: 'start',
  topicId: 'start-server-functions',
  title: 'TanStack Start: Server Functions RPC & Client/Server Boundaries',
  description: 'Execute type-safe server code with createServerFn, input validation, and automatic RPC serialization.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/start/latest/docs/framework/react/server-functions',
  learningObjectives: [
    'Define server-side procedures using createServerFn({ method: "GET" | "POST" }).',
    'Enforce input payload validation schemas with validator(zodSchema).',
    'Observe the compiled client RPC stub that triggers POST requests across network boundaries.',
    'Simulate server-side logging, environment secrets access, and execution timing.',
  ],
  conceptSections: [
    {
      title: 'Full-Stack Type Safety with Server Functions',
      content:
        'In TanStack Start, server functions bridge client React components and server runtimes without needing manual API routes or fetch boilerplate. You define createServerFn() with server-only logic (such as SQL queries or secrets access). TanStack Start compiles the client call into a type-safe RPC request.',
    },
    {
      title: 'Security & Bundling Isolation',
      content:
        'Code written inside .handler(async ({ data }) => ...) is stripped from client JavaScript bundles during production builds. Database connections, secret API keys, and internal microservices never reach the browser.',
    },
  ],
  importantApis: [
    {
      name: 'createServerFn()',
      signature: 'createServerFn({ method: "POST" }).validator(...).handler(...)',
      description: 'Declares a server function callable from client components.',
    },
    {
      name: 'serverFn({ data })',
      signature: 'const result = await myServerFn({ data: payload })',
      description: 'Calls the server function from the client via automated JSON RPC.',
    },
  ],
  previewInstructions: 'Select a user lookup or submit a server audit command. Inspect the simulated "Server Execution Terminal" to watch server-side secret validation and RPC response timing.',
  expectedResult: 'A full-stack simulation demonstrating client RPC invocations, payload transmission, and secure server-side execution.',
  commonMistakes: [
    {
      mistake: 'Importing node-only modules directly into client components outside server functions.',
      fix: 'Keep server imports encapsulated inside server functions or .server.ts files.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How do TanStack Start server functions differ from traditional REST API controllers?',
      answer:
        'Server functions eliminate URL routing boilerplate, provide end-to-end TypeScript type inference for arguments and return types, and automatically handle serialization and cache integration with TanStack Query.',
    },
  ],
  example: {
    id: 'example-start-server-functions',
    title: 'Server Function RPC Simulator with Terminal Telemetry',
    description: 'Demonstrating createServerFn execution, client-side invocation, and server-side secret verification.',
    entryFile: '/App.tsx',
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import { Server, Terminal, Zap, Shield, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

interface ServerLog {
  id: number;
  timestamp: string;
  source: 'CLIENT_RPC' | 'SERVER_HANDLER';
  message: string;
}

export default function App() {
  const [userId, setUserId] = useState('usr_102');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [logs, setLogs] = useState<ServerLog[]>([
    {
      id: 1,
      timestamp: '16:00:00',
      source: 'SERVER_HANDLER',
      message: 'TanStack Start SSR engine listening on port 3000 (Node.js/Nitro)',
    },
  ]);

  // Simulation of createServerFn:
  // const getUserProfile = createServerFn({ method: 'GET' })
  //   .validator((id: string) => id)
  //   .handler(async ({ data }) => { ... })
  const handleCallServerFn = async () => {
    setIsLoading(true);
    setResult(null);

    const clientLog: ServerLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      source: 'CLIENT_RPC',
      message: \`[Client] Dispatching RPC: getUserProfile({ data: "\${userId}" })\`,
    };
    setLogs((prev) => [...prev, clientLog]);

    // Simulated network transmission & server processing
    await new Promise((r) => setTimeout(r, 650));

    const serverLog: ServerLog = {
      id: Date.now() + 1,
      timestamp: new Date().toLocaleTimeString(),
      source: 'SERVER_HANDLER',
      message: \`[Server] handler executed. Accessing DATABASE_URL securely. User verified in 12ms.\`,
    };
    setLogs((prev) => [...prev, serverLog]);

    const mockProfile = {
      id: userId,
      name: userId === 'usr_102' ? 'Alex Mercer' : 'Sarah Connor',
      email: \`\${userId}@tanstack.dev\`,
      tier: 'Enterprise Platinum',
      serverExecutionTimeMs: 14,
      databaseSecretAccessed: true,
    };

    setResult(mockProfile);
    setIsLoading(false);
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '640px', margin: '0 auto', background: '#ffffff', minHeight: '100vh' }}>
      <header style={{ marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <h2 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={20} color="#06b6d4" />
          <span>TanStack Start: Server Functions Simulator</span>
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Inspect type-safe RPC boundaries compiled with <code>createServerFn()</code>.
        </p>
      </header>

      {/* Code Architecture Card */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', marginBottom: '16px', fontSize: '12px' }}>
        <div style={{ fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Server/Client Separation Contract:</div>
        <pre style={{ margin: 0, background: '#0f172a', color: '#93c5fd', padding: '10px', borderRadius: '6px', overflowX: 'auto', fontFamily: 'monospace' }}>
{\`// 1. Server Definition (stripped from client bundle)
export const getUserProfile = createServerFn({ method: 'GET' })
  .validator((d: string) => d)
  .handler(async ({ data: id }) => {
    return await db.users.findUnique({ where: { id } });
  });

// 2. Client Invocation (transparent JSON RPC)
const profile = await getUserProfile({ data: 'usr_102' });\`}
        </pre>
      </div>

      {/* Trigger Controls */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
        >
          <option value="usr_102">Lookup User: usr_102 (Alex)</option>
          <option value="usr_205">Lookup User: usr_205 (Sarah)</option>
        </select>

        <button
          onClick={handleCallServerFn}
          disabled={isLoading}
          style={{
            background: '#0891b2',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
          <span>Invoke serverFn()</span>
        </button>
      </div>

      {/* Server Result */}
      {result && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065f46', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
            <CheckCircle2 size={16} /> RPC Call Resolved Successfully
          </div>
          <div style={{ fontSize: '12px', color: '#047857' }}>
            Name: <strong>{result.name}</strong> • Email: {result.email} • Tier: {result.tier} (Latency: {result.serverExecutionTimeMs}ms)
          </div>
        </div>
      )}

      {/* Server Terminal Log */}
      <div style={{ background: '#0f172a', color: '#f8fafc', borderRadius: '8px', padding: '14px', fontSize: '11px', fontFamily: 'monospace' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: 700, marginBottom: '8px', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
          <Terminal size={14} />
          <span>Server Terminal & Network RPC Telemetry</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
          {logs.map((log) => (
            <div key={log.id} style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: '#64748b' }}>[{log.timestamp}]</span>
              <span style={{ color: log.source === 'CLIENT_RPC' ? '#fbbf24' : '#34d399', fontWeight: 600 }}>
                {log.source}:
              </span>
              <span style={{ color: '#e2e8f0' }}>{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`,
      },
    },
    dependencies: {
      'lucide-react': '^1.65.0',
    },
  },
}

