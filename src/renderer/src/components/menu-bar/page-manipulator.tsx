import { usePDFStore } from '@renderer/hooks/use-pdf'
import { cn } from '@renderer/lib/utils'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '../ui/button'

const PageManipulator = (): React.JSX.Element => {
  const { totalPages, file, currentPage, scale, setScale } = usePDFStore()
  return (
    <div className={cn('flex items-center gap-1', file ? '' : 'invisible')}>
      <div className="flex-1 px-1 rounded-sm text-center ">
        {currentPage} / {totalPages == 0 ? 10 : totalPages}
      </div>
      <div className="flex items-center gap-1">
        <Button variant="secondary" disabled={scale === 1} onClick={() => setScale(scale - 0.5)}>
          <ZoomOut className="size-4" />
        </Button>
        <Button variant="secondary" disabled={scale === 10} onClick={() => setScale(scale + 0.5)}>
          <ZoomIn />
        </Button>
      </div>
    </div>
  )
}

export default PageManipulator
