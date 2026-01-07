import { redirect } from 'next/navigation'

export default function Home() {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/41ffdff1-fbce-4bc2-bd3b-bb934cde6189',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:4',message:'Root page reached',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C,E'})}).catch(()=>{});
  // #endregion
  redirect('/dashboard')
}
