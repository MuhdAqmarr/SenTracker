'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { success, error, handleError, requireAuth, type ActionResult } from '@/lib/errors'

/**
 * Creates or updates a budget for a specific category and month
 * @param categoryId - Category ID for the budget
 * @param monthYear - Month and year in 'YYYY-MM' format
 * @param monthlyLimit - Monthly spending limit (must be > 0)
 * @returns ActionResult indicating success or failure
 */
export async function upsertBudget(
  categoryId: string,
  monthYear: string,
  monthlyLimit: number
): Promise<ActionResult> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    requireAuth(user)

    if (monthlyLimit <= 0) {
      return error('Budget limit must be greater than 0')
    }

    // Check if budget exists for this category and month
    const { data: existing } = await supabase
      .from('budgets')
      .select('id')
      .eq('user_id', user.id)
      .eq('category_id', categoryId)
      .eq('month_year', monthYear)
      .single()

    if (existing) {
      // Update existing budget
      const { error: dbError } = await supabase
        .from('budgets')
        .update({ monthly_limit: monthlyLimit })
        .eq('id', existing.id)
        .eq('user_id', user.id)

      if (dbError) {
        return handleError(dbError, 'Failed to update budget')
      }
    } else {
      // Create new budget
      const { error: dbError } = await supabase
        .from('budgets')
        .insert({
          user_id: user.id,
          category_id: categoryId,
          month_year: monthYear,
          monthly_limit: monthlyLimit,
        })

      if (dbError) {
        return handleError(dbError, 'Failed to create budget')
      }
    }

    revalidatePath('/budget')
    revalidatePath('/dashboard')
    return success()
  } catch (err) {
    return handleError(err, 'Failed to save budget')
  }
}

/**
 * Deletes a budget record
 * @param budgetId - Budget ID to delete
 * @returns ActionResult indicating success or failure
 */
export async function deleteBudget(budgetId: string): Promise<ActionResult> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    requireAuth(user)

    const { error: dbError } = await supabase
      .from('budgets')
      .delete()
      .eq('id', budgetId)
      .eq('user_id', user.id)

    if (dbError) {
      return handleError(dbError, 'Failed to delete budget')
    }

    revalidatePath('/budget')
    revalidatePath('/dashboard')
    return success()
  } catch (err) {
    return handleError(err, 'Failed to delete budget')
  }
}

