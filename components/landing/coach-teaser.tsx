"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MessageCircle, Flame, Target } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export function LandingCoach() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom bottom",
          toggleActions: "play none none reverse"
        }
      })

      // Stagger in cards
      tl.from(".coach-card", {
        y: 100,
        opacity: 0,
        rotate: -5,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.2)"
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Text */}
        <div className="order-2 lg:order-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-medium uppercase tracking-wider">
            <Target className="w-3 h-3" />
            Budget Coach
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Your personal <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              Money Mentor.
            </span>
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
            It&apos;s not just about tracking. It&apos;s about getting better. 
            Receive daily tips, streak rewards, and gentle nudges when you&apos;re going off track.
          </p>
        </div>

        {/* Cards Stack */}
        <div className="order-1 lg:order-2 relative h-[400px] flex items-center justify-center">
          
          {/* Card 1: Bottom */}
          <div className="coach-card absolute top-12 left-0 right-0 mx-auto w-full max-w-sm p-6 rounded-2xl bg-zinc-800/80 border border-white/5 shadow-xl transform scale-90 translate-y-8 -rotate-6 z-0 blur-[1px] opacity-60">
             <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-medium">3-Day Streak! 🔥</h4>
                <p className="text-sm text-zinc-400 mt-1">You&apos;re on fire! Keep logging to earn the Weekender badge.</p>
              </div>
             </div>
          </div>

          {/* Card 2: Middle */}
          <div className="coach-card absolute top-8 left-0 right-0 mx-auto w-full max-w-sm p-6 rounded-2xl bg-zinc-800/90 border border-white/10 shadow-xl transform scale-95 translate-y-4 -rotate-3 z-10">
             <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-medium">Dining is 80% used 🍔</h4>
                <p className="text-sm text-zinc-400 mt-1">RM 120 left for the rest of the month. Maybe cook at home tonight?</p>
              </div>
             </div>
          </div>

          {/* Card 3: Top (Focus) */}
          <div className="coach-card absolute top-0 left-0 right-0 mx-auto w-full max-w-sm p-6 rounded-2xl bg-zinc-900 border border-white/20 shadow-2xl z-20">
             <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-medium">Projected: RM 1,950 📉</h4>
                <p className="text-sm text-zinc-400 mt-1">Great job! At this pace, you&apos;ll save RM 450 this month.</p>
              </div>
             </div>
             <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                <span className="text-zinc-500">Just now</span>
                <span className="text-emerald-400 font-medium">View Insight →</span>
             </div>
          </div>

        </div>
      </div>
    </section>
  )
}
