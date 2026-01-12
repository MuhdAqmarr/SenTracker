'use client'

import Image from 'next/image'
import { MonthSelector } from '@/components/dashboard/month-selector'
import { usePathname } from 'next/navigation'

export function MobileHeader() {
  const pathname = usePathname()
  
  // Only show month selector on dashboard, budget, and history pages
  const showMonthSelector = ['/dashboard', '/budget', '/history'].includes(pathname)
  
  // Get title based on path
  const getTitle = () => {
    switch(pathname) {
      case '/dashboard': return 'Dashboard'
      case '/history': return 'History'
      case '/budget': return 'Budget'
      case '/profile': return 'Profile'
      default: return 'SenTracker'
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 px-4 min-h-[3.5rem] flex items-center justify-between pt-safe" style={{ height: 'calc(3.5rem + env(safe-area-inset-top, 0px))' }}>
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
          <Image
            src="/icon.png"
            alt="SenTracker"
            width={20}
            height={20}
            className="object-contain"
            priority
            loading="eager"
            unoptimized={false}
          />
        </div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          {getTitle()}
        </h1>
      </div>
      
      {showMonthSelector && (
        <div className="scale-90 origin-right">
          <MonthSelector />
        </div>
      )}
    </header>
  )
}

