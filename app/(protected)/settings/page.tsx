import { createClient } from '@/lib/supabase/server'
import { FadeInStagger, FadeInItem } from '@/components/motion'
import { SettingsForm } from '@/components/settings/settings-form'
import { ExportSection } from '@/components/settings/export-section'
import { AccountSection } from '@/components/settings/account-section'

// Removed force-dynamic for better caching performance
// export const dynamic = 'force-dynamic'
export const revalidate = 300 // Revalidate every 5 minutes (settings change less frequently)

async function getSettingsData() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    user,
    profile,
  }
}

export default async function SettingsPage() {
  const data = await getSettingsData()
  
  if (!data) return null

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <h1 className="text-xl font-bold text-foreground">Settings</h1>

      <FadeInStagger className="space-y-6">
        {/* Account */}
        <FadeInItem>
          <AccountSection 
            email={data.user.email || ''} 
            displayName={data.profile?.display_name || ''} 
          />
        </FadeInItem>

        {/* Preferences */}
        <FadeInItem>
          <SettingsForm />
        </FadeInItem>

        {/* Export */}
        <FadeInItem>
          <ExportSection />
        </FadeInItem>
      </FadeInStagger>
    </div>
  )
}
