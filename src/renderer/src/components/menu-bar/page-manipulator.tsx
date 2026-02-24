import { usePDFStore } from '@renderer/hooks/use-pdf'
import { Input } from '../ui/input'

const PageManipulator = (): React.JSX.Element => {
  const { totalPages } = usePDFStore()
  return (
    <div>
      <Input className="w-[50px] px-1 rounded-sm" type="number" defaultValue={1} /> {'/'}{' '}
      {totalPages == 0 ? 10 : totalPages}
    </div>
  )
}

export default PageManipulator
