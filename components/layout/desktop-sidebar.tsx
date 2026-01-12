'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Home, BarChart3, Wallet, Target, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Insights', href: '/insights', icon: BarChart3 },
  { name: 'Budgets', href: '/budget', icon: Wallet },
  { name: 'Coach', href: '/coach', icon: Target },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function DesktopSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(200)

  // Set CSS variable for sidebar width so layout can use it
  useEffect(() => {
    const updateWidth = () => {
      const width = collapsed ? 72 : (window.innerWidth >= 2560 ? 240 : 200)
      setSidebarWidth(width)
      document.documentElement.style.setProperty('--sidebar-width', `${width}px`)
    }
    
    updateWidth() // Initial set
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [collapsed])

  return (
    <motion.aside
      initial={false}
      animate={{
        width: sidebarWidth,
      }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="hidden lg:flex fixed left-0 top-0 bottom-0 bg-card/80 backdrop-blur-xl border-r border-border flex-col z-40"
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-2.5 border-b border-border gap-1.5">
        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
          <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-transparent">
            <Image
              src="/icon.png"
              alt="SenTracker"
              width={28}
              height={28}
              className="object-contain rounded-lg"
              priority
            />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                key="logo-text"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden min-w-0 flex-1"
              >
                <span className="text-sm font-bold gradient-text whitespace-nowrap">
                  SenTracker
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-secondary transition-colors touch-target flex-shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto" aria-label="Sidebar navigation">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all relative group",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              title={collapsed ? item.name : undefined}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="desktopActiveTab"
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              
              <item.icon className={cn(
                "h-4 w-4 flex-shrink-0 transition-transform",
                isActive && "scale-110"
              )} />
              
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
                <div className="absolute left-full ml-3 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg border border-border">
                  {item.name}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-3 border-t border-border"
          >
            <div className="glass-card p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Target className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground">Budget Coach</span>
              </div>
              <p className="text-xs text-muted-foreground leading-tight">
                Check out your daily insights
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  )
}

