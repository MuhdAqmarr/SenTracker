'use client'

import { useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { gsap } from 'gsap'
import { Calendar, Store, FileText, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ParsedExpense } from '@/lib/nl/types'

interface ParsedPreviewCardProps {
  parsed: ParsedExpense
  selectedCategoryName?: string
  onCategoryClick?: () => void
  className?: string
}

export function ParsedPreviewCard({
  parsed,
  selectedCategoryName,
  onCategoryClick,
  className,
}: ParsedPreviewCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const prevParsedRef = useRef<ParsedExpense | null>(null)

  // Animate on change
  useEffect(() => {
    if (cardRef.current && prevParsedRef.current !== parsed) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0.7, y: 5 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      )
      prevParsedRef.current = parsed
    }
  }, [parsed])

  const displayCategory = selectedCategoryName || parsed.categoryName
  const hasAmount = parsed.amount !== undefined && parsed.amount > 0
  const confidencePercent = Math.round(parsed.confidence * 100)

  // Confidence color
  const confidenceColor =
    parsed.confidence >= 0.7
      ? 'text-emerald-500'
      : parsed.confidence >= 0.4
      ? 'text-amber-500'
      : 'text-red-500'

  return (
    <div
      ref={cardRef}
      className={cn(
        'rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/60 backdrop-blur-sm p-5 space-y-4 shadow-sm dark:shadow-none',
        className
      )}
    >
      {/* Amount Display */}
      <div className="text-center">
        {hasAmount ? (
          <div className="text-4xl font-bold text-zinc-900 dark:text-white">
            <span className="text-zinc-400 dark:text-zinc-500 text-2xl mr-1">RM</span>
            {parsed.amount!.toFixed(2)}
          </div>
        ) : (
          <div className="text-2xl text-zinc-400 dark:text-zinc-500 italic">Enter amount...</div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Merchant */}
        <div className="flex items-center gap-2 text-sm">
          <Store className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          <span className={parsed.merchant ? 'text-zinc-700 dark:text-white font-medium' : 'text-zinc-400 dark:text-zinc-500 italic'}>
            {parsed.merchant || 'No merchant'}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          <span className="text-zinc-700 dark:text-white font-medium">{format(parsed.date, 'dd MMM yyyy')}</span>
        </div>

        {/* Category */}
        <div className="col-span-2">
          <button
            type="button"
            onClick={onCategoryClick}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              displayCategory
                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/30'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-dashed border-zinc-300 dark:border-zinc-600'
            )}
          >
            {displayCategory ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                {displayCategory.charAt(0).toUpperCase() + displayCategory.slice(1)}
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Pick Category
              </>
            )}
          </button>
        </div>

        {/* Notes */}
        {parsed.notes && (
          <div className="col-span-2 flex items-start gap-2 text-sm">
            <FileText className="w-4 h-4 text-zinc-400 dark:text-zinc-500 mt-0.5" />
            <span className="text-zinc-600 dark:text-zinc-300">{parsed.notes}</span>
          </div>
        )}
      </div>

      {/* Confidence & Warnings */}
      <div className="pt-3 border-t border-zinc-200 dark:border-white/5 space-y-2">
        {/* Confidence Bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 dark:text-zinc-500">Confidence</span>
          <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', {
                'bg-emerald-500': parsed.confidence >= 0.7,
                'bg-amber-500': parsed.confidence >= 0.4 && parsed.confidence < 0.7,
                'bg-red-500': parsed.confidence < 0.4,
              })}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
          <span className={cn('text-xs font-medium', confidenceColor)}>
            {confidencePercent}%
          </span>
        </div>

        {/* Warnings */}
        {parsed.warnings.length > 0 && (
          <div className="space-y-1">
            {parsed.warnings.map((warning, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-amber-500/80">
                <AlertCircle className="w-3 h-3" />
                {warning}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
