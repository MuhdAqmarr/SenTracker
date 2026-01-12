'use client'

import { TrendingUp, Wallet, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCountUp } from '@/components/motion'
import { cn } from '@/lib/utils'

interface QuickStatsProps {
  totalSpend: number
  budgetTotal: number
  topCategory: string
  topCategoryAmount: number
}

export function QuickStats({ totalSpend, budgetTotal, topCategory, topCategoryAmount }: QuickStatsProps) {
  const animatedSpend = useCountUp(totalSpend, 0.8)
  const remaining = budgetTotal - totalSpend
  const animatedRemaining = useCountUp(Math.abs(remaining), 0.8)
  const isOverBudget = remaining < 0
  const percentUsed = budgetTotal > 0 ? (totalSpend / budgetTotal) * 100 : 0

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-MY', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {/* Month Spend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">Spent</span>
        </div>
        <p className="text-xl md:text-2xl font-bold text-foreground truncate">
          RM {formatMoney(animatedSpend)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {percentUsed.toFixed(0)}% of budget
        </p>
      </motion.div>

      {/* Remaining */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={cn(
          "glass-card p-4",
          isOverBudget && "border-destructive/50 animate-pulse-glow"
        )}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Wallet className={cn(
            "h-3.5 w-3.5",
            isOverBudget ? "text-destructive" : "text-muted-foreground"
          )} />
          <span className={cn(
            "text-xs font-medium",
            isOverBudget ? "text-destructive" : "text-muted-foreground"
          )}>
            {isOverBudget ? 'Over' : 'Left'}
          </span>
        </div>
        <p className={cn(
          "text-xl md:text-2xl font-bold truncate",
          isOverBudget ? "text-destructive" : "text-primary"
        )}>
          RM {formatMoney(animatedRemaining)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {isOverBudget ? 'over budget' : 'remaining'}
        </p>
      </motion.div>

      {/* Top Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-1.5 mb-2">
          <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">Top</span>
        </div>
        <p className="text-sm md:text-base font-bold text-foreground truncate">
          {topCategory || 'None'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          RM {formatMoney(topCategoryAmount)}
        </p>
      </motion.div>
    </div>
  )
}
