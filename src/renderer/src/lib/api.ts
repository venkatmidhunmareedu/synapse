export const minimize = (): Promise<void> => {
  return window.api.min()
}

export const maximise = (): Promise<void> => {
  return window.api.max()
}

export const restore = (): Promise<void> => {
  return window.api.restore()
}

export const close = (): Promise<void> => {
  return window.api.close()
}

export const selectFile = (): Promise<string | null> => {
  return window.api.selectFile()
}

export const readPDFFile = async (filePath: string): Promise<Uint8Array> => {
  const base64 = await window.api.readPDFFile(filePath)

  // ✅ Fix padding before decoding (atob is strict about = padding)
  const padded = base64.replace(/[^A-Za-z0-9+/]/g, '') // strip any whitespace/newlines
  const binaryString = atob(padded)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}
