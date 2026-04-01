import { usePDFStore } from '@renderer/hooks/use-pdf'
import EmptyState from './empty-state'
import { useWindowStore } from '@renderer/hooks/use-window'
import { Loader2 } from 'lucide-react'
import PDFViewer from '../pdf-viewer'

const Canvas = (): React.JSX.Element => {
  const { loading } = usePDFStore()
  const { filePath } = useWindowStore()

  return (
    <div className="flex h-full w-full px-3 py-2 items-center justify-center overflow-y-auto border">
      {filePath ? (
        <>
          {loading ? (
            <div className="text-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <div className="relative h-full bg-white">
              <PDFViewer />
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
