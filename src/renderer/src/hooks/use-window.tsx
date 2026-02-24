/* eslint-disable react-refresh/only-export-components */
import { selectFile } from '@/lib/api'
import { createContext, useContext, useEffect, useState } from 'react'

interface WindowState {
  currentView: 'thumbnails' | 'annotations' | 'bookmarks'
  setCurrentView: (view: 'thumbnails' | 'annotations' | 'bookmarks') => void
}

const windowContext = createContext<WindowState | undefined>(undefined)

const useWindow = (): WindowState => {
  const [currentView, setCurrentView] = useState<'thumbnails' | 'annotations' | 'bookmarks'>(
    'thumbnails'
  )

  useEffect(() => {
    if (window) {
      window.addEventListener('keydown', (e) => {
        switch (true) {
          case e.ctrlKey && e.key === 'o':
            selectFile()
            break
          case e.ctrlKey && e.key === 't':
            setCurrentView('thumbnails')
            break
          case e.ctrlKey && e.key === 'a':
            setCurrentView('annotations')
            break
          case e.ctrlKey && e.key === 'b':
            setCurrentView('bookmarks')
            break
          default:
            break
        }
      })
    }

    return () => {
      if (window) {
        window.removeEventListener('keydown', () => {})
      }
    }
  }, [])
  return {
    currentView,
    setCurrentView
  }
}

export const WindowProvider = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const state = useWindow()
  return <windowContext.Provider value={state}>{children}</windowContext.Provider>
}

export const useWindowStore = (): WindowState => {
  const context = useContext(windowContext)
  if (!context) throw new Error('useWindowStore must be used within a WindowProvider')
  return context
}
