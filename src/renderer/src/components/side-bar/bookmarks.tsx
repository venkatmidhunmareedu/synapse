import { usePDFStore } from '@renderer/hooks/use-pdf'
import EmptyState from './empty-state'
import { Bookmark } from 'lucide-react'

const Bookmarks = (): React.JSX.Element => {
  const { bookmarks } = usePDFStore()
  return (
    <div className="h-full w-full">
      <div className="h-full w-full">
        {bookmarks?.length > 0 ? (
          bookmarks.map((bookmark, index) => <div key={index}>{bookmark}</div>)
        ) : (
          <EmptyState desc="No bookmarks available" icon={<Bookmark className="h-8 w-8" />} />
        )}
      </div>
    </div>
  )
}

export default Bookmarks
