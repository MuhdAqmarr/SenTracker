'use client'

import { useState } from 'react'
import { ExpenseList } from '@/components/home/expense-list'
import { EditExpenseDialog } from '@/components/expenses/edit-expense-dialog'
import { deleteExpense } from '@/lib/actions/expenses'
import { useToast } from '@/hooks/use-toast'
import type { Database } from '@/types/database'

type Expense = Database['public']['Tables']['expenses']['Row']
interface ExpenseWithCategory extends Expense {
  categories?: { name: string } | null
}

interface Category {
  id: string
  name: string
}

interface DashboardClientProps {
  expenses: ExpenseWithCategory[]
  categories: Category[]
}

export function DashboardClient({ expenses, categories }: DashboardClientProps) {
  const [editingExpense, setEditingExpense] = useState<ExpenseWithCategory | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleEdit = (expense: ExpenseWithCategory) => {
    setEditingExpense(expense)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return

    const result = await deleteExpense(id)
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      })
    } else {
      toast({
        title: "Deleted",
        description: "Expense removed successfully",
      })
    }
  }

  return (
    <>
      <ExpenseList 
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <EditExpenseDialog 
        expense={editingExpense}
        categories={categories}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  )
}
