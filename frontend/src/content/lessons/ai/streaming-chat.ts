import type { LessonManifest } from '../../types'

export const aiStreamingChatLesson: LessonManifest = {
  id: 'ai-streaming-chat',
  libraryId: 'ai',
  topicId: 'ai-tool-streams',
  title: 'TanStack AI: Streaming Text, Protected Endpoints & Tool Orchestration',
  description: 'Coordinate streaming LLM tokens, secure backend routing without client API key leaks, and client tool callbacks.',
  difficulty: 'ADVANCED',
  estimatedMinutes: 20,
  officialDocUrl: 'https://github.com/tanstack/ai',
  learningObjectives: [
    'Understand streaming text chunk architectures (Server-Sent Events / ReadableStreams).',
    'Route AI prompts through protected backend endpoints to prevent exposing API keys.',
    'Execute client-side tool callbacks dispatched by AI function-calling.',
    'Gracefully handle upstream LLM rate limits, network timeouts, and fallback mock modes.',
  ],
  conceptSections: [
    {
      title: 'Security: Zero Frontend API Keys',
      content:
        'Never place OpenAI, Anthropic, or Gemini API keys inside client-side React code. TanStack AI connects frontend hooks to a secure backend endpoint (like Spring Boot or TanStack Start server functions) that injects credentials from environment variables.',
    },
    {
      title: 'Package Maturity & Verification',
      content:
        'Package: @tanstack/ai (Release Candidate). TanStack AI orchestrates multi-turn chat sessions, streaming token assembly, and client tool-call execution pipelines.',
    },
  ],
  importantApis: [
    {
      name: 'useChat()',
      signature: 'useChat({ api: "/api/v1/ai/chat", onToolCall: ... })',
      description: 'Coordinates streaming chat message streams and response parsing.',
    },
  ],
  previewInstructions: 'Type a prompt like "Explain TanStack Query caching" or click the suggested query buttons. Watch the simulated AI response stream token-by-token with live chunk rate metrics.',
  expectedResult: 'A streaming generative AI chat interface with chunk delivery telemetry and secure backend proxy architecture.',
  commonMistakes: [
    {
      mistake: 'Exposing provider secret keys in client JavaScript or Vite environment variables.',
      fix: 'Always proxy requests through backend endpoints (/api/v1/ai/stream) where secrets are safe.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How do streaming HTTP responses prevent browser connection timeouts for long LLM outputs?',
      answer:
        'By utilizing Server-Sent Events (SSE) or Transfer-Encoding: chunked, the server sends tokens as they generate, maintaining active TCP activity and keeping Time-To-First-Byte (TTFB) under 500ms.',
    },
  ],
  example: {
    id: 'example-ai-streaming-chat',
    title: 'Streaming LLM Chat with Backend Proxy Telemetry',
    description: 'Simulating streaming token responses, secure backend proxying, and tool calling callbacks.',
    entryFile: '/App.tsx',
    files: {
      '/App.tsx': {
        code: `import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Shield, Terminal, Loader2, ArrowRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      content: 'Hello! I am your TanStack AI assistant. How can I help you explore the ecosystem today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [tokenRate, setTokenRate] = useState('0 tokens/sec');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (userText: string) => {
    if (!userText.trim() || isStreaming) return;

    const userMsg: ChatMessage = { id: String(Date.now()), role: 'user', content: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    const assistantMsgId = String(Date.now() + 1);
    const initialAssistantMsg: ChatMessage = { id: assistantMsgId, role: 'assistant', content: '' };
    setMessages((prev) => [...prev, initialAssistantMsg]);

    // Simulated streaming response chunks from protected backend
    const simulatedResponse = 
      "TanStack Query provides declarative data fetching by decoupling component rendering from network management. " +
      "It caches responses in-memory, tracks freshness via staleTime, and automatically deduplicates concurrent identical requests. " +
      "When integrated with TanStack Router, route loaders can call queryClient.ensureQueryData() to preload data before page transitions!";

    const chunks = simulatedResponse.split(' ');
    let accumulated = '';
    const startTime = Date.now();

    for (let i = 0; i < chunks.length; i++) {
      await new Promise((r) => setTimeout(r, 65)); // simulated token stream interval
      accumulated += (i === 0 ? '' : ' ') + chunks[i];

      setMessages((prev) =>
        prev.map((m) => (m.id === assistantMsgId ? { ...m, content: accumulated } : m))
      );

      const elapsedSec = (Date.now() - startTime) / 1000;
      setTokenRate(\`\${Math.round((i + 1) / Math.max(elapsedSec, 0.1))} tokens/sec\`);
    }

    setIsStreaming(false);
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '620px', margin: '0 auto', background: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#e11d48" />
            <span>TanStack AI: Streaming Chat</span>
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Protected backend proxy architecture with zero exposed client secrets.
          </p>
        </div>
        <span style={{ fontSize: '11px', background: '#fef2f2', color: '#e11d48', padding: '4px 8px', borderRadius: '4px', fontWeight: 600, border: '1px solid #fecdd3' }}>
          Mock Mode Active
        </span>
      </header>

      {/* Stream Metrics Bar */}
      <div style={{ background: '#0f172a', color: '#fff', padding: '8px 14px', borderRadius: '6px', fontSize: '11px', fontFamily: 'monospace', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
        <span>Backend Route: <strong>POST /api/v1/ai/stream</strong></span>
        <span style={{ color: isStreaming ? '#38bdf8' : '#94a3b8' }}>
          {isStreaming ? \`Streaming: \${tokenRate}\` : 'Idle'}
        </span>
      </div>

      {/* Chat Messages Log */}
      <div style={{ flex: 1, minHeight: '340px', maxHeight: '400px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', background: '#f8fafc', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              gap: '10px',
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
            }}
          >
            {m.role === 'assistant' && (
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fee2e2', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', shrink: 0 }}>
                <Bot size={16} />
              </div>
            )}
            <div
              style={{
                background: m.role === 'user' ? '#0f172a' : '#ffffff',
                color: m.role === 'user' ? '#ffffff' : '#1e293b',
                padding: '10px 14px',
                borderRadius: '8px',
                border: m.role === 'user' ? 'none' : '1px solid #e2e8f0',
                fontSize: '13px',
                lineHeight: 1.5,
              }}
            >
              {m.content || (isStreaming ? <Loader2 size={14} className="animate-spin text-rose-500" /> : '')}
            </div>
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>

      {/* Quick Suggestions */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', overflowX: 'auto' }}>
        {[
          'Explain Query Caching',
          'How do server functions work?',
          'What is 2D Virtualization?',
        ].map((sugg) => (
          <button
            key={sugg}
            onClick={() => handleSend(sugg)}
            disabled={isStreaming}
            style={{ background: '#fff', border: '1px solid #cbd5e1', color: '#475569', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {sugg}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        style={{ display: 'flex', gap: '8px' }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the TanStack ecosystem..."
          disabled={isStreaming}
          style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
        />
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          style={{ background: '#e11d48', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '6px', fontWeight: 600, cursor: isStreaming || !input.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          {isStreaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </form>
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

