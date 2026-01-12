'use client'

import { motion } from 'framer-motion'
import { Lightbulb, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface Insight {
  id: string
  type: 'tip' | 'warning' | 'celebration'
  title: string
  message: string
  icon: string
}

interface DailyInsightProps {
  insight: Insight
}

export function DailyInsight({ insight }: DailyInsightProps) {
  const bgColors = {
    tip: 'from-blue-500/20 to-cyan-500/20',
    warning: 'from-amber-500/20 to-orange-500/20',
    celebration: 'from-emerald-500/20 to-teal-500/20',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6 rounded-2xl bg-gradient-to-br border border-border relative overflow-hidden",
        bgColors[insight.type]
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <span className="text-8xl">{insight.icon}</span>
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wide">
            Today&apos;s Insight
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-auto" aria-label="Why am I seeing this?">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">
                  Insights are generated based on your spending patterns and budget goals
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-2">
          {insight.title}
        </h2>
        
        <p className="text-muted-foreground leading-relaxed">
          {insight.message}
        </p>
      </div>
    </motion.div>
  )
}
