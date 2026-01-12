'use client'

import { User, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AccountSectionProps {
  email: string
  displayName: string
}

export function AccountSection({ email, displayName }: AccountSectionProps) {
  const router = useRouter()
  
  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="glass-card p-5">
      <h2 className="font-semibold text-foreground mb-4">Account</h2>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full gradient-accent flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {displayName || 'User'}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {email}
            </p>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={handleSignOut}
          className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
        >
          Sign Out
        </Button>
      </div>
    </div>
  )
}
