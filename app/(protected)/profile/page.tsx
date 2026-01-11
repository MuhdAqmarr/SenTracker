import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, Settings, CreditCard, HelpCircle, Shield } from 'lucide-react'
import { TapMotion } from '@/components/motion'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id || '')
    .single()

  const initials = profile?.display_name
    ? profile.display_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'U'

  const menuItems = [
    { icon: Settings, label: 'Preferences' },
    { icon: CreditCard, label: 'Payment Methods' },
    { icon: Shield, label: 'Security' },
    { icon: HelpCircle, label: 'Help & Support' },
  ]

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
        <CardContent className="p-6 flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-emerald-100">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-emerald-50 text-emerald-600 text-xl font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {profile?.display_name || 'User'}
            </h2>
            <p className="text-sm text-slate-500">
              {user?.email}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {menuItems.map((item) => (
          <TapMotion key={item.label}>
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full">
                  <item.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white flex-1">
                  {item.label}
                </span>
              </CardContent>
            </Card>
          </TapMotion>
        ))}
      </div>

      <form action={signOut}>
        <TapMotion>
          <Button 
            variant="destructive" 
            className="w-full h-12 text-base font-medium bg-red-50 hover:bg-red-100 text-red-600 border-none shadow-none"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </TapMotion>
      </form>
      
      <p className="text-center text-xs text-slate-400 pt-4">
        Version 1.0.0
      </p>
    </div>
  )
}

