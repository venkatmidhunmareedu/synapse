import PageManipulator from './page-manipulator'
import Pagination from './pagination'
import { useWindowStore } from '@renderer/hooks/use-window'

const MenuBar = (): React.JSX.Element => {
  const { filePath } = useWindowStore()

  // Extract filename from path
  const getFileName = (path: string | null): string => {
    if (!path) return 'Synapse PDF Viewer'
    return path.split('/').pop() || path.split('\\').pop() || 'Unknown file'
  }

  return (
    <div className="h-10 w-full flex justify-between space-x-2 items-center text-sm font-semibold px-2">
      <PageManipulator />
      <div className="truncate max-w-[200px] select-none">{getFileName(filePath)}</div>
      <Pagination />
    </div>
  )
}

export default MenuBar
