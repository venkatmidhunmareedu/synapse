import 'pdfjs-dist/web/pdf_viewer.css'

import { usePDFStore } from '@renderer/hooks/use-pdf'
import EmptyState from './empty-state'

const Canvas = (): React.JSX.Element => {
  const { canvasRef, filePath } = usePDFStore()
  return (
    <div className=" flex w-full h-full px-3 py-2 items-center justify-center overflow-y-auto">
      {filePath ? <canvas ref={canvasRef} className="w-[700px] h-full" /> : <EmptyState />}
    </div>
  )
}

export default Canvas
