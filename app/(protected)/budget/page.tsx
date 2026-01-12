import { createClient } from '@/lib/supabase/server'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { BudgetForm } from '@/components/budget/budget-form'
import { MonthSelector } from '@/components/dashboard/month-selector'
import { BudgetHealthScore } from '@/components/budgets/budget-health-score'

// Removed force-dynamic for better caching performance
// export const dynamic = 'force-dynamic'
export const dynamic = 'force-dynamic' // Required for searchParams
export const revalidate = 60 // Revalidate every 60 seconds

async function getBudgetData(monthYear: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const date = new Date(monthYear + '-01')
  const startDate = startOfMonth(date).toISOString()
  const endDate = endOfMonth(date).toISOString()

  const [{ data: categories }, { data: budgets }, { data: expenses }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase
      .from('budgets')
      .select('*, categories(name)')
      .eq('month_year', monthYear)
      .eq('user_id', user.id),
    supabase
      .from('expenses')
      .select('category_id, amount')
      .gte('date', startDate)
      .lte('date', endDate)
      .eq('user_id', user.id)
  ])

  // Calculate spending per category
  const categorySpend: Record<string, number> = {}
  expenses?.forEach(e => {
    const catId = e.category_id
    categorySpend[catId] = (categorySpend[catId] || 0) + Number(e.amount)
  })

  // Build health score data
  const healthData = budgets?.map(b => ({
    category: b.categories?.name || 'Unknown',
    spent: categorySpend[b.category_id] || 0,
    limit: Number(b.monthly_limit)
  })) || []

  return {
    categories: categories || [],
    budgets: budgets || [],
    healthData
  }
}

export default async function BudgetPage({
  searchParams,
}: {
  searchParams: { month?: string }
}) {
  const currentMonth = searchParams.month || format(new Date(), "yyyy-MM")
  const data = await getBudgetData(currentMonth)

  if (!data) return null

  return (
    <div className="flex-1 space-y-6 pb-24 lg:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Budget Settings</h2>
          <p className="text-sm text-muted-foreground">
            Set your monthly spending limits for each category
          </p>
        </div>
        <MonthSelector />
      </div>

      <BudgetHealthScore budgets={data.healthData} />

      <BudgetForm 
        categories={data.categories} 
        budgets={data.budgets}
        monthYear={currentMonth}
      />
    </div>
  )
}

