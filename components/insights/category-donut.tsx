'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { PieChart as PieChartIcon } from 'lucide-react'

interface CategoryData {
  name: string
  value: number
  [key: string]: string | number
}

interface CategoryDonutProps {
  data: CategoryData[]
  total: number
}

const COLORS = [
  'hsl(160, 84%, 39%)',  // Primary emerald
  'hsl(192, 91%, 36%)',  // Cyan
  'hsl(38, 92%, 50%)',   // Amber
  'hsl(280, 65%, 60%)',  // Purple
  'hsl(0, 84%, 60%)',    // Red
  'hsl(210, 65%, 50%)',  // Blue
  'hsl(330, 65%, 55%)',  // Pink
  'hsl(100, 60%, 45%)',  // Green
]

export function CategoryDonut({ data, total }: CategoryDonutProps) {
  const formatMoney = (value: number) => {
    return `RM ${new Intl.NumberFormat('en-MY', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)}`
  }

  if (data.length === 0) {
    return (
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-foreground">By Category</h3>
        </div>
        <p className="text-sm text-muted-foreground text-center py-8">
          No expenses this month
        </p>
      </div>
    )
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <PieChartIcon className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-foreground">By Category</h3>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Chart */}
        <div className="h-48 w-48 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    const percent = ((data.value / total) * 100).toFixed(1)
                    return (
                      <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
                        <p className="text-sm font-medium text-foreground">
                          {data.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatMoney(data.value)} ({percent}%)
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2">
          {data.slice(0, 5).map((item, index) => {
            const percent = ((item.value / total) * 100).toFixed(1)
            return (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="h-3 w-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-foreground flex-1 truncate">
                  {item.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {percent}%
                </span>
              </div>
            )
          })}
          {data.length > 5 && (
            <p className="text-xs text-muted-foreground">
              +{data.length - 5} more categories
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
