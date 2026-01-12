"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
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
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center pt-24 lg:pt-32 pb-0 px-4 overflow-hidden perspective-1000">
      
      {/* Content Container */}
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Text Side - Awwwards Style */}
        <div className="text-center lg:text-left space-y-8 relative z-20">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-[10px] uppercase tracking-widest text-emerald-400 font-semibold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            V2.0 is Live
          </div>

          <div className="relative">
            <h1 className="hero-title text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.9] invisible">
              <span className="block opacity-50 relative z-0">JUST TYPE.</span>
              <span className="block text-emerald-400 relative z-10 -mt-2 sm:-mt-4">
                WE TRACK.
              </span>
            </h1>
            {/* Decorative background blur for text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/10 blur-[100px] -z-10 rounded-full" />
          </div>
          
          <p className="hero-subtitle text-lg lg:text-xl text-zinc-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light invisible">
            Forget boring forms. Just say <span className="text-white font-medium">&quot;RM12 Grab to KLCC&quot;</span> and let our engine handle the rest. The first finance app that speaks Malaysian.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start pt-4">
            <Link 
              href="/login" 
              className="hero-btn group relative h-12 lg:h-14 pl-6 lg:pl-8 pr-2 bg-white text-black rounded-full font-bold text-base lg:text-lg flex items-center gap-4 hover:bg-zinc-100 transition-all overflow-hidden"
            >
              <span className="relative z-10">Try Natural Entry</span>
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
            className="relative w-[280px] h-[560px] lg:w-[320px] lg:h-[640px] bg-black rounded-[40px] border-[8px] border-zinc-800 shadow-2xl overflow-hidden ring-1 ring-white/10 transform transition-transform will-change-transform origin-center scale-90 lg:scale-95"
            style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 100px -20px rgba(6, 182, 212, 0.2)" }}
          >
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50" />
            
            {/* Screen Content - App Screenshot */}
            <div className="w-full h-full relative bg-zinc-950 overflow-hidden">
              <Image
                src="/phone-mockup.jpeg"
                alt="SenTracker Mobile App"
                fill
                className="object-cover object-top"
                priority
                quality={90}
                sizes="(max-width: 768px) 280px, 320px"
              />
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
