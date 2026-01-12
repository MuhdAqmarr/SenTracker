"use client"

import { useEffect, useRef } from "react"

export function LandingBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const scrollY = window.scrollY
      const orbs = containerRef.current.querySelectorAll('.aurora-orb')
      
      orbs.forEach((orb, i) => {
        const speed = 0.2 + (i * 0.05)
        const element = orb as HTMLElement
        element.style.transform = `translateY(${scrollY * speed}px)`
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 -z-50 overflow-hidden bg-[#030304] pointer-events-none">
      
      {/* Cinematic Noise Overlay - High opacity for film grain look */}
      <div 
        className="absolute inset-0 z-50 opacity-[0.07] mix-blend-overlay"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }}
      />

      {/* Grid Lines - Barely visible, technical feel */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" 
      />

      {/* Deep Atmospheric Aurora Effects */}
      
      {/* Primary Emerald Glow - Top Left */}
      <div className="aurora-orb absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-emerald-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10000ms]" />
      
      {/* Secondary Cyan Glow - Top Right */}
      <div className="aurora-orb absolute top-[-10%] right-[-20%] w-[80vw] h-[80vw] bg-cyan-900/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
      
      {/* Deep Violet - Bottom Center */}
      <div className="aurora-orb absolute bottom-[-40%] left-[20%] w-[60vw] h-[60vw] bg-indigo-900/20 rounded-full blur-[150px] mix-blend-screen animate-blob animation-delay-4000" />

      {/* Accent Beam */}
      <div className="aurora-orb absolute top-[20%] left-[50%] -translate-x-1/2 w-[40vw] h-[40vw] bg-teal-900/10 rounded-full blur-[100px] mix-blend-overlay" />

    </div>
  )
}
