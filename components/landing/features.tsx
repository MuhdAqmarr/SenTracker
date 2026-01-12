"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Wallet, PieChart, TrendingUp, Download, ScanLine, MessageCircle } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: <Wallet className="w-6 h-6 text-emerald-400" />,
    title: "Precision Tracking",
    desc: "Track every cent efficiently. Support for RM decimals and custom categories tailored for Malaysian lifestyles.",
    stats: "RM 1,240.50"
  },
  {
    icon: <PieChart className="w-6 h-6 text-cyan-400" />,
    title: "Smart Budgets",
    desc: "Set monthly limits for Food, Transport, and more. We'll warn you when you're burning through cash too fast.",
    stats: "82% Used"
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-violet-400" />,
    title: "Monthly Insights",
    desc: "Visualize your spending patterns. Spot anomalies and find out exactly where your money is going.",
    stats: "+12% vs last mo"
  },
  {
    icon: <Download className="w-6 h-6 text-amber-400" />,
    title: "Data Control",
    desc: "Your data is yours. Export everything to CSV whenever you want. No lock-in, ever.",
    stats: "CSV Ready"
  }
]

export function LandingFeatures() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".feature-card")
      
      cards.forEach((card: any, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power2.out"
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="features" ref={containerRef} className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Everything you need.</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Powerful features wrapped in a simple, beautiful interface designed for daily use.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="feature-card group p-6 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-colors backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                {feature.desc}
              </p>
              <div className="inline-block px-3 py-1 rounded-full bg-zinc-800/80 text-xs font-medium text-zinc-300 border border-white/5">
                {feature.stats}
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Teaser */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-zinc-900/60 to-zinc-900/40 border border-white/5 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 feature-card">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
              <ScanLine className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Coming Soon: AI Receipt Scan</h3>
              <p className="text-sm text-zinc-400">Snap a photo of your receipt and let AI handle the data entry.</p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-full bg-white/5 text-xs text-white/60 font-medium">
            Join waitlist
          </div>
        </div>
      </div>
    </section>
  )
}
