import React, { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import {
  Menu,
  Sun,
  Moon,
  Laptop,
  ExternalLink,
  User,
  SlidersHorizontal,
  Bookmark,
  LogIn,
  LogOut,
} from 'lucide-react'
import { GitHubIcon } from '@/components/github-icon'
import { useTheme } from '@/components/theme-provider'
import { useAuth } from '@/context/auth-context'
import { IconButton } from '@/components/ui/icon-button'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/search-input'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TANSTACK_LIBRARIES } from '@/content/libraries-data'

interface NavbarProps {
  onOpenMobileMenu: () => void
}

export function Navbar({ onOpenMobileMenu }: NavbarProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { user, isAuthenticated, openAuthModal, logout } = useAuth()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')

  // Build dynamic breadcrumbs
  const pathSegments = location.pathname.split('/').filter(Boolean)

  const getBreadcrumbs = () => {
    if (pathSegments.length === 0 || (pathSegments.length === 1 && pathSegments[0] === 'dashboard')) {
      return [{ label: 'Dashboard', href: '/dashboard' }]
    }

    const crumbs: { label: string; href?: string }[] = []

    if (pathSegments[0] === 'libraries') {
      crumbs.push({ label: 'Libraries', href: '/libraries' })
    } else if (pathSegments[0] === 'library' && pathSegments[1]) {
      const lib = TANSTACK_LIBRARIES.find((l) => l.id === pathSegments[1])
      crumbs.push({ label: 'Libraries', href: '/libraries' })
      crumbs.push({
        label: lib ? lib.shortName : pathSegments[1],
        href: `/library/${pathSegments[1]}`,
      })
      if (pathSegments[2]) {
        const topic = lib?.topics.find((t) => t.id === pathSegments[2])
        crumbs.push({
          label: topic ? topic.title : pathSegments[2],
        })
      }
    } else if (pathSegments[0] === 'playground') {
      crumbs.push({ label: 'Playground', href: '/playground' })
    } else if (pathSegments[0] === 'progress') {
      crumbs.push({ label: 'Learning Progress', href: '/progress' })
    } else if (pathSegments[0] === 'bookmarks') {
      crumbs.push({ label: 'Bookmarks', href: '/bookmarks' })
    } else if (pathSegments[0] === 'settings') {
      crumbs.push({ label: 'Settings', href: '/settings' })
    }

    return crumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md">
      {/* Left: Mobile trigger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <IconButton
          label="Open navigation menu"
          onClick={onOpenMobileMenu}
          className="md:hidden h-8 w-8 text-foreground"
        >
          <Menu className="h-4 w-4" />
        </IconButton>

        <Breadcrumb className="hidden sm:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1
              return (
                <React.Fragment key={idx}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast || !crumb.href ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Center/Right: SearchInput & Actions */}
      <div className="flex items-center gap-2">
        <div className="hidden lg:block w-64">
          <SearchInput
            placeholder="Search lessons & APIs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
          />
        </div>

        {/* Official TanStack Docs link */}
        <IconButton
          label="Official TanStack Docs"
          onClick={() => window.open('https://tanstack.com', '_blank')}
          className="hidden sm:flex h-8 w-8"
        >
          <ExternalLink className="h-4 w-4" />
        </IconButton>

        {/* GitHub link */}
        <IconButton
          label="GitHub Repository"
          onClick={() => window.open('https://github.com/TanStack', '_blank')}
          className="h-8 w-8"
        >
          <GitHubIcon className="h-4 w-4" />
        </IconButton>

        {/* Theme Toggle Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton label="Toggle color theme" className="h-8 w-8">
              {resolvedTheme === 'dark' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun className="mr-2 h-3.5 w-3.5" />
              <span>Light</span>
              {theme === 'light' && <span className="ml-auto text-primary">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon className="mr-2 h-3.5 w-3.5" />
              <span>Dark (Default)</span>
              {theme === 'dark' && <span className="ml-auto text-primary">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <Laptop className="mr-2 h-3.5 w-3.5" />
              <span>System</span>
              {theme === 'system' && <span className="ml-auto text-primary">✓</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Account / Sign In */}
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer">
                {user.displayName ? user.displayName[0].toUpperCase() : <User className="h-3.5 w-3.5" />}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-0.5">
                  <span className="text-xs font-semibold text-foreground">{user.displayName || 'Developer'}</span>
                  <span className="text-[11px] text-muted-foreground font-normal truncate">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/progress" className="cursor-pointer">
                  <Bookmark className="mr-2 h-3.5 w-3.5" />
                  <span>My Progress</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
                  <span>Preferences</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="text-rose-500 cursor-pointer">
                <LogOut className="mr-2 h-3.5 w-3.5" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={openAuthModal}
            className="h-7 text-xs px-2.5 gap-1.5 font-medium border-border hover:bg-accent"
          >
            <LogIn className="h-3 w-3" />
            <span>Sign In</span>
          </Button>
        )}
      </div>
    </header>
  )
}
