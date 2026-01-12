'use client'

import { motion } from 'framer-motion'
import { ListTodo } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Insight {
  id: string
  type: 'tip' | 'warning' | 'celebration'
  title: string
  message: string
  icon: string
}

interface WeeklyFeedProps {
  insights: Insight[]
}

export function WeeklyFeed({ insights }: WeeklyFeedProps) {
  const typeColors = {
    tip: 'bg-blue-500/20 text-blue-400',
    warning: 'bg-amber-500/20 text-amber-400',
    celebration: 'bg-emerald-500/20 text-emerald-400',
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <ListTodo className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-foreground">This Week</h3>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
              typeColors[insight.type]
            )}>
              <span className="text-sm">{insight.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm">
                {insight.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {insight.message}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
