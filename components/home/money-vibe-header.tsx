'use client'

import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const vibes = [
  "What's your money vibe today? 💫",
  "Let's check in on your wallet! 💰",
  "Ready to crush your goals? 🎯",
  "You're doing amazing! ✨",
  "Time for a quick money check 📊",
]

export function MoneyVibeHeader() {
  // Get consistent vibe based on day
  const today = new Date().getDay()
  const vibe = vibes[today % vibes.length]

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 mb-6"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          repeatDelay: 3,
          ease: "easeInOut"
        }}
      >
        <Sparkles className="h-5 w-5 text-primary" />
      </motion.div>
      <h1 className="text-lg md:text-xl font-semibold text-foreground">
        {vibe}
      </h1>
    </motion.div>
  )
}
