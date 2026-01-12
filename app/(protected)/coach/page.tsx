import { createClient } from '@/lib/supabase/server'
import { startOfMonth, endOfMonth, format, subMonths, subDays } from 'date-fns'
import { FadeInStagger, FadeInItem } from '@/components/motion'
import { DailyInsight } from '@/components/coach/daily-insight'
import { WeeklyFeed } from '@/components/coach/weekly-feed'
import { Achievements } from '@/components/coach/achievements'
import { Target } from 'lucide-react'

// Removed force-dynamic for better caching performance
// export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

interface CoachInsight {
  id: string
  type: 'tip' | 'warning' | 'celebration'
  title: string
  message: string
  icon: string
}

async function getCoachData() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const currentMonth = format(new Date(), 'yyyy-MM')
  const date = new Date()
  const startDate = startOfMonth(date).toISOString()
  const endDate = endOfMonth(date).toISOString()
  
  const prevDate = subMonths(date, 1)
  
  const [{ data: expenses }, { data: prevExpenses }, { data: budgets }] = await Promise.all([
    supabase
      .from('expenses')
      .select('*, categories(name)')
      .gte('date', startDate)
      .lte('date', endDate)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('expenses')
      .select('*, categories(name)')
      .gte('date', startOfMonth(prevDate).toISOString())
      .lte('date', endOfMonth(prevDate).toISOString())
      .eq('user_id', user.id),
    supabase
      .from('budgets')
      .select('*, categories(name)')
      .eq('month_year', currentMonth)
      .eq('user_id', user.id),
  ])

  // Calculate metrics
  const totalSpend = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0
  const budgetTotal = budgets?.reduce((sum, b) => sum + Number(b.monthly_limit), 0) || 0
  
  // Days calculations
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const daysPassed = date.getDate()
  const daysRemaining = daysInMonth - daysPassed
  const currentBurnRate = daysPassed > 0 ? totalSpend / daysPassed : 0
  const targetBurnRate = budgetTotal > 0 && daysRemaining > 0 
    ? (budgetTotal - totalSpend) / daysRemaining 
    : 0

  // Generate insights
  const insights: CoachInsight[] = []
  
  // Burn rate insight
  if (daysRemaining > 0 && budgetTotal > 0) {
    if (currentBurnRate > targetBurnRate * 1.2) {
      insights.push({
        id: 'burn-high',
        type: 'warning',
        title: 'Spending Fast',
        message: `You're spending RM ${currentBurnRate.toFixed(0)}/day. To stay in budget, aim for RM ${targetBurnRate.toFixed(0)}/day for the rest of the month.`,
        icon: '🔥',
      })
    } else if (currentBurnRate <= targetBurnRate) {
      insights.push({
        id: 'burn-good',
        type: 'celebration',
        title: 'You\'re On Track! 🎉',
        message: `Great pace! You can spend up to RM ${targetBurnRate.toFixed(0)}/day and still hit your budget.`,
        icon: '✅',
      })
    }
  }

  // Category comparisons
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

  Object.entries(categorySpend).forEach(([cat, amount]) => {
    const prev = prevCategorySpend[cat] || 0
    if (prev > 0) {
      const change = ((amount - prev) / prev) * 100
      if (change > 25 && amount > 50) {
        insights.push({
          id: `cat-${cat}`,
          type: 'warning',
          title: `${cat} Up ${change.toFixed(0)}%`,
          message: `You've spent RM ${amount.toFixed(0)} on ${cat} this month vs RM ${prev.toFixed(0)} last month.`,
          icon: '⚠️',
        })
      } else if (change < -20 && prev > 50) {
        insights.push({
          id: `cat-${cat}-down`,
          type: 'celebration',
          title: `${cat} Down!`,
          message: `Great job! ${cat} spending is ${Math.abs(change).toFixed(0)}% lower than last month.`,
          icon: '🎉',
        })
      }
    }
  })

  // Calculate streak (days with expenses logged)
  const uniqueDays = new Set(
    expenses?.map(e => e.date.split('T')[0]) || []
  )
  const today = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')
  
  let streak = 0
  if (uniqueDays.has(today) || uniqueDays.has(yesterday)) {
    let checkDate = uniqueDays.has(today) ? new Date() : subDays(new Date(), 1)
    while (uniqueDays.has(format(checkDate, 'yyyy-MM-dd'))) {
      streak++
      checkDate = subDays(checkDate, 1)
    }
  }

  // Achievements
  const achievements = []
  if (streak >= 3) {
    achievements.push({ id: 'streak-3', title: `${streak}-Day Streak`, icon: '🔥' })
  }
  
  // Under budget categories
  budgets?.forEach(budget => {
    const catName = budget.categories?.name || ''
    const spent = categorySpend[catName] || 0
    if (spent < Number(budget.monthly_limit) && spent > 0) {
      achievements.push({ 
        id: `under-${budget.id}`, 
        title: `Under Budget: ${catName}`, 
        icon: '💰' 
      })
    }
  })

  return {
    insights: insights.slice(0, 3),
    streak,
    achievements: achievements.slice(0, 4),
    totalSpend,
    budgetTotal,
    daysRemaining,
  }
}

export default async function CoachPage() {
  const data = await getCoachData()
  
  if (!data) return null

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl gradient-accent flex items-center justify-center">
          <Target className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Budget Coach</h1>
          <p className="text-sm text-muted-foreground">Your money mentor</p>
        </div>
      </div>

      <FadeInStagger className="space-y-6">
        {/* Daily Insight (Featured) */}
        {data.insights.length > 0 && (
          <FadeInItem>
            <DailyInsight insight={data.insights[0]} />
          </FadeInItem>
        )}

        {/* Weekly Feed */}
        {data.insights.length > 1 && (
          <FadeInItem>
            <WeeklyFeed insights={data.insights.slice(1)} />
          </FadeInItem>
        )}

        {/* Achievements */}
        <FadeInItem>
          <Achievements 
            streak={data.streak} 
            achievements={data.achievements} 
          />
        </FadeInItem>
      </FadeInStagger>
    </div>
  )
}
