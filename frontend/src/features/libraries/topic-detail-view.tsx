import React, { useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Clock,
  ExternalLink,
  RotateCcw,
  Play,
  Terminal,
  Code2,
  Sparkles,
  BookOpen,
} from 'lucide-react'
import { TANSTACK_LIBRARIES } from '@/content/libraries-data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable-panel'
import { EmptyState } from '@/components/ui/empty-state'
import { toast } from 'sonner'

export function TopicDetailView() {
  const { libraryId, topicId } = useParams({ from: '/library/$libraryId/$topicId' })

  const library = TANSTACK_LIBRARIES.find((lib) => lib.id === libraryId)
  const topic = library?.topics.find((t) => t.id === topicId)

  const [isCompleted, setIsCompleted] = useState(topic?.isCompleted ?? false)
  const [isBookmarked, setIsBookmarked] = useState(topic?.isBookmarked ?? false)
  const [activeTab, setActiveTab] = useState('editor')

  if (!library || !topic) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <EmptyState
          title="Topic Not Found"
          description={`Topic "${topicId}" under library "${libraryId}" could not be located.`}
          actionLabel="Back to Library"
          onAction={() => window.history.back()}
        />
      </div>
    )
  }

  const toggleComplete = () => {
    setIsCompleted((prev) => {
      const next = !prev
      toast.success(next ? 'Marked as completed!' : 'Marked as in progress.')
      return next
    })
  }

  const toggleBookmark = () => {
    setIsBookmarked((prev) => {
      const next = !prev
      toast.success(next ? 'Added to bookmarks' : 'Removed from bookmarks')
      return next
    })
  }

  const handleReset = () => {
    toast.info('Restored original example code')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden animate-in fade-in-50 duration-300">
      {/* Top Action Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/60 backdrop-blur-xs text-xs">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs gap-1 -ml-1 text-muted-foreground hover:text-foreground">
            <Link to="/library/$libraryId" params={{ libraryId: library.id }}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{library.shortName}</span>
            </Link>
          </Button>
          <span className="text-muted-foreground/40">/</span>
          <span className="font-semibold text-foreground truncate max-w-xs">{topic.title}</span>
          <Badge variant="outline" className="text-[10px] hidden sm:inline-flex">
            {topic.difficulty}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isCompleted ? 'secondary' : 'outline'}
            onClick={toggleComplete}
            className="h-7 text-xs gap-1.5"
          >
            <CheckCircle2 className={`h-3.5 w-3.5 ${isCompleted ? 'text-emerald-500' : 'text-muted-foreground'}`} />
            <span>{isCompleted ? 'Completed' : 'Mark Completed'}</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={toggleBookmark}
            className={`h-7 px-2 text-xs ${isBookmarked ? 'text-amber-500' : 'text-muted-foreground'}`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>

          <Button asChild size="sm" variant="ghost" className="h-7 px-2 text-xs text-muted-foreground">
            <a href={topic.officialDocUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>

      {/* Main Dual-Pane Resizable Layout */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel: Theory, Objectives, and Guide */}
          <ResizablePanel defaultSize={40} minSize={25} className="bg-card/20 overflow-y-auto p-6 scrollbar-thin">
            <div className="max-w-xl space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-1">
                  <span>{library.name}</span>
                  <span>•</span>
                  <span>{topic.estimatedMinutes} mins</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">{topic.title}</h1>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{topic.summary}</p>
              </div>

              {/* Learning Objectives */}
              <div className="rounded-lg border border-border bg-card p-4 space-y-2.5">
                <h3 className="text-xs font-semibold text-foreground uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Learning Objectives
                </h3>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                  <li>Understand the core design pattern and problem domain.</li>
                  <li>Inspect reactive state transitions and data flows.</li>
                  <li>Modify active configuration parameters in the editor.</li>
                  <li>Observe live DOM updates and console diagnostics.</li>
                </ul>
              </div>

              {/* Theoretical Explanation */}
              <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                <h3 className="text-sm font-semibold text-foreground">Deep Dive: How it Works</h3>
                <p>
                  Modern web applications demand efficient state management without excessive re-renders. In this example, we configure the reactive pipeline to bind directly to user-driven actions.
                </p>
                <p>
                  Review the code on the right panel. Notice how clean separation between the data provider and consumer components guarantees modularity and testability.
                </p>
              </div>

              {/* Code Highlights Callout */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground space-y-1.5">
                <h4 className="font-semibold text-primary">Pro Tip</h4>
                <p>
                  You can edit the code in the right panel. In Phase 4, Monaco Editor and Sandpack will compile your modifications with instant HMR in the live preview.
                </p>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel: Workspace Tabs (Editor, Preview, Console) */}
          <ResizablePanel defaultSize={60} minSize={30} className="bg-background flex flex-col overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
              {/* Tab Bar Header */}
              <div className="flex items-center justify-between px-4 py-1.5 border-b border-border bg-card/40">
                <TabsList className="h-7 bg-muted/60">
                  <TabsTrigger value="editor" className="h-6 text-xs gap-1.5">
                    <Code2 className="h-3.5 w-3.5" />
                    Code Editor
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="h-6 text-xs gap-1.5">
                    <Play className="h-3.5 w-3.5 text-emerald-500" />
                    Live Preview
                  </TabsTrigger>
                  <TabsTrigger value="console" className="h-6 text-xs gap-1.5">
                    <Terminal className="h-3.5 w-3.5" />
                    Console
                  </TabsTrigger>
                </TabsList>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleReset}
                  className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset Code</span>
                </Button>
              </div>

              {/* Editor Tab Content */}
              <TabsContent value="editor" className="flex-1 m-0 p-4 overflow-auto font-mono text-xs">
                <div className="rounded-lg border border-border bg-muted/30 p-4 h-full">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-border text-muted-foreground text-[11px]">
                    <span>App.tsx</span>
                    <span className="text-emerald-500">Ready to edit (Monaco engine mounts in Phase 4)</span>
                  </div>
                  <pre className="text-foreground leading-relaxed">
{`import React from 'react';
import { useQuery } from '@tanstack/react-query';

export default function App() {
  const { data, isPending } = useQuery({
    queryKey: ['demo-data'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 600));
      return { status: 'success', message: 'Hello from ${library.name}!' };
    }
  });

  if (isPending) return <p>Loading interactive state...</p>;

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <h2>${topic.title}</h2>
      <p>{data?.message}</p>
    </div>
  );
}`}
                  </pre>
                </div>
              </TabsContent>

              {/* Live Preview Tab */}
              <TabsContent value="preview" className="flex-1 m-0 p-6 flex items-center justify-center bg-muted/10">
                <div className="max-w-md w-full p-6 rounded-xl border border-border bg-card shadow-sm text-center space-y-3">
                  <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                    <Play className="h-5 w-5 fill-current" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">Interactive Sandbox Preview</h3>
                  <p className="text-xs text-muted-foreground">
                    Live browser Sandpack iframe runner connects in Phase 4. All code runs 100% in-browser with zero backend execution.
                  </p>
                  <Button size="sm" variant="outline" className="text-xs">
                    Test Runner State
                  </Button>
                </div>
              </TabsContent>

              {/* Console Tab */}
              <TabsContent value="console" className="flex-1 m-0 p-4 overflow-auto bg-black/90 font-mono text-xs text-emerald-400">
                <div className="space-y-1">
                  <p className="text-muted-foreground">[System] Sandpack isolated runner initialized.</p>
                  <p className="text-muted-foreground">[System] Environment: Browser Worker (React 19).</p>
                  <p className="text-emerald-400">[Console] Mounted {library.name} component tree successfully.</p>
                </div>
              </TabsContent>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

