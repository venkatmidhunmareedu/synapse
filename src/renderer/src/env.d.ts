/// <reference types="vite/client" />

declare module '*?url' {
  const src: string
  export default src
}

declare namespace Window {
  interface Window {
    api: {
      min: () => Promise<void>
      max: () => Promise<void>
      restore: () => Promise<void>
      close: () => Promise<void>
      selectFile: () => Promise<string | null>
      onWindowStateChanged: (callback: (state: string) => void) => void
    }
  }
}
