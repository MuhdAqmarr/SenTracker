'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { Provider } from '@supabase/supabase-js'

export async function signInWithOAuth(provider: Provider) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/41ffdff1-fbce-4bc2-bd3b-bb934cde6189',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/(auth)/actions.ts:8',message:'signInWithOAuth called',data:{provider:String(provider)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'G'})}).catch(()=>{});
  // #endregion
  const supabase = createClient()
  const origin = headers().get('origin')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  // #region agent log
  if (error) {
    fetch('http://127.0.0.1:7242/ingest/41ffdff1-fbce-4bc2-bd3b-bb934cde6189',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/(auth)/actions.ts:20',message:'signInWithOAuth error',data:{error:error.message, errorCode:error.status},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'G'})}).catch(()=>{});
  }
  // #endregion

  if (error) {
    return redirect('/login?message=Could not authenticate user')
  }

  return redirect(data.url)
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect('/login')
}

