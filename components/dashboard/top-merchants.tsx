import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"

interface MerchantData {
  merchant: string
  amount: number
  percentage: number
}

export function TopMerchants({ data }: { data: MerchantData[] }) {
  return (
    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 mt-4 mb-4">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-slate-900 dark:text-white">Top Merchants</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-3">
          {data.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No data available</p>
          ) : (
            data.map((item) => (
              <div key={item.merchant} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium truncate max-w-[150px]">{item.merchant}</span>
                  <span className="text-slate-500">{formatCurrency(item.amount)}</span>
                </div>
                <Progress value={item.percentage} className="h-1.5 bg-slate-100 dark:bg-slate-800" indicatorClassName="bg-slate-800 dark:bg-slate-400" />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
