import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      // Window Handlers
      min: () => Promise<void>
      max: () => Promise<void>
      restore: () => Promise<void>
      close: () => Promise<void>
      selectFile: () => Promise<string | null>
      readPDFFile: (filePath: string) => Promise<string>
      onWindowStateChanged: (callback: (state: string) => void) => void
    }
  }
}
