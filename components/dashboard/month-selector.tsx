'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format, subMonths } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

function MonthSelectorInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentMonth = searchParams.get("month") || format(new Date(), "yyyy-MM")

  // Generate last 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i)
    return {
      value: format(date, "yyyy-MM"),
      label: format(date, "MMMM yyyy"),
    }
  })

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("month", value)
    router.push(`?${params.toString()}`)
  }

  return (
    <Select value={currentMonth} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px] bg-white dark:bg-slate-950">
        <SelectValue placeholder="Select month" />
      </SelectTrigger>
      <SelectContent>
        {months.map((month) => (
          <SelectItem key={month.value} value={month.value}>
            {month.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function MonthSelector() {
  return (
    <Suspense fallback={<Skeleton className="w-[180px] h-10" />}>
      <MonthSelectorInner />
    </Suspense>
  )
}
