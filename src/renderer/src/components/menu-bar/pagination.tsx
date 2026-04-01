import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'
import { usePDFStore } from '@renderer/hooks/use-pdf'
import { cn } from '@renderer/lib/utils'

const Pagination = (): React.JSX.Element => {
  const { currentPage, totalPages, setCurrentPage, file } = usePDFStore()

  return (
    <div className={cn('flex  gap-1', file ? '' : 'invisible')}>
      <Button
        variant={'secondary'}
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        {' '}
        <ChevronLeft /> Previous
      </Button>
      <Button
        variant={'secondary'}
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Next <ChevronRight />
      </Button>
    </div>
  )
}

export default Pagination
