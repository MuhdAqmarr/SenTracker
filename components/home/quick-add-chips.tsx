'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface QuickAddChipsProps {
  merchants: string[]
  onMerchantClick: (merchant: string) => void
}

export function QuickAddChips({ 
  merchants, 
  onMerchantClick, 
}: QuickAddChipsProps) {
  // Get last 3 merchants
  const recentMerchants = merchants.slice(0, 3)
  
  if (recentMerchants.length === 0) return null

  return (
    <div className="mb-4">
      <p className="text-xs text-muted-foreground mb-2">Quick add</p>
      <div className="flex flex-wrap gap-2">
        {recentMerchants.map((merchant, index) => (
          <motion.button
            key={merchant}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onMerchantClick(merchant)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium",
              "bg-secondary text-secondary-foreground",
              "hover:bg-primary/20 hover:text-primary",
              "transition-colors touch-target"
            )}
          >
            {merchant}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
