import { createClient } from '@/lib/supabase/server'
import { startOfMonth, endOfMonth, format } from 'date-fns'
import { MoneyVibeHeader } from '@/components/home/money-vibe-header'
import { QuickStats } from '@/components/home/quick-stats'
import { AddExpenseSheet } from '@/components/expenses/add-expense-sheet'
import { FadeInStagger, FadeInItem } from '@/components/motion'
import { DashboardClient } from '@/components/dashboard/dashboard-client'
import { Suspense } from 'react'

// Removed force-dynamic for better caching performance
// export const dynamic = 'force-dynamic'
export const dynamic = 'force-dynamic' // Required for searchParams
export const revalidate = 60 // Revalidate every 60 seconds

async function getDashboardData(monthStr: string) {
  const supabase = createClient()
  const date = new Date(monthStr + "-01")
  const startDate = startOfMonth(date).toISOString()
  const endDate = endOfMonth(date).toISOString()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [
    { data: expenses },
    { data: budgets },
    { data: categories }
  ] = await Promise.all([
    supabase
      .from('expenses')
      .select('*, categories(name)')
      .gte('date', startDate)
      .lte('date', endDate)
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(50), // Limit to 50 most recent expenses for better performance
    supabase
      .from('budgets')
      .select('*, categories(name)')
      .eq('month_year', monthStr)
      .eq('user_id', user.id),
    supabase
      .from('categories')
      .select('*')
      .order('name')
  ])

  return { 
    expenses: expenses || [], 
    budgets: budgets || [], 
    categories: categories || [] 
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { month?: string }
}) {
  const currentMonth = searchParams.month || format(new Date(), "yyyy-MM")
  const data = await getDashboardData(currentMonth)

  if (!data) return null

  const { expenses, budgets, categories } = data

  // Calculate stats
  const totalSpend = expenses.reduce((sum, item) => sum + Number(item.amount), 0)
  const budgetTotal = budgets.reduce((sum, item) => sum + Number(item.monthly_limit), 0)

  // Calculate category spend
  const categorySpend = expenses.reduce((acc, item) => {
    const catName = item.categories?.name || 'Other'
    acc[catName] = (acc[catName] || 0) + Number(item.amount)
    return acc
  }, {} as Record<string, number>)

  // Get top category
  const sortedCategories = Object.entries(categorySpend).sort(([, a], [, b]) => b - a)
  const topCategory = sortedCategories[0]?.[0] || ''
  const topCategoryAmount = sortedCategories[0]?.[1] || 0

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <FadeInStagger>
        <FadeInItem>
          <MoneyVibeHeader />
        </FadeInItem>

        <FadeInItem>
          <QuickStats 
            totalSpend={totalSpend}
            budgetTotal={budgetTotal}
            topCategory={topCategory}
            topCategoryAmount={topCategoryAmount}
          />
        </FadeInItem>

        {/* Add Expense CTA */}
        <FadeInItem>
          <div className="mb-6">
            <AddExpenseSheet categories={categories} />
          </div>
        </FadeInItem>

        {/* Recent Expenses */}
        <FadeInItem>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Expenses</h2>
              <span className="text-sm text-muted-foreground">
                {format(new Date(currentMonth + '-01'), 'MMMM yyyy')}
              </span>
            </div>
            <Suspense fallback={<div className="space-y-3"><div className="glass-card p-4 h-20 animate-pulse" /><div className="glass-card p-4 h-20 animate-pulse" /></div>}>
              <DashboardClient 
                expenses={expenses}
                categories={categories}
              />
            </Suspense>
          </div>
        </FadeInItem>
      </FadeInStagger>
    </div>
  )
}
