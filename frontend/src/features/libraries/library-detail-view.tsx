import React from 'react'
import { Link, useParams } from '@tanstack/react-router'
import {
  ExternalLink,
  BookOpen,
  Clock,
  CheckCircle2,
  Bookmark,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'
import { TANSTACK_LIBRARIES } from '@/content/libraries-data'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LibraryIcon } from '@/components/library-icon'
import { EmptyState } from '@/components/ui/empty-state'

export function LibraryDetailView() {
  const { libraryId } = useParams({ from: '/library/$libraryId' })
  const library = TANSTACK_LIBRARIES.find((lib) => lib.id === libraryId)

  if (!library) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <EmptyState
          title="Library Not Found"
          description={`No TanStack library matching identifier "${libraryId}" exists.`}
          actionLabel="Back to All Libraries"
          onAction={() => window.history.back()}
        />
      </div>
    )
  }

  const completedCount = library.topics.filter((t) => t.isCompleted).length
  const totalCount = library.topics.length
  const percentComplete = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in-50 duration-300">
      {/* Back button */}
      <div>
        <Button asChild variant="ghost" size="sm" className="gap-1.5 -ml-2 text-xs text-muted-foreground hover:text-foreground">
          <Link to="/libraries">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Libraries
          </Link>
        </Button>
      </div>

      {/* Library Hero Header */}
      <div className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-muted/40 shadow-xs"
              style={{ color: library.color }}
            >
              <LibraryIcon name={library.iconName} className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  {library.name}
                </h1>
                <Badge variant={library.maturity === 'STABLE' ? 'outline' : 'secondary'} className="text-[10px]">
                  {library.maturity}
                </Badge>
              </div>
              <p className="font-mono text-xs text-muted-foreground mt-0.5">{library.packageName} (v{library.version})</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
              <a href={library.officialDocUrl} target="_blank" rel="noreferrer">
                <span>Official Docs</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
          {library.description}
        </p>

        {/* Progress bar */}
        <div className="pt-2 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-muted-foreground font-medium">
            Track Progress: {completedCount} of {totalCount} topics completed ({percentComplete}%)
          </span>
          <div className="w-full sm:w-48 bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Learning Topics & Demonstrations
          </h2>
          <span className="text-xs font-mono text-muted-foreground">{library.topics.length} topics</span>
        </div>

        <div className="space-y-3">
          {library.topics.map((topic, index) => (
            <Card
              key={topic.id}
              className="border-border hover:border-primary/40 transition-colors group"
            >
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs text-muted-foreground font-semibold mt-0.5">
                    {topic.isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {topic.title}
                      </h3>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {topic.difficulty}
                      </Badge>
                      {topic.isBookmarked && (
                        <Bookmark className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {topic.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" /> {topic.estimatedMinutes}m
                  </span>
                  <Button asChild size="sm" className="h-8 gap-1.5 text-xs">
                    <Link
                      to="/library/$libraryId/$topicId"
                      params={{ libraryId: library.id, topicId: topic.id }}
                    >
                      <span>{topic.isCompleted ? 'Review' : 'Start'}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

