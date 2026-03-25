import 'pdfjs-dist/web/pdf_viewer.css'
import { usePDFStore } from '@renderer/hooks/use-pdf'
import EmptyState from './empty-state'
import { useWindowStore } from '@renderer/hooks/use-window'
import { Loader2 } from 'lucide-react'

const Canvas = (): React.JSX.Element => {
  // 1. Destructure a new ref for the text layer from your store
  const { canvasRef, textLayerRef, loading } = usePDFStore()
  const { filePath } = useWindowStore()

  return (
    <div className="flex h-[calc(100%-10rem)] w-full px-3 py-2 items-center justify-center overflow-y-auto">
      {filePath ? (
        <>
          {loading ? (
            <div className="text-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            /* 2. Create a relative wrapper to hold both the canvas and the text layer */
            <div className="relative w-[700px] h-full bg-white">
              {/* Canvas sits in the background */}
              <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

              {/* Text Layer sits invisibly exactly on top */}
              <div
                ref={textLayerRef}
                className="textLayer absolute top-0 left-0 w-full h-full"
                style={{ overflow: 'hidden' }}
              />
            </div>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}

export default Canvas
