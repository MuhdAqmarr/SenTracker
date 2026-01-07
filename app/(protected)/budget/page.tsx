import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { BudgetForm } from '@/components/budget/budget-form'
import { MonthSelector } from '@/components/dashboard/month-selector'

export const dynamic = 'force-dynamic'

async function getBudgetData(monthYear: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const [{ data: categories }, { data: budgets }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase
      .from('budgets')
      .select('*, categories(name)')
      .eq('month_year', monthYear)
      .eq('user_id', user.id)
  ])

  return {
    categories: categories || [],
    budgets: budgets || []
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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Budget Settings</h2>
          <p className="text-muted-foreground">
            Set your monthly spending limits for each category
          </p>
        </div>
        <MonthSelector />
      </div>

      <BudgetForm 
        categories={data.categories} 
        budgets={data.budgets}
        monthYear={currentMonth}
      />
    </div>
  )
}

