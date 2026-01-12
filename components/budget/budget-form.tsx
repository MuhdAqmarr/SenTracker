'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { upsertBudget } from '@/lib/actions/budgets'
import { formatCurrency } from '@/lib/utils'
import { Save, Loader2 } from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface Budget {
  id: string
  category_id: string
  monthly_limit: number
  categories: { name: string } | null
}

interface BudgetFormProps {
  categories: Category[]
  budgets: Budget[]
  monthYear: string
}

export function BudgetForm({ categories, budgets, monthYear }: BudgetFormProps) {
  const [limits, setLimits] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    budgets.forEach(b => {
      initial[b.category_id] = b.monthly_limit.toString()
    })
    return initial
  })
  const [saving, setSaving] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleSave = async (categoryId: string) => {
    const value = parseFloat(limits[categoryId] || '0')
    if (value <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Budget limit must be greater than 0",
      })
      return
    }

    setSaving(categoryId)
    const result = await upsertBudget(categoryId, monthYear, value)
    setSaving(null)

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      })
    } else {
      toast({
        title: "Success",
        description: "Budget saved successfully",
      })
      router.refresh()
    }
  }

  const totalBudget = Object.values(limits).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Monthly Budget</CardTitle>
          <CardDescription>Sum of all category budgets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald-600">
            {formatCurrency(totalBudget)}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const existingBudget = budgets.find(b => b.category_id === category.id)
          const currentValue = limits[category.id] || ''

          return (
            <Card key={category.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{category.name}</CardTitle>
                {existingBudget && (
                  <CardDescription>
                    Current limit: {formatCurrency(existingBudget.monthly_limit)}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      RM
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={currentValue}
                      onChange={(e) => setLimits(prev => ({
                        ...prev,
                        [category.id]: e.target.value
                      }))}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    onClick={() => handleSave(category.id)}
                    disabled={saving === category.id || !currentValue}
                    size="icon"
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {saving === category.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

