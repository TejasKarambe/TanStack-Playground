import React, { useState } from 'react'
import { SlidersHorizontal, Moon, Sun, Laptop, Save, RotateCcw } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function SettingsView() {
  const { theme, setTheme } = useTheme()

  const [fontSize, setFontSize] = useState(14)
  const [tabSize, setTabSize] = useState(2)
  const [keybinding, setKeybinding] = useState('vscode')
  const [autoRun, setAutoRun] = useState(true)

  const handleSave = () => {
    toast.success('Preferences saved successfully!')
  }

  const handleReset = () => {
    setTheme('dark')
    setFontSize(14)
    setTabSize(2)
    setKeybinding('vscode')
    setAutoRun(true)
    toast.info('Preferences reset to defaults.')
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in-50 duration-300">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <SlidersHorizontal className="h-6 w-6 text-primary" />
          Settings & Preferences
        </h1>
        <p className="text-sm text-muted-foreground">
          Customize your developer environment, code editor experience, and theme appearance.
        </p>
      </div>

      {/* Theme Appearance Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Appearance Theme</CardTitle>
          <CardDescription className="text-xs">
            Choose how TanStack Playground looks on your screen. Defaults to dark mode.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            <button
              onClick={() => setTheme('dark')}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'border-primary bg-primary/10 text-foreground shadow-2xs'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <Moon className="h-5 w-5" />
              <span>Dark (Default)</span>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                theme === 'light'
                  ? 'border-primary bg-primary/10 text-foreground shadow-2xs'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <Sun className="h-5 w-5" />
              <span>Light</span>
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                theme === 'system'
                  ? 'border-primary bg-primary/10 text-foreground shadow-2xs'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <Laptop className="h-5 w-5" />
              <span>System</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Editor Preferences Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Editor Configuration</CardTitle>
          <CardDescription className="text-xs">
            Configure Monaco Editor options, font sizes, and execution behavior.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Font size */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
            <div>
              <h4 className="text-xs font-semibold text-foreground">Font Size</h4>
              <p className="text-[11px] text-muted-foreground">Editor text size in pixels</p>
            </div>
            <div className="flex items-center gap-1.5">
              {[12, 14, 16, 18].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                    fontSize === size
                      ? 'bg-primary text-primary-foreground font-bold'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>

          {/* Tab size */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
            <div>
              <h4 className="text-xs font-semibold text-foreground">Tab Indentation</h4>
              <p className="text-[11px] text-muted-foreground">Number of spaces per tab stop</p>
            </div>
            <div className="flex items-center gap-1.5">
              {[2, 4].map((size) => (
                <button
                  key={size}
                  onClick={() => setTabSize(size)}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                    tabSize === size
                      ? 'bg-primary text-primary-foreground font-bold'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {size} spaces
                </button>
              ))}
            </div>
          </div>

          {/* Keybindings */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
            <div>
              <h4 className="text-xs font-semibold text-foreground">Keybindings</h4>
              <p className="text-[11px] text-muted-foreground">Keyboard shortcut schema for Monaco editor</p>
            </div>
            <div className="flex items-center gap-1.5">
              {['standard', 'vscode', 'vim'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setKeybinding(mode)}
                  className={`px-3 py-1 rounded-md text-xs uppercase font-mono transition-colors cursor-pointer ${
                    keybinding === mode
                      ? 'bg-primary text-primary-foreground font-bold'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-run */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-semibold text-foreground">Live Auto-Execution</h4>
              <p className="text-[11px] text-muted-foreground">Re-bundle sandbox automatically on code changes</p>
            </div>
            <button
              onClick={() => setAutoRun(!autoRun)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                autoRun ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                  autoRun ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5 text-xs">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Defaults
        </Button>
        <Button size="sm" onClick={handleSave} className="gap-1.5 text-xs">
          <Save className="h-3.5 w-3.5" />
          Save Preferences
        </Button>
      </div>
    </div>
  )
}

