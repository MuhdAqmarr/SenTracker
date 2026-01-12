'use client'

import { Flame, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BurnRateCardProps {
  currentBurnRate: number
  targetBurnRate: number
  daysRemaining: number
  budgetTotal: number
  totalSpend: number
}

export function BurnRateCard({ 
  currentBurnRate, 
  targetBurnRate, 
  daysRemaining,
  budgetTotal,
  totalSpend 
}: BurnRateCardProps) {
  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('en-MY', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const isOverBudget = totalSpend > budgetTotal
  const isBurningFast = currentBurnRate > targetBurnRate * 1.2

  if (budgetTotal === 0) {
    return (
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Burn Rate</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Set a budget to track your daily burn rate
        </p>
      </div>
    )
  }

  return (
    <div className={cn(
      "glass-card p-5",
      isOverBudget && "border-destructive/50"
    )}>
      <div className="flex items-center gap-2 mb-4">
        <Flame className={cn(
          "h-4 w-4",
          isOverBudget ? "text-destructive" : isBurningFast ? "text-warning" : "text-primary"
        )} />
        <h3 className="font-semibold text-foreground">Burn Rate</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Current pace</p>
          <p className={cn(
            "text-xl font-bold",
            isBurningFast ? "text-warning" : "text-foreground"
          )}>
            RM {formatMoney(currentBurnRate)}<span className="text-sm font-normal text-muted-foreground">/day</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Target pace</p>
          <p className="text-xl font-bold text-primary">
            RM {formatMoney(Math.max(0, targetBurnRate))}<span className="text-sm font-normal text-muted-foreground">/day</span>
          </p>
        </div>
      </div>

      {daysRemaining > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-muted-foreground" />
            {isOverBudget ? (
              <span className="text-destructive">
                You&apos;re over budget by RM {formatMoney(totalSpend - budgetTotal)}
              </span>
            ) : isBurningFast ? (
              <span className="text-warning">
                Slow down! Spend RM {formatMoney(targetBurnRate)}/day to stay in budget
              </span>
            ) : (
              <span className="text-muted-foreground">
                {daysRemaining} days left. You&apos;re on track!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
