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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function DashboardClient({ expenses, categories }: DashboardClientProps) {
  const [editingExpense, setEditingExpense] = useState<ExpenseWithCategory | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleEdit = (expense: ExpenseWithCategory) => {
    setEditingExpense(expense)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    setDeleteId(null) // Close dialog immediately
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
        onDelete={(id) => setDeleteId(id)}
      />
      
      <EditExpenseDialog 
        expense={editingExpense}
        categories={categories}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the expense record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
