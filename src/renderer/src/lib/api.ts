export const minimize = (): Promise<void> => {
  return window.api.min()
}

export const maximise = (): Promise<void> => {
  return window.api.max()
}

export const close = (): Promise<void> => {
  return window.api.close()
}

export const selectFile = (): Promise<string | null> => {
  return window.api.selectFile()
}
