import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'

const Pagination = (): React.JSX.Element => {
  return (
    <div className="flex  gap-1">
      <Button variant={'secondary'}>
        {' '}
        <ChevronLeft /> Previous
      </Button>
      <Button variant={'secondary'} disabled>
        Next <ChevronRight />
      </Button>
    </div>
  )
}

export default Pagination
