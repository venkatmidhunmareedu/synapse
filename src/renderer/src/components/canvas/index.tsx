import * as pdfjsLib from 'pdfjs-dist'
import 'pdfjs-dist/web/pdf_viewer.css'

import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { usePDFStore } from '@renderer/hooks/use-pdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

const Canvas = (): React.JSX.Element => {
  const { canvasRef } = usePDFStore()
  return (
    <div className="w-full h-full border px-3 py-2">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

export default Canvas
