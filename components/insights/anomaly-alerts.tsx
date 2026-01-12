'use client'

import { AlertTriangle, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface Anomaly {
  category: string
  current: number
  previous: number
  changePercent: number
}

interface AnomalyAlertsProps {
  anomalies: Anomaly[]
}

export function AnomalyAlerts({ anomalies }: AnomalyAlertsProps) {
  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('en-MY', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <h3 className="font-semibold text-foreground">Spending Changes</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="ml-auto" aria-label="Why am I seeing this?">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm">
                These categories show significant changes compared to last month (+/- 15%)
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-3">
        {anomalies.map((anomaly, index) => {
          const isIncrease = anomaly.changePercent > 0
          
          return (
            <motion.div
              key={anomaly.category}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
            >
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                isIncrease ? "bg-destructive/20" : "bg-primary/20"
              )}>
                {isIncrease ? (
                  <TrendingUp className="h-4 w-4 text-destructive" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-primary" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">
                  {anomaly.category}
                </p>
                <p className="text-xs text-muted-foreground">
                  RM {formatMoney(anomaly.current)} vs RM {formatMoney(anomaly.previous)}
                </p>
              </div>
              
              <div className={cn(
                "text-sm font-semibold",
                isIncrease ? "text-destructive" : "text-primary"
              )}>
                {isIncrease ? '+' : ''}{anomaly.changePercent.toFixed(0)}%
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
