'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon, Zap, Monitor } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export function SettingsForm() {
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark')
  const [lowMotion, setLowMotion] = useState(false)

  useEffect(() => {
    // Load preferences
    const storedTheme = localStorage.getItem('sen-theme') as 'dark' | 'light' | 'system' | null
    const storedMotion = localStorage.getItem('sen-low-motion')
    
    if (storedTheme) setTheme(storedTheme)
    if (storedMotion === 'true') setLowMotion(true)
  }, [])

  const handleThemeChange = (newTheme: 'dark' | 'light' | 'system') => {
    setTheme(newTheme)
    localStorage.setItem('sen-theme', newTheme)
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    } else {
      // System preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', isDark)
      document.documentElement.classList.toggle('light', !isDark)
    }
  }

  const handleLowMotionChange = (enabled: boolean) => {
    setLowMotion(enabled)
    localStorage.setItem('sen-low-motion', String(enabled))
    document.documentElement.classList.toggle('low-motion', enabled)
  }

  return (
    <div className="glass-card p-5">
      <h2 className="font-semibold text-foreground mb-4">Preferences</h2>
      
      <div className="space-y-6">
        {/* Theme */}
        <div>
          <Label className="text-sm text-foreground mb-3 block">Theme</Label>
          <div className="flex gap-2">
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-colors ${
                theme === 'dark' 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-border text-muted-foreground hover:border-muted-foreground'
              }`}
            >
              <Moon className="h-4 w-4" />
              <span className="text-sm font-medium">Dark</span>
            </button>
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-colors ${
                theme === 'light' 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-border text-muted-foreground hover:border-muted-foreground'
              }`}
            >
              <Sun className="h-4 w-4" />
              <span className="text-sm font-medium">Light</span>
            </button>
            <button
              onClick={() => handleThemeChange('system')}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-colors ${
                theme === 'system' 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-border text-muted-foreground hover:border-muted-foreground'
              }`}
            >
              <Monitor className="h-4 w-4" />
              <span className="text-sm font-medium">Auto</span>
            </button>
          </div>
        </div>

        {/* Low Motion Mode */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="low-motion" className="text-sm text-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Low Motion Mode
            </Label>
            <p className="text-xs text-muted-foreground">
              Reduces animations for better battery life
            </p>
          </div>
          <Switch
            id="low-motion"
            checked={lowMotion}
            onCheckedChange={handleLowMotionChange}
          />
        </div>
      </div>
    </div>
  )
}
