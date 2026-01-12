'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode, useEffect, useRef } from 'react'
import gsap from 'gsap'

interface MotionProps extends HTMLMotionProps<"div"> {
  children: ReactNode
}

// ============================================
// Framer Motion Components (preserved)
// ============================================

export function TapMotion({ children, className, ...props }: MotionProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function FadeInStagger({ children, className, ...props }: MotionProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function FadeInItem({ children, className, ...props }: MotionProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={item}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function PageTransition({ children, className, ...props }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// GSAP Enhanced Components
// ============================================

interface ProgressRingProps {
  percent: number
  size?: number
  strokeWidth?: number
  className?: string
  trackColor?: string
  progressColor?: string
  showLabel?: boolean
  labelSuffix?: string
}

export function ProgressRing({
  percent,
  size = 100,
  strokeWidth = 8,
  className = '',
  trackColor = 'hsl(var(--muted))',
  progressColor = 'hsl(var(--primary))',
  showLabel = true,
  labelSuffix = '%',
}: ProgressRingProps) {
  const circleRef = useRef<SVGCircleElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  
  useEffect(() => {
    const offset = circumference - (Math.min(percent, 100) / 100) * circumference
    
    if (circleRef.current) {
      gsap.to(circleRef.current, {
        strokeDashoffset: offset,
        duration: 0.8,
        ease: 'power2.out',
      })
    }
    
    if (labelRef.current && showLabel) {
      gsap.to(labelRef.current, {
        innerText: Math.round(percent),
        duration: 0.6,
        ease: 'power2.out',
        snap: { innerText: 1 },
        onUpdate: function() {
          if (labelRef.current) {
            labelRef.current.textContent = Math.round(parseFloat(labelRef.current.textContent || '0')) + labelSuffix
          }
        }
      })
    }
  }, [percent, circumference, showLabel, labelSuffix])

  // Over budget styling
  const isOver = percent > 100
  const actualProgressColor = isOver ? 'hsl(var(--destructive))' : progressColor

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="progress-ring">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          className="opacity-30"
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={actualProgressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          className="progress-ring-circle"
        />
      </svg>
      {showLabel && (
        <span 
          ref={labelRef}
          className={`absolute text-sm font-semibold ${isOver ? 'text-destructive' : ''}`}
        >
          0{labelSuffix}
        </span>
      )}
    </div>
  )
}

// ============================================
// Confetti Component
// ============================================
interface ConfettiProps {
  active: boolean
  onComplete?: () => void
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!active || !containerRef.current) return
    
    const colors = ['#34d399', '#06b6d4', '#f59e0b', '#a78bfa', '#f472b6']
    const container = containerRef.current
    const particles: HTMLDivElement[] = []
    
    // Create particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div')
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        left: 50%;
        top: 50%;
        pointer-events: none;
      `
      container.appendChild(particle)
      particles.push(particle)
    }
    
    // Animate
    gsap.to(particles, {
      x: () => (Math.random() - 0.5) * 300,
      y: () => (Math.random() - 0.5) * 300,
      rotation: () => Math.random() * 720,
      opacity: 0,
      scale: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.02,
      onComplete: () => {
        particles.forEach(p => p.remove())
        onComplete?.()
      }
    })
    
    return () => {
      particles.forEach(p => p.remove())
    }
  }, [active, onComplete])

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden="true"
    />
  )
}

// ============================================
// Overspend Shake Animation
// ============================================
interface ShakeWrapperProps {
  children: ReactNode
  shake: boolean
  className?: string
}

export function ShakeWrapper({ children, shake, className = '' }: ShakeWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (shake && ref.current) {
      gsap.timeline()
        .to(ref.current, { x: -4, duration: 0.06 })
        .to(ref.current, { x: 4, duration: 0.06 })
        .to(ref.current, { x: -3, duration: 0.05 })
        .to(ref.current, { x: 3, duration: 0.05 })
        .to(ref.current, { x: 0, duration: 0.04 })
    }
  }, [shake])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

// Re-export hooks
export { useMotionPrefs, usePageTransition, useCountUp } from '@/hooks/use-animation'
