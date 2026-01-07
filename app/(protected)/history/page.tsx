import { createClient } from '@/lib/supabase/server'
import { startOfMonth, endOfMonth, format } from 'date-fns'
import { ExpenseTable } from '@/components/expenses/expense-table'
import { FadeInStagger, FadeInItem } from '@/components/motion'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { AddExpenseSheet } from '@/components/expenses/add-expense-sheet'

export const dynamic = 'force-dynamic'

async function getHistoryData(monthStr: string) {
  const supabase = createClient()
  const date = new Date(monthStr + "-01")
  const startDate = startOfMonth(date).toISOString()
  const endDate = endOfMonth(date).toISOString()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [{ data: expenses }, { data: categories }] = await Promise.all([
    supabase
      .from('expenses')
      .select('*, categories(name)')
      .gte('date', startDate)
      .lte('date', endDate)
      .eq('user_id', user.id)
      .order('date', { ascending: false }),
    supabase.from('categories').select('*').order('name')
  ])

  return { 
    expenses: expenses || [], 
    categories: categories || [] 
  }
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: { month?: string }
}) {
  const currentMonth = searchParams.month || format(new Date(), "yyyy-MM")
  const data = await getHistoryData(currentMonth)

  if (!data) return null

  // Group expenses by date
  const groupedExpenses = data.expenses.reduce((acc, expense) => {
    const date = formatDate(expense.date)
    if (!acc[date]) acc[date] = []
    acc[date].push(expense)
    return acc
  }, {} as Record<string, typeof data.expenses>)

  return (
    <div className="space-y-6">
      <AddExpenseSheet categories={data.categories} />
      
      <FadeInStagger className="space-y-6">
        {Object.entries(groupedExpenses).map(([date, items]) => (
          <FadeInItem key={date} className="space-y-2">
            <h3 className="text-sm font-medium text-slate-500 px-1">{date}</h3>
            <div className="space-y-2">
              {items.map((expense) => (
                <Card key={expense.id} className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium text-slate-900 dark:text-white">{expense.merchant}</p>
                      <p className="text-xs text-slate-500">{expense.categories?.name || 'Uncategorized'}</p>
                      {expense.notes && (
                        <p className="text-xs text-slate-400 italic">{expense.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(expense.amount)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </FadeInItem>
        ))}
        
        {data.expenses.length === 0 && (
          <FadeInItem>
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
              <CardContent className="p-8 text-center text-muted-foreground">
                No expenses found for this month.
              </CardContent>
            </Card>
          </FadeInItem>
        )}
      </FadeInStagger>
    </div>
  )
}

