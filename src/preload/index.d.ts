import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      min: () => Promise<void>
      max: () => Promise<void>
      close: () => Promise<void>
      selectFile: () => Promise<string | null>
    }
  }
}
