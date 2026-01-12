'use server'

import { createClient } from '@/lib/supabase/server'
import { expenseSchema, type ExpenseFormValues } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { success, error, handleError, requireAuth, type ActionResult } from '@/lib/errors'

/**
 * Adds a new expense record for the authenticated user
 * @param data - Expense form data validated against expenseSchema
 * @returns ActionResult indicating success or failure
 */
export async function addExpense(data: ExpenseFormValues): Promise<ActionResult> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    requireAuth(user)

    const result = expenseSchema.safeParse(data)
    if (!result.success) {
      return error('Invalid expense data')
    }

    const { error: dbError } = await supabase.from('expenses').insert({
      user_id: user.id,
      amount: result.data.amount,
      category_id: result.data.category_id,
      merchant: result.data.merchant,
      date: result.data.date.toISOString(),
      notes: result.data.notes || null,
    })

    if (dbError) {
      return handleError(dbError, 'Failed to add expense')
    }

    revalidatePath('/dashboard')
    return success()
  } catch (err) {
    return handleError(err, 'Failed to add expense')
  }
}

/**
 * Updates an existing expense record
 * @param id - Expense ID to update
 * @param data - Updated expense form data
 * @returns ActionResult indicating success or failure
 */
export async function updateExpense(id: string, data: ExpenseFormValues): Promise<ActionResult> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    requireAuth(user)

    const result = expenseSchema.safeParse(data)
    if (!result.success) {
      return error('Invalid expense data')
    }

    const { error: dbError } = await supabase
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

    if (dbError) {
      return handleError(dbError, 'Failed to update expense')
    }

    revalidatePath('/dashboard')
    return success()
  } catch (err) {
    return handleError(err, 'Failed to update expense')
  }
}

/**
 * Deletes an expense record
 * @param id - Expense ID to delete
 * @returns ActionResult indicating success or failure
 */
export async function deleteExpense(id: string): Promise<ActionResult> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    requireAuth(user)

    const { error: dbError } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (dbError) {
      return handleError(dbError, 'Failed to delete expense')
    }

    revalidatePath('/dashboard')
    return success()
  } catch (err) {
    return handleError(err, 'Failed to delete expense')
  }
}
