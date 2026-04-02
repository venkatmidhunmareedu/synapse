import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { readFileSync } from 'fs'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Sending window state to renderer
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window:state-changed', 'MAXIMIZED')
  })
  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window:state-changed', 'UNMAXIMIZED')
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Handlers
  ipcMain.handle('window:min', () => {
    const window = BrowserWindow.getFocusedWindow()
    if (window) {
      window.minimize()
    }
  })
  ipcMain.handle('window:max', () => {
    const window = BrowserWindow.getFocusedWindow()
    if (window) {
      window.maximize()
    }
  })
  ipcMain.handle('window:restore', () => {
    const window = BrowserWindow.getFocusedWindow()
    if (window) {
      if (window.isMaximized()) {
        window.unmaximize()
      } else {
        window.maximize()
      }
    }
  })
  ipcMain.handle('window:close', () => {
    const window = BrowserWindow.getFocusedWindow()
    if (window) {
      window.close()
    }
  })
  ipcMain.handle('dialog:select-file', (): string | null => {
    const window = BrowserWindow.getFocusedWindow()
    if (window) {
      const result = dialog.showOpenDialogSync(window, {
        filters: [
          {
            name: 'PDF Files',
            extensions: ['pdf']
          }
        ]
      })
      if (result) {
        console.log('File opened : ', result[0])
        return result[0]
      }
    }
    return null
  })
  ipcMain.handle('pdf:read-file', (_event, filePath: string): string => {
    console.log('🔧 Main process: pdf:read-file called with path:', filePath)
    try {
      const fileData = readFileSync(filePath)
      console.log('🔧 Main process: File read successfully, size:', fileData.length, 'bytes')
      return fileData.toString('base64') // ✅ base64 is IPC-safe
    } catch (error) {
      console.error('🔧 Main process: Error reading PDF file:', error)
      throw error
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
