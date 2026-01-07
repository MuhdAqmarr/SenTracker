'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { motion } from 'framer-motion'

const COLORS = [
  '#10b981', // emerald-500
  '#3b82f6', // blue-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#64748b', // slate-500
]

interface CategoryData {
  name: string
  value: number
  [key: string]: string | number
}

export function CategoryChart({ data }: { data: CategoryData[] }) {
  if (data.length === 0) {
    return (
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 mt-4">
        <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
          No expenses recorded
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 mt-4">
      <CardHeader className="pb-0 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-slate-900 dark:text-white">Spending Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderColor: 'transparent',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#0f172a' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
