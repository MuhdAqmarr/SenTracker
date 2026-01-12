import { createClient } from '@/lib/supabase/server'
import { startOfMonth, endOfMonth, format, eachDayOfInterval, subMonths } from 'date-fns'
import { FadeInStagger, FadeInItem, ProgressRing } from '@/components/motion'
import { TrendChart } from '@/components/insights/trend-chart'
import { BurnRateCard } from '@/components/insights/burn-rate-card'
import { AnomalyAlerts } from '@/components/insights/anomaly-alerts'
import { CategoryDonut } from '@/components/insights/category-donut'
import { TopMerchants } from '@/components/dashboard/top-merchants'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Removed force-dynamic for better caching performance
// export const dynamic = 'force-dynamic'
export const dynamic = 'force-dynamic' // Required for searchParams
export const revalidate = 60 // Revalidate every 60 seconds

async function getInsightsData(monthStr: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const date = new Date(monthStr + '-01')
  const startDate = startOfMonth(date).toISOString()
  const endDate = endOfMonth(date).toISOString()
  
  // Previous month for comparison
  const prevDate = subMonths(date, 1)
  // Previous month for comparison queries
  
  const [{ data: expenses }, { data: prevExpenses }, { data: budgets }] = await Promise.all([
    supabase
      .from('expenses')
      .select('*, categories(name)')
      .gte('date', startDate)
      .lte('date', endDate)
      .eq('user_id', user.id)
      .order('date', { ascending: true }),
    supabase
      .from('expenses')
      .select('*, categories(name)')
      .gte('date', startOfMonth(prevDate).toISOString())
      .lte('date', endOfMonth(prevDate).toISOString())
      .eq('user_id', user.id),
    supabase
      .from('budgets')
      .select('*, categories(name)')
      .eq('month_year', monthStr)
      .eq('user_id', user.id),
  ])

  // Calculate metrics
  const totalSpend = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0
  const prevTotalSpend = prevExpenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0
  const budgetTotal = budgets?.reduce((sum, b) => sum + Number(b.monthly_limit), 0) || 0
  
  // Daily trend
  const days = eachDayOfInterval({ start: startOfMonth(date), end: endOfMonth(date) })
  const today = new Date()
  const dailyTrend = days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd')
    const daySpend = expenses?.filter(e => e.date.startsWith(dayStr))
      .reduce((sum, e) => sum + Number(e.amount), 0) || 0
    const isFuture = day > today
    return { date: format(day, 'd'), amount: daySpend, isFuture }
  })
  
  // Burn rate
  const daysInMonth = days.length
  const daysPassed = today.getMonth() === date.getMonth() && today.getFullYear() === date.getFullYear()
    ? today.getDate()
    : daysInMonth
  const daysRemaining = Math.max(0, daysInMonth - daysPassed)
  const currentBurnRate = daysPassed > 0 ? totalSpend / daysPassed : 0
  const targetBurnRate = budgetTotal > 0 && daysRemaining > 0 
    ? (budgetTotal - totalSpend) / daysRemaining 
    : 0
  
  // Category comparison (anomalies)
  const categorySpend: Record<string, number> = {}
  const prevCategorySpend: Record<string, number> = {}
  
  expenses?.forEach(e => {
    const cat = e.categories?.name || 'Other'
    categorySpend[cat] = (categorySpend[cat] || 0) + Number(e.amount)
  })
  
  prevExpenses?.forEach(e => {
    const cat = e.categories?.name || 'Other'
    prevCategorySpend[cat] = (prevCategorySpend[cat] || 0) + Number(e.amount)
  })
  
  const anomalies = Object.entries(categorySpend)
    .map(([cat, amount]) => {
      const prev = prevCategorySpend[cat] || 0
      const change = prev > 0 ? ((amount - prev) / prev) * 100 : (amount > 0 ? 100 : 0)
      return { category: cat, current: amount, previous: prev, changePercent: change }
    })
    .filter(a => Math.abs(a.changePercent) > 15 && a.current > 10)
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 3)
  
  // Top merchants
  const merchantSpend: Record<string, number> = {}
  expenses?.forEach(e => {
    merchantSpend[e.merchant] = (merchantSpend[e.merchant] || 0) + Number(e.amount)
  })
  
  const topMerchants = Object.entries(merchantSpend)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([merchant, amount]) => ({
      merchant,
      amount,
      percentage: totalSpend > 0 ? (amount / totalSpend) * 100 : 0
    }))

  // Category chart data
  const categoryData = Object.entries(categorySpend)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  return {
    totalSpend,
    prevTotalSpend,
    budgetTotal,
    percentUsed: budgetTotal > 0 ? (totalSpend / budgetTotal) * 100 : 0,
    dailyTrend,
    currentBurnRate,
    targetBurnRate,
    daysRemaining,
    anomalies,
    categoryData,
    topMerchants,
  }
}

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: { month?: string }
}) {
  const currentMonth = searchParams.month || format(new Date(), 'yyyy-MM')
  const data = await getInsightsData(currentMonth)
  
  if (!data) return null

  const prevMonth = format(subMonths(new Date(currentMonth + '-01'), 1), 'yyyy-MM')
  const nextMonth = format(new Date(new Date(currentMonth + '-01').setMonth(new Date(currentMonth + '-01').getMonth() + 1)), 'yyyy-MM')
  const isCurrentMonth = currentMonth === format(new Date(), 'yyyy-MM')

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-MY', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      {/* Month Selector */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">
          {format(new Date(currentMonth + '-01'), 'MMMM yyyy')}
        </h1>
        <div className="flex items-center gap-1">
          <Link
            href={`/insights?month=${prevMonth}`}
            className="p-2 rounded-lg hover:bg-secondary transition-colors touch-target"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </Link>
          <Link
            href={`/insights?month=${nextMonth}`}
            className={cn(
              "p-2 rounded-lg hover:bg-secondary transition-colors touch-target",
              isCurrentMonth && "opacity-50 pointer-events-none"
            )}
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        </div>
      </div>

      <FadeInStagger className="space-y-6">
        {/* Total Spend Summary */}
        <FadeInItem>
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Spend</p>
                <p className="text-3xl font-bold text-foreground">
                  RM {formatMoney(data.totalSpend)}
                </p>
                {data.budgetTotal > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {data.percentUsed.toFixed(0)}% of RM {formatMoney(data.budgetTotal)} budget
                  </p>
                )}
              </div>
              {data.budgetTotal > 0 && (
                <ProgressRing 
                  percent={Math.min(data.percentUsed, 100)}
                  size={80}
                  strokeWidth={8}
                />
              )}
            </div>
          </div>
        </FadeInItem>

        {/* Trend Chart */}
        <FadeInItem>
          <TrendChart data={data.dailyTrend} />
        </FadeInItem>

        {/* Burn Rate */}
        <FadeInItem>
          <BurnRateCard 
            currentBurnRate={data.currentBurnRate}
            targetBurnRate={data.targetBurnRate}
            daysRemaining={data.daysRemaining}
            budgetTotal={data.budgetTotal}
            totalSpend={data.totalSpend}
          />
        </FadeInItem>

        {/* Anomalies */}
        {data.anomalies.length > 0 && (
          <FadeInItem>
            <AnomalyAlerts anomalies={data.anomalies} />
          </FadeInItem>
        )}

        {/* Category Breakdown */}
        <FadeInItem>
          <CategoryDonut data={data.categoryData} total={data.totalSpend} />
        </FadeInItem>

        {/* Top Merchants */}
        <FadeInItem>
          <TopMerchants data={data.topMerchants} />
        </FadeInItem>
      </FadeInStagger>
    </div>
  )
}
