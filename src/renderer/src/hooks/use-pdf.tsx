/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist'

import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { useWindowStore } from './use-window'
import { readPDFFile } from '../lib/api'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

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
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  textLayerRef: React.RefObject<HTMLDivElement | null> // 🆕 NEW: Added textLayerRef to state
  pdf: PDFDocumentProxy | null
  thumbnails: { src: string; page: number }[]
  annotations: string[]
  bookmarks: string[]
}

const PDFContext = createContext<PDFState | undefined>(undefined)

const usePDF = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  textLayerRef: React.RefObject<HTMLDivElement | null> // 🆕 NEW: Added to hook params
): PDFState => {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const renderTaskRef = useRef<RenderTask | null>(null)
  // File path for the PDF
  const [thumbnails, setThumbnails] = useState<{ src: string; page: number }[]>([])
  const [annotations] = useState<string[]>([])
  const [bookmarks] = useState<string[]>([])
  const { filePath } = useWindowStore()

  // 1. Load the Document (Once per URL change)
  useEffect(() => {
    console.log('🎯 PDF useEffect triggered with filePath:', filePath)
    let isMounted = true
    setLoading(true)
    console.log('🔄 Loading state set to true')

    const loadDoc = async (): Promise<void> => {
      try {
        console.log('📄 loadDoc called with filePath:', filePath)

        if (!filePath) {
          throw new Error('No file path provided')
        }

        console.log('📖 Reading PDF file via IPC...')
        const pdfData = await readPDFFile(filePath)
        console.log('✅ PDF file read successfully, size:', pdfData.length, 'bytes')

        console.log('🔄 Loading PDF document with PDF.js...')
        const loadingTask = pdfjsLib.getDocument({ data: pdfData })
        const pdfDoc = await loadingTask.promise
        console.log('✅ PDF document loaded successfully, pages:', pdfDoc.numPages)

        const thumbnailScale = 0.2
        const generatedThumbnails: { src: string; page: number }[] = []

        for (let pageNumber = 1; pageNumber <= pdfDoc.numPages; pageNumber += 1) {
          const page = await pdfDoc.getPage(pageNumber)
          const viewport = page.getViewport({ scale: thumbnailScale })
          const thumbCanvas = document.createElement('canvas')
          const thumbContext = thumbCanvas.getContext('2d')

          if (!thumbContext) continue

          thumbCanvas.width = viewport.width
          thumbCanvas.height = viewport.height

          const thumbRenderTask = page.render({
            canvasContext: thumbContext,
            viewport,
            canvas: thumbCanvas
          })

          await thumbRenderTask.promise

          generatedThumbnails.push({
            src: thumbCanvas.toDataURL('image/jpeg', 0.8),
            page: pageNumber
          })
        }

        if (isMounted) {
          setPdf(pdfDoc)
          setThumbnails(generatedThumbnails)
          setError(null)
          console.log('✅ PDF state updated successfully')
        }
      } catch (err: unknown) {
        console.error('❌ Error loading PDF:', err)
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load PDF'
          setError(errorMessage)
          setThumbnails([])
          console.log('❌ Error state set:', errorMessage)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
          console.log('🏁 Loading state set to false')
        }
      }
    }

    loadDoc()
    return () => {
      isMounted = false
    }
  }, [filePath])

  // 2. Render the Page (Whenever pdf or currentPage changes)
  useEffect(() => {
    if (!pdf || !canvasRef.current) return

    const renderPage = async (): Promise<void> => {
      try {
        const page = await pdf.getPage(currentPage)
        const canvas = canvasRef.current!
        const context = canvas.getContext('2d')
        if (!context) return

        // High-DPI scaling
        const viewport = page.getViewport({ scale: scale })
        canvas.height = viewport.height * zoom
        canvas.width = viewport.width * zoom

        // Cancel previous render task to prevent flickering/overlap
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel()
        }

        renderTaskRef.current = page.render({
          canvasContext: context,
          viewport,
          canvas
        })

        // Wait for the canvas rendering to finish
        await renderTaskRef.current.promise

        // 🆕 NEW: Text Layer Rendering Logic
        if (textLayerRef.current) {
          const textLayerDiv = textLayerRef.current

          // Clear any previous text
          textLayerDiv.innerHTML = ''

          // v5+ requires the scale factor CSS variable to align text accurately
          textLayerDiv.style.setProperty('--scale-factor', viewport.scale.toString())

          // Extract text content from the page
          const textContent = await page.getTextContent()

          // Instantiate the new TextLayer class
          const textLayer = new pdfjsLib.TextLayer({
            textContentSource: textContent,
            container: textLayerDiv,
            viewport: viewport
          })

          // Execute the render task
          await textLayer.render()
        }
      } catch (err: unknown) {
        if (
          err &&
          typeof err === 'object' &&
          'name' in err &&
          err.name !== 'RenderingCancelledException'
        ) {
          console.error('Render error:', err)
        }
      }
    }

    renderPage()
  }, [pdf, currentPage, canvasRef, textLayerRef, scale, zoom]) // 🆕 NEW: Added textLayerRef to dependencies

  useEffect(() => {
    if (filePath) return

    setPdf(null)
    setThumbnails([])
    setError(null)
  }, [filePath])

  return {
    scale,
    setScale,
    zoom,
    setZoom,
    loading,
    currentPage,
    totalPages: pdf?.numPages || 0,
    error,
    pdf,
    setCurrentPage,
    canvasRef,
    textLayerRef, // 🆕 NEW: Exported to context
    thumbnails,
    annotations,
    bookmarks
  }
}

// 3. Provider Component
export const PDFProvider = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textLayerRef = useRef<HTMLDivElement>(null) // 🆕 NEW: Created ref for Provider

  // 🆕 NEW: Passed textLayerRef to the hook
  const state = usePDF(canvasRef, textLayerRef)

  return <PDFContext.Provider value={state}>{children}</PDFContext.Provider>
}

// 4. Consumer Hook
export const usePDFStore = (): PDFState => {
  const context = useContext(PDFContext)
  if (!context) throw new Error('usePDFStore must be used within a PDFProvider')
  return context
}
