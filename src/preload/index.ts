import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { UIMessage } from 'ai'

// Custom APIs for renderer
const api = {
  // Window Handlers
  min: () => electronAPI.ipcRenderer.invoke('window:min'),
  max: () => electronAPI.ipcRenderer.invoke('window:max'),
  restore: () => electronAPI.ipcRenderer.invoke('window:restore'),
  close: () => electronAPI.ipcRenderer.invoke('window:close'),
  selectFile: () => electronAPI.ipcRenderer.invoke('dialog:select-file'),
  readPDFFile: (filePath: string) => electronAPI.ipcRenderer.invoke('pdf:read-file', filePath),
  onWindowStateChanged: (callback: (state: string) => void) =>
    electronAPI.ipcRenderer.on('window:state-changed', (_event, isMaximized) =>
      callback(isMaximized as string)
    ),
  // Chat bot Handlers
  startChat: (streamId: string, messages: UIMessage[]) =>
    electronAPI.ipcRenderer.send('start-chat', streamId, messages),

  onStreamEvent: (
    callback: (
      streamId: string,
      payload: {
        type: 'chunk' | 'end' | 'error'
        data: UIMessage
      }
    ) => void
  ) => {
    const listener = (
      _event: Electron.IpcRendererEvent,
      streamId: string,
      payload: {
        type: 'chunk' | 'end' | 'error'
        data: UIMessage
      }
    ): void => callback(streamId, payload)
    electronAPI.ipcRenderer.on('stream-event', listener)
    return listener // Return listener so we can remove it later
  },

  removeStreamListener: (
    listener: (
      event: Electron.IpcRendererEvent,
      streamId: string,
      payload: {
        type: 'chunk' | 'end' | 'error'
        data: UIMessage
      }
    ) => void
  ) => {
    ipcRenderer.removeListener('stream-event', listener)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
