import Link from 'next/link'
import Image from 'next/image'
import { SocialLoginButtons } from '@/components/auth/social-login-buttons'
import { LandingBackground } from '@/components/landing/background'
import { ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <LandingBackground />

      <div className="w-full max-w-md relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl p-8 space-y-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                <Image
                  src="/icon.png"
                  alt="SenTracker"
                  width={40}
                  height={40}
                  className="object-contain rounded-xl"
                  priority
                />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                SenTracker
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Get started
            </h1>
            <p className="text-zinc-400 text-sm">
              Sign in or create an account to continue
            </p>
          </div>

          <div className="space-y-6">
            <SocialLoginButtons />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-medium">
                <span className="bg-[#09090b] px-3 text-zinc-500">
                  Secured by Supabase
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-center text-xs text-zinc-500 mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
