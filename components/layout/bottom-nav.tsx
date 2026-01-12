'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, BarChart3, Wallet, Target, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Insights', href: '/insights', icon: BarChart3 },
  { name: 'Budgets', href: '/budget', icon: Wallet },
  { name: 'Coach', href: '/coach', icon: Target },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 lg:hidden pointer-events-none pb-safe">
      <nav 
        className={cn(
          "mx-auto max-w-md rounded-full pointer-events-auto",
          // Light mode
          "bg-transparent backdrop-blur-md",
          "border border-white/50",
          "shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]",
          // Dark mode
          "dark:bg-transparent",
          "dark:border-white/10",
          "dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]",
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex justify-around items-center h-16 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                className="relative flex flex-col items-center justify-center flex-1 h-full touch-target group"
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={cn(
                      "absolute inset-0 m-auto h-12 w-12 rounded-[20px] pointer-events-none z-10",
                      "backdrop-blur-[1.5px] backdrop-brightness-110 backdrop-contrast-110",
                      "bg-white/10 dark:bg-white/5",
                      // Light Mode: Strong glass loop
                      "shadow-[inset_0_0_8px_rgba(255,255,255,0.6),inset_0_0_2px_rgba(255,255,255,0.8),0_4px_10px_rgba(0,0,0,0.1)]",
                      // Dark Mode: Softer, 'slowed down' glass look (less harsh white insets)
                      "dark:shadow-[inset_0_0_12px_rgba(255,255,255,0.1),inset_0_0_2px_rgba(255,255,255,0.2),0_4px_10px_rgba(0,0,0,0.3)]"
                    )}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <motion.div 
                  className={cn(
                    "relative z-0 flex items-center justify-center transition-all duration-200",
                    isActive 
                      ? "text-primary scale-125" 
                      : "text-zinc-400 hover:text-white"
                  )}
                  whileTap={{ scale: 0.9 }}
                >
                  <item.icon 
                    className="h-6 w-6" 
                    strokeWidth={isActive ? 2.5 : 2} 
                  />
                </motion.div>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
