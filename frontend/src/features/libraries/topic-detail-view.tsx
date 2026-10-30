import React, { useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { TANSTACK_LIBRARIES } from '@/content/libraries-data'
import { getLessonByLibraryAndTopic } from '@/content/registry'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable-panel'
import { EmptyState } from '@/components/ui/empty-state'
import { LessonWorkspace } from '@/components/playground/lesson-workspace'
import { toast } from 'sonner'

export function TopicDetailView() {
  const { libraryId, topicId } = useParams({ from: '/library/$libraryId/$topicId' })

  const library = TANSTACK_LIBRARIES.find((lib) => lib.id === libraryId)
  const topic = library?.topics.find((t) => t.id === topicId)
  const manifest = getLessonByLibraryAndTopic(libraryId, topicId)

  const [isCompleted, setIsCompleted] = useState(topic?.isCompleted ?? false)
  const [isBookmarked, setIsBookmarked] = useState(topic?.isBookmarked ?? false)
  const [openFaq, setOpenFaq] = useState<Record<number, boolean>>({ 0: true })
  const [mobileTab, setMobileTab] = useState<'theory' | 'playground'>('playground')

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
      toast.success(next ? 'Marked lesson as completed!' : 'Marked lesson as in progress.')
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

  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  // Fallback example if manifest is not yet defined
  const activeExample = manifest?.example ?? {
    id: `${libraryId}-${topicId}-fallback`,
    title: topic.title,
    description: topic.summary,
    entryFile: '/App.tsx',
    dependencies: {
      [library.packageName]: library.version,
    },
    files: {
      '/App.tsx': {
        code: `import React from 'react';\n\nexport default function App() {\n  return (\n    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>\n      <h2>${topic.title}</h2>\n      <p>${topic.summary}</p>\n      <p>Official Docs: <a href="${topic.officialDocUrl}" target="_blank">${topic.officialDocUrl}</a></p>\n    </div>\n  );\n}`,
      },
    },
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
            {manifest?.difficulty ?? topic.difficulty}
          </Badge>
          <span className="text-muted-foreground/60 hidden md:inline-flex items-center gap-1 font-mono text-[11px]">
            <Clock className="h-3 w-3" />
            {manifest?.estimatedMinutes ?? topic.estimatedMinutes} mins
          </span>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Tab Switcher */}
          <div className="flex sm:hidden bg-muted rounded p-0.5">
            <button
              onClick={() => setMobileTab('theory')}
              className={`px-2 py-0.5 text-[11px] rounded ${mobileTab === 'theory' ? 'bg-card font-semibold' : 'text-muted-foreground'}`}
            >
              Theory
            </button>
            <button
              onClick={() => setMobileTab('playground')}
              className={`px-2 py-0.5 text-[11px] rounded ${mobileTab === 'playground' ? 'bg-card font-semibold' : 'text-muted-foreground'}`}
            >
              Code
            </button>
          </div>

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
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
            className={`h-7 px-2 text-xs ${isBookmarked ? 'text-amber-500' : 'text-muted-foreground'}`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>

          <Button asChild size="sm" variant="ghost" className="h-7 px-2 text-xs text-muted-foreground" title="Official Documentation">
            <a href={manifest?.officialDocUrl ?? topic.officialDocUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>

      {/* Main Resizable Dual-Pane Body */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel: Theory, Objectives, Concept Deep-Dive, FAQs */}
          <ResizablePanel
            defaultSize={38}
            minSize={25}
            maxSize={55}
            className={`bg-card/20 overflow-y-auto p-6 scrollbar-thin ${
              mobileTab === 'playground' ? 'hidden sm:block' : 'block'
            }`}
          >
            <div className="max-w-xl space-y-6">
              {/* Title & Description */}
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-1">
                  <span>{library.name}</span>
                  <span>•</span>
                  <span>{manifest?.estimatedMinutes ?? topic.estimatedMinutes} mins</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  {manifest?.title ?? topic.title}
                </h1>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {manifest?.description ?? topic.summary}
                </p>
              </div>

              {/* Learning Objectives */}
              {manifest?.learningObjectives && (
                <div className="rounded-lg border border-border bg-card p-4 space-y-2.5">
                  <h3 className="text-xs font-semibold text-foreground uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    Learning Objectives
                  </h3>
                  <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                    {manifest.learningObjectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Concept Sections */}
              {manifest?.conceptSections?.map((section, idx) => (
                <div key={idx} className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                  <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
                  <p>{section.content}</p>
                </div>
              ))}

              {/* Important APIs Table */}
              {manifest?.importantApis && manifest.importantApis.length > 0 && (
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  <div className="px-3 py-2 border-b border-border text-[11px] font-semibold text-foreground bg-muted/30 uppercase font-mono tracking-wider">
                    Important APIs
                  </div>
                  <div className="divide-y divide-border text-xs">
                    {manifest.importantApis.map((api, idx) => (
                      <div key={idx} className="p-3 space-y-1">
                        <div className="font-mono font-semibold text-foreground text-[12px] text-primary">
                          {api.name}
                        </div>
                        {api.signature && (
                          <code className="block bg-muted/60 p-1.5 rounded-xs font-mono text-[11px] text-muted-foreground overflow-x-auto">
                            {api.signature}
                          </code>
                        )}
                        <p className="text-muted-foreground text-[12px]">{api.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expected Result & Preview Instructions */}
              {manifest?.previewInstructions && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs space-y-2">
                  <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <FileCheck className="h-4 w-4" />
                    Interactive Instructions & Expected Output
                  </div>
                  <p className="text-muted-foreground">{manifest.previewInstructions}</p>
                  <p className="text-emerald-700/80 dark:text-emerald-300/80 font-mono text-[11px]">
                    Expected: {manifest.expectedResult}
                  </p>
                </div>
              )}

              {/* Common Mistakes */}
              {manifest?.commonMistakes && manifest.commonMistakes.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-foreground uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    Common Pitfalls & Fixes
                  </h3>
                  <div className="space-y-2 text-xs">
                    {manifest.commonMistakes.map((cm, i) => (
                      <div key={i} className="p-3 rounded-lg border border-border bg-card space-y-1">
                        <div className="text-destructive font-medium">✕ {cm.mistake}</div>
                        <div className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Fix: {cm.fix}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interview Questions */}
              {manifest?.interviewQuestions && manifest.interviewQuestions.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-foreground uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-primary" />
                    Interview Checkpoint
                  </h3>
                  <div className="space-y-2">
                    {manifest.interviewQuestions.map((q, idx) => (
                      <div key={idx} className="rounded-lg border border-border bg-card overflow-hidden">
                        <button
                          onClick={() => toggleFaq(idx)}
                          className="w-full flex items-center justify-between p-3 text-left text-xs font-medium text-foreground hover:bg-muted/40 transition-colors"
                        >
                          <span>{q.question}</span>
                          {openFaq[idx] ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
                        </button>
                        {openFaq[idx] && (
                          <div className="px-3 pb-3 pt-1 text-xs text-muted-foreground border-t border-border/40 bg-muted/10 leading-relaxed">
                            {q.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="hidden sm:flex" />

          {/* Right Panel: Interactive Monaco + Sandpack Playground */}
          <ResizablePanel
            defaultSize={62}
            minSize={35}
            className={`bg-background h-full overflow-hidden ${
              mobileTab === 'theory' ? 'hidden sm:block' : 'block'
            }`}
          >
            <LessonWorkspace example={activeExample} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
