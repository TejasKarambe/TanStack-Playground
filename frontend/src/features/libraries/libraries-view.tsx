import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ExternalLink, ArrowRight } from 'lucide-react'
import { TANSTACK_LIBRARIES } from '@/content/libraries-data'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/search-input'
import { LibraryIcon } from '@/components/library-icon'

export function LibrariesView() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'ALL' | 'STABLE' | 'ECOSYSTEM'>('ALL')

  const filteredLibraries = TANSTACK_LIBRARIES.filter((lib) => {
    const matchesSearch =
      lib.name.toLowerCase().includes(search.toLowerCase()) ||
      lib.packageName.toLowerCase().includes(search.toLowerCase()) ||
      lib.description.toLowerCase().includes(search.toLowerCase())

    if (!matchesSearch) return false

    if (filter === 'STABLE') return lib.maturity === 'STABLE'
    if (filter === 'ECOSYSTEM') return lib.maturity !== 'STABLE'
    return true
  })

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          TanStack Ecosystem Libraries
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Comprehensive, production-grade learning tracks with editable code examples across the complete TanStack suite.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-muted border border-border w-fit">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              filter === 'ALL'
                ? 'bg-background text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Libraries ({TANSTACK_LIBRARIES.length})
          </button>
          <button
            onClick={() => setFilter('STABLE')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              filter === 'STABLE'
                ? 'bg-background text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Production Stable
          </button>
          <button
            onClick={() => setFilter('ECOSYSTEM')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              filter === 'ECOSYSTEM'
                ? 'bg-background text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            RC / Beta / New
          </button>
        </div>

        <div className="w-full sm:w-72">
          <SearchInput
            placeholder="Filter libraries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
          />
        </div>
      </div>

      {/* Library Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLibraries.map((lib) => (
          <Card
            key={lib.id}
            className="border-border hover:border-primary/50 transition-all flex flex-col justify-between group"
          >
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted/40"
                    style={{ color: lib.color }}
                  >
                    <LibraryIcon name={lib.iconName} className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">{lib.name}</CardTitle>
                    <p className="font-mono text-[11px] text-muted-foreground">{lib.packageName}</p>
                  </div>
                </div>
                <Badge
                  variant={lib.maturity === 'STABLE' ? 'outline' : 'secondary'}
                  className="text-[10px]"
                >
                  {lib.maturity === 'STABLE' ? `v${lib.version}` : lib.maturity}
                </Badge>
              </div>
              <CardDescription className="text-xs line-clamp-2">
                {lib.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-0">
              <div className="text-[11px] text-muted-foreground flex items-center justify-between border-t border-border/60 pt-3">
                <span>{lib.topics.length} Interactive Topics</span>
                <span className="font-mono">v{lib.version}</span>
              </div>
            </CardContent>

            <CardFooter className="p-5 pt-0 flex items-center justify-between gap-2">
              <Button asChild variant="outline" size="sm" className="h-8 text-xs gap-1.5 flex-1">
                <a href={lib.officialDocUrl} target="_blank" rel="noreferrer">
                  <span>Docs</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              </Button>
              <Button asChild size="sm" className="h-8 text-xs gap-1.5 flex-1">
                <Link to="/library/$libraryId" params={{ libraryId: lib.id }}>
                  <span>View Track</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

