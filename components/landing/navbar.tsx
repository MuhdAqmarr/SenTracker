"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        scrolled ? "bg-black/50 backdrop-blur-xl border-white/5 py-4" : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden">
            <Image
              src="/icon.png"
              alt="SenTracker"
              width={32}
              height={32}
              className="object-contain rounded-xl"
              priority
            />
          </div>
          <span className="font-bold text-lg tracking-tight text-white hidden sm:block">
            SenTracker
          </span>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
          <Link href="#privacy" className="hover:text-white transition-colors">Privacy</Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-sm font-medium text-white hover:text-emerald-400 transition-colors hidden sm:block"
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold tracking-wide hover:scale-105 transition-transform"
          >
            Get Started
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </header>
  )
}
