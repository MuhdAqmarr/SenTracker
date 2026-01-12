"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ArrowRight, ShieldCheck, Zap, Download } from "lucide-react"

export function LandingHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    
    // Check locally stored preference from footer
    const storedPref = localStorage.getItem("sen-low-motion")

    if (mediaQuery.matches || storedPref === "true") return

    // GSAP Intro Timeline
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.from(".hero-text-reveal", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        skewY: 2
      })
      .from(".hero-btn", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1
      }, "-=0.8")
      .from(".hero-badge", {
        opacity: 0,
        y: 10,
        duration: 0.8,
        stagger: 0.1
      }, "-=0.6")

      // Phone Entrance
      gsap.from(phoneRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.5,
        rotateX: 20,
        scale: 0.9,
        ease: "power2.out"
      })

      // Mouse Parallax Effect
      const handleMouseMove = (e: MouseEvent) => {
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

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const scrollToFeatures = () => {
    const features = document.getElementById("features")
    features?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section ref={containerRef} className="relative min-h-[110vh] flex flex-col items-center pt-32 pb-20 px-4 overflow-hidden perspective-1000">
      
      {/* Content Container */}
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Text Side */}
        <div className="text-center lg:text-left space-y-8">
          <div className="overflow-hidden">
            <h1 className="hero-text-reveal text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                Track Spending.
              </span>
              <span className="block">Stay on Budget.</span>
              <span className="block text-zinc-400">Feel in Control.</span>
            </h1>
          </div>
          
          <div className="overflow-hidden">
            <p className="hero-text-reveal text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              A MYR-first expense tracker with tailored budgets and a friendly coach. 
              Built for real life in Malaysia.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link 
              href="/login" 
              className="hero-btn group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg transition-transform hover:scale-105 active:scale-95"
            >
              Start Tracking Free
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 rounded-full bg-white blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
            </Link>
            
            <button 
              onClick={scrollToFeatures}
              className="hero-btn px-8 py-4 text-zinc-400 hover:text-white transition-colors font-medium border border-transparent hover:border-white/10 rounded-full"
            >
              See how it works
            </button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4 text-xs font-medium text-zinc-500 uppercase tracking-widest">
            <div className="hero-badge flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Private by Design
            </div>
            <div className="hero-badge flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Offline-Friendly
            </div>
            <div className="hero-badge flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-500" />
              Installable PWA
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
