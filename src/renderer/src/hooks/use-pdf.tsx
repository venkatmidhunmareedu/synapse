/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { pdfjs } from 'react-pdf'
import { useWindowStore } from './use-window'
import { embedPDFFile, readPDFFile } from '../lib/api'

interface PDFState {
  loading: boolean
  scale: number
  setScale: (scale: number) => void
  zoom: number
  setZoom: (zoom: number) => void
  currentPage: number
  totalPages: number
  error: string | null
  setCurrentPage: (page: number) => void
  setTotalPages: (pages: number) => void
  setDocumentError: (message: string) => void
  file: { data: Uint8Array } | null
  thumbnails: { src: string; page: number }[]
  annotations: string[]
  bookmarks: string[]
}

const PDFContext = createContext<PDFState | undefined>(undefined)

const usePDF = (): PDFState => {
  const { filePath } = useWindowStore()
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [loadedFile, setLoadedFile] = useState<{
    path: string
    file: { data: Uint8Array }
  } | null>(null)
  const [errorState, setErrorState] = useState<{ path: string; message: string } | null>(null)
  const [pageCountState, setPageCountState] = useState<{ path: string; count: number } | null>(null)
  const [thumbnailState, setThumbnailState] = useState<{
    path: string
    items: { src: string; page: number }[]
  } | null>(null)
  const [annotations] = useState<string[]>([])
  const [bookmarks] = useState<string[]>([])

  useEffect(() => {
    let isMounted = true

    if (!filePath) return () => void (isMounted = false)

    readPDFFile(filePath)
      .then((data) => {
        if (!isMounted) return
        // Copy avoids ArrayBuffer detachment when PDF.js worker consumes data.
        const copy = new Uint8Array(data.buffer.slice(0))
        setLoadedFile({ path: filePath, file: { data: copy } })
        setErrorState(null)
        setPageCountState({ path: filePath, count: 0 })
        setCurrentPage(1)
      })
      .catch((err: unknown) => {
        if (!isMounted) return
        setLoadedFile(null)
        setErrorState({
          path: filePath,
          message: err instanceof Error ? err.message : 'Failed to load PDF'
        })
      })

    // Embed the PDF file immediately after loading
    embedPDFFile(filePath).then((success) => {
      if (success) {
        console.log('STATUS', 'PDF FILE EMBEDDED SUCCESSFULLY')
      } else {
        console.error('🔧 Renderer process: Error embedding PDF file')
      }
    })

    return () => {
      isMounted = false
    }
  }, [filePath])

  useEffect(() => {
    let isMounted = true
    const activeFile = filePath && loadedFile?.path === filePath ? loadedFile.file : null

    if (!filePath || !activeFile) return () => void (isMounted = false)

    const generateThumbnails = async (): Promise<void> => {
      try {
        // Use a fresh copy to avoid detached buffers across worker hops.
        const copy = new Uint8Array(activeFile.data.buffer.slice(0))
        const loadingTask = pdfjs.getDocument({ data: copy })
        const pdfDoc = await loadingTask.promise
        const thumbnailScale = 0.2
        const generated: { src: string; page: number }[] = []

        for (let pageNumber = 1; pageNumber <= pdfDoc.numPages; pageNumber += 1) {
          if (!isMounted) return
          const page = await pdfDoc.getPage(pageNumber)
          const viewport = page.getViewport({ scale: thumbnailScale })
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          if (!context) continue

          canvas.width = viewport.width
          canvas.height = viewport.height

          const renderTask = page.render({
            canvasContext: context,
            viewport,
            canvas
          })
          await renderTask.promise

          generated.push({
            page: pageNumber,
            src: canvas.toDataURL('image/jpeg', 0.8)
          })
        }

        if (isMounted) {
          setThumbnailState({ path: filePath, items: generated })
        }
      } catch {
        if (isMounted) {
          setThumbnailState({ path: filePath, items: [] })
        }
      }
    }

    void generateThumbnails()

    return () => {
      isMounted = false
    }
  }, [filePath, loadedFile])

  const file = filePath && loadedFile?.path === filePath ? loadedFile.file : null
  const error = filePath && errorState?.path === filePath ? errorState.message : null
  const totalPages = filePath && pageCountState?.path === filePath ? pageCountState.count : 0
  const thumbnails = filePath && thumbnailState?.path === filePath ? thumbnailState.items : []
  const loading = Boolean(filePath) && !file && !error

  return {
    scale,
    setScale,
    zoom,
    setZoom,
    loading,
    currentPage,
    totalPages,
    error,
    file,
    setCurrentPage,
    setTotalPages: (pages: number) => {
      if (!filePath) return
      setPageCountState({ path: filePath, count: pages })
    },
    setDocumentError: (message: string) => {
      if (!filePath) return
      setErrorState({ path: filePath, message })
    },
    thumbnails,
    annotations,
    bookmarks
  }
}

export const PDFProvider = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const state = usePDF()
  return <PDFContext.Provider value={state}>{children}</PDFContext.Provider>
}

export const usePDFStore = (): PDFState => {
  const context = useContext(PDFContext)
  if (!context) throw new Error('usePDFStore must be used within a PDFProvider')
  return context
}
