'use client'

import { useOfflineSync } from '@/hooks/use-offline-sync'
import { Cloud, CloudOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

export function SyncStatusIndicator() {
  const { isOnline, pendingCount, isSyncing, syncQueue } = useOfflineSync()

  if (isOnline && pendingCount === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-20 right-4 z-40 lg:bottom-4"
      >
        <div className="glass-card px-4 py-2 flex items-center gap-3 shadow-lg">
          {isSyncing ? (
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
          ) : isOnline ? (
            <Cloud className="h-4 w-4 text-primary" />
          ) : (
            <CloudOff className="h-4 w-4 text-muted-foreground" />
          )}
          
          <div className="text-sm">
            {isSyncing ? (
              <span className="text-foreground">Syncing...</span>
            ) : isOnline ? (
              <span className="text-foreground">
                {pendingCount} pending {pendingCount === 1 ? 'change' : 'changes'}
              </span>
            ) : (
              <span className="text-muted-foreground">Offline mode</span>
            )}
          </div>

          {isOnline && pendingCount > 0 && !isSyncing && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => syncQueue()}
              className="h-6 px-2 text-xs"
            >
              Sync now
            </Button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
