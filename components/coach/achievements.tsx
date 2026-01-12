'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Flame } from 'lucide-react'
import { ConfettiCelebration } from '@/components/celebrations/confetti'

interface Achievement {
  id: string
  title: string
  icon: string
}

interface AchievementsProps {
  streak: number
  achievements: Achievement[]
}

export function Achievements({ streak, achievements }: AchievementsProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [prevAchievementCount, setPrevAchievementCount] = useState(0)

  // Trigger confetti when new achievements are unlocked
  useEffect(() => {
    const totalCount = achievements.length + (streak >= 3 ? 1 : 0)
    if (totalCount > prevAchievementCount && prevAchievementCount > 0) {
      setShowConfetti(true)
    }
    setPrevAchievementCount(totalCount)
  }, [achievements.length, streak, prevAchievementCount])

  return (
    <>
      <ConfettiCelebration 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-foreground">Achievements</h3>
        </div>

        {/* Streak Display */}
        {streak > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-4 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-orange-500/30 flex items-center justify-center">
                <Flame className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{streak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Achievement Badges */}
        {achievements.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement, index) => {
              // Parse title for "Label: Value" format
              const [label, value] = achievement.title.includes(':') 
                ? achievement.title.split(':').map(s => s.trim())
                : [null, achievement.title]

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
                >
                  <span className="text-xl flex-shrink-0">{achievement.icon}</span>
                  <div className="flex flex-col min-w-0">
                    {label && (
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium leading-none mb-1">
                        {label}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-foreground leading-tight">
                      {value}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Keep tracking to unlock achievements! 🏆
          </p>
        )}
      </div>
    </>
  )
}
