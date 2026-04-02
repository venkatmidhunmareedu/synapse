/* eslint-disable react-refresh/only-export-components */
import { selectFile } from '@/lib/api'
import { createContext, useContext, useEffect, useState } from 'react'

interface WindowState {
  currentView: 'thumbnails' | 'annotations' | 'bookmarks'
  setCurrentView: (view: 'thumbnails' | 'annotations' | 'bookmarks') => void
  filePath: string | null
  openFileDialog: () => void
  closeFile: () => void
}

const windowContext = createContext<WindowState | undefined>(undefined)

const useWindow = (): WindowState => {
  const [currentView, setCurrentView] = useState<'thumbnails' | 'annotations' | 'bookmarks'>(
    'thumbnails'
  )
  const [filePath, setFilePath] = useState<string | null>(null)

  // open file dialog
  const openFileDialog = (): void => {
    selectFile().then((path) => {
      if (path) {
        console.log('📁 File selected:', path)
        setFilePath(path)
      }
    })
  }

  const closeFile = (): void => {
    setFilePath(null)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      switch (true) {
        case e.ctrlKey && e.key === 'o':
          e.preventDefault()
          openFileDialog()
          break
        case e.ctrlKey && e.key === 't':
          e.preventDefault()
          setCurrentView('thumbnails')
          break
        case e.ctrlKey && e.key === 'a':
          e.preventDefault()
          setCurrentView('annotations')
          break
        case e.ctrlKey && e.key === 'b':
          e.preventDefault()
          setCurrentView('bookmarks')
          break
        default:
          break
      }
    }

    if (window) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      if (window) {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [])

  // Track filePath changes for debugging
  useEffect(() => {
    console.log('🔄 useWindow: filePath changed to:', filePath)
  }, [filePath])

  return {
    currentView,
    setCurrentView,
    filePath,
    openFileDialog,
    closeFile
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
