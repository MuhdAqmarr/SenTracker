'use client'

import { useState } from 'react'
import { format, isToday, isYesterday, parseISO } from 'date-fns'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Trash2, Edit2, MoreHorizontal } from 'lucide-react'
import type { Expense } from '@/types/database'

interface ExpenseWithCategory extends Expense {
  categories?: { name: string } | null
}

interface ExpenseListProps {
  expenses: ExpenseWithCategory[]
  onEdit?: (expense: ExpenseWithCategory) => void
  onDelete?: (id: string) => void
}

// Group expenses by date
function groupByDate(expenses: ExpenseWithCategory[]) {
  const groups: { [key: string]: ExpenseWithCategory[] } = {}
  
  expenses.forEach(expense => {
    const date = expense.date.split('T')[0]
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(expense)
  })
  
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
}

function formatDateHeader(dateStr: string) {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'EEEE, MMM d')
}

// Category icon mapping
const categoryIcons: { [key: string]: string } = {
  'Food': '🍔',
  'Transport': '🚗',
  'Shopping': '🛍️',
  'Entertainment': '🎬',
  'Bills': '📄',
  'Health': '💊',
  'Education': '📚',
  'Travel': '✈️',
  'Other': '📦',
}

function getCategoryIcon(category: string) {
  return categoryIcons[category] || '💵'
}

interface SwipeableItemProps {
  expense: ExpenseWithCategory
  onEdit?: (expense: ExpenseWithCategory) => void
  onDelete?: (id: string) => void
}

function SwipeableExpenseItem({ expense, onEdit, onDelete }: SwipeableItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const x = useMotionValue(0)
  const actionOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0])
  const actionScale = useTransform(x, [-100, -50, 0], [1, 0.9, 0.8])

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -50) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-MY', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="relative overflow-hidden rounded-xl mb-3">
      {/* Action buttons (revealed on swipe) */}
      <motion.div 
        className="absolute right-0 top-0 bottom-0 flex items-center gap-2 pr-3"
        style={{ opacity: actionOpacity, scale: actionScale }}
      >
        <button
          onClick={() => onEdit?.(expense)}
          className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center touch-target"
          aria-label="Edit expense"
        >
          <Edit2 className="h-4 w-4 text-primary" />
        </button>
        <button
          onClick={() => onDelete?.(expense.id)}
          className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center touch-target"
          aria-label="Delete expense"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </button>
      </motion.div>

      {/* Main content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{ x: isOpen ? -100 : 0 }}
        style={{ x }}
        className="relative z-10 flex items-center gap-3 p-3 bg-card rounded-xl border border-border touch-action-pan-y"
      >
        {/* Category Icon */}
        <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 text-lg">
          {getCategoryIcon(expense.categories?.name || 'Other')}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">
            {expense.merchant}
          </p>
          <p className="text-xs text-muted-foreground">
            {expense.categories?.name || 'Uncategorized'}
          </p>
        </div>

        {/* Amount */}
        <div className="text-right flex-shrink-0">
          <p className="font-semibold text-foreground">
            RM {formatAmount(Number(expense.amount))}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(parseISO(expense.date), 'h:mm a')}
          </p>
        </div>

        {/* Quick actions button (visible alternative to swipe on desktop) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:flex hidden h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary transition-colors touch-target"
          aria-label="More options"
        >
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </button>
      </motion.div>
    </div>
  )
}

export function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  const grouped = groupByDate(expenses)

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">💸</div>
        <p className="text-muted-foreground">No expenses yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Tap the button below to add your first expense
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {grouped.map(([date, items], groupIndex) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.05 }}
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              {formatDateHeader(date)}
            </h3>
            <div>
              {items.map((expense, index) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <SwipeableExpenseItem
                    expense={expense}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
