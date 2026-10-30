import React from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Layers } from 'lucide-react'
import {
  TANSTACK_LIBRARIES,
  TOTAL_LESSONS,
  COMPLETED_LESSONS,
} from '@/content/libraries-data'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LibraryIcon } from '@/components/library-icon'

export function ProgressView() {
  const overallPercent = Math.round((COMPLETED_LESSONS / TOTAL_LESSONS) * 100)

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in-50 duration-300">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Learning Progress & Mastery
        </h1>
        <p className="text-sm text-muted-foreground">
          Track completed topics, current study status, and overall TanStack curriculum achievements.
        </p>
      </div>

      {/* Summary Card */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Total Progress
            </span>
            <div className="text-3xl font-bold text-foreground mt-1">
              {overallPercent}% Complete
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {COMPLETED_LESSONS} of {TOTAL_LESSONS} curriculum lessons completed
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
              {COMPLETED_LESSONS} Finished
            </Badge>
            <Badge variant="outline" className="text-xs px-3 py-1">
              {TOTAL_LESSONS - COMPLETED_LESSONS} Remaining
            </Badge>
          </div>
        </div>

        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </div>

      {/* Library Progress Breakdown */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          Progress by Library Track
        </h2>

        <div className="space-y-3">
          {TANSTACK_LIBRARIES.map((lib) => {
            const completed = lib.topics.filter((t) => t.isCompleted).length
            const total = lib.topics.length
            const pct = Math.round((completed / total) * 100)

            return (
              <Card key={lib.id} className="border-border p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-xs"
                      style={{ color: lib.color }}
                    >
                      <LibraryIcon name={lib.iconName} className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{lib.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{completed} of {total} lessons done</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-muted-foreground">{pct}%</span>
                    <Button asChild size="sm" variant="ghost" className="h-7 text-xs gap-1">
                      <Link to="/library/$libraryId" params={{ libraryId: lib.id }}>
                        <span>Open</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

