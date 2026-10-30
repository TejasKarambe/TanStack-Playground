import React, { useState } from 'react'
import { Code2, Play, Share2, Copy, RotateCcw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable-panel'
import { toast } from 'sonner'

export function PlaygroundView() {
  const [activeTab, setActiveTab] = useState('editor')

  const handleShare = () => {
    toast.success('Snippet share link copied to clipboard!')
  }

  const handleReset = () => {
    toast.info('Playground reset to default template.')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden animate-in fade-in-50 duration-300">
      {/* Action Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/60 backdrop-blur-xs text-xs">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground">Standalone Playground</span>
          <span className="text-[11px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded-xs">
            Freeform Sandbox
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleReset} className="h-7 text-xs gap-1.5">
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
          <Button size="sm" onClick={handleShare} className="h-7 text-xs gap-1.5">
            <Share2 className="h-3 w-3" />
            Share Snippet
          </Button>
        </div>
      </div>

      {/* Editor & Preview Split Panes */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Editor Panel */}
          <ResizablePanel defaultSize={50} minSize={30} className="bg-muted/20 p-4 font-mono text-xs overflow-auto">
            <div className="rounded-lg border border-border bg-card p-4 h-full flex flex-col">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-border text-[11px] text-muted-foreground">
                <span>Playground.tsx</span>
                <span className="text-emerald-500">React 19 + TypeScript</span>
              </div>
              <pre className="text-foreground leading-relaxed flex-1">
{`import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReactTable } from '@tanstack/react-table';

export default function Playground() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Custom TanStack Experiment</h1>
      <p>Test any TanStack feature directly in this sandbox.</p>
      <button onClick={() => setCount(c => c + 1)}>
        Counter: {count}
      </button>
    </div>
  );
}`}
              </pre>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Preview Panel */}
          <ResizablePanel defaultSize={50} minSize={30} className="bg-background flex flex-col p-6 items-center justify-center">
            <div className="max-w-md w-full p-6 rounded-xl border border-border bg-card text-center space-y-3 shadow-xs">
              <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Live Execution Preview</h3>
              <p className="text-xs text-muted-foreground">
                In Phase 4, the Sandpack in-browser bundler will execute arbitrary code edits here in real-time.
              </p>
              <Button size="sm" variant="outline" className="text-xs">
                Inspect Output
              </Button>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

