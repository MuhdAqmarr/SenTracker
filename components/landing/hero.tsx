"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ArrowRight } from "lucide-react"

export function LandingHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      // Animate Elements - using fromTo for strictly defined start/end states (prevents stuck visibility)
      tl.fromTo("h1.hero-title", 
        { y: 100, autoAlpha: 0, skewY: 2 },
        { y: 0, autoAlpha: 1, skewY: 0, duration: 1.2 }
      )
      .fromTo("p.hero-subtitle",
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8 },
        "-=0.8"
      )
      .fromTo(".hero-btn",
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1 },
        "-=0.6"
      )
      .fromTo(".hero-badge",
        { y: 10, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8 },
        "-=0.8"
      )

      // Phone Entrance
      gsap.fromTo(phoneRef.current,
        { y: 100, autoAlpha: 0, rotateX: 20, scale: 0.9 },
        { y: 0, autoAlpha: 1, rotateX: 0, scale: 1, duration: 1.5, ease: "power2.out" }
      )

      // Mouse Parallax
      const handleMouseMove = (e: MouseEvent) => {
        if (!phoneRef.current) return
        const { clientX, clientY } = e
        const xPos = (clientX / window.innerWidth - 0.5) * 20
        const yPos = (clientY / window.innerHeight - 0.5) * 20

        gsap.to(phoneRef.current, {
          x: xPos,
          y: yPos,
          rotateY: xPos * 0.5,
          rotateX: -yPos * 0.5,
          duration: 1,
          ease: "power2.out"
        })
      }

      window.addEventListener("mousemove", handleMouseMove)
      return () => window.removeEventListener("mousemove", handleMouseMove)
    }, containerRef)

    return () => ctx.revert()
  }, [])



  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center pt-32 pb-0 px-4 overflow-hidden perspective-1000">
      
      {/* Content Container */}
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Text Side - Awwwards Style */}
        <div className="text-center lg:text-left space-y-8 relative z-20">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-[10px] uppercase tracking-widest text-emerald-400 font-semibold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            V2.0 is Live
          </div>

          <div className="relative">
            <h1 className="hero-title text-7xl sm:text-8xl lg:text-9xl font-bold tracking-tighter text-white leading-[0.9] invisible">
              <span className="block opacity-50 relative z-0">LIQUID</span>
              <span className="block text-emerald-400 relative z-10 -mt-2 sm:-mt-4">
                FINANCE
              </span>
            </h1>
            {/* Decorative background blur for text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/10 blur-[100px] -z-10 rounded-full" />
          </div>
          
          <p className="hero-subtitle text-xl text-zinc-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light invisible">
            Stop tracking expenses like it&apos;s 2010. Experience the <span className="text-white font-medium">first cinematic personal finance app</span> built for the Malaysian ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start pt-4">
            <Link 
              href="/login" 
              className="hero-btn group relative h-14 pl-8 pr-2 bg-white text-black rounded-full font-bold text-lg flex items-center gap-4 hover:bg-zinc-100 transition-all overflow-hidden"
            >
              <span className="relative z-10">Start the Experience</span>
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
              </div>
            </Link>
          </div>

          <div className="hero-badge pt-8 flex items-center gap-8 justify-center lg:justify-start opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Trust Badges / Social Proof */}
             <div className="text-xs font-mono text-zinc-500 flex flex-col gap-1 text-left">
                <span className="block text-white font-bold text-lg">4.9/5</span>
                <span>User Rating</span>
             </div>
             <div className="w-px h-8 bg-white/10" />
             <div className="text-xs font-mono text-zinc-500 flex flex-col gap-1 text-left">
                <span className="block text-white font-bold text-lg">10k+</span>
                <span>Transactions</span>
             </div>
          </div>
        </div>

        {/* 3D Phone Mock Side */}
        <div className="relative flex justify-center lg:justify-end mt-12 lg:mt-0 perspective-1000">
          <div 
            ref={phoneRef}
            className="relative w-[300px] h-[600px] bg-black rounded-[45px] border-[8px] border-zinc-800 shadow-2xl overflow-hidden ring-1 ring-white/10 transform transition-transform will-change-transform"
            style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 100px -20px rgba(6, 182, 212, 0.2)" }}
          >
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50" />
            
            {/* Screen Content */}
            <div className="w-full h-full bg-zinc-950 flex flex-col p-6 pt-12 space-y-6">
              
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-zinc-400">Total Spent</div>
                  <div className="text-2xl font-bold text-white">RM 1,234<span className="text-zinc-500 text-sm">.50</span></div>
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400" />
                </div>
              </div>

              {/* Chart Mock */}
              <div className="h-32 w-full bg-zinc-900/50 rounded-2xl flex items-end justify-between p-3 gap-1">
                {[40, 65, 30, 80, 50, 90, 45].map((h, i) => (
                  <div 
                    key={i} 
                    className="w-full bg-zinc-800 rounded-t-sm" 
                    style={{ height: `${h}%` }}
                  >
                   <div 
                    className="w-full bg-emerald-500/80 rounded-t-sm" 
                    style={{ height: i === 5 ? '100%' : '0%' }} 
                   /> 
                  </div>
                ))}
              </div>

              {/* List */}
              <div className="space-y-3">
                <div className="text-xs font-medium text-zinc-500 uppercase">Recent</div>
                {[
                  { name: "Tesco Groceries", cat: "Food", price: "- RM 154.20" },
                  { name: "Petronas", cat: "Transport", price: "- RM 50.00" },
                  { name: "Netflix", cat: "Entertain", price: "- RM 39.90" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">
                        {item.cat[0]}
                      </div>
                      <div className="text-sm text-zinc-200">{item.name}</div>
                    </div>
                    <div className="text-sm font-medium text-white">{item.price}</div>
                  </div>
                ))}
              </div>

              {/* Bottom Nav Mock */}
              <div className="absolute bottom-6 left-6 right-6 h-14 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/10 flex items-center justify-around px-4">
                <div className="w-8 h-1 rounded-full bg-zinc-700" />
                <div className="w-8 h-1 rounded-full bg-zinc-700" />
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg -mt-6">
                  <div className="w-4 h-4 bg-white/20 rounded-sm" />
                </div>
                <div className="w-8 h-1 rounded-full bg-zinc-700" />
                <div className="w-8 h-1 rounded-full bg-zinc-700" />
              </div>

            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
