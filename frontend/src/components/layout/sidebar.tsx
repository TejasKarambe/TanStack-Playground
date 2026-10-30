import React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Code2,
  Bookmark,
  CheckCircle2,
  Settings,
  ChevronLeft,
  ChevronRight,
  BookMarked,
} from 'lucide-react'
import { TANSTACK_LIBRARIES } from '@/content/libraries-data'
import { LibraryIcon } from '@/components/library-icon'
import { Badge } from '@/components/ui/badge'
import { IconButton } from '@/components/ui/icon-button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  onItemClick?: () => void
}

export function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
  onItemClick,
}: SidebarProps) {
  const location = useLocation()
  const pathname = location.pathname

  const mainNavItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'All Libraries',
      href: '/libraries',
      icon: BookMarked,
      badge: '13',
    },
  ]

  const toolNavItems = [
    {
      title: 'Playground',
      href: '/playground',
      icon: Code2,
    },
    {
      title: 'Learning Progress',
      href: '/progress',
      icon: CheckCircle2,
    },
    {
      title: 'Bookmarks',
      href: '/bookmarks',
      icon: Bookmark,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard' && (pathname === '/' || pathname === '/dashboard')) return true
    return pathname.startsWith(href)
  }

  const isLibraryActive = (libId: string) => {
    return pathname.startsWith(`/library/${libId}`)
  }

  return (
    <aside
      className={cn(
        'relative flex flex-col h-full border-r border-border bg-card/50 backdrop-blur-sm transition-all duration-300 ease-in-out select-none',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-14 px-3.5 border-b border-border">
        <Link
          to="/dashboard"
          onClick={onItemClick}
          className="flex items-center gap-2.5 overflow-hidden font-semibold text-sm tracking-tight text-foreground hover:opacity-90 transition-opacity"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-xs shadow-xs">
            TS
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="truncate font-semibold tracking-tight">TanStack</span>
              <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase -mt-1">
                Playground
              </span>
            </div>
          )}
        </Link>
        {onToggleCollapse && (
          <IconButton
            label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={onToggleCollapse}
            className="hidden md:flex h-7 w-7"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </IconButton>
        )}
      </div>

      {/* Scrollable Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-6 scrollbar-thin">
        {/* Main Section */}
        <div>
          {!isCollapsed && (
            <div className="px-2 mb-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground/80 font-medium">
              Overview
            </div>
          )}
          <nav className="space-y-0.5">
            {mainNavItems.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              return (
                <TooltipProvider key={item.href} delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href}
                        onClick={onItemClick}
                        className={cn(
                          'flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer',
                          active
                            ? 'bg-accent text-accent-foreground font-semibold shadow-2xs'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
                        {!isCollapsed && (
                          <div className="flex flex-1 items-center justify-between min-w-0">
                            <span className="truncate">{item.title}</span>
                            {item.badge && (
                              <span className="text-[10px] font-mono bg-muted text-muted-foreground px-1.5 py-0.2 rounded-xs">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </nav>
        </div>

        {/* TanStack Libraries Section (Data-Driven) */}
        <div>
          {!isCollapsed && (
            <div className="flex items-center justify-between px-2 mb-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground/80 font-medium">
              <span>TanStack Libraries</span>
              <span className="text-[10px] text-muted-foreground/60">13</span>
            </div>
          )}
          <nav className="space-y-0.5">
            {TANSTACK_LIBRARIES.map((lib) => {
              const active = isLibraryActive(lib.id)
              return (
                <TooltipProvider key={lib.id} delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to="/library/$libraryId"
                        params={{ libraryId: lib.id }}
                        onClick={onItemClick}
                        className={cn(
                          'flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer group',
                          active
                            ? 'bg-accent text-accent-foreground font-semibold shadow-2xs'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        )}
                      >
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-xs transition-colors"
                          style={{
                            color: active ? lib.color : undefined,
                          }}
                        >
                          <LibraryIcon name={lib.iconName} className="h-3.5 w-3.5" />
                        </span>
                        {!isCollapsed && (
                          <div className="flex flex-1 items-center justify-between min-w-0">
                            <span className="truncate">{lib.shortName}</span>
                            {lib.maturity !== 'STABLE' && (
                              <span
                                className={cn(
                                  'text-[9px] font-mono px-1 py-0.2 rounded-xs font-semibold uppercase',
                                  lib.maturity === 'RELEASE_CANDIDATE' &&
                                    'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
                                  lib.maturity === 'BETA' &&
                                    'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                                  lib.maturity === 'ALPHA' &&
                                    'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                )}
                              >
                                {lib.maturity === 'RELEASE_CANDIDATE' ? 'RC' : lib.maturity.toLowerCase()}
                              </span>
                            )}
                          </div>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">
                        <div className="flex items-center gap-1.5">
                          <span>{lib.name}</span>
                          {lib.maturity !== 'STABLE' && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0">
                              {lib.maturity}
                            </Badge>
                          )}
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </nav>
        </div>

        {/* Tools & Settings Section */}
        <div>
          {!isCollapsed && (
            <div className="px-2 mb-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground/80 font-medium">
              Tools & Progress
            </div>
          )}
          <nav className="space-y-0.5">
            {toolNavItems.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              return (
                <TooltipProvider key={item.href} delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href}
                        onClick={onItemClick}
                        className={cn(
                          'flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer',
                          active
                            ? 'bg-accent text-accent-foreground font-semibold shadow-2xs'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
                        {!isCollapsed && <span className="truncate">{item.title}</span>}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Footer / System Status */}
      <div className="p-2.5 border-t border-border bg-background/50">
        {!isCollapsed ? (
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
            <span className="font-mono">v1.0.0-phase1</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-500 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Ready
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
        )}
      </div>
    </aside>
  )
}

