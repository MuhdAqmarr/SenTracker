'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, History, Wallet, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'History', href: '/history', icon: History },
  { name: 'Budget', href: '/budget', icon: Wallet },
  { name: 'Profile', href: '/profile', icon: User },
]

export function DesktopSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      initial={false}
      animate={{
        width: collapsed ? 80 : 256,
      }}
      className="hidden lg:flex fixed left-0 top-0 bottom-0 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex-col z-40"
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                key="logo-text"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-lg font-bold text-slate-900 dark:text-white whitespace-nowrap overflow-hidden"
              >
                SenTracker
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative group",
                isActive 
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" 
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    key={item.name}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          )
        })}
      </nav>
    </motion.aside>
  )
}

