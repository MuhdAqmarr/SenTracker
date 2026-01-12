import { LandingBackground } from "@/components/landing/background"
import { LandingNavbar } from "@/components/landing/navbar"
import { LandingHero } from "@/components/landing/hero"
import { LandingFeatures } from "@/components/landing/features"
import { LandingCoach } from "@/components/landing/coach-teaser"
import { LandingTrust } from "@/components/landing/trust"
import { LandingFooter } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen text-white selection:bg-emerald-500/30 selection:text-emerald-200">
      <LandingNavbar />
      <LandingBackground />
      
      <div className="relative z-10 w-full overflow-hidden">
        <LandingHero />
        <LandingFeatures />
        <LandingCoach />
        <LandingTrust />
        <LandingFooter />
      </div>
    </main>
  )
}
