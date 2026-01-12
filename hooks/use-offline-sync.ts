'use client'

import { useEffect, useState, useCallback } from 'react'
import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface QueuedOperation {
  id: string
  type: 'expense_create' | 'expense_update' | 'expense_delete'
  data: any
  timestamp: number
}

interface OfflineDB extends DBSchema {
  operations: {
    key: string
    value: QueuedOperation
  }
}

const DB_NAME = 'sentracker-offline'
const DB_VERSION = 1

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const { toast } = useToast()

  // Initialize database
  const getDB = useCallback(async (): Promise<IDBPDatabase<OfflineDB>> => {
    return openDB<OfflineDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('operations')) {
          db.createObjectStore('operations', { keyPath: 'id' })
        }
      },
    })
  }, [])

  // Add operation to queue
  const queueOperation = useCallback(async (
    type: QueuedOperation['type'],
    data: any
  ): Promise<string> => {
    const db = await getDB()
    const operation: QueuedOperation = {
      id: crypto.randomUUID(),
      type,
      data,
      timestamp: Date.now(),
    }
    
    await db.add('operations', operation)
    setPendingCount(prev => prev + 1)
    
    return operation.id
  }, [getDB])

  // Sync queue with server
  const syncQueue = useCallback(async () => {
    if (!isOnline || isSyncing) return
    
    setIsSyncing(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setIsSyncing(false)
      return
    }

    try {
      const db = await getDB()
      const operations = await db.getAll('operations')
      
      if (operations.length === 0) {
        setIsSyncing(false)
        return
      }

      // Sort by timestamp
      operations.sort((a, b) => a.timestamp - b.timestamp)

      let successCount = 0
      for (const op of operations) {
        try {
          if (op.type === 'expense_create') {
            await supabase.from('expenses').insert({
              user_id: user.id,
              ...op.data,
            })
          } else if (op.type === 'expense_update') {
            await supabase
              .from('expenses')
              .update(op.data.updates)
              .eq('id', op.data.id)
              .eq('user_id', user.id)
          } else if (op.type === 'expense_delete') {
            await supabase
              .from('expenses')
              .delete()
              .eq('id', op.data.id)
              .eq('user_id', user.id)
          }
          
          // Remove from queue after success
          await db.delete('operations', op.id)
          successCount++
          setPendingCount(prev => Math.max(0, prev - 1))
        } catch (error) {
          console.error('Sync failed for operation:', op.id, error)
        }
      }

      if (successCount > 0) {
        toast({
          title: 'Synced!',
          description: `${successCount} ${successCount === 1 ? 'change' : 'changes'} synced successfully`,
        })
      }
    } catch (error) {
      console.error('Sync error:', error)
    } finally {
      setIsSyncing(false)
    }
  }, [isOnline, isSyncing, getDB, toast])

  // Update pending count
  const updatePendingCount = useCallback(async () => {
    const db = await getDB()
    const count = await db.count('operations')
    setPendingCount(count)
  }, [getDB])

  // Online/offline listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: 'You\'re offline',
        description: 'Changes will sync when you\'re back online',
        variant: 'default',
      })
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setIsOnline(navigator.onLine)
    
    // Initial count
    updatePendingCount()
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [toast, updatePendingCount])

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      syncQueue()
    }
  }, [isOnline, pendingCount, syncQueue])

  return {
    isOnline,
    pendingCount,
    isSyncing,
    queueOperation,
    syncQueue,
  }
}
