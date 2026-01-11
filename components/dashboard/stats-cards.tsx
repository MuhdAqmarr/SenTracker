import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Wallet, TrendingUp, AlertCircle } from "lucide-react"
import { TapMotion } from "@/components/motion"

interface StatsCardsProps {
  totalSpend: number
  budgetTotal: number
  overBudgetCount: number
}

export function StatsCards({ totalSpend, budgetTotal, overBudgetCount }: StatsCardsProps) {
  const spendPercentage = budgetTotal > 0 ? (totalSpend / budgetTotal) * 100 : 0
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
      <TapMotion>
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
          <CardContent className="p-4 md:p-5 lg:p-6 flex flex-col justify-between h-full relative">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Spend</span>
              <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {formatCurrency(totalSpend)}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">For selected month</p>
            </div>
          </CardContent>
        </Card>
      </TapMotion>

      <TapMotion>
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
          <CardContent className="p-4 md:p-5 lg:p-6 flex flex-col justify-between h-full relative">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Budget Usage</span>
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {spendPercentage.toFixed(0)}%
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                of {formatCurrency(budgetTotal)} limit
              </p>
            </div>
            {/* Progress bar background */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
              <div 
                className="h-full bg-blue-500 rounded-r-full" 
                style={{ width: `${Math.min(spendPercentage, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </TapMotion>

      <TapMotion>
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
          <CardContent className="p-4 md:p-5 lg:p-6 flex flex-col justify-between h-full relative">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Health</span>
              <div className={`p-1.5 rounded-full ${overBudgetCount > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
                <AlertCircle className={`h-4 w-4 ${overBudgetCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {overBudgetCount > 0 ? `${overBudgetCount} Alert` : 'Healthy'}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {overBudgetCount > 0 ? 'Categories over budget' : 'All budgets on track'}
              </p>
            </div>
          </CardContent>
        </Card>
      </TapMotion>
    </div>
  )
}
