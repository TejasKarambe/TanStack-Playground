import React from 'react'
import { Link } from '@tanstack/react-router'
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bookmark,
  Sparkles,
  Flame,
  Code2,
  Compass,
  Layers,
  GraduationCap,
} from 'lucide-react'
import {
  TOTAL_LIBRARIES,
  TOTAL_LESSONS,
  COMPLETED_LESSONS,
  BOOKMARKED_LESSONS,
  RECENTLY_VISITED,
  TANSTACK_LIBRARIES,
} from '@/content/libraries-data'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LibraryIcon } from '@/components/library-icon'

export function DashboardView() {
  const progressPercentage = Math.round((COMPLETED_LESSONS / TOTAL_LESSONS) * 100)

  // Curated recommended next lessons (uncompleted beginner/intermediate lessons)
  const recommendedLessons = TANSTACK_LIBRARIES.flatMap((lib) =>
    lib.topics
      .filter((t) => !t.isCompleted)
      .map((topic) => ({ ...topic, libraryId: lib.id, libraryName: lib.name, libraryColor: lib.color, iconName: lib.iconName }))
  ).slice(0, 4)

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in-50 duration-300">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-r from-card/80 via-card to-card/60 p-6 md:p-8 shadow-xs">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Learning Platform</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Master the TanStack Ecosystem
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Learn state management, type-safe routing, headless tables, reactive forms, and virtualization through runnable code examples with instantaneous browser live execution.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild size="sm" className="gap-2">
              <Link to="/libraries">
                <Compass className="h-4 w-4" />
                Browse All Libraries
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to="/playground">
                <Code2 className="h-4 w-4" />
                Open Blank Sandbox
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Demo Statistics Disclaimer */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-border/80 bg-muted/40 text-xs text-muted-foreground">
        <span className="flex h-2 w-2 rounded-full bg-amber-500" />
        <span>
          <strong>Notice</strong>: The statistics below represent pre-seeded initial learning metrics for previewing dashboard capabilities. Real-time user persistence activates when signed in.
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs">
              <span>Supported Libraries</span>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold">{TOTAL_LIBRARIES}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Production-ready & ecosystem libraries
            </p>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs">
              <span>Curriculum Topics</span>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold">{TOTAL_LESSONS}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Multi-file interactive examples
            </p>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs">
              <span>Completed Lessons</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              {COMPLETED_LESSONS} <span className="text-sm font-normal text-muted-foreground">/ {TOTAL_LESSONS}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-emerald-500/90 font-medium">
              {progressPercentage}% curriculum finished
            </p>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs">
              <span>Active Bookmarks</span>
              <Bookmark className="h-4 w-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold">{BOOKMARKED_LESSONS.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Saved for quick review & reference
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar Overview */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">Overall Mastery Progress</span>
          </div>
          <span className="font-mono text-muted-foreground">{COMPLETED_LESSONS} of {TOTAL_LESSONS} lessons completed ({progressPercentage}%)</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Dual Column: Recently Visited & Bookmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Visited */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Recently Visited
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                <Link to="/progress">View all</Link>
              </Button>
            </div>
            <CardDescription className="text-xs">
              Resume your recent learning sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {RECENTLY_VISITED.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-md border border-border/60 bg-muted/20 hover:bg-muted/50 transition-colors"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono text-muted-foreground font-semibold">
                      {item.libraryName}
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1 py-0">
                      {item.difficulty}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-medium text-foreground truncate">
                    {item.title}
                  </h4>
                </div>
                <Button asChild size="sm" variant="ghost" className="h-8 gap-1 text-xs shrink-0">
                  <Link
                    to="/library/$libraryId/$topicId"
                    params={{ libraryId: item.libraryId, topicId: item.id }}
                  >
                    <span>Open</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bookmarked Lessons */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-muted-foreground" />
                Bookmarked Lessons
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                <Link to="/bookmarks">View all</Link>
              </Button>
            </div>
            <CardDescription className="text-xs">
              Key topics saved for quick revision
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {BOOKMARKED_LESSONS.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-md border border-border/60 bg-muted/20 hover:bg-muted/50 transition-colors"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono text-muted-foreground font-semibold">
                      {item.libraryName}
                    </span>
                    <span className="text-[11px] text-muted-foreground/60">•</span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {item.estimatedMinutes}m
                    </span>
                  </div>
                  <h4 className="text-xs font-medium text-foreground truncate">
                    {item.title}
                  </h4>
                </div>
                <Button asChild size="sm" variant="ghost" className="h-8 gap-1 text-xs shrink-0">
                  <Link
                    to="/library/$libraryId/$topicId"
                    params={{ libraryId: item.libraryId, topicId: item.id }}
                  >
                    <span>Review</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recommended Next Lessons */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-500" />
              Recommended Next Topics
            </h3>
            <p className="text-xs text-muted-foreground">
              Continue through core TanStack concepts step by step
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link to="/libraries">Explore All</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedLessons.map((item) => (
            <Card key={item.id} className="border-border hover:border-primary/50 transition-colors flex flex-col justify-between">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-xs"
                    style={{ color: item.libraryColor }}
                  >
                    <LibraryIcon name={item.iconName} className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {item.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-sm font-semibold line-clamp-1">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2 mt-1">
                  {item.summary}
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-3 flex items-center justify-between border-t border-border/50">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {item.estimatedMinutes}m
                </span>
                <Button asChild size="sm" className="h-7 text-xs">
                  <Link
                    to="/library/$libraryId/$topicId"
                    params={{ libraryId: item.libraryId, topicId: item.id }}
                  >
                    Start
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
