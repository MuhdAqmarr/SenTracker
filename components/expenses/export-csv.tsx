'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Expense {
  id: string
  amount: number
  merchant: string
  date: string
  notes: string | null
  categories: { name: string } | null
}

interface ExportCSVProps {
  expenses: Expense[]
  monthLabel: string
}

export function ExportCSV({ expenses, monthLabel }: ExportCSVProps) {
  const handleExport = () => {
    if (expenses.length === 0) {
      return
    }

    // CSV Headers
    const headers = ['Date', 'Merchant', 'Category', 'Amount (RM)', 'Notes']
    
    // CSV Rows
    const rows = expenses.map(expense => [
      formatDate(expense.date),
      `"${expense.merchant.replace(/"/g, '""')}"`, // Escape quotes in merchant
      expense.categories?.name || 'Uncategorized',
      expense.amount.toFixed(2),
      `"${(expense.notes || '').replace(/"/g, '""')}"`, // Escape quotes in notes
    ])

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `expenses-${monthLabel}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleExport}
      disabled={expenses.length === 0}
    >
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  )
}

