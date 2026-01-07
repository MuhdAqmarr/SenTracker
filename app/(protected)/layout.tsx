import { BottomNav } from '@/components/layout/bottom-nav'
import { MobileHeader } from '@/components/layout/mobile-header'
import { PageTransition } from '@/components/motion'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <MobileHeader />
      
      <main className="flex-1 pt-14 pb-24 px-4 overflow-y-auto overflow-x-hidden">
        <PageTransition className="w-full max-w-md mx-auto">
          {children}
        </PageTransition>
      </main>
      
      <BottomNav />
    </div>
  )
}
