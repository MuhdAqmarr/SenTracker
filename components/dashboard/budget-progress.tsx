import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

interface BudgetProgressProps {
  category: string
  spent: number
  limit: number
}

export function BudgetProgressCard({ data }: { data: BudgetProgressProps[] }) {
  return (
    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 mt-4">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-slate-900 dark:text-white">Budget Health</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-4">
          {data.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No budgets set.
            </p>
          ) : (
            data.slice(0, 5).map((item) => { // Only show top 5 on dashboard
              const percentage = Math.min((item.spent / item.limit) * 100, 100)
              const isOverspent = item.spent > item.limit
              
              let progressColor = "bg-emerald-500"
              if (percentage >= 80) progressColor = "bg-yellow-500"
              if (isOverspent) progressColor = "bg-red-500"

              return (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{item.category}</span>
                      {isOverspent && (
                        <span className="text-[10px] text-red-500 font-bold">
                          Over
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className={isOverspent ? "text-red-500 font-semibold" : ""}>
                        {formatCurrency(item.spent)}
                      </span>
                      <span className="text-[10px] mx-1">/</span>
                      {formatCurrency(item.limit)}
                    </div>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-1.5 bg-slate-100 dark:bg-slate-800" 
                    indicatorClassName={progressColor}
                  />
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
