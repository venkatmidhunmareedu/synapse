/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist'

// Ensure worker is set up (standard for pdfjs-dist 4.x+)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

interface PDFState {
  loading: boolean
  currentPage: number
  totalPages: number
  error: string | null
  setCurrentPage: (page: number) => void
  canvasRef: React.RefObject<HTMLCanvasElement | null>
}

const PDFContext = createContext<PDFState | undefined>(undefined)

export const usePDF = (
  url: string,
  canvasRef: React.RefObject<HTMLCanvasElement | null>
): PDFState => {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const renderTaskRef = useRef<RenderTask | null>(null)

  // 1. Load the Document (Once per URL change)
  useEffect(() => {
    let isMounted = true
    setLoading(true)

    const loadDoc = async (): Promise<void> => {
      try {
        const loadingTask = pdfjsLib.getDocument(url)
        const pdfDoc = await loadingTask.promise
        if (isMounted) {
          setPdf(pdfDoc)
          setError(null)
        }
      } catch (err: unknown) {
        if (isMounted) setError(err instanceof Error ? err.message : 'Failed to load PDF')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadDoc()
    return () => {
      isMounted = false
    }
  }, [url])

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
        const viewport = page.getViewport({ scale: 1.5 })
        canvas.height = viewport.height
        canvas.width = viewport.width

        // Cancel previous render task to prevent flickering/overlap
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel()
        }

        renderTaskRef.current = page.render({
          canvasContext: context,
          viewport,
          canvas
        })

        await renderTaskRef.current.promise
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
  }, [pdf, currentPage, canvasRef])

  return {
    loading,
    currentPage,
    totalPages: pdf?.numPages || 0,
    error,
    setCurrentPage,
    canvasRef
  }
}

// 3. Provider Component
export const PDFProvider = ({
  url,
  children
}: {
  url: string
  children: React.ReactNode
}): React.JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const state = usePDF(url, canvasRef)
  return <PDFContext.Provider value={state}>{children}</PDFContext.Provider>
}

// 4. Consumer Hook
export const usePDFStore = (): PDFState => {
  const context = useContext(PDFContext)
  if (!context) throw new Error('usePDFStore must be used within a PDFProvider')
  return context
}
