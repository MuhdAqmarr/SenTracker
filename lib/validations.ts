import { z } from "zod"

export const expenseSchema = z.object({
  amount: z
    .number({ message: "Amount must be a valid number" })
    .positive({ message: "Amount must be greater than 0" }),
  category_id: z.string().uuid({ message: "Please select a category" }),
  merchant: z.string().min(1, { message: "Merchant name is required" }),
  date: z.date({ message: "A date is required" }),
  notes: z.string().optional(),
})

export type ExpenseFormValues = z.infer<typeof expenseSchema>

export const budgetSchema = z.object({
  category_id: z.string().uuid(),
  monthly_limit: z
    .number({ message: "Limit is required" })
    .positive({ message: "Limit must be positive" }),
  month_year: z.string().regex(/^\d{4}-\d{2}$/, { message: "Invalid format YYYY-MM" }),
})

export type BudgetFormValues = z.infer<typeof budgetSchema>
