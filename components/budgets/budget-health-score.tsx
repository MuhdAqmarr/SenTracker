'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConfettiCelebration } from '@/components/celebrations/confetti'

interface BudgetHealthScoreProps {
  budgets: Array<{
    category: string
    spent: number
    limit: number
  }>
}

export function BudgetHealthScore({ budgets }: BudgetHealthScoreProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  
  if (budgets.length === 0) {
    return (
      <div className="glass-card p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Award className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Budget Health</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Set budgets to track your financial health
        </p>
      </div>
    )
  }

  // Calculate health score
  const totalBudgets = budgets.length
  const underBudget = budgets.filter(b => b.spent < b.limit).length
  const onTrack = budgets.filter(b => {
    const percent = (b.spent / b.limit) * 100
    return percent >= 75 && percent < 100
  }).length
  const overBudget = budgets.filter(b => b.spent > b.limit).length

  // Calculate health score with strict penalties
  let totalScore = 0
  budgets.forEach(b => {
    const percent = (b.spent / b.limit) * 100
    if (percent >= 100) totalScore += 0
    else if (percent >= 85) totalScore += 50
    else totalScore += 100
  })

  // Start with base average
  let calculatedScore = Math.round(totalScore / totalBudgets)

  // Apply strict penalty: -10 points for every budget exceeded
  // This ensures even one or two failures drag down the score significantly
  const penalty = overBudget * 10
  const healthScore = Math.max(0, calculatedScore - penalty)
  
  // Determine health status
  const getHealthStatus = () => {
    if (healthScore >= 80) return { label: 'Excellent', color: 'text-emerald-500', icon: '✨' }
    if (healthScore >= 60) return { label: 'Good', color: 'text-green-500', icon: '👍' }
    if (healthScore >= 40) return { label: 'Fair', color: 'text-amber-500', icon: '⚠️' }
    return { label: 'Needs Work', color: 'text-destructive', icon: '🔴' }
  }

  const status = getHealthStatus()

  // Trigger confetti for excellent score
  const triggerCelebration = () => {
    if (healthScore >= 80 && !showConfetti) {
      setShowConfetti(true)
    }
  }

  return (
    <>
      <ConfettiCelebration 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onAnimationComplete={triggerCelebration}
        className="glass-card p-5 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Budget Health</h2>
          </div>
          <span className="text-xs text-muted-foreground">{budgets.length} budgets</span>
        </div>

        {/* Health Score Circle */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative h-20 w-20 flex-shrink-0">
            <svg className="transform -rotate-90" width="80" height="80">
              {/* Background circle */}
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-secondary"
              />
              {/* Progress circle */}
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(healthScore / 100) * 201} 201`}
                className={cn(
                  "transition-all duration-1000",
                  healthScore >= 80 ? "text-emerald-500" :
                  healthScore >= 60 ? "text-green-500" :
                  healthScore >= 40 ? "text-amber-500" :
                  "text-destructive"
                )}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{healthScore}</span>
            </div>
          </div>

          <div className="flex-1">
            <p className={cn("text-xl font-bold mb-1", status.color)}>
              {status.icon} {status.label}
            </p>
            <p className="text-sm text-muted-foreground">
              Your overall budget performance
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-lg bg-emerald-500/10">
            <p className="text-lg font-bold text-emerald-500">{underBudget}</p>
            <p className="text-xs text-muted-foreground">Under</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-amber-500/10">
            <p className="text-lg font-bold text-amber-500">{onTrack}</p>
            <p className="text-xs text-muted-foreground">On Track</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-destructive/10">
            <p className="text-lg font-bold text-destructive">{overBudget}</p>
            <p className="text-xs text-muted-foreground">Over</p>
          </div>
        </div>
      </motion.div>
    </>
  )
}
