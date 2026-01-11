'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { expenseSchema, type ExpenseFormValues } from '@/lib/validations'
import { addExpense } from '@/lib/actions/expenses'
import { useToast } from '@/hooks/use-toast'
import { FAB } from '@/components/ui/fab'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Plus } from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface AddExpenseSheetProps {
  categories: Category[]
  variant?: 'fab' | 'button'
}

export function AddExpenseSheet({ categories, variant }: AddExpenseSheetProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const isLargeScreen = useMediaQuery("(min-width: 1024px)")
  
  // Auto-detect variant: button on desktop (lg+), fab on mobile/tablet
  const effectiveVariant = variant || (isLargeScreen ? 'button' : 'fab')

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      merchant: '',
      amount: undefined,
      notes: '',
      date: new Date(),
    },
  })

  async function onSubmit(data: ExpenseFormValues) {
    setIsSubmitting(true)
    const result = await addExpense(data)
    setIsSubmitting(false)

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      })
    } else {
      toast({
        title: "Success",
        description: "Expense added successfully",
      })
      setOpen(false)
      form.reset({
        merchant: '',
        amount: undefined,
        notes: '',
        date: new Date(),
      })
    }
  }

  const ExpenseFormContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4 pb-8">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (RM)</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">RM</span>
                  <Input 
                    type="number" 
                    step="0.01" 
                    className="pl-10 text-lg font-semibold h-12"
                    placeholder="0.00" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full h-12 pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Pick date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="merchant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Merchant</FormLabel>
              <FormControl>
                <Input className="h-12" placeholder="Where did you spend?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input className="h-12" placeholder="Optional details" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-lg font-medium mt-4" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Save Expense"
          )}
        </Button>
      </form>
    </Form>
  )

  const TriggerButton = effectiveVariant === 'button' ? (
    <Button 
      onClick={() => setOpen(true)}
      className="bg-emerald-600 hover:bg-emerald-700 text-white"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Expense
    </Button>
  ) : (
    <FAB onClick={() => setOpen(true)} />
  )

  if (isDesktop) {
    return (
      <>
        {TriggerButton}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="right" className="sm:max-w-[425px]">
            <SheetHeader className="mb-6">
              <SheetTitle>Add Expense</SheetTitle>
            </SheetHeader>
            {ExpenseFormContent}
          </SheetContent>
        </Sheet>
      </>
    )
  }

  return (
    <>
      {TriggerButton}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Add Expense</DrawerTitle>
          </DrawerHeader>
          {ExpenseFormContent}
        </DrawerContent>
      </Drawer>
    </>
  )
}

