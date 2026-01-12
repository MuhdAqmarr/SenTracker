'use client'

import { BottomNav } from '@/components/layout/bottom-nav'
import { MobileHeader } from '@/components/layout/mobile-header'
import { DesktopSidebar } from '@/components/layout/desktop-sidebar'
import { PageTransition } from '@/components/motion'
import { SyncStatusIndicator } from '@/components/sync/sync-status-indicator'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Mobile/Tablet Header */}
      <div className="lg:hidden">
        <MobileHeader />
      </div>
      
      {/* Desktop Sidebar */}
      <DesktopSidebar />
      
      {/* Main Content Area */}
      <main 
        className="flex-1 pt-safe-header lg:pt-16 pb-safe-nav lg:pb-0 px-4 lg:px-6 xl:px-8 2xl:px-12 overflow-y-auto overflow-x-hidden"
        style={{ marginLeft: 'var(--sidebar-width, 200px)' }}
      >
        <PageTransition className="w-full max-w-md lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">
          {children}
        </PageTransition>
      </main>
      
      {/* Mobile/Tablet Bottom Navigation */}
      <div className="lg:hidden">
        <BottomNav />
      </div>

      {/* Sync Status Indicator */}
      <SyncStatusIndicator />
    </div>
  )
}
