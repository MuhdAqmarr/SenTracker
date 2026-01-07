import { SocialLoginButtons } from '@/components/auth/social-login-buttons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md border-slate-200 dark:border-slate-800 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Welcome to SenTracker
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Your personal MYR expense tracker & budget coach
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <SocialLoginButtons />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-950 px-2 text-slate-500 dark:text-slate-400">
                  Secure access via Supabase
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

