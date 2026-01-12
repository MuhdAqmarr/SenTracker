"use client"

import Link from "next/link"
import { Lock, Github, Heart } from "lucide-react"

export function LandingTrust() {
  return (
    <section id="privacy" className="py-24 px-4 text-center">
      <div className="max-w-4xl mx-auto space-y-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Your Data. Your Rules.</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white">Data Isolation</h3>
            <p className="text-sm text-zinc-500">Your financial data is secured with Row-Level Security. Only you can see it.</p>
          </div>
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400">
              <Github className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white">Open Source</h3>
            <p className="text-sm text-zinc-500">Transparent code. Auditable security. Login via GitHub or Google.</p>
          </div>
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white">MYR First</h3>
            <p className="text-sm text-zinc-500">Built for Malaysians. We know the difference between 'Mamak' costs and fine dining.</p>
          </div>
        </div>

        <div className="pt-12">
          <div className="p-8 rounded-3xl bg-gradient-to-b from-zinc-900 to-black border border-white/10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to take control?</h2>
            <Link 
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
            >
              Start Tracking Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function LandingFooter() {
    const handleLowMotionToggle = () => {
        const current = localStorage.getItem('sen-low-motion') === 'true'
        localStorage.setItem('sen-low-motion', (!current).toString())
        window.location.reload()
    }

    return (
        <footer className="py-12 px-4 border-t border-white/5 bg-black z-10 relative">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-zinc-500 text-sm">
                    © {new Date().getFullYear()} SenTracker. Built with ❤️ in Malaysia.
                </div>
                
                <div className="flex gap-6 text-sm font-medium text-zinc-400">
                    <button onClick={handleLowMotionToggle} className="hover:text-white transition-colors">
                        Toggle Low Motion
                    </button>
                    <Link href="#" className="hover:text-white transition-colors">Github</Link>
                    <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                </div>
            </div>
        </footer>
    )
}
