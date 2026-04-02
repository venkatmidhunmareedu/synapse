import { ElectronAPI } from '@electron-toolkit/preload'
import { UIMessage } from 'ai'

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

      // Chat bot Handlers
      startChat: (streamId: string, messages: UIMessage[]) => void
      onStreamEvent: (
        callback: (
          streamId: string,
          payload: {
            type: 'chunk' | 'end' | 'error'
            data: UIMessage
          }
        ) => void
      ) => void
      removeStreamListener: (
        listener: (
          event: Electron.IpcRendererEvent,
          streamId: string,
          payload: {
            type: 'chunk' | 'end' | 'error'
            data: UIMessage
          }
        ) => void
      ) => void
      removeStreamListener: (
        listener: (
          event: Electron.IpcRendererEvent,
          streamId: string,
          payload: {
            type: 'chunk' | 'end' | 'error'
            data: UIMessage
          }
        ) => void
      ) => void
    }
  }
}
