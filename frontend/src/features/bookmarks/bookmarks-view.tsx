import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Bookmark, Clock, ArrowRight, Trash2 } from 'lucide-react'
import { BOOKMARKED_LESSONS } from '@/content/libraries-data'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { toast } from 'sonner'

export function BookmarksView() {
  const [bookmarks, setBookmarks] = useState(BOOKMARKED_LESSONS)

  const handleRemove = (id: string, title: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id))
    toast.info(`Removed "${title}" from bookmarks.`)
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-300">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Bookmark className="h-6 w-6 text-primary fill-primary/20" />
          Bookmarked Lessons
        </h1>
        <p className="text-sm text-muted-foreground">
          Quickly access and review your saved TanStack topics and code demonstrations.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-6 w-6 text-muted-foreground" />}
          title="No Bookmarks Saved"
          description="Click the bookmark icon on any lesson page to save topics here for quick review."
          actionLabel="Browse Libraries"
          onAction={() => window.location.assign('/libraries')}
        />
      ) : (
        <div className="space-y-3">
          {bookmarks.map((item) => (
            <Card
              key={item.id}
              className="border-border p-4 hover:border-primary/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-muted-foreground">
                    {item.libraryName}
                  </span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {item.difficulty}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" /> {item.estimatedMinutes}m
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{item.summary}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemove(item.id, item.title)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                  title="Remove bookmark"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                <Button asChild size="sm" className="h-8 gap-1.5 text-xs">
                  <Link
                    to="/library/$libraryId/$topicId"
                    params={{ libraryId: item.libraryId, topicId: item.id }}
                  >
                    <span>Open Lesson</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

