'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function upsertBudget(categoryId: string, monthYear: string, monthlyLimit: number) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  if (monthlyLimit <= 0) {
    return { error: 'Budget limit must be greater than 0' }
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
    const { error } = await supabase
      .from('budgets')
      .update({ monthly_limit: monthlyLimit })
      .eq('id', existing.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error updating budget:', error)
      return { error: 'Failed to update budget' }
    }
  } else {
    // Create new budget
    const { error } = await supabase
      .from('budgets')
      .insert({
        user_id: user.id,
        category_id: categoryId,
        month_year: monthYear,
        monthly_limit: monthlyLimit,
      })

    if (error) {
      console.error('Error creating budget:', error)
      return { error: 'Failed to create budget' }
    }
  }

  revalidatePath('/budget')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteBudget(budgetId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', budgetId)
    .eq('user_id', user.id)

  if (error) {
    return { error: 'Failed to delete budget' }
  }

  revalidatePath('/budget')
  revalidatePath('/dashboard')
  return { success: true }
}

