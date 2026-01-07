'use server'

import { createClient } from '@/lib/supabase/server'
import { expenseSchema, type ExpenseFormValues } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function addExpense(data: ExpenseFormValues) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const result = expenseSchema.safeParse(data)
  if (!result.success) {
    return { error: 'Invalid data' }
  }

  const { error } = await supabase.from('expenses').insert({
    user_id: user.id,
    amount: result.data.amount,
    category_id: result.data.category_id,
    merchant: result.data.merchant,
    date: result.data.date.toISOString(),
    notes: result.data.notes || null,
  })

  if (error) {
    console.error('Error adding expense:', error)
    return { error: 'Failed to add expense' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateExpense(id: string, data: ExpenseFormValues) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const result = expenseSchema.safeParse(data)
  if (!result.success) {
    return { error: 'Invalid data' }
  }

  const { error } = await supabase
    .from('expenses')
    .update({
      amount: result.data.amount,
      category_id: result.data.category_id,
      merchant: result.data.merchant,
      date: result.data.date.toISOString(),
      notes: result.data.notes || null,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating expense:', error)
    return { error: 'Failed to update expense' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteExpense(id: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: 'Failed to delete expense' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
