import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Search,
  BookOpen,
  Code2,
  Layers,
  ArrowRight,
  X,
  Sparkles,
} from 'lucide-react'
import { TANSTACK_LIBRARIES } from '@/content/libraries-data'
import { ALL_LESSONS } from '@/content/registry'

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SearchResultItem {
  id: string
  type: 'library' | 'lesson' | 'api'
  title: string
  subtitle: string
  tag?: string
  href: string
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Listen for Ctrl+K / Cmd+K globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key ?.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      setSelectedIndex(0)
    } else {
      setQuery('')
    }
  }, [open])

  // Filtered results
  const results = useMemo(() => {
    const q = query.trim()?.toLowerCase()
    if (!q) {
      // Default suggested items when query is empty
      const suggestions: SearchResultItem[] = [
        {
          id: 'lib-query',
          type: 'library',
          title: 'TanStack Query',
          subtitle: 'Powerful asynchronous state management & data fetching',
          tag: 'Library',
          href: '/library/query',
        },
        {
          id: 'lib-table',
          type: 'library',
          title: 'TanStack Table',
          subtitle: 'Headless UI for building powerful tables and datagrids',
          tag: 'Library',
          href: '/library/table',
        },
        {
          id: 'lib-router',
          type: 'library',
          title: 'TanStack Router',
          subtitle: 'Fully typesafe routing with search param validation',
          tag: 'Library',
          href: '/library/router',
        },
        {
          id: 'lesson-basic-query',
          type: 'lesson',
          title: 'Basic Query: Fetching & Lifecycle States',
          subtitle: 'TanStack Query • useQuery hook with interactive controls',
          tag: 'BEGINNER',
          href: '/library/query/query-basics',
        },
        {
          id: 'lesson-sorting',
          type: 'lesson',
          title: 'Column Sorting & Multi-sort',
          subtitle: 'TanStack Table • Interactive sortable datagrid',
          tag: 'BEGINNER',
          href: '/library/table/table-sorting',
        },
      ]
      return suggestions
    }

    const words = q.split(/\s+/).filter(Boolean)
    const items: SearchResultItem[] = []

    // 1. Search Libraries
    TANSTACK_LIBRARIES.forEach((lib) => {
      const target = `${lib.name} ${lib.shortName} ${lib.description} ${lib.packageName} ${lib.id}`.toLowerCase()
      if (words.every((w) => target.includes(w))) {
        items.push({
          id: `lib-${lib.id}`,
          type: 'library',
          title: lib.name,
          subtitle: lib.description,
          tag: lib.version,
          href: `/library/${lib.id}`,
        })
      }
    })

    // 2. Search Lessons
    ALL_LESSONS.forEach((lesson) => {
      const lib = TANSTACK_LIBRARIES.find((l) => l.id === lesson.libraryId)
      const target = `${lib?.name || ''} ${lib?.shortName || ''} ${lesson.title} ${lesson.description} ${lesson.topicId} ${lesson.libraryId} ${lesson.learningObjectives?.join(' ') || ''}`.toLowerCase()

      if (words.every((w) => target.includes(w))) {
        items.push({
          id: `lesson-${lesson.id}`,
          type: 'lesson',
          title: lesson.title,
          subtitle: `${lib?.name || lesson.libraryId} • ${lesson.description}`,
          tag: lesson.difficulty,
          href: `/library/${lesson.libraryId}/${lesson.topicId}`,
        })
      }

      // 3. Search Important APIs
      lesson.importantApis?.forEach((api) => {
        const apiTarget = `${api.name} ${api.signature} ${api.description} ${lesson.title} ${lib?.name || ''}`.toLowerCase()
        if (words.every((w) => apiTarget.includes(w))) {
          items.push({
            id: `api-${lesson.id}-${api.name}`,
            type: 'api',
            title: api.name,
            subtitle: `${api.signature} — ${lesson.title}`,
            tag: 'API',
            href: `/library/${lesson.libraryId}/${lesson.topicId}`,
          })
        }
      })
    })

    return items.slice(0, 20)
  }, [query])

  const handleSelect = (item: SearchResultItem) => {
    onOpenChange(false)
    navigate({ to: item.href })
  }

  // Keyboard navigation within list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1 < results.length ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : results.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex])
      }
    } else if (e.key === 'Escape') {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden bg-card border-border shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Search Lessons, Libraries & APIs</DialogTitle>
        </DialogHeader>

        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-border bg-background">
          <Search className="h-4 w-4 text-muted-foreground mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search all 13 libraries, lessons, and APIs... (e.g. useQuery, sorting, virtual)"
            className="w-full h-12 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {results.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No results found for &ldquo;<span className="text-foreground font-semibold">{query}</span>&rdquo;
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-md cursor-pointer transition-colors ${isSelected
                      ? 'bg-primary/10 text-primary-foreground border border-primary/20'
                      : 'hover:bg-muted/50 text-foreground'
                    }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden mr-2">
                    <div
                      className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${item.type === 'library'
                          ? 'bg-amber-500/10 text-amber-500'
                          : item.type === 'api'
                            ? 'bg-sky-500/10 text-sky-400 font-mono text-xs'
                            : 'bg-emerald-500/10 text-emerald-500'
                        }`}
                    >
                      {item.type === 'library' ? (
                        <Layers className="h-4 w-4" />
                      ) : item.type === 'api' ? (
                        <Code2 className="h-4 w-4" />
                      ) : (
                        <BookOpen className="h-4 w-4" />
                      )}
                    </div>

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground truncate">
                          {item.title}
                        </span>
                        {item.tag && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-muted text-muted-foreground shrink-0">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate max-w-md">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`h-4 w-4 shrink-0 transition-opacity ${isSelected ? 'opacity-100 text-primary' : 'opacity-0'
                      }`}
                  />
                </div>
              )
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 border-t border-border bg-muted/30 text-[11px] text-muted-foreground flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded border border-border">↑</kbd>{' '}
              <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded border border-border">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded border border-border">↵</kbd> to select
            </span>
            <span>
              <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded border border-border">esc</kbd> to close
            </span>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-amber-500" /> TanStack Playground Search
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

