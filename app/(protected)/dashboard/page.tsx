import { createClient } from '@/lib/supabase/server'
import { startOfMonth, endOfMonth, format } from 'date-fns'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { CategoryChart } from '@/components/dashboard/category-chart'
import { TopMerchants } from '@/components/dashboard/top-merchants'
import { BudgetProgressCard } from '@/components/dashboard/budget-progress'
import { AddExpenseSheet } from '@/components/expenses/add-expense-sheet'
import { FadeInStagger, FadeInItem } from '@/components/motion'

export const dynamic = 'force-dynamic'

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
      .order('date', { ascending: false }),
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

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { month?: string }
}) {
  const currentMonth = searchParams.month || format(new Date(), "yyyy-MM")
  const data = await getDashboardData(currentMonth)

  if (!data) return null

  const { expenses, budgets, categories } = data

  const totalSpend = expenses.reduce((sum, item) => sum + Number(item.amount), 0)
  const budgetTotal = budgets.reduce((sum, item) => sum + Number(item.monthly_limit), 0)

  const categorySpend = expenses.reduce((acc, item) => {
    const catName = item.categories?.name || 'Uncategorized'
    acc[catName] = (acc[catName] || 0) + Number(item.amount)
    return acc
  }, {} as Record<string, number>)

  const categoryData = Object.entries(categorySpend).map(([name, value]) => ({
    name,
    value,
  }))

  const merchantSpend = expenses.reduce((acc, item) => {
    acc[item.merchant] = (acc[item.merchant] || 0) + Number(item.amount)
    return acc
  }, {} as Record<string, number>)

  const topMerchants = Object.entries(merchantSpend)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([merchant, amount]) => ({
      merchant,
      amount,
      percentage: (amount / totalSpend) * 100
    }))

  const budgetProgress = budgets.map(budget => {
    const catName = budget.categories?.name || ''
    const spent = expenses
      .filter(e => e.category_id === budget.category_id)
      .reduce((sum, e) => sum + Number(e.amount), 0)
    
    return {
      category: catName,
      spent,
      limit: Number(budget.monthly_limit)
    }
  }).sort((a, b) => (b.spent / b.limit) - (a.spent / a.limit))

  const overBudgetCount = budgetProgress.filter(b => b.spent > b.limit).length

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8 pb-20 lg:pb-0">
      <AddExpenseSheet categories={categories} />

      <FadeInStagger>
        <FadeInItem>
          <StatsCards 
            totalSpend={totalSpend} 
            budgetTotal={budgetTotal}
            overBudgetCount={overBudgetCount}
          />
        </FadeInItem>

        {/* Chart and Budget Progress - Side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          <FadeInItem>
            <CategoryChart data={categoryData} />
          </FadeInItem>

          <FadeInItem>
            <BudgetProgressCard data={budgetProgress} />
          </FadeInItem>
        </div>

        <FadeInItem>
          <TopMerchants data={topMerchants} />
        </FadeInItem>
      </FadeInStagger>
    </div>
  )
}
