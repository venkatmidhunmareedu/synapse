import { BrowserWindow } from 'electron'
import path from 'path'
import logger from './logger'

export function getFileName(filePath: string): string {
  return path.basename(filePath, path.extname(filePath))
}

/** LanceDB table names: alphanumeric, `_`, `-`, and `.` only (no spaces). */
export function generateFileNameWithForbiddenCharacters(fileName: string): string {
  const sanitized = fileName
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w.-]/g, '')
  return sanitized.length > 0 ? sanitized : 'table'
}

export function sendMessageToRenderer(statusTitle: string, message: string): void {
  const mainWindow = BrowserWindow.getFocusedWindow()
  if (mainWindow) {
    logger.info(`Sending message to renderer: ${statusTitle} ${message}`)
    mainWindow.webContents.send(statusTitle, message)
  }
}
