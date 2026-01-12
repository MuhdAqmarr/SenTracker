'use client'

import { useState } from 'react'
import { Download, Loader2, Calendar } from 'lucide-react'
import { format, subMonths } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { startOfMonth, endOfMonth } from 'date-fns'

export function ExportSection() {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [isExporting, setIsExporting] = useState(false)

  // Generate last 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i)
    return {
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy'),
    }
  })

  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }

      const date = new Date(selectedMonth + '-01')
      const startDate = startOfMonth(date).toISOString()
      const endDate = endOfMonth(date).toISOString()

      const { data: expenses } = await supabase
        .from('expenses')
        .select('*, categories(name)')
        .gte('date', startDate)
        .lte('date', endDate)
        .eq('user_id', user.id)
        .order('date', { ascending: true })

      if (!expenses || expenses.length === 0) {
        alert('No expenses found for this month')
        setIsExporting(false)
        return
      }

      // Generate CSV
      const headers = ['Date', 'Category', 'Merchant', 'Amount (MYR)', 'Notes']
      const rows: string[][] = [headers]
      let total = 0

      for (const expense of expenses) {
        const row = [
          format(new Date(expense.date), 'yyyy-MM-dd'),
          expense.categories?.name || 'Uncategorized',
          expense.merchant,
          Number(expense.amount).toFixed(2),
          expense.notes || ''
        ]
        rows.push(row)
        total += Number(expense.amount)
      }

      // Add totals row
      rows.push(['', '', 'TOTAL', total.toFixed(2), ''])

      // Convert to CSV
      const csv = rows.map(row => 
        row.map(cell => 
          cell.includes(',') || cell.includes('"') 
            ? `"${cell.replace(/"/g, '""')}"` 
            : cell
        ).join(',')
      ).join('\n')

      // Download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `expenses-${selectedMonth}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export expenses')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="glass-card p-5">
      <h2 className="font-semibold text-foreground mb-4">Export Data</h2>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Select Month
          </label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleExport} 
          disabled={isExporting}
          className="w-full gradient-accent text-white"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Export CSV
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Exports all expenses for the selected month including totals
        </p>
      </div>
    </div>
  )
}
