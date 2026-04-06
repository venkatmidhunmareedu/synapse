import { is } from '@electron-toolkit/utils'
import dayjs from 'dayjs'
import { app } from 'electron'
import path from 'path'
import fs from 'node:fs'

/**
 * Log level enum.
 */
type LogLevel = 'INFO' | 'ERROR' | 'WARN' | 'DEBUG' | 'TRACE'

/**
 * Logger class for logging messages to the console and a file.
 */
class Logger {
  private readonly isProduction: boolean
  private readonly logFile: string
  private readonly timestampFormat = 'YYYY-MM-DD HH:mm:ss'
  /**
   * Constructor for the Logger class.
   */
  constructor() {
    this.isProduction = !is.dev
    this.logFile = this.isProduction
      ? path.join(app.getPath('userData'), 'app.log')
      : path.join('./logs', 'app.log')
    fs.mkdirSync(path.dirname(this.logFile), { recursive: true })
  }
  /**
   * Logs a message to the console and a file.
   * @param level - The level of the message.
   * @param message - The message to log.
   */
  private log(level: LogLevel, message: string): void {
    const timestamp = dayjs().format(this.timestampFormat)
    const logMessage = `${timestamp} [${level}] ${message}`
    switch (level) {
      case 'INFO':
        console.info(logMessage)
        break
      case 'ERROR':
        console.error(logMessage)
        break
      case 'WARN':
        console.warn(logMessage)
        break
      case 'DEBUG':
        console.debug(logMessage)
        break
      case 'TRACE':
        console.trace(logMessage)
        break
      default:
        console.log(logMessage)
        break
    }
    fs.appendFileSync(this.logFile, logMessage + '\n')
  }
  /**
   * Logs an info message to the console and a file.
   * @param message - The message to log.
   */
  public info(message: string): void {
    this.log('INFO', message)
  }
  /**
   * Logs an error message to the console and a file.
   * @param message - The message to log.
   */
  public error(message: string): void {
    if (this.isProduction) {
      this.log('ERROR', message)
    }
  }
  /**
   * Logs a warning message to the console and a file.
   * @param message - The message to log.
   */
  public warn(message: string): void {
    if (this.isProduction) {
      this.log('WARN', message)
    }
  }
  /**
   * Logs a debug message to the console and a file.
   * @param message - The message to log.
   */
  public debug(message: string): void {
    if (this.isProduction) {
      this.log('DEBUG', message)
    }
  }
  /**
   * Logs a trace message to the console and a file.
   * @param message - The message to log.
   */
  public trace(message: string): void {
    if (this.isProduction) {
      this.log('TRACE', message)
    }
  }

  /**
   * Clears the log file.
   */
  public clearLogFile(): void {
    fs.writeFileSync(this.logFile, '')
  }
}

export default new Logger()
