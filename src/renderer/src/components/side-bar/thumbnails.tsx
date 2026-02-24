import { usePDFStore } from '@renderer/hooks/use-pdf'
import { Card, CardContent, CardFooter } from '../ui/card'
import EmptyState from './empty-state'
import { Image } from 'lucide-react'

const ThumbnailCard = ({ page, src }: { page: number; src: string }): React.JSX.Element => {
  return (
    <Card>
      <CardContent>
        <img src={src} />
      </CardContent>
      <CardFooter>{page}</CardFooter>
    </Card>
  )
}

const Thumbnails = (): React.JSX.Element => {
  const { thumbnails } = usePDFStore()
  return (
    <div className="h-full">
      <div className="h-full">
        {thumbnails?.length > 0 ? (
          thumbnails.map((thumbnail, index) => (
            <ThumbnailCard key={index} page={index + 1} src={thumbnail.src} />
          ))
        ) : (
          <EmptyState
            desc="Thumbnails meta data is not available"
            icon={<Image className="h-8 w-8" />}
          />
        )}
      </div>
    </div>
  )
}

export default Thumbnails
