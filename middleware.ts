import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/41ffdff1-fbce-4bc2-bd3b-bb934cde6189',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:6',message:'Middleware entry',data:{path:request.nextUrl.pathname,hasSupabaseUrl:!!process.env.NEXT_PUBLIC_SUPABASE_URL,hasSupabaseKey:!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A,B'})}).catch(()=>{});
  // #endregion
  try {
    const result = await updateSession(request)
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/41ffdff1-fbce-4bc2-bd3b-bb934cde6189',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:12',message:'Middleware success',data:{status:result?.status},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    return result
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/41ffdff1-fbce-4bc2-bd3b-bb934cde6189',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:17',message:'Middleware error',data:{error:String(error)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    throw error
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

