'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, History, Wallet, User } from 'lucide-react'
import { motion } from 'framer-motion'

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'History', href: '/history', icon: History },
  { name: 'Budget', href: '/budget', icon: Wallet },
  { name: 'Profile', href: '/profile', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-px h-0.5 w-8 bg-emerald-500 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              
              <div className={cn(
                "transition-colors duration-200",
                isActive ? "text-emerald-500" : "text-slate-400"
              )}>
                <item.icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              <span className={cn(
                "text-[10px] mt-1 font-medium transition-colors duration-200",
                isActive ? "text-emerald-500" : "text-slate-400"
              )}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

