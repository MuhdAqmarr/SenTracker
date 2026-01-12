'use client'

import { useState, useCallback, useEffect } from 'react'
import { Loader2, Sparkles, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { parseExpenseText, isReadyToSave } from '@/lib/nl'
import type { ParsedExpense } from '@/lib/nl/types'
import { ParsedPreviewCard } from './ParsedPreviewCard'
import { addExpense } from '@/lib/actions/expenses'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
}

interface NaturalLanguageEntryProps {
  categories: Category[]
  onClose: () => void
}

const EXAMPLE_PHRASES = [
  'rm 12 grab today',
  'RM8 kopi at Zus',
  'yesterday rm25 petrol shell',
  'Paid RM120 shopee headphones',
  'rm 5.50 teh ais mamak',
]

export function NaturalLanguageEntry({ categories, onClose }: NaturalLanguageEntryProps) {
  const [input, setInput] = useState('')
  const [parsed, setParsed] = useState<ParsedExpense | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const { toast } = useToast()

  // Debounced parsing
  useEffect(() => {
    if (!input.trim()) {
      setParsed(null)
      return
    }

    const timer = setTimeout(() => {
      const result = parseExpenseText(input)
      setParsed(result)

      // Auto-select category if suggested
      if (result.categoryName) {
        const matchedCategory = categories.find(
          (c) => c.name.toLowerCase() === result.categoryName?.toLowerCase()
        )
        if (matchedCategory) {
          setSelectedCategoryId(matchedCategory.id)
        }
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [input, categories])

  // Handle example click
  const handleExampleClick = useCallback((example: string) => {
    setInput(example)
  }, [])

  // Handle category selection
  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setShowCategoryPicker(false)
  }, [])

  // Find category name by ID
  const selectedCategoryName = selectedCategoryId
    ? categories.find((c) => c.id === selectedCategoryId)?.name
    : undefined

  // Check if ready to save
  const canSave = parsed && isReadyToSave(parsed, selectedCategoryId)

  // Handle submit
  const handleSubmit = async () => {
    if (!parsed || !canSave) return

    setIsSubmitting(true)

    try {
      const result = await addExpense({
        amount: parsed.amount!,
        category_id: selectedCategoryId!,
        merchant: parsed.merchant || 'Unknown',
        date: parsed.date,
        notes: parsed.notes || '',
      })

      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        })
      } else {
        toast({
          title: 'Expense Added! 🎉',
          description: `RM ${parsed.amount?.toFixed(2)} • ${parsed.merchant || 'Expense'}`,
        })
        onClose()
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save expense',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
          <span>Type naturally, we&apos;ll parse it</span>
        </div>
        <Textarea
          value={input}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
          placeholder={`Try: "rm 15 nasi lemak at ali mamak"`}
          className="min-h-[100px] text-lg bg-zinc-100 dark:bg-zinc-900/50 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-emerald-500/50 resize-none transition-colors"
          autoFocus
        />
      </div>

      {/* Example Chips */}
      <div className="flex flex-wrap gap-2">
        {EXAMPLE_PHRASES.map((phrase, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleExampleClick(phrase)}
            className="px-3 py-1.5 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-zinc-700 dark:hover:text-white transition-colors border border-zinc-200 dark:border-white/5"
          >
            {phrase}
          </button>
        ))}
      </div>

      {/* Parsed Preview */}
      {parsed && (
        <ParsedPreviewCard
          parsed={parsed}
          selectedCategoryName={selectedCategoryName}
          onCategoryClick={() => setShowCategoryPicker(true)}
        />
      )}

      {/* Category Picker (when needed) */}
      {showCategoryPicker && (
        <div className="space-y-2">
          <label className="text-sm text-zinc-500 dark:text-zinc-400">Select Category</label>
          <Select onValueChange={handleCategorySelect} value={selectedCategoryId}>
            <SelectTrigger className="h-12 bg-zinc-100 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Error State */}
      {parsed && !parsed.amount && (
        <div className="text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-3">
          💡 Include an amount, e.g., &quot;rm 15&quot; or &quot;RM 12.50&quot;
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!canSave || isSubmitting}
        className={cn(
          'w-full h-12 text-lg font-medium transition-all',
          canSave
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed'
        )}
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Confirm & Save
          </>
        )}
      </Button>
    </div>
  )
}
