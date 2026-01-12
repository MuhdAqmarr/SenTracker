'use client'

import { useMotionPrefs } from '@/hooks/use-animation'

export function LiquidGradient() {
  const { shouldAnimate } = useMotionPrefs()
  
  if (!shouldAnimate) {
    // Static gradient fallback for reduced motion
    return (
      <div className="fixed inset-0 -z-10 bg-background">
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 30%, hsl(160 84% 39% / 0.08) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 70%, hsl(192 91% 36% / 0.06) 0%, transparent 50%)
            `,
          }}
        />
      </div>
    )
  }
  
  return (
    <div className="liquid-bg" aria-hidden="true">
      {/* Gradient layers are defined in globals.css for GPU acceleration */}
    </div>
  )
}
