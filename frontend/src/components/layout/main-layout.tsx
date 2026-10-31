import React, { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './sidebar'
import { Navbar } from './navbar'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Toaster } from '@/components/ui/sonner'
import { AuthModal } from '@/components/auth/auth-modal'

export function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground antialiased font-sans">
      {/* Desktop Collapsible Sidebar */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />
      </div>

      {/* Mobile Drawer (Sheet) */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 sm:max-w-xs border-r border-border">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <Sidebar onItemClick={() => setIsMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <Navbar onOpenMobileMenu={() => setIsMobileOpen(true)} />
        <main className="flex-1 min-h-0 overflow-y-auto scrollbar-thin flex flex-col">
          <Outlet />
        </main>
      </div>

      <Toaster position="bottom-right" />
      <AuthModal />
    </div>
  )
}

