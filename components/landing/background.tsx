"use client"

import { useEffect, useRef } from "react"

export function LandingBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#0a0a0f] pointer-events-none">
      {/* Noise Texture Overlay for "Tactile" Feel */}
      <div 
        className="absolute inset-0 z-50 opacity-[0.03] mix-blend-overlay"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }}
      />

      {/* Floating Orbs - CSS Animated for GPU Efficiency */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-500/20 rounded-full blur-[100px] animate-blob mix-blend-screen" />
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen" />
      <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-violet-500/10 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-screen" />
      
      {/* Central Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-blue-900/10 rounded-full blur-[130px]" />
    </div>
  )
}
