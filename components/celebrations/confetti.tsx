'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface ConfettiProps {
  trigger: boolean
  onComplete?: () => void
}

export function ConfettiCelebration({ trigger, onComplete }: ConfettiProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasTriggered = useRef(false)
  
  useEffect(() => {
    if (!trigger || !containerRef.current || hasTriggered.current) return
    
    hasTriggered.current = true
    
    const colors = [
      '#34d399', // Emerald
      '#06b6d4', // Cyan
      '#f59e0b', // Amber
      '#a78bfa', // Purple
      '#f472b6', // Pink
      '#22c55e', // Green
    ]
    
    const container = containerRef.current
    const particles: HTMLDivElement[] = []
    
    // Create more particles for a fuller effect
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div')
      const size = Math.random() * 10 + 4
      const shape = Math.random() > 0.5 ? '50%' : '2px'
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${shape};
        left: 50%;
        top: 50%;
        pointer-events: none;
        z-index: 9999;
      `
      container.appendChild(particle)
      particles.push(particle)
    }
    
    // Animate particles
    particles.forEach((particle, i) => {
      const angle = (Math.PI * 2 / 50) * i
      const velocity = Math.random() * 200 + 150
      const xVel = Math.cos(angle) * velocity
      const yVel = Math.sin(angle) * velocity - 100 // Upward bias
      
      gsap.to(particle, {
        x: xVel,
        y: yVel + 300, // Fall down after going up
        rotation: Math.random() * 720,
        opacity: 0,
        scale: 0,
        duration: 1.5,
        ease: 'power3.out',
        delay: Math.random() * 0.1,
        onComplete: () => {
          particle.remove()
          if (i === particles.length - 1) {
            onComplete?.()
            // Reset trigger after animation
            setTimeout(() => {
              hasTriggered.current = false
            }, 100)
          }
        }
      })
    })
  }, [trigger, onComplete])

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-[9999]"
      aria-hidden="true"
    />
  )
}
