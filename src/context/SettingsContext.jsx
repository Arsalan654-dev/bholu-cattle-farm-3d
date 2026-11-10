import { createContext, useContext, useMemo } from 'react'
import { getPrefs, supportsWebGL, QUALITY } from '../lib/motion.js'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const value = useMemo(() => {
    const prefs = getPrefs()
    return {
      reduced: prefs.reduced,
      touch: prefs.touch,
      quality: QUALITY[prefs.quality],
      tier: prefs.quality,
      webgl: supportsWebGL(),
    }
  }, [])
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider')
  return ctx
}
