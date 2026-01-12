'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Loader2, Sparkles, PenLine } from 'lucide-react'

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
import { NaturalLanguageEntry } from './NaturalLanguageEntry'

type EntryMode = 'manual' | 'natural'

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
  const [entryMode, setEntryMode] = useState<EntryMode>('natural') // Default to NL mode
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
  const { toast } = useToast()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const isLargeScreen = useMediaQuery("(min-width: 1024px)")
  
  // Auto-detect variant: button on desktop (lg+), fab on mobile/tablet
  const effectiveVariant = variant || (isLargeScreen ? 'button' : 'fab')

  // Detect keyboard open/close using Visual Viewport API
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return

    const handleViewportChange = () => {
      const viewport = window.visualViewport
      if (viewport) {
        const heightDiff = window.innerHeight - viewport.height
        setIsKeyboardOpen(heightDiff > 150) // Threshold for keyboard detection
      }
    }

    window.visualViewport.addEventListener('resize', handleViewportChange)
    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportChange)
    }
  }, [])

  // Prevent drawer from closing when keyboard is open
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && isKeyboardOpen) {
      // If keyboard is open, blur the active input first
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      // Small delay to let keyboard close, then close drawer
      setTimeout(() => {
        setOpen(false)
      }, 200)
    } else {
      setOpen(newOpen)
    }
  }

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

    if (!result.success) {
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

  // Tab Toggle UI Component
  // Tab Toggle UI Component
  const TabToggle = (
    <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-900/50 rounded-lg mb-4 mx-4 border border-zinc-200 dark:border-zinc-800">
      <button
        type="button"
        onClick={() => setEntryMode('natural')}
        className={cn(
          'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all',
          entryMode === 'natural'
            ? 'bg-white dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm dark:shadow-none'
            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
        )}
      >
        <Sparkles className="w-4 h-4" />
        Natural
      </button>
      <button
        type="button"
        onClick={() => setEntryMode('manual')}
        className={cn(
          'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all',
          entryMode === 'manual'
            ? 'bg-white dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm dark:shadow-none'
            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
        )}
      >
        <PenLine className="w-4 h-4" />
        Manual
      </button>
    </div>
  )

  if (isDesktop) {
    return (
      <>
        {TriggerButton}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="right" className="sm:max-w-[425px] overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle>Add Expense</SheetTitle>
            </SheetHeader>
            {TabToggle}
            {entryMode === 'natural' ? (
              <div className="px-4 pb-8">
                <NaturalLanguageEntry categories={categories} onClose={() => setOpen(false)} />
              </div>
            ) : (
              ExpenseFormContent
            )}
          </SheetContent>
        </Sheet>
      </>
    )
  }

  return (
    <>
      {TriggerButton}
      <Drawer 
        open={open} 
        onOpenChange={handleOpenChange}
        keyboardAware={true}
        shouldScaleBackground={true}
      >
        <DrawerContent 
          className={cn(
            "flex flex-col",
            isKeyboardOpen 
              ? "max-h-[calc(100vh-env(safe-area-inset-top)-env(safe-area-inset-bottom))]" 
              : "max-h-[85vh]"
          )}
        >
          <DrawerHeader className="text-left flex-shrink-0 pb-2">
            <DrawerTitle>Add Expense</DrawerTitle>
          </DrawerHeader>
          <div 
            className={cn(
              "flex-1 overflow-y-auto overscroll-contain px-4 pb-8",
              isKeyboardOpen && "pb-safe"
            )}
          >
            {TabToggle}
            {entryMode === 'natural' ? (
              <div className="pb-8">
                <NaturalLanguageEntry categories={categories} onClose={() => setOpen(false)} />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-8">
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
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

