'use client'

import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'

interface FABProps {
  onClick: () => void
}

export function FAB({ onClick }: FABProps) {
  return (
    <motion.div
      className="fixed right-4 z-40 lg:bottom-6"
      style={{
        // Position above bottom nav (h-16 = 4rem) + bottom-6 (1.5rem) + FAB spacing (1.5rem) + safe area
        bottom: 'calc(4rem + 1.5rem + 1.5rem + env(safe-area-inset-bottom, 0px))',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {/* Pulse effect ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-emerald-500 opacity-30"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={onClick}
        className="relative flex items-center justify-center h-14 w-14 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
      >
        <Plus className="h-8 w-8" />
      </motion.button>
    </motion.div>
  )
}

