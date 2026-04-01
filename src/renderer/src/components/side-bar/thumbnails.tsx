import { usePDFStore } from '@renderer/hooks/use-pdf'
import { Card, CardContent, CardFooter } from '../ui/card'
import EmptyState from './empty-state'
import { Image } from 'lucide-react'
import { cn } from '@renderer/lib/utils'
import { useEffect } from 'react'

const ThumbnailCard = ({ page, src }: { page: number; src: string }): React.JSX.Element => {
  const { setCurrentPage, currentPage } = usePDFStore()
  return (
    <Card
      data-page={page}
      className={cn(
        'cursor-pointer mb-3 border-2 transition-all  duration-300 rounded-sm',
        currentPage === page ? ' border-primary' : 'border-background'
      )}
      onClick={() => setCurrentPage(page)}
    >
      <CardContent className="flex items-center justify-center border-none">
        <img src={src} className="w-fit h-fit" />
      </CardContent>
      <CardFooter className="flex items-center justify-center text-xs font-semibold border-none">
        {page}
      </CardFooter>
    </Card>
  )
}

const Thumbnails = (): React.JSX.Element => {
  const { thumbnails, currentPage, totalPages } = usePDFStore()

  useEffect(() => {
    // scroll to the current page thumbnail
    const thumbnail = document.querySelector<HTMLElement>(`[data-page="${currentPage}"]`)
    if (thumbnail) {
      thumbnail.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [currentPage, thumbnails])

  return (
    <div className="h-full w-full">
      <div className="h-full w-full">
        {totalPages == 0 ? (
          <EmptyState
            desc="Load a PDF file to view thumbnails"
            icon={<Image className="h-8 w-8" />}
          />
        ) : thumbnails?.length > 0 ? (
          thumbnails.map((thumbnail, index) => (
            <ThumbnailCard key={index} page={thumbnail.page} src={thumbnail.src} />
          ))
        ) : (
          <EmptyState
            desc="Thumbnails are not available for this PDF"
            icon={<Image className="h-8 w-8" />}
          />
        )}
      </div>
    </div>
  )
}

export default Thumbnails
