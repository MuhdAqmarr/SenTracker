'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { Provider } from '@supabase/supabase-js'

/**
 * Initiates OAuth sign-in flow with the specified provider
 * @param provider - OAuth provider (e.g., 'google', 'github')
 * @throws Redirects to login page on error
 */
export async function signInWithOAuth(provider: Provider) {
  const supabase = createClient()
  const origin = headers().get('origin')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return redirect('/login?message=Could not authenticate user')
  }

  return redirect(data.url)
}

/**
 * Signs out the current user and redirects to login page
 */
export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect('/login')
}

